const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executePython = (filePath, inputPath) => {
    return new Promise((resolve, reject) => {
        const command = inputPath
            ? `python ${filePath} < ${inputPath}`
            : `python ${filePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stderr });
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executePython,
};
