const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputPath) => {
    return new Promise((resolve, reject) => {
        const jobId = path.basename(filePath, ".java");
        const classFilePath = path.join(outputPath, jobId);

        exec(
            `javac ${filePath} -d ${outputPath} && cd ${outputPath} && java ${jobId} < ${inputPath}`,
            (error, stdout, stderr) => {
                if (error) {
                    return reject({ error, stderr });
                }
                if (stderr) {
                    return reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeJava,
};
