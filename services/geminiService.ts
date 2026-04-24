
import { GoogleGenAI, Type } from "@google/genai";
import { FuelStation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFuelAdvisor = async (stations: FuelStation[], query: string) => {
  try {
    const context = stations.map(s => 
      `${s.name} em ${s.neighborhood}: Gasolina está ${s.gasolineStatus}, Gasóleo está ${s.dieselStatus}`
    ).join('. ');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto dos postos de combustível no Soyo: ${context}. Pergunta do usuário: ${query}`,
      config: {
        systemInstruction: "Você é o assistente do app Fuel Check Soyo. Ajude o usuário a encontrar combustível de forma rápida e educada em português de Angola. Seja breve e direto.",
        temperature: 0.7,
      }
    });

    return response.text || "Não consegui processar seu pedido agora. Verifique a lista abaixo.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao consultar o assistente.";
  }
};
