import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  origem: "LP 4s4.Governance",
  classe: "form",
  mensagemInicial: "Ao enviar, abriremos seu e-mail com a mensagem pronta para a MOVE.ON.",
  botao: {
    texto: "Quero conversar",
    classe: "btn btn-primary btn-block",
    divClasse: "field full",
  },
  campos: [
    {
      nome: "nome",
      rotulo: "Nome",
      tipo: "text",
      placeholder: "Seu nome",
      autoComplete: "name",
      obrigatorio: true,
      rotuloEnvio: "Nome",
    },
    {
      nome: "email",
      rotulo: "E-mail corporativo",
      tipo: "email",
      placeholder: "voce@empresa.com",
      autoComplete: "email",
      obrigatorio: true,
      rotuloEnvio: "E-mail",
    },
    {
      nome: "empresa",
      rotulo: "Empresa",
      tipo: "text",
      placeholder: "Nome da empresa",
      autoComplete: "organization",
      rotuloEnvio: "Empresa",
    },
    {
      nome: "cargo",
      rotulo: "Cargo",
      tipo: "text",
      placeholder: "Seu cargo",
      autoComplete: "organization-title",
      rotuloEnvio: "Cargo",
    },
    {
      nome: "cenario",
      rotulo: "Seu projeto SAP é Brownfield, Greenfield ou Híbrido?",
      tipo: "select",
      larguraTotal: true,
      opcoes: [
        {
          valor: "",
          rotulo: "Selecione",
        },
        {
          rotulo: "Brownfield",
        },
        {
          rotulo: "Greenfield",
        },
        {
          rotulo: "Híbrido",
        },
        {
          rotulo: "Ainda não sei",
        },
      ],
      rotuloEnvio: "Cenário do projeto",
    },
    {
      nome: "desafio",
      rotulo: "Qual o seu desafio?",
      tipo: "textarea",
      placeholder: "Conte um pouco do cenário do seu projeto",
      larguraTotal: true,
      rotuloEnvio: "Qual o seu desafio",
    },
  ],
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    pergunta: "O que é o 4s4.Governance?",
    resposta:
      "É a frente de governança executiva de projetos SAP (Brownfield, Greenfield ou híbrido) da MOVE.ON, atuando como o braço direito independente do cliente na gestão de prazo, escopo e risco.",
    aberta: true,
  },
  {
    pergunta: "O 4s4.Governance substitui a implementadora do projeto?",
    resposta:
      "Não. O 4s4.Governance atua ao lado da implementadora, cuidando da camada de governança executiva — prazo, escopo e risco — em nome do cliente, sem interferir na entrega técnica do projeto.",
  },
  {
    pergunta: "O 4s4.Governance substitui o PMO interno?",
    resposta:
      "Não necessariamente. O PMO interno costuma cuidar da gestão executiva geral (recursos, cronograma, comunicação com a diretoria); o 4s4.Governance soma uma camada complementar e independente, focada nos riscos técnicos e nas decisões específicas de um projeto SAP.",
  },
  {
    pergunta: "Qual a diferença entre PMO Governance e 4s4.Governance?",
    resposta:
      "PMO Governance cuida do portfólio geral da empresa; 4s4.Governance é específico para a governança de projetos SAP.",
  },
];
