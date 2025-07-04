const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const aiErrorAnalysis = async (history) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Analyze the following history of errors made by the user  and provide a medium sized detailed analysis of the errors user frequently commits and how he can improve this , also tell the topics he often fails and the difficulty level of questions where it is commiting errors . Also suggest some improvent techiniques based on ypur analysis . also tell him whether he is improving or not based on the frequency of type  errors in past and recent  " + history,
    });
    return response.text;
};

module.exports = {
    aiErrorAnalysis,
};