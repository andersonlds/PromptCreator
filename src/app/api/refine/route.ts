import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/gemini";
import { Framework, PromptFormData } from "@/types/prompt";

export async function POST(req: Request) {
  try {
    const { framework, data }: { framework: Framework, data: PromptFormData } = await req.json();

    const systemPrompt = `Você é um Engenheiro de Prompt Sênior (Nível Master). 
    Refine os campos do framework ${framework}.
    Eleve a qualidade técnica, clareza e autoridade dos textos originais.
    
    DADOS:
    ${JSON.stringify(data)}
    
    Retorne estritamente o JSON atualizado com os novos textos profissionais.`;

    const result = await generateWithFallback({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const text = response.text();
    const improvedData = JSON.parse(text);

    return NextResponse.json(improvedData);
  } catch (error: any) {
    console.error("Erro no processamento Gemini:", error.message);
    return NextResponse.json({ error: error.message || "Erro na IA" }, { status: 500 });
  }
}
