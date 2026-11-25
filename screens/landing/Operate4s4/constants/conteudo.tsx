import type { ReactNode } from "react";

export const hero = {
  selo: "4s4.Operate · Pós Go-live",
  titulo: "Seu SAP não termina no go-live. A operação começa aí.",
  subtitulo: (
    <>
      Garantimos a <b>sustentabilidade</b> e a <b>evolução</b> do seu SAP no cenário pós-go-live, com{" "}
      <b>governança técnica</b> e <b>planos de evolução estruturados</b> — assegurando que o investimento continue
      gerando valor a longo prazo, e preparando a empresa para modelos de serviços gerenciados.
    </>
  ) as ReactNode,
};

export const comparativo = {
  etiqueta: "Diagnóstico",
  titulo: "O que muda com o 4s4.Operate",
  textos: [
    "O go-live não é a linha de chegada. Sem um plano de evolução, o ambiente SAP acumula dívida técnica em vez de gerar valor.",
  ],
  sem: {
    titulo: "Sem 4s4.Operate",
    itens: [
      "Operação reativa a chamados",
      "Melhorias sem priorização",
      "Conhecimento concentrado em poucas pessoas",
      "Ambiente evoluindo sem plano",
    ],
  },
  com: {
    titulo: "Com 4s4.Operate",
    itens: [
      "Ciclo de melhoria contínua",
      "Roadmap de evolução priorizado",
      "Governança técnica estruturada",
      "Terreno preparado para managed services",
    ],
  },
};

export const solucoes = {
  etiqueta: "Nossas soluções",
  titulo: "Como sustentamos e evoluímos o seu SAP",
  textos: [
    "Frentes que conectam estabilização pós-go-live, governança técnica e preparação para um modelo de serviços gerenciados.",
  ],
  solucoes: [
    {
      rotulo: "Para estabilizar o pós-go-live",
      titulo: "Diagnóstico e Estabilização",
      descricao:
        "Entendemos o ambiente pós-implantação: chamados recorrentes, dívida técnica e pontos de instabilidade.",
      ganhos: [
        "Diagnóstico do ambiente pós-go-live",
        "Mapa de chamados recorrentes e dívida técnica",
        "Pontos de instabilidade priorizados",
        "Base clara para o plano de evolução",
      ],
    },
    {
      rotulo: "Para evoluir com controle",
      titulo: "Governança Técnica e Roadmap",
      descricao: "Comitê de governança e plano de evolução priorizado para decidir o que entra no SAP e quando.",
      ganhos: [
        "Comitê de governança técnica estruturado",
        "Roadmap de evolução priorizado",
        "Critérios claros do que entra no SAP e quando",
        "Rotina de decisão técnica contínua",
      ],
    },
    {
      rotulo: "Para o próximo passo",
      titulo: "Managed Services Readiness",
      descricao: "Preparação operacional e de governança da empresa para um modelo de serviços gerenciados.",
      ganhos: [
        "Diagnóstico de maturidade operacional",
        "Plano de preparação para managed services",
        "Governança pronta para o novo modelo",
        "Transição estruturada de responsabilidades",
      ],
    },
  ],
};

export const diferenciais = {
  etiqueta: "Por que MOVE.ON",
  titulo: "Por que a MOVE.ON é diferente",
  diferenciais: [
    {
      titulo: "Governança técnica contínua",
      texto: "Evolução planejada, não apenas resposta a chamados.",
    },
    {
      titulo: "Independência",
      texto: "Não vendemos licença SAP — nosso interesse é o do cliente.",
    },
    {
      titulo: "Visão de longo prazo",
      texto: "Foco em manter o investimento em tecnologia gerando valor.",
    },
    {
      titulo: "Preparo para o próximo passo",
      texto: "Empresa pronta para evoluir para um modelo de serviços gerenciados quando fizer sentido.",
    },
  ],
};

export const comoFunciona = {
  etiqueta: "Como funciona",
  titulo: "Como estruturamos a evolução do seu SAP",
  passos: [
    {
      titulo: "Conversa inicial",
      texto: "Entendemos o momento do ambiente SAP e os objetivos da operação.",
    },
    {
      titulo: "Diagnóstico do ambiente pós-go-live",
      texto: "Mapeamos chamados, dívida técnica e pontos de instabilidade.",
    },
    {
      titulo: "Plano de evolução",
      texto: "Priorizamos o que entra no roadmap e quando.",
    },
    {
      titulo: "Estruturação da governança",
      texto: "Implantamos comitês e ritos de decisão técnica.",
    },
    {
      titulo: "Operação contínua",
      texto: "Acompanhamos a evolução do ambiente de forma estruturada.",
    },
  ],
  emGrade: false,
};

export const banner = {
  titulo: "Seu SAP não pode parar de evoluir depois do go-live.",
  chamada: {
    rotulo: "Quero estruturar minha evolução contínua",
    href: "#contato",
  },
};

export const contato = {
  etiqueta: "Vamos conversar",
  titulo: "Entenda como o 4s4.Operate pode sustentar seu SAP",
  textos: ["Agende uma conversa com o time da MOVE.ON para entendermos o momento do seu ambiente."],
};
