# Frameworks de Engenharia de Prompt
**Guia Técnico para Otimização de Modelos de Linguagem (LLMs)**

---

## O que é Chain of Thought (CoT)?

Técnica que instrui o modelo a decompor problemas complexos em passos lógicos intermediários. Essencial para reduzir alucinações e aumentar a precisão em tarefas de raciocínio. Ao forçar a IA a "pensar alto", o texto gerado serve como uma memória de trabalho.

### Ativação do COT

Utilize comandos como: "Pense passo a passo", "Explique seu raciocínio antes da conclusão" ou "Decomponha o problema em subtarefas".

### Guia de Elaboração — CoT (Perguntas Chave)

- **Passo a passo:** Consigo dividir o problema em etapas independentes e ordenadas?
- **Verificação:** Cada etapa tem um critério claro de conclusão antes de avançar para a próxima?
- **Explicitação:** O modelo precisa mostrar o raciocínio intermediário ou apenas o resultado final?
- **Dependência:** A conclusão da etapa N depende obrigatoriamente do resultado da etapa N-1?
- **Checagem:** Quais premissas do problema devem ser verificadas antes de iniciar a cadeia de raciocínio?

---

## Modelos Estruturados

### Método IDEAL (Controle e Escopo)

Focado em parâmetros técnicos e restrições operacionais rigorosas.

- **Intenção:** Objetivo central da tarefa.
- **Detalhes:** Contexto e dados de entrada necessários.
- **Exemplos:** Padrões de saída desejados (Few-shot).
- **Ação:** Comando direto e imperativo.
- **Limite:** Restrições e comportamentos a evitar.

#### Guia de Elaboração (Perguntas Chave)

- *Intenção:* Qual é o resultado único e final que desejo alcançar?
- *Detalhes:* Quais dados ou variáveis o modelo deve considerar obrigatoriamente?
- *Exemplos:* Tenho referências de tom ou formato que o modelo deve imitar?
- *Ação:* Qual é o verbo de comando que melhor descreve a operação?
- *Limite:* O que é proibido ou deve ser ignorado para evitar alucinações?

#### Perguntas adicionais para refinamento do IDEAL

- *Intenção:* O objetivo está formulado de forma que só existe uma interpretação possível?
- *Detalhes:* Existe alguma variável de contexto que, se omitida, mudaria o resultado esperado?
- *Exemplos:* O exemplo que forneci cobre casos extremos (edge cases) relevantes para a tarefa?
- *Ação:* O verbo de comando implica um escopo claro (ex.: "liste" vs. "analise" vs. "recomende")?
- *Limite:* O limite exclui explicitamente todo conteúdo que não serve ao objetivo central?

#### Exemplo prático

```
[INTENÇÃO]: Análise de segurança em Python.
[AÇÃO]: Identifique falhas de Path Traversal no código anexo.
[LIMITE]: Não altere lógica de negócio.
```

---

### Método RTF (Papel e Formato)

A abordagem mais eficiente para tarefas diretas com personas definidas.

- **Role (Papel):** Atribua uma especialidade (Ex: Engenheiro Sênior).
- **Task (Tarefa):** O trabalho específico a ser realizado.
- **Format (Formato):** Estrutura da saída (JSON, Tabela, Markdown).

#### Guia de Elaboração (Perguntas Chave)

- *Role:* Se eu fosse contratar um humano para isso, qual seria o cargo dele?
- *Task:* Qual é a missão atômica que precisa ser entregue agora?
- *Format:* O dado será lido por um humano (texto) ou por um sistema (JSON/CSV)?

#### Perguntas adicionais para refinamento do RTF

- *Role:* O nível de sênioridade da persona afeta o vocabulário e a profundidade esperados da resposta?
- *Role:* A persona deve ter viés de uma área específica (segurança, negócios, UX) que influencie o julgamento?
- *Task:* A tarefa é atômica ou contém subtarefas implícitas que precisam ser explicitadas?
- *Task:* Existe uma restrição de tempo ou volume que define o escopo mínimo aceitável da entrega?
- *Format:* O formato escolhido preserva toda a informação necessária sem perda de semântica?
- *Format:* Se o consumidor for um sistema, o formato precisa de schema ou validação adicional (ex.: JSON Schema)?

#### Exemplo prático

```
[ROLE]: Arquiteto Cloud AWS.
[TASK]: Plano de migração de banco RDS.
[FORMAT]: Tabela comparativa (Risco vs Mitigação).
```

---

### Método CREATE (Complexidade)

Para documentos extensos, redação criativa e parâmetros de geração específicos.

- **Character:** Persona e tom de voz detalhado.
- **Request:** Solicitação principal clara.
- **Adjustment:** Refinamentos de estilo e público-alvo.
- **Type:** Tipo de arquivo ou formato de saída.

