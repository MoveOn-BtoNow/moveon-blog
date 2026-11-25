import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { PerguntaFrequente } from "@/interfaces/pergunta-frequente";

export const formularioLead: ConfiguracaoFormularioLead = {
  origem: "LP Blueprint",
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
      nome: "transformacao",
      rotulo: "Que tipo de transformação sua empresa está avaliando?",
      tipo: "select",
      larguraTotal: true,
      opcoes: [
        {
          valor: "",
          rotulo: "Selecione",
        },
        {
          rotulo: "Troca de ERP",
        },
        {
          rotulo: "Reestruturação de processos e arquitetura",
        },
        {
          rotulo: "Fusão ou aquisição",
        },
        {
          rotulo: "Ainda não sei",
        },
      ],
      rotuloEnvio: "Tipo de transformação",
    },
    {
      nome: "desafio",
      rotulo: "Qual o seu desafio?",
      tipo: "textarea",
      placeholder: "Conte um pouco do cenário da sua empresa",
      larguraTotal: true,
      rotuloEnvio: "Qual o seu desafio",
    },
  ],
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    pergunta: "O que é o Blueprint da MOVE.ON?",
    resposta:
      "É a etapa de inteligência estratégica que antecede qualquer grande transformação de negócio. Antes de investir em uma nova tecnologia ou reestruturar processos, mapeamos o cenário atual, desenhamos o futuro desejado e construímos um plano priorizado — para que a decisão de investir seja tomada com dados, não com intuição.",
    aberta: true,
  },
  {
    pergunta: "Preciso fazer o Blueprint antes de uma grande transformação?",
    resposta:
      "Recomendamos fortemente. Empresas que avançam direto para a implementação sem esse diagnóstico prévio costumam descobrir riscos e retrabalho durante o projeto — quando já é mais caro corrigir. O Blueprint existe para que essas decisões sejam tomadas antes, com o negócio no controle do processo.",
  },
  {
    pergunta: "O Blueprint serve apenas para SAP S/4HANA?",
    resposta:
      "Não. O Blueprint é agnóstico de tecnologia. Ele serve para qualquer transformação estrutural — troca de ERP, reestruturação de processos, fusão ou aquisição — sendo o S/4HANA apenas um dos cenários possíveis, não o único.",
  },
  {
    pergunta: "Qual o prazo típico?",
    resposta:
      "O prazo varia com o escopo e a complexidade da operação, mas é desenhado para caber num horizonte de decisão executiva — sem se arrastar a ponto de a urgência do negócio passar.",
  },
  {
    pergunta: "O Blueprint substitui o diagnóstico da implementadora?",
    resposta:
      "Não substitui — complementa com independência. O diagnóstico da implementadora normalmente já parte de uma direção de solução; o Blueprint da MOVE.ON entra antes disso, sem vínculo comercial com nenhuma tecnologia, para garantir que a direção escolhida seja a certa para o negócio.",
  },
  {
    pergunta: "Quanto custa um Blueprint?",
    resposta:
      "O investimento varia conforme o escopo e o porte da empresa — não existe um valor único. Na prática, ele representa uma fração pequena do custo total da transformação que vem depois, e existe justamente para proteger esse investimento maior de retrabalho e decisões erradas.",
  },
  {
    pergunta: "O que recebo ao final do Blueprint?",
    resposta:
      "Um pacote completo de decisão: diagnóstico da situação atual, visão de futuro, plano de transformação priorizado, análise de riscos, recomendações e próximos passos claros — construído com a metodologia proprietária BTO da MOVE.ON, com apoio de Process Mining (mineração de processos) para embasar o diagnóstico em dados reais, não em percepção.",
  },
  {
    pergunta: "Preciso parar minha operação?",
    resposta:
      "Não. A execução do Blueprint foi desenhada para exigir pouca dedicação do seu time — a MOVE.ON acompanha de perto toda a coleta e a análise, para que a rotina da operação continue normalmente enquanto o diagnóstico avança.",
  },
];
