import type { ReactNode } from "react";

export const hero = {
  selo: "BPM · Business Transformation",
  titulo: "Transformação operacional que conecta processo, tecnologia e negócio numa só entrega.",
  subtitulo: (
    <>
      Combinamos <b>arquitetura de processos</b>, <b>tecnologia</b>, <b>dados</b> e <b>gestão da mudança</b> em uma
      jornada única — da descoberta estratégica à melhoria contínua — para que a operação evolua de verdade, não só no
      papel.
    </>
  ) as ReactNode,
  jornada: ["Descobrir", "Priorizar", "Transformar", "Implantar", "Sustentar"],
};

export const cenarios = {
  etiqueta: "Diagnóstico",
  titulo: "Você reconhece algum destes cenários?",
  cenarios: [
    "Processos redesenhados no papel que nunca se transformam em mudança real na operação",
    "Iniciativas de automação e IA implantadas sem um redesenho de processo por trás",
    "Melhoria contínua que não conecta processo, tecnologia, dados e pessoas",
    "Redesenho de processo sem plano de adoção — a mudança não acontece na prática",
    "Várias iniciativas de transformação andando desconectadas, sem um roadmap único",
  ],
};

export const solucoes = {
  etiqueta: "Nossas soluções",
  titulo: "Como estruturamos a transformação do seu processo",
  textos: [
    "Cada frente combina processo, arquitetura, dados e tecnologia — de ERP e automação a workflow, low code e IA — para transformar como a operação funciona de verdade.",
  ],
  solucoes: [
    {
      rotulo: "Para entender o cenário com profundidade",
      titulo: "BPM Diagnose",
      descricao:
        "Diagnóstico operacional baseado em dados: mapeamento ponta a ponta, entrevistas, shadowing, mineração de processos (quando aplicável) e análise de indicadores para revelar onde a operação perde performance.",
      ganhos: [
        "Mapa de processos ponta a ponta (as-is)",
        "Matriz de dores e causas-raiz",
        "Análise de indicadores e mineração de processos",
        "Oportunidades de digitalização e automação priorizadas",
      ],
    },
    {
      rotulo: "Para redesenhar com arquitetura e tecnologia",
      titulo: "BPM Redesign",
      descricao:
        "Redesenho to-be que vai além do fluxo: eliminação e simplificação de atividades, automação, arquitetura funcional, definição de papéis, integração entre áreas e levantamento de requisitos — com a experiência do usuário e os impactos organizacionais no centro do desenho.",
      ganhos: [
        "Processos to-be simplificados e automatizados",
        "Arquitetura funcional e requisitos levantados",
        "Papéis, responsabilidades e integração entre áreas",
        "Plano de impacto organizacional e experiência do usuário",
      ],
    },
    {
      rotulo: "Para sustentar a transformação",
      titulo: "BPM Governance",
      descricao:
        "Modelo de governança completo: ownership, matriz RACI, cadência de gestão, fóruns de decisão, SLAs e OKRs — com roadmap e backlog priorizados para manter a melhoria contínua viva depois da entrega.",
      ganhos: [
        "Ownership e matriz RACI definidos",
        "KPIs, SLAs e OKRs implantados",
        "Cadência de gestão e fóruns estruturados",
        "Roadmap e backlog de melhoria contínua",
      ],
    },
  ],
};

export const diferenciais = {
  etiqueta: "Por que MOVE.ON",
  titulo: "Por que a MOVE.ON é diferente",
  diferenciais: [
    {
      titulo: "Processo, tecnologia e negócio juntos",
      texto:
        "Arquitetura de processos, tecnologia e estratégia de negócio reunidas em um único time — nunca em consultorias separadas.",
    },
    {
      titulo: "Do diagnóstico até a adoção",
      texto: "Não entregamos um relatório. Acompanhamos o cliente do desenho até a adoção real da mudança na operação.",
    },
    {
      titulo: "Base em dados reais, não em achismo",
      texto: "Diagnóstico orientado por indicadores, mineração de processos e evidência — não por opinião isolada.",
    },
    {
      titulo: "Signavio + BTO.NOW no apoio ao método",
      texto:
        "Usamos essas ferramentas para sustentar a entrega — a diferença está em como conectamos processo e tecnologia.",
    },
  ],
};

export const comoFunciona = {
  etiqueta: "Como funciona",
  titulo: "A jornada completa de transformação",
  textos: [
    "Do diagnóstico estratégico à melhoria contínua — cada etapa combina processo, tecnologia, dados e pessoas.",
  ],
  passos: [
    {
      titulo: "Diagnóstico Estratégico",
      texto: "Entendemos o negócio, a dor e os objetivos estratégicos antes de tocar em qualquer processo.",
    },
    {
      titulo: "Arquitetura de Processos",
      texto: "Mapeamos a cadeia de valor e os processos ponta a ponta, com base em dados e evidência.",
    },
    {
      titulo: "Priorização",
      texto: "Priorizamos o que traz mais impacto, considerando esforço, risco e valor para o negócio.",
    },
    {
      titulo: "Business Case",
      texto: "Estruturamos o racional financeiro e estratégico que sustenta a decisão de investir.",
    },
    {
      titulo: "Redesenho TO-BE",
      texto: "Desenhamos o processo futuro, simplificado e alinhado à estratégia.",
    },
    {
      titulo: "Arquitetura Funcional",
      texto: "Traduzimos o novo processo em requisitos funcionais e papéis.",
    },
    {
      titulo: "Tecnologia",
      texto: "Definimos a tecnologia habilitadora certa para o caso, sempre que o redesenho exigir apoio tecnológico.",
    },
    {
      titulo: "Implantação",
      texto: "Colocamos o novo processo (e a tecnologia que o sustenta) em operação.",
    },
    {
      titulo: "Adoção",
      texto: "Trabalhamos a gestão da mudança para que as pessoas incorporem o novo jeito de operar.",
    },
    {
      titulo: "KPIs",
      texto: "Implantamos os indicadores que mostram se o processo está performando.",
    },
    {
      titulo: "Governança",
      texto: "Estruturamos ownership, ritos e responsabilidades para sustentar o modelo.",
    },
    {
      titulo: "Melhoria Contínua",
      texto: "Mantemos o processo evoluindo, com backlog e roadmap vivos.",
    },
  ],
  emGrade: true,
};

export const banner = {
  titulo: "Sua operação merece mais do que um fluxograma bonito.",
  chamada: {
    rotulo: "Quero transformar meus processos",
    href: "#contato",
  },
};

export const contato = {
  etiqueta: "Vamos conversar",
  titulo: "Entenda como transformar seus processos de verdade",
  textos: ["Agende uma conversa com o time da MOVE.ON para entendermos o cenário da sua operação."],
};
