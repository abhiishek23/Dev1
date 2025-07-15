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
// dotenv.config()
const cors = require("cors"); 
//Cross origin resource sharing 
app.use(cors({
  origin: "http://localhost:5173", // Your frontend's URL
  credentials: true, // If using cookies or auth headers
}));

// Connect to DB
DBconnection();

app.listen(7000, () => {
    console.log("server is listening on port 7000");
});

app.get("/", (req, res) => {
    res.send("server working fine");
});


const getErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") return err.message || JSON.stringify(err);
  return String(err);
};

app.post("/run", async (req, res) => {
  const { language, code, input = '', userId, topics = [], difficulty = "" } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  try {
    const filePath = generateFile(language, code);
    const inputPath = await generateInputFile(input);
    let output;

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

    return res.json({ output });

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
});

app.post("/submit", async (req, res) => {
  const result = await handleSubmission(req.body);
  res.status(result.status).json(result.body);
});

app.post("/submit-contest", async (req, res) => {
  const result = await submitContest(req.body);
  res.status(result.success ? 200 : 400).json(result);
});