import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Estratégia de Model Hunting: Lista de modelos em ordem de preferência
const MODELS = [
  "gemini-1.5-flash-002", // Estável e Rápido
  "gemini-1.5-flash",     // Fallback Estável
  "gemini-1.5-pro",       // Alta capacidade (se disponível)
  "gemini-2.0-flash-exp"  // Experimental/Futuro
];

export async function getStableModel() {
  // Nota: Em implementações síncronas simples, usamos o primeiro da lista.
  // Em fluxos complexos, poderíamos testar a disponibilidade.
  return genAI.getGenerativeModel({ model: MODELS[0] });
}

// Exportando o modelo principal para compatibilidade imediata
export const model = genAI.getGenerativeModel({ 
  model: MODELS[0] 
});

