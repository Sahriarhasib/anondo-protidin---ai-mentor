
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { MentorMessage } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chat(history: MentorMessage[], message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          topP: 0.9,
        },
      });
      return response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
    }
  }
}

export const geminiService = new GeminiService();
