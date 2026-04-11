import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeTextAPI(text: string) {
  const prompt = `
    Analyze the following social media content for potential harm, fake news, hate speech, or toxicity.
    Content: "${text}"
    
    Return a JSON response with the following structure:
    {
      "category": "Safe" | "Low Risk" | "Suspicious" | "Harmful" | "Critical",
      "riskScore": number (0-100),
      "confidence": number (0-100),
      "detectedIssues": string[],
      "matchedSignals": string[],
      "explanation": string,
      "recommendation": string
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("API Analysis Error:", error);
    throw error;
  }
}

export async function analyzeImageAPI(base64Image: string, ocrText: string) {
  const prompt = `
    Analyze this image and its extracted text for potential harm.
    Extracted Text: "${ocrText}"
    
    Return a JSON response with the following structure:
    {
      "category": "Safe" | "Low Risk" | "Suspicious" | "Harmful" | "Critical",
      "riskScore": number (0-100),
      "confidence": number (0-100),
      "detectedIssues": string[],
      "textInterpretation": string,
      "visualInterpretation": string,
      "recommendation": string
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("API Image Analysis Error:", error);
    throw error;
  }
}
