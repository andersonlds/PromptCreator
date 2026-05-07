"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Sparkles, Wand2, Terminal, Zap, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { Framework, PromptFormData } from "@/types/prompt";

const INITIAL_DATA: PromptFormData = {
  intent: "", details: "", examples: "", action: "", limit: "",
  role: "", task: "", format: "",
  character: "", request: "", adjustment: "", type: "",
  cotInstruction: ""
};

export default function PromptGenerator() {
  const [mounted, setMounted] = useState(false);
  const [framework, setFramework] = useState<Framework>("IDEAL");
  const [data, setData] = useState<PromptFormData>(INITIAL_DATA);
  const [cot, setCot] = useState(false);
  const [output, setOutput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFrameworkChange = (f: Framework) => {
    if (f === framework) return;
    setFramework(f);
    setData(INITIAL_DATA);
    setCot(false);
    setShowResult(false);
  };

  useEffect(() => {
    const examples = {
      IDEAL: "1. Mapeie os acoplamentos síncronos;\n2. Identifique riscos de consistência;\n3. Estime o custo de refatoração;\n4. Compare ganho em escalabilidade;\n5. Emita a recomendação final.",
      RTF: "Antes de redigir, responda internamente:\n- Linha do Tempo: Eventos rastreáveis?\n- Causa Raiz: Técnica ou processual?\n- Impacto: Sistemas expostos?",
      CREATE: "Decomponha mentalmente:\n1. Qual dor específica resolve?\n2. Qual métrica de negócio impacta?\n3. Linguagem calibrada ao decisor?\n4. Afirmação técnica verificável?"
    };

    if (cot) {
      setData(prev => ({ ...prev, cotInstruction: examples[framework] }));
    } else {
      setData(prev => ({ ...prev, cotInstruction: "" }));
    }
  }, [framework, cot]);

  useEffect(() => {
    generatePrompt();
  }, [framework, data, cot]);

  const handleInputChange = (field: keyof PromptFormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = () => {
    let result = "";
    if (framework === "IDEAL") {
      const actionWithCot = cot && data.cotInstruction
        ? `${data.action}\nSiga esta cadeia de raciocínio antes da conclusão:\n${data.cotInstruction}`
        : data.action;

      result = `[INTENÇÃO]: ${data.intent}\n` +
        `[DETALHES]: ${data.details}\n` +
        `[EXEMPLOS]: ${data.examples}\n` +
        `[AÇÃO]: ${actionWithCot}\n` +
        `[LIMITE]: ${data.limit}`;
    } else if (framework === "RTF") {
      result = `[ROLE]: ${data.role}\n` +
        `[TASK]: ${data.task}\n` +
        `[FORMAT]: ${data.format}`;
      if (cot && data.cotInstruction) {
        result += `\n[INSTRUÇÃO COT]: ${data.cotInstruction}`;
      }
    } else if (framework === "CREATE") {
      result = `[CHARACTER]: ${data.character}\n` +
        `[REQUEST]: ${data.request}\n` +
        `[ADJUSTMENT]: ${data.adjustment}\n` +
        `[TYPE]: ${data.type}`;
      if (cot && data.cotInstruction) {
        result += `\n[INSTRUÇÃO COT]: ${data.cotInstruction}`;
      }
    }
    setOutput(result.trim());
  };

  const validateFields = () => {
    const requiredFields: Record<Framework, (keyof PromptFormData)[]> = {
      IDEAL: ["intent", "details", "examples", "action", "limit"],
      RTF: ["role", "task", "format"],
      CREATE: ["character", "request", "adjustment", "type"]
    };

    const fieldsToCheck = [...requiredFields[framework]];
    if (cot) fieldsToCheck.push("cotInstruction");

    const missingFields = fieldsToCheck.filter(field => !data[field]?.trim());

    if (missingFields.length > 0) {
      alert("Por favor, preencha todos os campos obrigatórios antes de gerar o prompt.");
      return false;
    }
    return true;
  };

  const handleGenerateClick = async () => {
    if (!validateFields()) return;

    setIsImproving(true);
    setShowResult(true);

    let finalData = data;

    try {
      // 1. Tentar Refinar com IA (com timeout de 8 segundos para não travar)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ framework, data }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const improvedData = await response.json();

      if (improvedData && !improvedData.error) {
        console.log("IA refinou com sucesso:", improvedData);
        finalData = improvedData;
        setData(improvedData);
      } else {
        const isQuotaError = improvedData.error?.includes("429") || improvedData.error?.toLowerCase().includes("quota");

        if (isQuotaError) {
          const proceed = window.confirm(
            "A cota do Google Gemini esgotou para este modelo.\n\n" +
            "Deseja gerar o prompt exatamente como você digitou (sem refinamento da IA)?\n" +
            "Se cancelar, a aplicação será reiniciada."
          );

          if (!proceed) {
            window.location.reload();
            return;
          }
        } else {
          alert("Aviso: O Gemini não conseguiu refinar este prompt. Gerando versão local. Detalhe: " + improvedData.error);
        }
      }
    } catch (error: any) {
      console.error("Erro crítico na chamada da IA:", error);
      alert("Falha técnica: " + (error.message || "Erro de rede") + ". Tente reiniciar o servidor.");
    } finally {
      // 2. Sempre gera o prompt (seja com dados da IA ou locais)
      const result = formatPrompt(framework, finalData, cot);
      setOutput(result);
      setIsImproving(false);

      // 3. Scroll e Animação garantidos
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        gsap.fromTo(resultRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" });
      }, 100);
    }
  };

  const formatPrompt = (fw: Framework, d: PromptFormData, isCot: boolean) => {
    let result = "";
    if (fw === "IDEAL") {
      const actionWithCot = isCot && d.cotInstruction
        ? `${d.action}\nSiga esta cadeia de raciocínio antes da conclusão:\n${d.cotInstruction}`
        : d.action;
      result = `[INTENÇÃO]: ${d.intent}\n[DETALHES]: ${d.details}\n[EXEMPLOS]: ${d.examples}\n[AÇÃO]: ${actionWithCot}\n[LIMITE]: ${d.limit}`;
    } else if (fw === "RTF") {
      result = `[ROLE]: ${d.role}\n[TASK]: ${d.task}\n[FORMAT]: ${d.format}`;
      if (isCot && d.cotInstruction) result += `\n[INSTRUÇÃO COT]: ${d.cotInstruction}`;
    } else if (fw === "CREATE") {
      result = `[CHARACTER]: ${d.character}\n[REQUEST]: ${d.request}\n[ADJUSTMENT]: ${d.adjustment}\n[TYPE]: ${d.type}`;
      if (isCot && d.cotInstruction) result += `\n[INSTRUÇÃO COT]: ${d.cotInstruction}`;
    }
    return result.trim();
  };

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className="relative z-10">
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 mb-8 leading-[1.1] tracking-tight">
          PromptCreator
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-16 font-medium leading-relaxed">
          A ferramenta definitiva para <span className="text-slate-200">Engenharia de Prompt</span>. <br />
          Gere estruturas profissionais com frameworks validados.
        </p>
        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="group flex flex-col items-center gap-6 text-slate-500 hover:text-indigo-400 transition-all duration-500"
          aria-label="Rolar para o formulário"
        >
          <span className="text-xs font-black uppercase tracking-[0.3em] ml-1">Explorar</span>
          <div className="p-2 rounded-full border border-slate-800 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </button>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="max-w-4xl mx-auto px-4 py-24">
        <div className="space-y-12">
          <div className="card-container group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">Escolha o Framework</h3>
                <p className="text-sm text-slate-500">Selecione a estrutura ideal para seu objetivo</p>
              </div>
            </div>

            <div className="flex bg-slate-950/80 p-2 rounded-2xl gap-2 border border-slate-800/50 shadow-inner mb-8">
              {(["IDEAL", "RTF", "CREATE"] as Framework[]).map(f => (
                <button
                  key={f}
                  onClick={() => handleFrameworkChange(f)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${framework === f
                    ? "btn-framework-active"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 backdrop-blur-sm h-[100px] flex items-center overflow-hidden">
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                {framework === "IDEAL" && "Focado em controle técnico e restrições operacionais. Perfeito para automação, análise de dados e sistemas complexos."}
                {framework === "RTF" && "Focado em velocidade e precisão. Ideal para geração de conteúdo, e-mails e relatórios estruturados."}
                {framework === "CREATE" && "Focado em engajamento e personalização. Ideal para interações humanizadas e escrita criativa."}
              </p>
            </div>
          </div>

          <div className="card-container group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <Terminal className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Parâmetros do Prompt</h3>
                  <p className="text-sm text-slate-500">Configure os detalhes da sua requisição</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-4 cursor-pointer bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                  <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Chain of Thought</span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={cot}
                      onChange={() => setCot(!cot)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              {framework === "IDEAL" && (
                <>
                  <InputGroup label="Intenção" value={data.intent} onChange={v => handleInputChange("intent", v)} description="Qual é o resultado único e final?" />
                  <InputGroup label="Detalhes" value={data.details} onChange={v => handleInputChange("details", v)} description="Quais dados o modelo deve considerar?" />
                  <InputGroup label="Exemplos" value={data.examples} onChange={v => handleInputChange("examples", v)} description="Referências de tom ou formato?" />
                  <InputGroup label="Ação" value={data.action} onChange={v => handleInputChange("action", v)} description="Verbo de comando da operação?" />
                  <InputGroup label="Limite" value={data.limit} onChange={v => handleInputChange("limit", v)} description="O que é proibido ou ignorado?" />
                </>
              )}
              {framework === "RTF" && (
                <>
                  <InputGroup label="Role" value={data.role} onChange={v => handleInputChange("role", v)} description="Qual seria o cargo contratado?" />
                  <InputGroup label="Task" value={data.task} onChange={v => handleInputChange("task", v)} description="Missão atômica a ser entregue?" />
                  <InputGroup label="Format" value={data.format} onChange={v => handleInputChange("format", v)} description="JSON, CSV, Texto ou Tabela?" />
                </>
              )}
              {framework === "CREATE" && (
                <>
                  <InputGroup label="Character" value={data.character} onChange={v => handleInputChange("character", v)} description="Persona e bagagem cultural?" />
                  <InputGroup label="Request" value={data.request} onChange={v => handleInputChange("request", v)} description="O pedido é explícito?" />
                  <InputGroup label="Adjustment" value={data.adjustment} onChange={v => handleInputChange("adjustment", v)} description="Público técnico ou leigo?" />
                  <InputGroup label="Type" value={data.type} onChange={v => handleInputChange("type", v)} description="Tipo de arquivo ou canal?" />
                </>
              )}

              {cot && (
                <div className="pt-6 border-t border-white/5">
                  <InputGroup
                    label="Instrução CoT"
                    value={data.cotInstruction}
                    onChange={v => handleInputChange("cotInstruction", v)}
                    description="Decomponha o problema em passos lógicos"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isImproving}
              className="mt-12 w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 sm:py-7 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-base sm:text-xl tracking-wider sm:tracking-[0.2em] uppercase">
                {isImproving ? (
                  <>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> REFINANDO COM IA...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" /> GERAR PROMPT AGORA
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {showResult && (
          <div ref={resultRef} className="mt-32 space-y-10 opacity-0">
            <div className="card-container group bg-slate-900/50 flex flex-col min-h-[500px] ring-1 ring-white/10 shadow-3xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Seu Prompt Profissional</h3>
                    <p className="text-sm text-slate-500">Pronto para uso imediato</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    alert("Copiado!");
                  }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group/btn border border-white/5 hover:border-indigo-500/30"
                  aria-label="Copiar prompt"
                >
                  <span className="text-sm font-bold text-slate-400 group-hover/btn:text-indigo-400 uppercase tracking-widest">Copiar</span>
                  <Copy className="w-5 h-5 text-slate-400 group-hover/btn:text-indigo-400" />
                </button>
              </div>
              <div className="preview-area flex-1 bg-black/60 border-indigo-500/10 group-hover:border-indigo-500/20 transition-colors overflow-auto custom-scrollbar">
                {output}
              </div>
              <div className="mt-6 flex items-center justify-center gap-3 py-4 border-t border-white/5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Otimizado para LLMs de alta performance
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-600 text-sm">
          PromptCreator © 2026 • Quantum Lab
        </p>
      </footer>
    </div>
  );
}

function InputGroup({ label, value, onChange, description }: { label: string, value: string, onChange: (v: string) => void, description?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="input-label mb-0">
          {label} <span className="text-red-500">*</span>
        </label>
        {description && <span className="text-xs text-slate-500 font-medium">{description}</span>}
      </div>
      <textarea
        className="input-box min-h-[100px] resize-none"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Preenchimento obrigatório..."
      />
    </div>
  );
}
