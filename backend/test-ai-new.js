import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

async function run() {
    console.log("Testing SDK with key:", process.env.GOOGLE_AI_KEY.substring(0, 5) + "...");
    try {
        const result = await model.generateContent("Hello, are you there?");
        console.log("SDK SUCCESS! Response:", result.response.text());
    } catch (err) {
        console.error("SDK ERROR:", err.message);
    }
}
run();
