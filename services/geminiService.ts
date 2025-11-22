
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Source, AnalysisInput, ComplexityMode } from '../types';
import { SYSTEM_INSTRUCTION, INITIAL_PROMPT_TEMPLATE, FILE_PROMPT_TEMPLATE } from '../constants';

let chatSession: Chat | null = null;
let currentModel = 'gemini-2.5-flash';

// Helper to extract domain from URI
const getDomain = (uri: string) => {
  try {
    return new URL(uri).hostname.replace('www.', '');
  } catch (e) {
    return 'source';
  }
};

// Helper to extract sources from grounding metadata
const extractSources = (response: GenerateContentResponse): Source[] => {
  // Standard Google Search grounding
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  // Potential other source types in future updates
  
  if (!chunks) return [];

  // Filter for chunks that have a web URI
  return chunks
    .filter(c => c.web?.uri && c.web?.title)
    .map(c => ({
      title: c.web!.title!,
      uri: c.web!.uri!,
      domain: getDomain(c.web!.uri!)
    }));
};

export const initializeChat = async (apiKey: string, input: AnalysisInput): Promise<{ text: string; sources: Source[] }> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // Use flash for speed and general analysis
  currentModel = 'gemini-2.5-flash';

  chatSession = ai.chats.create({
    model: currentModel,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });

  let messagePayload: any;

  if (input.type === 'url') {
    messagePayload = { 
      message: INITIAL_PROMPT_TEMPLATE(input.value, input.autoResearch || false) 
    };
  } else {
    // For files, we pass the file data inline
    messagePayload = {
      message: [
        {
          inlineData: {
            mimeType: input.mimeType || 'application/pdf',
            data: input.value
          }
        },
        {
          text: FILE_PROMPT_TEMPLATE(input.fileName || 'Document')
        }
      ]
    };
  }
  
  try {
    const result = await chatSession.sendMessage(messagePayload);
    return {
      text: result.text || "I analyzed the content but couldn't generate a text summary. Ask me anything about it.",
      sources: extractSources(result)
    };
  } catch (error) {
    console.error("Gemini initialization error:", error);
    throw new Error("Failed to analyze the content. It might be too large or inaccessible.");
  }
};

export const sendMessageToGemini = async (text: string, complexity: ComplexityMode): Promise<{ text: string; sources: Source[] }> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  // Prepend complexity instruction to the user prompt contextually
  let finalPrompt = text;
  if (complexity === 'eli5') {
    finalPrompt = `(Mode: Explain Like I'm 5) ${text}`;
  } else if (complexity === 'expert') {
    finalPrompt = `(Mode: PhD Expert Level) ${text}`;
  }

  try {
    const result = await chatSession.sendMessage({ message: finalPrompt });
    return {
      text: result.text || "I couldn't generate a response.",
      sources: extractSources(result)
    };
  } catch (error) {
    console.error("Gemini message error:", error);
    return {
      text: "Sorry, I encountered an error processing your request.",
      sources: []
    };
  }
};
