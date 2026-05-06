export type Framework = "IDEAL" | "RTF" | "CREATE";

export interface PromptFormData {
  intent: string;
  details: string;
  examples: string;
  action: string;
  limit: string;
  role: string;
  task: string;
  format: string;
  character: string;
  request: string;
  adjustment: string;
  type: string;
  cotInstruction: string;
}
