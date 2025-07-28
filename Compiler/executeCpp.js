// // const fs = require("fs");
// // const path = require("path");
// // const { exec } = require("child_process");
// // // ie it creates a copy of terminal on main terminal tha main application 
// // // will be running and on the copy terminal the sub process will be running 

// // // The child_process module in Node.js is used to create and manage subprocesses—that is, to run system commands or external programs 
// // // (like g++, python, or node) from your Node.js application.
// // const outputPath = path.join(__dirname, "outputs");

// // if (!fs.existsSync(outputPath)) {
// //     fs.mkdirSync(outputPath, { recursive: true });
// // }

// // const executeCpp = (filePath, inputPath) => {
// //     //  "filePath": "C:\\Users\\Abhishek\\Desktop\\Dev_Season\\compiler\\codes\\304e1c4b-db9a-4701-b704-9ef7fbd18fdb.cpp"
// //     const jobId = path.basename(filePath, path.extname(filePath));
// //     // 304e1c4b-db9a-4701-b704-9ef7fbd18fdb.cpp"
// //     const outPath = path.join(outputPath, `${jobId}.exe`);
// //     // we have done this so tht our exe file gets a separate name 

// //     return new Promise((resolve, reject) => {
// //         exec(
// //             `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe < ${inputPath}`,
// //             // with the addition of last line the compiler starts accepting user input 
// //             (error, stdout, stderr) => {
// //                 if (error) {
// //                     reject({ error, stderr });
// //                 }
// //                 if (stderr) {
// //                     reject(stderr);
// //                 }
// //                 resolve(stdout);
// //             }
// //         );
// //     });
// // };

// // module.exports = {
// //     executeCpp,
// // };

// const fs = require("fs");
// const path = require("path");
// const { exec } = require("child_process");
// // ie it creates a copy of terminal on main terminal tha main application 
// // will be running and on the copy terminal the sub process will be running 

// // The child_process module in Node.js is used to create and manage subprocesses—that is, to run system commands or external programs 
// // (like g++, python, or node) from your Node.js application.
// const outputPath = path.join(__dirname, "outputs");

// if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true });
// }

// const executeCpp = (filePath, inputPath) => {
//     //  "filePath": "C:\\Users\\Abhishek\\Desktop\\Dev_Season\\compiler\\codes\\304e1c4b-db9a-4701-b704-9ef7fbd18fdb.cpp"
//     const jobId = path.basename(filePath, path.extname(filePath));
//     // 304e1c4b-db9a-4701-b704-9ef7fbd18fdb.cpp"
//     const outPath = path.join(outputPath, `${jobId}.out`);
//     // we have done this so tht our exe file gets a separate name 

//     return new Promise((resolve, reject) => {
//         exec(
//             `g++ ${filePath} -o ${outPath} && ${outPath} < ${inputPath}`,
//             // with the addition of last line the compiler starts accepting user input 
//             (error, stdout, stderr) => {
//                 if (error) {
//                     reject({ error, stderr });
//                 }
//                 if (stderr) {
//                     reject(stderr);
//                 }
//                 resolve(stdout);
//             }
//         );
//     });
// };

// module.exports = {
//     executeCpp,
// };
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputPath) => {
    const jobId = path.basename(filePath, path.extname(filePath));
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filePath} -o ${outPath} && ${outPath} < ${inputPath}`,
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
    executeCpp,
};
