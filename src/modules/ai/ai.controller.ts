import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const generateSustainabilityAdvisorReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { prompt, companyData } = req.body;
    
    const systemInstruction = "You are an enterprise-grade AI Sustainability Advisor. Provide multi-step optimization roadmaps, carbon reduction strategies, and professional corporate ESG jargon adhering strictly to a zero-placeholder policy.";
    const userPrompt = prompt || `Analyze the following corporate carbon footprint data and generate an actionable sustainability roadmap: ${JSON.stringify(companyData || { scope1: "45t CO2e", scope2: "120t CO2e", scope3: "310t CO2e" }) }`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: { systemInstruction, temperature: 0.4 }
      });
    } catch (primaryError: any) {
      if (primaryError.status === 503) {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: userPrompt,
          config: { systemInstruction, temperature: 0.4 }
        });
      } else {
        throw primaryError;
      }
    }

    const analysisText = response.text || (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "No response generated from AI model.";

    res.status(200).json({ success: true, analysis: analysisText });
  } catch (error: any) {
    console.error("AI Error Details:", error);
    res.status(500).json({ 
      success: false, 
      message: error.status === 503 ? 'Gemini AI is currently experiencing high demand. Please click generate again in a moment.' : (error.message || 'AI generation failed') 
    });
  }
};