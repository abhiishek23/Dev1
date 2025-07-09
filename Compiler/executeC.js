const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filePath, inputPath) => {
    const jobId = path.basename(filePath, path.extname(filePath));
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `gcc ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeC,
};
