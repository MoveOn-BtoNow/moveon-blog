import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  "origem": "LP BPM",
  "classe": "form",
  "mensagemInicial": "Ao enviar, abriremos seu e-mail com a mensagem pronta para a MOVE.ON.",
  "botao": {
    "texto": "Quero conversar",
    "classe": "btn btn-primary btn-block",
    "divClasse": "field full"
  },
  "campos": [
    {
      "nome": "nome",
      "rotulo": "Nome",
      "tipo": "text",
      "placeholder": "Seu nome",
      "autoComplete": "name",
      "obrigatorio": true,
      "rotuloEnvio": "Nome"
    },
    {
      "nome": "email",
      "rotulo": "E-mail corporativo",
      "tipo": "email",
      "placeholder": "voce@empresa.com",
      "autoComplete": "email",
      "obrigatorio": true,
      "rotuloEnvio": "E-mail"
    },
    {
      "nome": "empresa",
      "rotulo": "Empresa",
      "tipo": "text",
      "placeholder": "Nome da empresa",
      "autoComplete": "organization",
      "rotuloEnvio": "Empresa"
    },
    {
      "nome": "cargo",
      "rotulo": "Cargo",
      "tipo": "text",
      "placeholder": "Seu cargo",
      "autoComplete": "organization-title",
      "rotuloEnvio": "Cargo"
    },
    {
      "nome": "objetivo",
      "rotulo": "Qual o principal objetivo da sua iniciativa?",
      "tipo": "select",
      "larguraTotal": true,
      "opcoes": [
        {
          "valor": "",
          "rotulo": "Selecione"
        },
        {
          "rotulo": "Reduzir custo operacional"
        },
        {
          "rotulo": "Suportar uma transformação tecnológica (ERP, automação, IA)"
        },
        {
          "rotulo": "Melhorar indicadores e governança"
        },
        {
          "rotulo": "Ainda não sei"
        }
      ],
      "rotuloEnvio": "Objetivo da iniciativa"
    },
    {
      "nome": "desafio",
      "rotulo": "Qual o seu desafio?",
      "tipo": "textarea",
      "placeholder": "Conte um pouco do cenário dos seus processos",
      "larguraTotal": true,
      "rotuloEnvio": "Qual o seu desafio"
    }
  ]
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    "pergunta": "O que é o BPM da MOVE.ON?",
    "resposta": "Não é só modelagem de processos: é a frente de Business Transformation da MOVE.ON, que une arquitetura de processos, tecnologia, dados e gestão da mudança para transformar como a empresa opera.",
    "aberta": true
  },
  {
    "pergunta": "O BPM inclui implantação de tecnologia (ERP, automação, IA)?",
    "resposta": "Sim. Quando o redesenho exige apoio tecnológico, cuidamos também da arquitetura funcional e da implantação — seja em ERP, workflow, automação ou IA."
  },
  {
    "pergunta": "Vocês usam alguma ferramenta específica?",
    "resposta": "Usamos o Signavio para modelagem e a plataforma BTO.NOW para governança, entre outras tecnologias quando fizer sentido — mas a entrega não depende de uma ferramenta específica."
  },
  {
    "pergunta": "Serve para empresas que não usam SAP?",
    "resposta": "Sim. O BPM é agnóstico de ERP — a lógica de transformação de processos se aplica independente da tecnologia usada."
  }
];
