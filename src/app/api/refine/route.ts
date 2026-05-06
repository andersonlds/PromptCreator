import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { Framework, PromptFormData } from "@/types/prompt";

export async function POST(req: Request) {
  try {
    const { framework, data }: { framework: Framework, data: PromptFormData } = await req.json();

    const systemPrompt = `Você é um Engenheiro de Prompt Sênior (Nível Master). 
    Utilize o poder do Gemini 2.5 para refinar os campos do framework ${framework}.
    Eleve a qualidade técnica, clareza e autoridade dos textos originais.
    
    DADOS:
    ${JSON.stringify(data)}
    
    Retorne estritamente o JSON atualizado com os novos textos profissionais.`;

    const result = await model.generateContent({
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
    console.error("Erro na SDK Gemini 2.5:", error.message);
    return NextResponse.json({ error: error.message || "Erro na IA" }, { status: 500 });
  }
}
