import { NextResponse } from "next/server";
import { generateWithGroq } from "@/lib/groq";
import { Framework, PromptFormData } from "@/types/prompt";
import { limiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    
    try {
      await limiter.check(5, ip);
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
    IMPORTANTE: Retorne estritamente um objeto JSON onde TODOS os valores são strings. Não use objetos aninhados ou arrays.`;

    const userPrompt = `DADOS ORIGINAIS: ${JSON.stringify(data)}`;

    const result = await generateWithGroq(systemPrompt, userPrompt);
    
    if (!result) {
      throw new Error("Falha ao obter resposta do Groq");
    }

    const improvedData = JSON.parse(result);

    return NextResponse.json(improvedData);
  } catch (error: any) {
    console.error("Erro no processamento Groq:", error.message);
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" }, 
      { status: 500 }
    );
  }
}
