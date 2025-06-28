const fs = require("fs");

const path = require("path")


const { v4: uuid } = require('uuid');



const dirInputs = path.join(__dirname, "inputs") 

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}


// Creates a temporary file with user's input data
const generateInputFile = async (input) => {
    const jobID = uuid();
    const input_filename = `${jobID}.txt`;
    const input_filePath = path.join(dirInputs, input_filename);
    await fs.writeFileSync(input_filePath, input);
    //for upper command to run properly input should be a string otherwiw it will give errors 
    return input_filePath;
};

module.exports = {
    generateInputFile,
};