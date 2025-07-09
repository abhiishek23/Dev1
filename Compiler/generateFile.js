


const fs = require("fs");
//fs is file system module and it helps to interact with file system 
//this is not in npm it comes with javascript 
const path = require("path")
//path module help to get the path pf any module 

const { v4: uuid } = require('uuid');
// The uuid package exports multiple functions, like: UNIVERSALLY UNIQUE IDENTIFIER 
// v1
// v4
// etc.
// Get the v4 function from the uuid module
// Store it in a local variable called uuid 
const { manageDirectorySize } = require("./manageDirectorySize");

const dirCodes = path.join(__dirname, "codes") //C:\Users\Abhishek\Desktop\Dev_Season\Compiler\codes 
//here __ dirname is default
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
//till now we have created  our codes folder now we will have to put our codes at proper places 

const generateFile = (language, code) => {
  const jobId = uuid()
  //now we have unique name our only task is to create  new file nd put it into codes folder 
  // 🔹 Backticks `...`
  // These are backticks, not regular quotes. They're used in JavaScript to:
  // Embed variables or expressions directly inside a string
  // Write multi-line strings easily
  // 🔹 ${...} syntax
  // Inside backticks, ${...} lets you insert variables or expressions.
  // So:// js
  // Copy
  // Edit
  // const jobID = "abc123";
  // const format = "pdf";
  // const filename = `${jobID}.${format}`;
  // console.log(filename); // Output: abc123.pdf
  const filename = `${jobId}.${language}`;
  const filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, code);

//  Simplified file cleanup using shared utility
  manageDirectorySize(dirCodes, 10);

  return filePath;
}

module.exports = { generateFile }

