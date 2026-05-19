import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = "VITE_GEMINI_API_KEY"; // from .env
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    sentiment: {
      type: SchemaType.STRING,
      enum: ["positive", "neutral", "negative"],
      description: "The overall sentiment of the journal entry.",
    },
    emotion: {
      type: SchemaType.STRING,
      enum: ["happy", "sad", "anxious", "angry", "calm", "excited", "fear"],
      description: "The primary emotion expressed by the user in the entry.",
    },
    stressScore: {
      type: SchemaType.INTEGER,
      description: "A score from 0 to 100 indicating the perceived stress level.",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A thoughtful, concise 1-2 sentence summary of what the user is experiencing.",
    },
    affirmation: {
      type: SchemaType.STRING,
      description: "A highly empathetic, personalized, and comforting affirmation.",
    },
  },
  required: ["sentiment", "emotion", "stressScore", "summary", "affirmation"],
};

const prompt = `
You are an empathetic, insightful psychological AI assistant analyzing a user's private journal entry.
Read the following entry carefully and extract the emotional data.

Journal Entry:
"""I'm feeling so anxious today because of my exams."""
`;

(async () => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });
    console.log(result.response.text());
  } catch (err) {
    console.error("FAILED:", err);
  }
})();
