const fs = require("fs");
const path = require("path");
const util = require("util");
// const asyncReadFile  = util.promisify(fs.readFile)
// const asyncWriteFile  = util.promisify(fs.writeFile)

const getData = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const generateStudentArray = (data) => {
  return new Promise((resolve) => {
    let arrayFormat = data.split("\r\n");
    let filtered = [];
    arrayFormat.forEach((item) => {
      if (Boolean(item.trim())) {
        let trimmed = item.toLowerCase().trim();
        let splited = trimmed.split(" ");
        if (splited.length > 1 && !(splited[1] !== "@gmail.com")) {
          filtered = [...filtered, ...splited];
        } else {
          filtered.push(trimmed);
        }
      }
    });
    let sortedFilter = filtered.sort();
    const uniqueLength = removeDuplicates(sortedFilter);
    let noDuplication = sortedFilter.slice(0, uniqueLength);
    resolve(noDuplication);
  });
};

function removeDuplicates(nums) {
  if (nums.length === 0) {
    return 0; // Empty array, no duplicates
  }

  let uniqueIndex = 0; // Index to store unique elements

  // Iterate through the array starting from the second element
  for (let i = 1; i < nums.length; i++) {
    // If the current element is different from the previous unique element
    if (nums[i] !== nums[uniqueIndex]) {
      uniqueIndex++; // Move the unique index forward
      nums[uniqueIndex] = nums[i]; // Store the unique element at the unique index
    }
  }

  // Return the length of the subarray containing unique elements
  return uniqueIndex + 1;
}

const generateStudentObj = (arrayFormat) => {
  let objectFormat;
  //   arrayFormat.pop();
  objectFormat = arrayFormat.map((item) => {
    return {
      email: item,
      hasVoted: false,
    };
  });
  saveIntoAFile(JSON.stringify(objectFormat));
};

const saveIntoAFile = (objectFormat) => {
  fs.writeFile("students.json", objectFormat, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      //   fs.writeFile("matric_no.txt", objectFormat, (err) => {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       console.log("Successfully Write to file");
      //     }
      //   });
      console.log("Successfully written file");
    }
  });
};

getData("./emailcompilationforvoting.txt")
  .then((data) => {
    generateStudentArray(data).then((data) => generateStudentObj(data));
  })
  .catch((err) => console.log(err));

// OR
// const runAllProcess = async (path) => {
//   const data = await getData(path)
//   const arrayFormat = await generateStudentArray(data)
//   generateStudentObj(arrayFormat)
// }
