import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";

if (!apiKey && process.env.NODE_ENV !== "development") {
  console.warn("GROQ_API_KEY não configurada.");
}

export const groq = new Groq({
  apiKey: apiKey,
});

export const MODEL_NAME = "llama-3.3-70b-versatile";

/**
 * Interface simplificada para geração de conteúdo via Groq com JSON Mode.
 */
export async function generateWithGroq(systemPrompt: string, userPrompt: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: MODEL_NAME,
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error("[Groq Error]:", error.message);
    throw error;
  }
}
