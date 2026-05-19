import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "missing_api_key";

if (apiKey === "missing_api_key") {
  console.error("CRITICAL: VITE_GEMINI_API_KEY is missing. AI features will fail.");
}

// Initialize Gemini client
export const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
