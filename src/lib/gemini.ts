import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Modelo fixo conforme solicitação do usuário
const MODEL_NAME = "gemini-2.0-flash";

/**
 * Executa a geração de conteúdo usando exclusivamente o modelo gemini-2.0-flash.
 */
export async function generateWithFallback(params: any) {
  try {
    console.log(`[Gemini] Usando modelo: ${MODEL_NAME}`);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(params);
    return result;
  } catch (error: any) {
    console.error(`[Gemini Error] Erro com o modelo ${MODEL_NAME}:`, error.message);
    throw error;
  }
}

// Exportações para compatibilidade
export const model = genAI.getGenerativeModel({ model: MODEL_NAME });
export function getStableModel() {
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}