#### Guia de Elaboração (Perguntas Chave)

- *Character:* Qual a personalidade, bagagem cultural e nível de formalidade?
- *Request:* O pedido é explícito o suficiente para não gerar dúvidas?
- *Adjustment:* Preciso de algum ajuste de extensão, público ou viés?
- *Type:* É um post para rede social, um e-mail corporativo ou um script?

#### Perguntas adicionais para refinamento do CREATE

- *Character:* O personagem tem opiniões, valores ou preferências que devem transparecer no texto?
- *Character:* A persona é especialista no assunto ou deve simular o nível de conhecimento do público-alvo?
- *Request:* A solicitação tem uma hipótese central que o texto deve defender ou refutar?
- *Request:* Existe algum tópico adjacente que deve ser deliberadamente excluído para manter o foco?
- *Adjustment:* O público-alvo é técnico, leigo ou misto? Isso altera o vocabulário e a densidade de informação?
- *Adjustment:* Há restrições de SEO, acessibilidade ou conformidade editorial que devem ser respeitadas?
- *Type:* O tipo de saída implica restrições de comprimento (ex.: tweet: 280 chars, artigo: 1200+ words)?

#### Exemplo prático

```
[CHARACTER]: Redator técnico da revista Wired.
[REQUEST]: Artigo sobre IA Generativa (2000 palavras).
[TYPE]: Markdown formatado com cabeçalhos H2 e H3.
```

---

## Sinergia: Modelos Estruturados + Chain of Thought (CoT)

Para problemas que exigem lógica multicamada, integramos o CoT dentro dos frameworks tradicionais.

### Exemplo Híbrido: IDEAL + CoT

```
[INTENÇÃO]: Diagnóstico de performance em Banco de Dados.
[DETALHES]: Query lenta demorando 15 segundos em produção.
[AÇÃO]: Analise o plano de execução seguindo estes passos:
  1. Identifique se há Sequential Scan em tabelas grandes.
  2. Avalie a seletividade dos índices existentes.
  3. Conclua com a sugestão de otimização baseada no raciocínio acima.
[LIMITE]: Não sugira alteração de hardware antes de esgotar tunning de query.
```

### Exemplo Híbrido: RTF + CoT

```
[ROLE]: Consultor Estratégico Sênior.
[TASK]: Decidir se a empresa deve investir em IA agora.
[FORMAT]: Texto com análise de pensamento crítico.
[INSTRUÇÃO COT]: Antes de dar a recomendação, analise o custo de oportunidade, o tempo
de implementação e a curva de aprendizado da equipe. Pense passo a passo.
```

### Exemplo Híbrido: CREATE + CoT

```
[CHARACTER]: Arquiteto de Sistemas Críticos.
[REQUEST]: Desenhe uma solução de mensageria resiliente.
[ADJUSTMENT]: Explique a lógica de cada componente antes de apresentá-los.
[INSTRUÇÃO COT]: Decomponha a arquitetura em: Ingestão, Processamento, Armazenamento e
Recuperação de Erros. Justifique cada escolha técnica.
```

---

## Aplicações Avançadas: CoT Integrado aos Modelos de Prompt

Esta seção apresenta casos de uso aprofundados que combinam a decomposição lógica do CoT com cada um dos três modelos estruturados. O objetivo é demonstrar como a instrução de raciocínio explícito eleva a qualidade e a rastreabilidade das respostas em cenários complexos.

### CoT + IDEAL — Revisão de Arquitetura de Software

**Cenário:** avaliar se um microsserviço legado deve ser migrado para arquitetura orientada a eventos. O CoT força o modelo a analisar cada dimensão técnica antes de emitir um veredito.

```
[INTENÇÃO]: Avaliar viabilidade de migração de microsserviço para event-driven.
[DETALHES]: Serviço atual em REST síncrono; 50k req/dia; equipe de 3 devs;
  sem testes de integração; SLA de 99,5%.
[AÇÃO]: Siga obrigatoriamente esta cadeia de raciocínio antes da conclusão:
  1. Mapeie os acoplamentos síncronos existentes e classifique por criticidade.
  2. Identifique riscos de consistência eventual para cada acoplamento crítico.
  3. Estime o custo de refatoração em homens-hora considerando a equipe descrita.
  4. Compare o custo com o ganho esperado em escalabilidade e resiliência.
  5. Emita a recomendação final com base nos passos anteriores.
[LIMITE]: Não recomendar tecnologias específicas antes de concluir a análise.
  Não ignorar a restrição de SLA na conclusão.
```

