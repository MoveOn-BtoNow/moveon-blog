import type { ReactNode } from "react";

export const hero = {
  selo: "Blueprint · Strategic Readiness",
  titulo: "Antes de qualquer grande transformação, prepare o terreno.",
  subtitulo: (
    <>
      O Blueprint é a <b>inteligência estratégica</b> da MOVE.ON que integra{" "}
      <b>processos, tecnologia e arquitetura corporativa</b> antes de qualquer implementação complexa — mitigando
      riscos, eliminando retrabalho e trazendo <b>previsibilidade de custo</b> e <b>clareza de investimento</b>.
    </>
  ) as ReactNode,
  complemento: (
    <div className="blueprint-nodes">
      <div className="node">
        <div className="dot">01</div>
        <div className="label">Processos</div>
      </div>
      <div className="node">
        <div className="dot">02</div>
        <div className="label">Tecnologia</div>
      </div>
      <div className="node">
        <div className="dot">03</div>
        <div className="label">
          Arquitetura
          <br />
          Corporativa
        </div>
      </div>
    </div>
  ) as ReactNode,
};

export const comparativo = {
  etiqueta: "Diagnóstico",
  titulo: "O que muda com um Blueprint bem feito",
  textos: [
    "Grandes transformações não falham por falta de tecnologia. Falham por falta de terreno preparado antes da implementação.",
  ],
  sem: {
    titulo: "Sem Blueprint",
    itens: [
      "Escopo definido às pressas",
      "Retrabalho descoberto só durante o projeto",
      "Estouro de custo sem explicação clara",
      "Áreas desalinhadas sobre o que muda",
    ],
  },
  com: {
    titulo: "Com Blueprint",
    itens: [
      "Escopo validado antes do projeto",
      "Riscos mitigados na origem",
      "Previsibilidade de investimento",
      "Negócio, processo e tecnologia integrados",
    ],
  },
};

export const solucoes = {
  etiqueta: "Nossas soluções",
  titulo: "Como estruturamos o seu Blueprint",
  textos: [
    "Três frentes que conectam diagnóstico, desenho estratégico e governança de investimento antes de qualquer implementação.",
  ],
  solucoes: [
    {
      rotulo: "Para enxergar o cenário atual",
      titulo: "Diagnóstico de Arquitetura e Processos",
      descricao:
        "Mapeamento de processos, sistemas e arquitetura corporativa atual — com apoio de Process Mining e entrevistas — identificando riscos e gaps antes da implementação.",
      ganhos: [
        "Mapa do cenário atual (as-is)",
        "Riscos e gaps priorizados",
        "Visão única entre negócio e TI",
        "Base factual para decisão",
      ],
    },
    {
      rotulo: "Para desenhar o caminho",
      titulo: "Blueprint Estratégico",
      descricao:
        "Desenho do modelo futuro (to-be) de processos, tecnologia e arquitetura, com escopo e investimento claros para o CFO — seja a transformação uma troca de ERP, uma reestruturação de arquitetura, uma fusão/aquisição ou outro tipo de mudança estrutural.",
      ganhos: [
        "Modelo to-be de processos e arquitetura",
        "Escopo validado com as áreas",
        "Estimativa de investimento estruturada",
        "Roadmap de implementação priorizado",
      ],
    },
    {
      rotulo: "Para blindar o investimento",
      titulo: "Business Case e Governança de Escopo",
      descricao:
        "Estruturação do business case, previsibilidade de custo e critérios de governança para a execução do projeto.",
      ganhos: [
        "Business case estruturado",
        "Critérios de governança de escopo",
        "Previsibilidade de custo para o CFO",
        "Handoff estruturado para a implementação",
      ],
    },
  ],
};

export const diferenciais = {
  etiqueta: "Por que MOVE.ON",
  titulo: "Por que a MOVE.ON é diferente",
  diferenciais: [
    {
      titulo: "Visão integrada de negócio e tecnologia",
      texto:
        "Processos, arquitetura corporativa e tecnologia analisados em uma única estrutura — nunca em silos desconectados.",
    },
    {
      titulo: "Pensado para a previsibilidade do CFO",
      texto: "Foco em previsibilidade de custo e clareza de investimento desde o primeiro dia do diagnóstico.",
    },
    {
      titulo: "Menos retrabalho ao longo do projeto",
      texto: "Riscos e gaps identificados antes da implementação começar — não descobertos no meio do caminho.",
    },
    {
      titulo: "Base sólida antes da transformação",
      texto: "Terreno preparado para a implementação avançar com segurança, independente do ERP envolvido.",
    },
  ],
};

export const comoFunciona = {
  etiqueta: "Como funciona",
  titulo: "Como conduzimos o processo, passo a passo",
  passos: [
    {
      titulo: "Alinhamento inicial",
      texto: "Entendemos o cenário, os objetivos da transformação e o nível de maturidade atual da empresa.",
    },
    {
      titulo: "Diagnóstico de processos e arquitetura",
      texto: "Mapeamos processos, sistemas e arquitetura corporativa, identificando riscos e gaps.",
    },
    {
      titulo: "Desenho do blueprint (to-be)",
      texto: "Desenhamos o modelo futuro de processos, tecnologia e arquitetura.",
    },
    {
      titulo: "Business case e priorização",
      texto: "Estruturamos o business case e a previsibilidade de investimento para o CFO.",
    },
    {
      titulo: "Governança de handoff",
      texto: "Preparamos a transição estruturada para a fase de implementação.",
    },
  ],
  emGrade: false,
};

export const banner = {
  titulo: "Sua próxima grande transformação merece um terreno preparado.",
  chamada: {
    rotulo: "Quero estruturar meu Blueprint",
    href: "#contato",
  },
};

export const contato = {
  etiqueta: "Vamos conversar",
  titulo: "Entenda se sua empresa precisa de um Blueprint",
  textos: ["Agende uma conversa com o time da MOVE.ON para entendermos o cenário da sua transformação."],
};
