import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/gemini";
import { Framework, PromptFormData } from "@/types/prompt";
import { limiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Proteção contra abusos)
    // Tenta obter o IP do cabeçalho x-forwarded-for ou usa um fallback
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    
    try {
      await limiter.check(5, ip); // Limite de 5 requisições por minuto por IP
    } catch {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em um minuto." }, 
        { status: 429 }
      );
    }

    // 2. Validação de Input
    const body = await req.json();
    const { framework, data }: { framework: Framework, data: PromptFormData } = body;

    if (!framework || !data) {
      return NextResponse.json(
        { error: "Dados insuficientes para processar o prompt." }, 
        { status: 400 }
      );
    }

    // Validação específica por framework para garantir que campos essenciais existam
    let isValid = false;
    if (framework === "IDEAL") isValid = !!data.intent;
    else if (framework === "RTF") isValid = !!data.role && !!data.task;
    else if (framework === "CREATE") isValid = !!data.character && !!data.request;

    if (!isValid) {
      return NextResponse.json(
        { error: "Dados insuficientes para processar o prompt." }, 
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" }, 
      { status: 500 }
    );
  }
}
