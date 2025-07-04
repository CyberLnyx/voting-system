const XLSX = require("xlsx");
const fs = require("fs");

/**
 * Parses Excel file to JSON with custom field mapping
 * @param {string|ArrayBuffer} filePath - Path to Excel file or ArrayBuffer
 * @returns {Promise<Array>} - Array of JSON objects
 */
async function parseExcelToJson(filePath) {
  return new Promise((resolve, reject) => {
    try {
      let data;

      // Handle file path (string)
      if (typeof filePath === "string") {
        if (!fs.existsSync(filePath)) {
          reject(new Error(`File not found: ${filePath}`));
          return;
        }
        data = fs.readFileSync(filePath);
      }
      // Handle ArrayBuffer directly
      else if (filePath instanceof ArrayBuffer) {
        data = filePath;
      } else {
        reject(
          new Error("Invalid input. Expected file path string or ArrayBuffer")
        );
        return;
      }

      processExcelData(data, resolve, reject);
    } catch (error) {
      reject(new Error(`Error reading file: ${error.message}`));
    }
  });
}

/**
 * Process Excel data and convert to JSON
 * @param {ArrayBuffer} data - Excel file data
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 */
function processExcelData(data, resolve, reject) {
  try {
    // Read the Excel file
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      resolve([]);
      return;
    }

    // Get headers from first row
    const headers = jsonData[0];

    // Find column indices for required fields
    // const nameIndex = findColumnIndex(headers, ["NAME", "name", "Name"]);
    const matricIndex = findColumnIndex(headers, [
      "MATRIC NUMBER",
      "matric number",
      "Matric Number",
      "MATRIC_NUMBER",
      "matric_number",
    ]);
    const emailIndex = findColumnIndex(headers, [
      "EMAIL",
      "email",
      "Email",
      "E-MAIL",
      "e-mail",
    ]);

    // Check if all required columns exist
    if (matricIndex === -1 || emailIndex === -1) {
      const missing = [];
      if (nameIndex === -1) missing.push("NAME");
      if (matricIndex === -1) missing.push("MATRIC NUMBER");
      if (emailIndex === -1) missing.push("EMAIL");

      reject(new Error(`Missing required columns: ${missing.join(", ")}`));
      return;
    }

    // Convert data rows to JSON objects with custom field names
    const result = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];

      // Skip empty rows
      if (!row || row.length === 0 || row.every((cell) => !cell)) {
        continue;
      }

      const jsonRow = {
        // name: cleanValue(row[nameIndex]),
        matricNo: cleanValue(row[matricIndex]),
        email: cleanValue(row[emailIndex]),
        hasVoted: false,
      };

      // Only add row if it has at least one non-empty value
      if (jsonRow.matricNo || jsonRow.corresponding_email) {
        result.push(jsonRow);
      }
    }

    resolve(result);
  } catch (error) {
    reject(new Error(`Failed to parse Excel file: ${error.message}`));
  }
}

/**
 * Find column index by matching possible header names
 * @param {Array} headers - Array of header names
 * @param {Array} possibleNames - Array of possible column names to match
 * @returns {number} - Column index or -1 if not found
 */
function findColumnIndex(headers, possibleNames) {
  for (let i = 0; i < headers.length; i++) {
    const header = String(headers[i]).trim();
    if (
      possibleNames.some((name) => header.toLowerCase() === name.toLowerCase())
    ) {
      return i;
    }
  }
  return -1;
}

/**
 * Clean and format cell values
 * @param {any} value - Cell value
 * @returns {string} - Cleaned value
 */
function cleanValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

// Node.js Usage Examples

// Example 1: Basic usage with async/await
async function main() {
  try {
    // const jsonData = await parseExcelToJson("students.xlsx");
    const jsonData = await parseExcelToJson("2025-nassa-students.xlsx");
    console.log("Parsed data:", JSON.stringify(jsonData, null, 2));

    // Save to JSON file
    fs.writeFileSync("output.json", JSON.stringify(jsonData, null, 2));
    console.log("Data saved to output.json");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 2: Using with promises
// parseExcelToJson("./data/students.xlsx")
//   .then((data) => {
//     console.log(`Parsed ${data.length} records`);
//     data.forEach((record, index) => {
//       console.log(
//         `${index + 1}. ${record.name} (${record.matric_no}) - ${
//           record.corresponding_email
//         }`
//       );
//     });
//   })
//   .catch((error) => {
//     console.error("Parsing failed:", error.message);
//   });

// Example 3: Batch processing multiple files
// async function processMultipleFiles(filePaths) {
//   const results = [];

//   for (const filePath of filePaths) {
//     try {
//       console.log(`Processing ${filePath}...`);
//       const data = await parseExcelToJson(filePath);
//       results.push({
//         file: filePath,
//         records: data,
//         count: data.length,
//       });
//       console.log(`✓ ${filePath}: ${data.length} records`);
//     } catch (error) {
//       console.error(`✗ ${filePath}: ${error.message}`);
//       results.push({
//         file: filePath,
//         error: error.message,
//       });
//     }
//   }

//   return results;
// }

// Example 4: Command line usage
// function parseFromCommandLine() {
//   const filePath = process.argv[2];

//   if (!filePath) {
//     console.log("Usage: node excel-parser.js <path-to-excel-file>");
//     process.exit(1);
//   }

//   parseExcelToJson(filePath)
//     .then((data) => {
//       console.log(JSON.stringify(data, null, 2));
//     })
//     .catch((error) => {
//       console.error("Error:", error.message);
//       process.exit(1);
//     });
// }

// Uncomment the example you want to use:
main();
// parseFromCommandLine();

// // Export for use as module
// module.exports = { parseExcelToJson };
