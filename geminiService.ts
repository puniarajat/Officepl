

import { GoogleGenAI, Type } from "@google/genai";

// Use a variable to hold the initialized client.
let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * This prevents the app from crashing on startup if the API key is not yet configured.
 * @returns An instance of GoogleGenAI or null if the API key is missing.
 */
const getAiClient = (): GoogleGenAI | null => {
  if (ai) {
    return ai;
  }

  // Safely access the API key to prevent a ReferenceError in browser environments where `process` may not be defined.
  const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
  } else {
    // Log an error only once if the key is missing.
    if (!ai) {
      console.error("Gemini API key not found. Please set the API_KEY environment variable. AI features will be disabled, and fallback data will be used.");
    }
    return null;
  }
};


export const generateInterests = async (): Promise<string[]> => {
  const localAi = getAiClient();
  const fallbackInterests = ["Photography", "Hiking", "Cooking", "Gaming", "Reading", "Yoga", "Traveling", "Coding", "Music", "Art", "Investing", "Startups", "Coffee", "Podcasts", "Blogging"];

  if (!localAi) {
    return fallbackInterests;
  }

  try {
    const response = await localAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 40 diverse hobbies and interests suitable for professionals in an office setting. Examples: 'Data Visualization', 'Rock Climbing', 'Board Games'.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interests: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.interests || [];
  } catch (error) {
    console.error("Error generating interests:", error);
    // Fallback to a default list in case of an API error
    return fallbackInterests;
  }
};


export const generateIcebreaker = async (sharedInterests: string[]): Promise<string> => {
  const localAi = getAiClient();
  const fallbackIcebreaker = "Hey! Looks like we have some things in common. How's your week going?";

  if (!localAi || sharedInterests.length === 0) {
    return fallbackIcebreaker;
  }

  const prompt = `Two people have matched and share these interests: ${sharedInterests.join(', ')}. Create a fun, friendly, and short (under 20 words) icebreaker question to start their conversation. The question should be about one of their shared interests.`;

  try {
    const response = await localAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating icebreaker:", error);
    return `I see we both like ${sharedInterests[0]}! What's your favorite part about it?`;
  }
};