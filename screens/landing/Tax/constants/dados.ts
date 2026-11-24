import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  "origem": "LP 4s4.TAX Reforma Tributária no S/4HANA",
  "classe": "form",
  "mensagemInicial": "Ao enviar, abriremos seu e-mail com a mensagem pronta para a MOVE.ON.",
  "botao": {
    "texto": "Quero avaliar meu cenário",
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
      "nome": "s4hana",
      "rotulo": "Sua empresa já está no S/4HANA?",
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
        },
        {
          "rotulo": "Em processo de migração"
        },
        {
          "rotulo": "Não sei"
        }
      ],
      "rotuloEnvio": "Já está no S/4HANA"
    }
  ]
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    "pergunta": "O que é o 4s4.TAX da MOVE.ON?",
    "resposta": "É a solução da MOVE.ON para apoiar empresas na adequação da Reforma Tributária dentro do ambiente SAP, conectando fiscal, processos, tecnologia, testes e gestão do programa em uma mesma estrutura de atuação."
  },
  {
    "pergunta": "A Reforma Tributária impacta apenas o time fiscal?",
    "resposta": "Não. A Reforma também impacta processos, dados, documentos fiscais, integrações, sistemas, áreas de negócio, controles e rotinas operacionais. Por isso, a adequação precisa envolver fiscal, tecnologia, operação e gestão."
  },
  {
    "pergunta": "Já temos um time fiscal interno, vocês substituem?",
    "resposta": "Não, complementamos. Operamos a camada técnica no SAP e a governança regulatória. Seu time fiscal continua tomando as decisões e a MOVE.ON garante que o sistema execute."
  },
  {
    "pergunta": "E se ainda estou no SAP ECC e não migrei para o S/4HANA?",
    "resposta": "A Reforma Tributária é uma janela natural para acelerar a migração para S/4HANA. Avaliamos isso no diagnóstico."
  }
];
