import type { ReactNode } from "react";

export const hero = {
  selo: "4s4.Governance · Brownfield, Greenfield ou Híbrido",
  titulo: "Seu projeto SAP, com rigor técnico e uma governança dedicada só aos seus interesses.",
  subtitulo: (
    <>
      Atuamos como o <b>braço direito do cliente</b> na gestão de <b>prazos, escopo e riscos</b> em projetos SAP
      (Brownfield, Greenfield ou híbrido), com uma camada de governança dedicada{" "}
      <b>exclusivamente aos interesses do cliente</b> ao longo de toda a jornada.
    </>
  ) as ReactNode,
  jornada: ["Diagnóstico", "Modelo de Governança", "Implantação", "Acompanhamento Contínuo"],
};

export const cenarios = {
  etiqueta: "Diagnóstico",
  titulo: "Você reconhece algum destes cenários?",
  textos: [
    'Quando falamos em "camada de governança", queremos dizer isso: um conjunto de ritos, painéis e responsáveis que atuam como uma camada superior de governança em relação a quem está implementando a nível operacional — sem interferir na entrega técnica do projeto. Essa governança pode ser aplicada a projetos, programas ou portfólio, dependendo da escala da iniciativa.',
  ],
  cenarios: [
    "Falta de uma camada independente para acompanhar prazos, escopo e riscos do projeto",
    "Escopo muda sem controle formal de impacto em prazo e custo",
    "Riscos técnicos são identificados tarde demais, já em fase crítica",
    "Falta visão executiva sobre o real andamento do projeto SAP",
    "Decisões técnicas tomadas sem considerar o interesse de longo prazo do cliente",
  ],
};

export const solucoes = {
  etiqueta: "Nossas soluções",
  titulo: "Como estruturamos a governança do seu projeto SAP",
  textos: [
    "Três frentes que conectam estruturação, acompanhamento contínuo e governança independente ao longo do projeto.",
  ],
  solucoes: [
    {
      rotulo: "Para estruturar a governança do projeto",
      titulo: "4s4.Governance Setup",
      descricao:
        "Definição de ritos, comitês, critérios de decisão e controle de escopo/prazo/risco desde o início do projeto.",
      ganhos: [
        "Ritos e comitês estruturados",
        "Critérios claros de decisão",
        "Controle formal de escopo, prazo e risco",
        "Base de governança desde o kickoff",
      ],
      selos: ["Plano de Governança", "Matriz RACI de Decisão", "Calendário de Ritos", "Critérios de Escalonamento"],
    },
    {
      rotulo: "Para acompanhar a execução",
      titulo: "4s4.Governance Track",
      descricao:
        "Operação contínua da governança, com dashboards, farol de riscos e relatórios executivos independentes.",
      ganhos: [
        "Dashboards de acompanhamento",
        "Farol de riscos atualizado",
        "Relatórios executivos independentes",
        "Visibilidade contínua do andamento",
      ],
      selos: ["Dashboard Executivo", "Farol de Riscos", "Relatório Periódico", "Ata de Rituais (BTO.NOW)"],
    },
    {
      rotulo: "Para projetos críticos",
      titulo: "4s4.Governance Assure",
      descricao:
        "Camada de governança técnica e acompanhamento independente em projetos Brownfield, Greenfield ou híbridos de alta criticidade.",
      ganhos: [
        "Governança técnica independente",
        "Checagem técnica independente",
        "Alertas antecipados de risco crítico",
        "Camada extra de segurança executiva",
      ],
      selos: [
        "Relatório de Governança Técnica",
        "Checklist de Conformidade",
        "Plano de Mitigação",
        "Alerta de Risco Crítico",
      ],
    },
  ],
};

export const diferenciais = {
  etiqueta: "Por que MOVE.ON",
  titulo: "Por que a MOVE.ON é diferente",
  diferenciais: [
    {
      titulo: "Independência absoluta de interesses",
      texto: "Não vendemos licença nem implementação — nosso único interesse ao longo do projeto é o do cliente.",
    },
    {
      titulo: "Governança em uma única plataforma",
      texto: "Riscos, escopo, decisões e atas centralizados no BTO.NOW — sem depender de planilha ou e-mail perdido.",
    },
    {
      titulo: "Atuação em Brownfield, Greenfield ou Híbrido",
      texto: "Experiência madura nos três cenários de projeto SAP, com a mesma estrutura de governança.",
    },
    {
      titulo: "Transparência executiva de ponta a ponta",
      texto: "Visibilidade completa do andamento do projeto para quem decide, o tempo todo.",
    },
  ],
};

export const comoFunciona = {
  etiqueta: "Como funciona",
  titulo: "Como conduzimos a governança, passo a passo",
  passos: [
    {
      titulo: "Alinhamento inicial",
      texto: "Entendemos o projeto e o momento atual da jornada SAP.",
    },
    {
      titulo: "Diagnóstico do projeto",
      texto: "Mapeamos riscos, escopo e o modelo de decisão em curso.",
    },
    {
      titulo: "Modelo de governança",
      texto: "Desenhamos ritos, comitês e critérios de decisão sob medida.",
    },
    {
      titulo: "Implantação da governança",
      texto: "Colocamos a estrutura de governança em operação junto ao projeto.",
    },
    {
      titulo: "Acompanhamento contínuo",
      texto: "Seguimos ao lado do cliente até o fechamento do projeto.",
    },
  ],
  emGrade: false,
};

export const banner = {
  titulo: "Seu projeto SAP merece uma camada de governança que trabalha só para você.",
  chamada: {
    rotulo: "Quero estruturar minha governança",
    href: "#contato",
  },
};

export const contato = {
  etiqueta: "Vamos conversar",
  titulo: "Entenda como o 4s4.Governance pode proteger seu projeto SAP",
  textos: ["Agende uma conversa com o time da MOVE.ON para entendermos o cenário do seu projeto."],
};
