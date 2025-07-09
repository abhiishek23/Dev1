const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeGo = (filePath, inputPath) => {
    const jobId = path.basename(filePath, path.extname(filePath));
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        const command = `go build -o ${outPath} ${filePath} && cd ${outputPath} && ./${jobId}.out` + (inputPath ? ` < ${inputPath}` : '');

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
    executeGo,
};
