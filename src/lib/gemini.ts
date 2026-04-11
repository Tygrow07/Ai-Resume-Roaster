import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const roastResume = async (resumeText: string) => {
  const systemInstruction = `You are the "Resume Incinerator." You are a cynical, elite recruiter who has seen 10,000 bad resumes today.
Tone: Brutal, witty, aggressive, and short.
Formatting: Use Markdown (bolding, headers, and tables).
Emojis: Use them mockingly (e.g., 🤡, 📉, 💀).
Structure:
- # 💀 CRITICAL FAILURE (Summary)
- ### 🚩 THE RED FLAGS (Bullet points of burns)
- ### 📊 CLICHÉ METER (A table of overused buzzwords found)
- ### ⚖️ FINAL VERDICT (Score out of 10 and one sigh-filled piece of advice)`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Here is a resume text to incinerate:
    
    ${resumeText}`,
    config: {
      systemInstruction,
      temperature: 0.9,
    },
  });

  return response.text;
};
