const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
const problem = require("./MODEL/problem.js");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const aiReviewApproach = async (approach, ProblemID) => {
    const problemData = await problem.findOne({ ProblemID: ProblemID });

    if (!problemData) {
        throw new Error("Problem not found with the given ProblemID");
    }

    const { solution, description, constraints } = problemData;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:
            "Analyze the given approach with the actual solution if it is on the right path to solution of the coding problem. Also if the approaches and solution do not match use your own intelligence to check if the user approach could be correct for the given question description and constraints. If yes, tell him he is on the right path, and the approach may be correct but not listed in the solutions. If no, answer is wrong, tell it he is going wrong. Give response as if you are talking to the user.\n\n" +
            "Problem Description: " + description + "\n\n" +
            "Problem Constraints: " + constraints + "\n\n" +
            "Official Solution: " + solution + "\n\n" +
            "User's Approach: " + approach,
    });

    return response.text;
};

module.exports = {
    aiReviewApproach,
};
