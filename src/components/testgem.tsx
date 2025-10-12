import { useEffect } from "react";
import { model } from "../lib/gemini"; // make sure path is correct

export default function TestGemini() {
  useEffect(() => {
    async function run() {
      const text = "I need to pee but toilet is locked and I have to be embarrassed in front of everyone";

      const prompt = `
You are an AI journal analyzer. Respond in plain text ONLY. Do NOT return JSON yet, just a raw response:

Journal Entry:
"""${text}"""
      `;

      try {
        const result = await model.generateContent(prompt);
        const raw = await result.response.text();

        console.log("----- GEMINI RAW RESPONSE -----");
        console.log(raw);
      } catch (err) {
        console.error("Gemini call failed:", err);
      }
    }

    run();
  }, []);

  return <div>Test Gemini: Check console for output</div>;
}
