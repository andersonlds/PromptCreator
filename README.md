# PromptCreator — Engenharia de Prompt Profissional

O **PromptCreator** é uma aplicação de alta performance projetada para simplificar e elevar a qualidade da engenharia de prompt. Utilizando frameworks validados e refinamento por Inteligência Artificial via Groq Cloud, o sistema gera estruturas otimizadas para LLMs (Large Language Models) de última geração.

## 🌌 Estética e Design

O sistema adota o padrão **Midnight Premium** com efeitos de **Liquid Glass**.
- **Visual**: Interface em tons escuros (Slate/Indigo), transparências e desfoque de fundo (backdrop-blur).
- **Interatividade**: Micro-animações fluidas desenvolvidas com **GSAP** e **Framer Motion**.
- **Fundo Dinâmico**: Background estelar renderizado via **Three.js** para uma experiência imersiva.

## 🛠️ Funcionalidades Principais

### 1. Frameworks de Engenharia
- **IDEAL**: Focado em controle técnico e restrições operacionais. Perfeito para automação e análise de dados.
- **RTF (Role, Task, Format)**: Focado em velocidade e precisão. Ideal para e-mails e relatórios estruturados.
- **CREATE**: Focado em engajamento e personalização. Ideal para interações humanizadas e escrita criativa.

### 2. Refinamento por IA
- Integração com a infraestrutura da **Groq Cloud**.
- Modelo principal: `llama-3.3-70b-versatile`.
- **Fail-Safe**: Sistema de fallback que garante a geração local do prompt caso o serviço de IA esteja indisponível ou atinja o limite de quota.

### 3. Notificações Profissionais
- Substituição de alertas nativos por um sistema de **Toasts** assíncronos.
- **Modais de Confirmação** customizados para decisões críticas do sistema.

### 4. Responsividade Total
- Layout otimizado para celulares, tablets e desktops.
- Escalonamento tipográfico dinâmico e empilhamento inteligente de componentes em telas móveis.

## 🚀 Stack Tecnológica

- **Core**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/)
- **Gráficos 3D**: [Three.js](https://threejs.org/)
- **IA Engine**: [Groq Cloud SDK](https://groq.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

```env
GROQ_API_KEY=seu_api_key_aqui
```

## 📦 Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação em: `http://localhost:3000`

---

Desenvolvido por **Quantum Lab © 2026**.
