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
    // let categories = data.split("- b -");
    // let contestants = categories.map((category) => {
    //   let data = category.split("- a -");
    //   let role = data[0].trim();
    //   let nominees = data[1]
    //     .split("- [ ] ")
    //     .filter((item) => Boolean(item.trim()) && item.trim())
    //     .map((nominee) => {
    //       let name = nominee.trim();
    //       return { name, imgUrl: "" };
    //     });
    //   return {
    //     role,
    //     nominees,
    //   };
    // });
    // resolve(contestants);
    let commaSplit = data.split(",");
    let carriageSplit = [];
    commaSplit.forEach((item, i) => {
      let spliting = item.split("\r\n");
      if (spliting.length > 1) {
        carriageSplit = [...carriageSplit, ...spliting];
      } else {
        carriageSplit.push(item);
      }
    });
    // console.log(carriageSplit);
    let filtered = [];
    carriageSplit.forEach((item) => {
      if (Boolean(item.trim())) {
        let trimmed = item.toLowerCase().trim();
        let splited = trimmed.split("\r\n");
        if (
          splited.length > 1 &&
          !(splited[1] !== "@gmail.com") &&
          !(splited[1] !== "u.edu.ng")
        ) {
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
  // let objectFormat = arrayFormat;
  saveIntoAFile(JSON.stringify(objectFormat));
};

const saveIntoAFile = (objectFormat) => {
  fs.writeFile("./nassa-student-list.json", objectFormat, (err) => {
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

getData("./nassa-student-list.txt")
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
