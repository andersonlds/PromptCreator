"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Sparkles, Wand2, Terminal, Zap, ChevronDown } from "lucide-react";
import { gsap } from "gsap";

type Framework = "IDEAL" | "RTF" | "CREATE";

interface FormData {
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

export default function PromptGenerator() {
  const [mounted, setMounted] = useState(false);
  const [framework, setFramework] = useState<Framework>("IDEAL");
  const [data, setData] = useState<FormData>({
    intent: "", details: "", examples: "", action: "", limit: "",
    role: "", task: "", format: "",
    character: "", request: "", adjustment: "", type: "",
    cotInstruction: ""
  });
  const [cot, setCot] = useState(false);
  const [output, setOutput] = useState("");
  const [showResult, setShowResult] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleInputChange = (field: keyof FormData, value: string) => {
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

  const handleGenerateClick = () => {
    generatePrompt();
    setShowResult(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      gsap.fromTo(resultRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" });
    }, 100);
  };

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className="relative z-10">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 mb-6 leading-tight">
          PromptCreator
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 font-medium">
          A ferramenta definitiva para Engenharia de Prompt Sênior. 
          Gere estruturas profissionais usando IDEAL, RTF e CREATE.
        </p>
        <button 
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="group flex flex-col items-center gap-4 text-white/50 hover:text-white transition-colors"
        >
          <span className="text-sm font-bold uppercase tracking-widest">Começar Agora</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="max-w-4xl mx-auto px-4 py-24">
        <div className="space-y-12">
          <div className="card-container">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-100">
              <Zap className="w-6 h-6 text-indigo-400" /> Escolha o Framework
            </h3>
            <div className="flex bg-slate-950 p-2 rounded-2xl gap-2 border border-slate-800 shadow-inner mb-6">
              {(["IDEAL", "RTF", "CREATE"] as Framework[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFramework(f)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                    framework === f ? "btn-framework-active" : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
              <p className="text-slate-300 text-sm leading-relaxed">
                {framework === "IDEAL" && "Focado em controle técnico e restrições operacionais. Perfeito para automação, análise de dados e sistemas complexos."}
                {framework === "RTF" && "Focado em velocidade e precisão. Ideal para geração de conteúdo, e-mails e relatórios estruturados."}
                {framework === "CREATE" && "Focado em engajamento e personalização. Ideal para interações humanizadas e escrita criativa."}
              </p>
            </div>
          </div>

          <div className="card-container">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
                <Terminal className="w-6 h-6 text-indigo-400" /> Parâmetros do Prompt
              </h3>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-950/50 px-4 py-2 rounded-full border border-slate-800">
                <span className="text-sm font-bold text-slate-400">Chain of Thought</span>
                <input type="checkbox" checked={cot} onChange={() => setCot(!cot)} className="w-5 h-5 accent-indigo-500" />
              </label>
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
              className="mt-10 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 text-xl tracking-wider uppercase"
            >
              <Wand2 className="w-6 h-6" /> GERAR PROMPT AGORA
            </button>
          </div>
        </div>

        {/* RESULT SECTION */}
        {showResult && (
          <div ref={resultRef} className="mt-24 space-y-8 opacity-0">
            <div className="card-container bg-slate-900 border-none flex flex-col min-h-[500px] ring-1 ring-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-400" /> Seu Prompt Profissional
                </h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(output)} 
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  title="Copiar para área de transferência"
                >
                  <Copy className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                </button>
              </div>
              <div className="preview-area flex-1 bg-black/40 border-none">{output}</div>
              <p className="mt-4 text-center text-slate-500 text-sm italic">
                Pronto! Copie o prompt acima e cole no seu modelo de IA favorito.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-600 text-sm">
          PromptCreator © 2026 • Engenharia de Prompt Avançada
        </p>
      </footer>
    </div>
  );
}

function InputGroup({ label, value, onChange, description }: { label: string, value: string, onChange: (v: string) => void, description?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="input-label mb-0">{label}</label>
        {description && <span className="text-xs text-slate-500 font-medium">{description}</span>}
      </div>
      <textarea 
        className="input-box min-h-[100px] resize-none" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
      />
    </div>
  );
}
