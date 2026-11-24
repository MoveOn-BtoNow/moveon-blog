import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  "origem": "LP PMO Governance",
  "classe": "form",
  "mensagemInicial": "Ao enviar, abriremos seu e-mail com a mensagem pronta para a MOVE.ON.",
  "botao": {
    "texto": "Quero conversar",
    "classe": "btn btn-primary cta-track",
    "cta": "form",
    "divClasse": "field full"
  },
  "campos": [
    {
      "nome": "nome",
      "rotulo": "Nome",
      "autoComplete": "name",
      "obrigatorio": true,
      "rotuloEnvio": "Nome"
    },
    {
      "nome": "email",
      "rotulo": "E-mail corporativo",
      "tipo": "email",
      "autoComplete": "email",
      "obrigatorio": true,
      "rotuloEnvio": "E-mail"
    },
    {
      "nome": "empresa",
      "rotulo": "Empresa",
      "autoComplete": "organization",
      "rotuloEnvio": "Empresa"
    },
    {
      "nome": "cargo",
      "rotulo": "Cargo",
      "autoComplete": "organization-title",
      "rotuloEnvio": "Cargo"
    },
    {
      "nome": "utilizaSap",
      "rotulo": "Utiliza SAP?",
      "tipo": "select",
      "larguraTotal": true,
      "opcoes": [
        {
          "valor": "",
          "rotulo": "Selecione"
        },
        {
          "rotulo": "Sim"
        },
        {
          "rotulo": "Não"
        }
      ],
      "rotuloEnvio": "Utiliza SAP"
    }
  ]
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    "pergunta": "O que é o PMO Governance da MOVE.ON?",
    "resposta": "É uma estrutura de governança para organizar portfólios, prioridades, riscos, indicadores e decisões. Objetivo: dar mais controle, previsibilidade e alinhamento entre estratégia e execução."
  },
  {
    "pergunta": "O PMO Governance serve para empresas que ainda não têm PMO?",
    "resposta": "Sim. A MOVE.ON atua desde a estruturação inicial (PMO Organizer), criando ritos, fóruns e responsabilidades, até a operação contínua do portfólio (PMO Scale UP / Transform)."
  },
  {
    "pergunta": "Vocês usam alguma plataforma para acompanhar os projetos?",
    "resposta": "Sim. A MOVE.ON utiliza a plataforma proprietária BTO.NOW, que oferece dashboards, workflows, indicadores e rastreabilidade completa da execução em tempo real."
  },
  {
    "pergunta": "Minha empresa já usa ferramentas de gestão. Atrapalha?",
    "resposta": "Não. Operamos sobre as ferramentas que você já tem (SAP ALM, MS Project, etc.). O BTO.NOW entra como camada executiva de governança, não como substituta."
  },
  {
    "pergunta": "Qual a diferença entre contratar um gerente de projetos e contratar o PMO Governance?",
    "resposta": "Um gerente acompanha iniciativas específicas. O PMO Governance organiza a gestão do portfólio inteiro, padroniza métodos, acompanha riscos em escala, estrutura indicadores e apoia a liderança na tomada de decisão estratégica."
  },
  {
    "pergunta": "Qual é o prazo para ver resultados?",
    "resposta": "Os primeiros ganhos aparecem em 30-60 dias (estrutura de governança, rituais definidos, visibilidade inicial). A maturidade plena é tipicamente atingida em 3-4 meses de operação contínua."
  }
];
