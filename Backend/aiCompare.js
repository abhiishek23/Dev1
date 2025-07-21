const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
const User = require("./MODEL/user");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const aiCompare = async (userId1, userId2) => {
  const user1 = await User.findOne({ userId: userId1 });
  const user2 = await User.findOne({ userId: userId2 });

  if (!user1 || !user2) {
    throw new Error("One or both users not found");
  }

  const prompt = `
Compare the coding error history of two users. The goal is to analyze their mistake patterns, language usage, and topic difficulties, and suggest how the lower-performing user can improve.

User 1 (ID: ${userId1}):
${JSON.stringify(user1.errorHistory, null, 2)}

User 2 (ID: ${userId2}):
${JSON.stringify(user2.errorHistory, null, 2)}

Please respond with:
1. Who appears to perform better and why.
2. Key weaknesses or repeated mistakes in each user.
3. Actionable improvement suggestions for the weaker user.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
};

module.exports = {
  aiCompare,
};