**Por que funciona:** o campo `[AÇÃO]` impõe uma sequência de inferências numeradas. O modelo não pode saltar para a recomendação sem antes externalizar o raciocínio intermediário, o que torna erros lógicos detectáveis e auditáveis.

---

### CoT + RTF — Análise de Incidente de Segurança

**Cenário:** um engenheiro de segurança precisa produzir um relatório de post-mortem de um vazamento de dados com cadeia de evidências documentada.

```
[ROLE]: Engenheiro de Segurança Sênior especializado em resposta a incidentes.
[TASK]: Produzir post-mortem de vazamento de credenciais via variável de ambiente
  exposta em log de CI/CD.
[FORMAT]: Relatório em Markdown com seções: Linha do Tempo, Causa Raiz,
  Impacto, Ações Corretivas.
[INSTRUÇÃO COT]:
  Antes de redigir cada seção, responda internamente:
  - Linha do Tempo: Qual é o evento mais antigo rastreável? Há lacunas?
  - Causa Raiz: A causa é técnica, processual ou ambas? Existe causa-raiz upstream?
  - Impacto: O impacto é limitável ou já materializado? Quais sistemas foram expostos?
  - Ações Corretivas: A ação ataca a causa raiz ou apenas o sintoma?
  Somente após este raciocínio, redija cada seção.
```

**Por que funciona:** a instrução CoT é inserida como um quarto campo no RTF, forçando a persona (Role) a raciocinar dentro do domínio de segurança antes de produzir o formato estruturado solicitado. A qualidade do relatório final é diretamente proporcional à profundidade do raciocínio intermediário exigido.

---

### CoT + CREATE — Elaboração de Proposta Técnica Comercial

**Cenário:** produzir uma proposta de implementação de plataforma de dados para um cliente corporativo, equilibrando linguagem técnica e argumentação de valor de negócio.

```
[CHARACTER]: Consultor de Dados Sênior com 15 anos de experiência em projetos
  enterprise. Tom: assertivo, orientado a resultado, sem jargões desnecessários.
[REQUEST]: Proposta de implementação de Data Lakehouse para empresa de logística
  com 200 TB de dados históricos e 5 TB/mês de crescimento.
[ADJUSTMENT]: Público-alvo misto: CTO (técnico) e CFO (financeiro).
  Máximo de 4 páginas. Evitar buzzwords sem substância.
[TYPE]: Documento Word com capa, sumário executivo e seções numeradas.
[INSTRUÇÃO COT]:
  Antes de escrever qualquer seção, decomponha mentalmente:
  1. Qual dor específica do cliente esta seção resolve?
  2. Qual métrica de negócio (custo, tempo, risco) é impactada?
  3. A linguagem está calibrada para o perfil do decisor desta seção?
  4. A afirmação técnica é verificável ou é uma promessa genérica?
  Redija a seção somente após esta validação interna.
```

**Por que funciona:** o CoT atua como um filtro de qualidade embutido no processo de geração. O campo `[ADJUSTMENT]` define o público; o CoT garante que cada parágrafo seja justificado por uma necessidade real do leitor antes de ser escrito.

---

### CoT Encadeado — Raciocínio em Múltiplos Turnos

Técnica avançada: dividir um problema complexo em múltiplos prompts onde a saída de um turno alimenta o raciocínio do turno seguinte. Útil quando o problema excede a janela de contexto ou exige validação humana entre etapas.

```
--- TURNO 1 (Diagnóstico) ---
[ROLE]: Arquiteto de Software.
[TASK]: Dado o diagrama de dependências abaixo, identifique apenas os
  acoplamentos circulares. Liste-os numerados. Não proponha soluções ainda.
[INSTRUÇÃO COT]: Percorra cada módulo e trace suas dependências passo a passo.

--- TURNO 2 (Priorização) ---
[ROLE]: Arquiteto de Software.
[TASK]: Com base nos acoplamentos identificados no diagnóstico anterior,
  classifique-os por impacto em testabilidade (Alto/Médio/Baixo).
[INSTRUÇÃO COT]: Para cada item, justifique a classificação antes de atribuí-la.

--- TURNO 3 (Solução) ---
[ROLE]: Arquiteto de Software.
[TASK]: Proponha a refatoração para os 2 acoplamentos de impacto Alto.
[INSTRUÇÃO COT]: Para cada proposta, avalie: custo de mudança, risco de regressão
  e ganho em manutenibilidade. Conclua com a ordem recomendada de execução.
```

**Vantagem do CoT encadeado:** cada turno tem um escopo restrito e verificável. O humano pode validar o diagnóstico (Turno 1) antes de autorizar a priorização (Turno 2), mantendo controle granular sobre o raciocínio do modelo em problemas de alta complexidade.

---

*Documento gerado para referência técnica em Engenharia de Prompt.*
