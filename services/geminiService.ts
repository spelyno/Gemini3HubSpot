import { GoogleGenAI } from "@google/genai";
import { Contact, Deal } from '../types';

// Initialize the Gemini API client
// Note: process.env.API_KEY is assumed to be available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Generates a cold email draft based on contact information.
   */
  async generateEmailDraft(contact: Contact, context: string): Promise<string> {
    try {
      const prompt = `
        You are an expert sales representative. Write a professional, personalized cold email to ${contact.firstName} ${contact.lastName}, 
        who is the ${contact.position} at ${contact.company}.
        
        Context for the email: ${context}
        
        Keep it concise (under 150 words), persuasive, and professional. 
        Do not include subject lines or placeholders like [Your Name] if possible, just the body text.
      `;
      
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return response.text || "Unable to generate draft.";
    } catch (error) {
      console.error("Gemini Email Gen Error:", error);
      return "Error generating email. Please check your API key.";
    }
  },

  /**
   * Analyzes a deal and provides probability insights and next steps.
   */
  async analyzeDeal(deal: Deal, contact: Contact): Promise<{ analysis: string; recommendedAction: string }> {
    try {
      const prompt = `
        Analyze the following sales deal:
        Deal Title: ${deal.title}
        Amount: $${deal.amount}
        Stage: ${deal.stage}
        Current Probability: ${deal.probability}%
        Contact: ${contact.firstName} ${contact.lastName} (${contact.position} at ${contact.company})
        Contact Notes: ${contact.notes}

        Provide a brief risk analysis (2-3 sentences) and one concrete recommended next step to move the deal forward.
        Return the response as a JSON object with keys "analysis" and "recommendedAction".
        Do not use Markdown formatting for the JSON.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      // Basic cleanup if the model adds markdown ticks despite instruction
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Gemini Deal Analysis Error:", error);
      return { 
        analysis: "Could not analyze deal at this time.", 
        recommendedAction: "Review manually." 
      };
    }
  },

  /**
   * Summarizes recent activity for a contact.
   */
  async summarizeContactHistory(contact: Contact, activities: string[]): Promise<string> {
    try {
        const prompt = `
            Summarize the relationship status with ${contact.firstName} ${contact.lastName} from ${contact.company}.
            Based on these notes/activities:
            ${activities.join('\n')}
            
            Provide a bulleted summary of key points in HTML format (using <ul> and <li>).
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        
        return response.text || "No summary available.";
    } catch (error) {
        return "Error summarizing contact.";
    }
  }
};
