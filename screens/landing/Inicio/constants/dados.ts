import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";

export const formularioLead: ConfiguracaoFormularioLead = {
  "origem": "Home MOVE.ON",
  "classe": "form",
  "mensagemInicial": "Seus dados são enviados diretamente para a equipe MOVE.ON.",
  "botao": {
    "texto": "Quero conversar",
    "classe": "btn btn-primary",
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
      "nome": "clienteSap",
      "rotulo": "É cliente SAP?",
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
          "rotulo": "Não sei"
        }
      ],
      "rotuloEnvio": "É cliente SAP"
    },
    {
      "nome": "desafio",
      "rotulo": "Qual o seu desafio?",
      "tipo": "textarea",
      "linhas": 4,
      "larguraTotal": true,
      "rotuloEnvio": "Qual o seu desafio"
    }
  ]
};
