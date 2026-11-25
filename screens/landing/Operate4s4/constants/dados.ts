import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  origem: "LP 4s4.Operate",
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
      nome: "momento",
      rotulo: "Em qual momento do pós-go-live sua empresa está?",
      tipo: "select",
      larguraTotal: true,
      opcoes: [
        {
          valor: "",
          rotulo: "Selecione",
        },
        {
          rotulo: "Recém foi live",
        },
        {
          rotulo: "Estabilizando",
        },
        {
          rotulo: "Já em evolução contínua",
        },
        {
          rotulo: "Não sei",
        },
      ],
      rotuloEnvio: "Momento pós-go-live",
    },
    {
      nome: "desafio",
      rotulo: "Qual o seu desafio?",
      tipo: "textarea",
      placeholder: "Conte um pouco do cenário do seu ambiente SAP",
      larguraTotal: true,
      rotuloEnvio: "Qual o seu desafio",
    },
  ],
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    pergunta: "O que é o 4s4.Operate?",
    resposta:
      "É a frente da MOVE.ON dedicada à sustentabilidade e evolução contínua do SAP no pós-go-live, com governança técnica e planos de evolução estruturados.",
    aberta: true,
  },
];
