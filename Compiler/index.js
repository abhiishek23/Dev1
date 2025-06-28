const express = require("express")
const app = express();
app.use(express.json());
//above is  body parser middleware
app.use(express.urlencoded({ extended: true }));
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp'); // 
app.listen(7000, () => {
    console.log("server is listening on port 7000")
})
app.get("/", (req, res) => {
    res.send("server working fine ");
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = generateFile(language, code);
        //generate file is defined by  us 
        const output = await executeCpp(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({
            error: error.message || error.stderr || error,
        });

    }
});