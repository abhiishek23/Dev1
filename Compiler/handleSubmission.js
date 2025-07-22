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
const { executejs } = require('./executejs'); 
const { executeGo } = require('./executeGo');
const problemModel = require("../Backend/MODEL/problem");
const User = require("../Backend/MODEL/user");

// Connect to DB


async function handleSubmission(reqBody) {
  const { language = 'cpp', code, ProblemID, userId, topics = [], difficulty = null } = reqBody;

  if (!code || !ProblemID) {
    return {
      status: 400,
      body: { success: false, error: "Missing code or problemID" }
    };
  }

  try {
    const filePath = generateFile(language, code);
    const problem = await problemModel.findOne({ ProblemID: ProblemID });

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
        else if (language === 'js' || language === 'javascript') output = await executejs(filePath, inputPath);
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
 const errMsg = error ;
    const stderr = error.stderr?.toString?.() || error.message || "Unknown error";

    try {
      if (userId) {
        await User.updateOne(
          { userId: new RegExp(`^${userId}$`, "i") },
          {
            $push: {
              errorHistory: {
                code: String(code),
                language: String(language),
                error: stderr,
                topics: Array.isArray(topics) ? topics.map(String) : [],
                difficulty: String(difficulty || ""),
              },
            },
          }
        );
        console.log("📌 Error logged for user:", userId);
      }
    } catch (logErr) {
      console.error("⚠️ Failed to log error to DB:", logErr?.message);
    }
//sending std error in response 
 
    res.status(500).json({ success: false,  stderr  });
  }
}

module.exports = { handleSubmission };
