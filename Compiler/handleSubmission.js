const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');

const { executeCpp } = require('./executeCpp');
const { executeC } = require('./executeC'); 
const { executeJava } = require('./executeJava'); 
const { executePython } = require('./executePython'); 
const { executeJs } = require('./executeJs'); 
const { executeGo } = require('./executeGo');





const problemModel = require("../Backend/MODEL/problem");
const User = require("../Backend/MODEL/user");

// Connect to DB


async function handleSubmission(reqBody) {
  const { language = 'cpp', code, problemID, userId, topics = [], difficulty = null } = reqBody;

  if (!code || !problemID) {
    return {
      status: 400,
      body: { success: false, error: "Missing code or problemID" }
    };
  }

  try {
    const filePath = generateFile(language, code);
    const problem = await problemModel.findOne({ ProblemID: problemID });

    if (!problem) {
      return {
        status: 404,
        body: { error: "Problem not found" }
      };
    }

    const allTestCases = [...problem.VisibletestCase, ...problem.HiddentestCase];
    const results = [];
    let allPassed = true;

    for (let testCase of allTestCases) {
      const inputPath = await generateInputFile(testCase.input);
      let output;

      try {
        if (language === 'cpp') output = await executeCpp(filePath, inputPath);
        else if (language === 'c') output = await executeC(filePath, inputPath);
        else if (language === 'java') output = await executeJava(filePath, inputPath);
        else if (language === 'py' || language === 'python') output = await executePython(filePath, inputPath);
        else if (language === 'js' || language === 'javascript') output = await executeJs(filePath, inputPath);
        else if (language === 'go' || language === 'golang') output = await executeGo(filePath, inputPath);
        else return { status: 400, body: { error: "Unsupported language" } };
      } catch (err) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: err.stderr || err.message || "Error",
          passed: false
        });
        allPassed = false;
        continue;
      }

      const cleanedOutput = output.trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = cleanedOutput === expectedOutput;
      if (!passed) allPassed = false;

      results.push({
        input: testCase.input,
        expected: expectedOutput,
        output: cleanedOutput,
        passed
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        verdict: allPassed ? "Accepted" : "Wrong Answer",
        results,
      }
    };

  } catch (error) {
    try {
      if (userId) {
        await User.findOneAndUpdate(
          { userId },
          {
            $push: {
              errorHistory: {
                code,
                language,
                error: error?.message || error || "Unknown error",
                topics,
                difficulty,
              }
            }
          }
        );
      }
    } catch (logErr) {
      console.error("⚠️ Error logging to errorHistory:", logErr?.message || logErr);
    }

    return {
      status: 500,
      body: { error: error?.message || "Server Error" }
    };
  }
}

module.exports = { handleSubmission };
