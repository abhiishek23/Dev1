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

require("dotenv").config({ path: "../Backend/.env" });
const { handleSubmission } = require('./handleSubmission');

const mongoose = require("mongoose");
const { DBconnection } = require("../Backend/Database/db");
const problemModel = require("../Backend/MODEL/problem");
const User = require("../Backend/MODEL/user");
const submitContest = require("./submitContest"); 

// Connect to DB
DBconnection();

app.listen(7000, () => {
    console.log("server is listening on port 7000");
});

app.get("/", (req, res) => {
    res.send("server working fine");
});

app.post("/run", async (req, res) => {
  const { language, code, input = '', userId, topics = [], difficulty = null } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    console.log("🔧 Generating file for language:", language);
    const filePath = generateFile(language, code);
    const inputPath = await generateInputFile(input);
    let output;

    console.log("⚙️ Executing code...");
    if (language === 'cpp') {
      output = await executeCpp(filePath, inputPath);
    } else if (language === 'c') {
      output = await executeC(filePath, inputPath);
    } else if (language === 'java') {
      output = await executeJava(filePath, inputPath);
    } else if (language === 'py' || language === 'python') {
      output = await executePython(filePath, inputPath);
    } else if (language === 'js' || language === 'javascript') {
      output = await executeJs(filePath, inputPath);
    } else if (language === 'go' || language === 'golang') {
      output = await executeGo(filePath, inputPath);
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    console.log("✅ Execution complete");
    res.json({ filePath, inputPath, output });

  } catch (error) {
    console.error("❌ Error during run:", error?.message || error || "Unknown error");

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
        console.log("📌 Error logged to user history");
      }
    } catch (logErr) {
      console.error("⚠️ Error logging to errorHistory:", logErr?.message || logErr);
    }

    res.status(500).json({
      error: error?.message || error || "Server Error",
    });
  }
});

app.post("/submit", async (req, res) => {
  const result = await handleSubmission(req.body);
  res.status(result.status).json(result.body);
});

app.post("/submit-contest", async (req, res) => {
  const result = await submitContest(req.body);
  res.status(result.success ? 200 : 400).json(result);
});