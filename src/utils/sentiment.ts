import { model } from "../lib/gemini";

export type SentimentAnalysis = {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotion: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'excited' | 'fear';
  stressScore: number; // 0-100
  summary: string;
  affirmation: string;
};

// normalize Gemini’s emotion output to your enum
function normalizeEmotion(e: string): SentimentAnalysis['emotion'] {
  const map: Record<string, SentimentAnalysis['emotion']> = {
    happy: 'happy',
    joyful: 'happy',
    content: 'calm',
    calm: 'calm',
    relaxed: 'calm',
    sad: 'sad',
    depressed: 'sad',
    anxious: 'anxious',
    nervous: 'anxious',
    tense: 'anxious',
    angry: 'angry',
    frustrated: 'angry',
    excited: 'excited',
    fear: 'fear',
    scared: 'fear'
  };
  return map[e.toLowerCase()] || 'calm';
}

function cleanAIResponse(raw: string): string {
  // Remove ```json and ``` if present
  return raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}


export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  if (!text || text.trim() === "") {
    return {
      sentiment: "neutral",
      emotion: "calm",
      stressScore: 0,
      summary: "No text provided.",
      affirmation: "Take a moment to reflect."
    };
  }

  const prompt = `
Analyze this journal entry and respond ONLY with valid JSON exactly matching this schema:
{
  "sentiment": "positive | neutral | negative",
  "emotion": "happy | sad | anxious | angry | calm | excited | fear",
  "stressScore": 0-100,
  "summary": "short 1-2 sentence summary",
  "affirmation": "motivational or comforting statement"
}

Journal Entry:
"""${text}"""
`;

  try {
    const result = await model.generateContent(prompt);
    let raw = await result.response.text();

    raw = cleanAIResponse(raw);

    const parsed = JSON.parse(raw);

    // normalize emotion
    parsed.emotion = normalizeEmotion(parsed.emotion);

    return parsed as SentimentAnalysis;
  } catch (err) {
    console.error("Gemini analyze error:", err);

    return {
      sentiment: "neutral",
      emotion: "calm",
      stressScore: 50,
      summary: "Unable to analyze entry.",
      affirmation: "Take a deep breath. You are doing fine."
    };
  }
}
