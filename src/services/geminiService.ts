import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TopicContent {
  title: string;
  what: string;
  why: string;
  where: string;
  example: string;
}

export interface CodingProblem {
  title: string;
  description: string;
  input: string;
  expectedOutput: string;
  hint: string;
  solution: string;
  solutionExplanation: string;
}

export const geminiService = {
  async generateTopicContent(topic: string): Promise<TopicContent> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the Java topic "${topic}" for a 5th-grade student. Use simple language, daily life examples. Format as JSON with fields: title, what, why, where, example.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            what: { type: Type.STRING },
            why: { type: Type.STRING },
            where: { type: Type.STRING },
            example: { type: Type.STRING },
          },
          required: ["title", "what", "why", "where", "example"],
        },
      },
    });
    return JSON.parse(response.text);
  },

  async generateMCQs(topic: string): Promise<MCQ[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 15 simple MCQs about "${topic}" for kids. Each question should have 4 options and a simple 1-2 line explanation. Format as a JSON array of objects with fields: question, options (array of 4 strings), correctAnswer (index 0-3), explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });
    return JSON.parse(response.text);
  },

  async generateCodingProblem(topic: string): Promise<CodingProblem> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a simple Java coding problem for beginners about "${topic}". Format as JSON with fields: title, description, input, expectedOutput, hint, solution, solutionExplanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            input: { type: Type.STRING },
            expectedOutput: { type: Type.STRING },
            hint: { type: Type.STRING },
            solution: { type: Type.STRING },
            solutionExplanation: { type: Type.STRING },
          },
          required: ["title", "description", "input", "expectedOutput", "hint", "solution", "solutionExplanation"],
        },
      },
    });
    return JSON.parse(response.text);
  }
};
