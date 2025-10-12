import { model } from "../lib/gemini";

async function testGemini() {
  const text = "I need to pee but toilet is locked and I have to be embarrassed in front of everyone";

  const prompt = `
You are an AI journal analyzer. Respond to this journal entry in plain text (no JSON) for testing purposes:

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

testGemini();
