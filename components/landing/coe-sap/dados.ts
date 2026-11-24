import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  "origem": "LP Centro de Excelência SAP (COE)",
  "prefixoAssunto": "Contato COE SAP via site MOVE.ON",
  "classe": "form",
  "mensagemInicial": "Ao enviar, abriremos seu e-mail com a mensagem pronta para a MOVE.ON.",
  "botao": {
    "texto": "Quero conversar com um especialista SAP",
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
      "nome": "versao",
      "rotulo": "Em qual versão do SAP sua empresa está?",
      "tipo": "select",
      "larguraTotal": true,
      "opcoes": [
        {
          "valor": "",
          "rotulo": "Selecione"
        },
        {
          "rotulo": "S/4HANA"
        },
        {
          "rotulo": "ECC"
        },
        {
          "rotulo": "Em processo de migração"
        },
        {
          "rotulo": "Não sei"
        }
      ],
      "rotuloEnvio": "Versão SAP"
    },
    {
      "nome": "desafio",
      "rotulo": "Qual o seu desafio?",
      "tipo": "textarea",
      "linhas": 3,
      "larguraTotal": true,
      "rotuloEnvio": "Desafio"
    }
  ]
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    "pergunta": "O que é Clean Core na prática?",
    "resposta": "É manter o core SAP mais próximo do standard, evitando customizações desnecessárias e usando extensões mais seguras e controladas."
  },
  {
    "pergunta": "Isso não é o que minha AMS ou fornecedor SAP já faz?",
    "resposta": "Não exatamente. A AMS mantém a operação funcionando, resolvendo chamados, incidentes e demandas do dia a dia. O CoE SAP atua em uma camada mais estratégica: define critérios, arquitetura, qualidade e governança para orientar como o ambiente deve evoluir. Na prática, o CoE ajuda a evitar que cada ajuste ou melhoria gere mais complexidade, customização e débito técnico no SAP."
  },
  {
    "pergunta": "Minha empresa precisa estar em S/4HANA?",
    "resposta": "Não necessariamente. Empresas em ECC, S/4HANA ou em processo de migração podem estruturar um CoE para reduzir riscos e preparar melhor a evolução."
  },
  {
    "pergunta": "Qual a diferença entre CoE SAP e implementadora?",
    "resposta": "A implementadora normalmente atua em projetos específicos. O CoE SAP cria uma estrutura contínua para governar, sustentar e evoluir o ambiente."
  },
  {
    "pergunta": "O CoE substitui meu time interno?",
    "resposta": "Não. O modelo pode complementar, orientar, estruturar ou operar junto ao time interno, dependendo da maturidade e necessidade da empresa."
  }
];
