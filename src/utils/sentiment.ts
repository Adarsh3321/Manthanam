import { model, fallbackModel } from "../lib/gemini";
import { SchemaType } from "@google/generative-ai";

export type SentimentAnalysis = {
  sentiment: "positive" | "neutral" | "negative";
  emotion: "happy" | "sad" | "anxious" | "angry" | "calm" | "excited" | "fear";
  stressScore: number;
  confidence: number;
  riskLevel: "none" | "low" | "medium" | "high";
  summary: string;
  affirmation: string;
};

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    sentiment: {
      type: SchemaType.STRING,
      enum: ["positive", "neutral", "negative"],
      description: "Overall sentiment of the journal entry."
    },

    emotion: {
      type: SchemaType.STRING,
      enum: [
        "happy",
        "sad",
        "anxious",
        "angry",
        "calm",
        "excited",
        "fear"
      ],
      description:
        "The dominant emotion expressed throughout the journal entry."
    },

    stressScore: {
      type: SchemaType.INTEGER,
      description:
        "Stress level from 0 to 100. 0 = fully relaxed, 100 = extreme stress."
    },

    confidence: {
      type: SchemaType.NUMBER,
      description:
        "Confidence score from 0.0 to 1.0 indicating certainty of the classification."
    },

    riskLevel: {
      type: SchemaType.STRING,
      enum: ["none", "low", "medium", "high"],
      description:
        "Risk level based on signs of hopelessness, severe distress, social withdrawal, or self-harm related language."
    },

    summary: {
      type: SchemaType.STRING,
      description:
        "A concise 1-2 sentence summary of the user's experience and emotional state."
    },

    affirmation: {
      type: SchemaType.STRING,
      description:
        "A personalized, empathetic, supportive affirmation directly related to the journal entry."
    }
  },

  required: [
    "sentiment",
    "emotion",
    "stressScore",
    "confidence",
    "riskLevel",
    "summary",
    "affirmation"
  ]
};

export async function analyzeSentiment(
  text: string
): Promise<SentimentAnalysis> {
  if (!text || text.trim() === "") {
    return {
      sentiment: "neutral",
      emotion: "calm",
      stressScore: 0,
      confidence: 1,
      riskLevel: "none",
      summary: "No journal entry was provided.",
      affirmation:
        "Take a moment to reflect on your thoughts and feelings today."
    };
  }

  const prompt = `
You are an emotional wellness analysis assistant.

Analyze the following journal entry and return ONLY valid JSON.

Determine:

1. sentiment
   - positive
   - neutral
   - negative

2. emotion
   - happy
   - sad
   - anxious
   - angry
   - calm
   - excited
   - fear

3. stressScore
   - integer between 0 and 100

4. confidence
   - decimal between 0.0 and 1.0

5. riskLevel
   - none
   - low
   - medium
   - high

6. summary
   - 1-2 sentences

7. affirmation
   - personalized and empathetic

IMPORTANT RULES:

Sentiment Rules:
- positive = overall positive outcome even if some concerns exist
- neutral = balanced positive and negative emotions
- negative = overall distress, disappointment, sadness, fear, anger, or suffering

Emotion Rules:

happy:
- joy
- gratitude
- contentment
- satisfaction

excited:
- achievement
- enthusiasm
- anticipation
- celebration
- motivation

sad:
- disappointment
- loneliness
- hopelessness
- grief
- emotional pain
- withdrawal

anxious:
- worry
- uncertainty
- nervousness
- overthinking

angry:
- frustration
- resentment
- irritation
- outrage

calm:
- peacefulness
- relaxation
- acceptance
- balance

fear:
- panic
- dread
- perceived danger
- strong fear response

IMPORTANT:
- Do NOT choose anxious merely because worry exists.
- Choose the emotion that dominates MOST of the journal.
- Positive achievements with uncertainty are often:
  sentiment = positive
  emotion = anxious OR excited

- Hopelessness, isolation, emotional exhaustion, self-blame,
  or inability to imagine improvement are usually:
  emotion = sad

Risk Level Guidelines:

none:
- normal emotional range

low:
- mild stress or temporary emotional difficulty

medium:
- sustained stress, anxiety, sadness, burnout

high:
- hopelessness
- severe emotional distress
- social withdrawal
- self-harm ideation
- inability to see a positive future

Stress Score Guidelines:

0-20:
very relaxed or highly positive

21-40:
mild stress

41-60:
moderate stress

61-80:
high stress

81-100:
severe emotional strain

Return ONLY JSON.

Journal Entry:
"""${text}"""
`;

  const requestConfig: any = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],

    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,

      // Lower value = more consistent classification
      temperature: 0.3
    }
  };

  try {
    let result;

    try {
      result = await model.generateContent(requestConfig);
    } catch (primaryErr: any) {
      console.warn(
        "Primary model failed. Falling back...",
        primaryErr?.message
      );

      result = await fallbackModel.generateContent(requestConfig);
    }

    const raw = result.response.text();
    const parsed = JSON.parse(raw);

    parsed.stressScore = Math.max(
      0,
      Math.min(100, parsed.stressScore ?? 50)
    );

    parsed.confidence = Math.max(
      0,
      Math.min(1, parsed.confidence ?? 0.8)
    );

    if (
      !["none", "low", "medium", "high"].includes(parsed.riskLevel)
    ) {
      parsed.riskLevel = "low";
    }

    return parsed as SentimentAnalysis;
  } catch (err) {
    console.error("Gemini analyze error:", err);

    return {
      sentiment: "neutral",
      emotion: "calm",
      stressScore: 50,
      confidence: 0,
      riskLevel: "low",
      summary:
        "Unable to analyze the journal entry due to a technical issue.",
      affirmation:
        "Your thoughts still matter even when analysis isn't available right now."
    };
  }
}