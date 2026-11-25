import type { CaseCliente, EscritorioBto, Lider } from "@/interfaces/conteudo-institucional";

export const cases: CaseCliente[] = [
  {
    logo: { src: "/landing/clientes/usina-coruripe.png", alt: "Usina Coruripe" },
    destaque: "Go-live",
    descricao: "migração SAP ECC para S/4HANA na unidade de Iturama/MG",
    depoimento: "Sucesso do Go-Live da migração para S/4HANA RISE. Um marco da dedicação do time.",
    autor: {
      nome: "Ledir Antunes Malaquias",
      cargo: "Head de TI",
      iniciais: "LA",
      foto: "/landing/depoimentos/ledir-antunes-malaquias.webp",
    },
  },
  {
    logo: { src: "/landing/clientes/arklok.png", alt: "Arklok" },
    destaque: "Implantação",
    descricao: "do Ecossistema de Atendimento da Arklok Tecnologia",
    depoimento: "Tenho orgulho do que construímos e sigo animada para conduzir os próximos passos dessa evolução.",
    autor: {
      nome: "Patricia Santos",
      cargo: "Gestão de Qualidade | CX",
      iniciais: "PS",
      foto: "/landing/depoimentos/patricia-santos.webp",
    },
  },
  {
    logo: { src: "/landing/clientes/cimed.png", alt: "CIMED" },
    destaque: "100%",
    descricao: "das operações do Grupo Cimed cobertas",
    depoimento:
      "Concluímos a implantação da solução de Governança de Dados Mestres para 100% das operações do Grupo Cimed. Vandré e time MOVE.ON foram excelentes.",
    autor: {
      nome: "Rodrigo Sarlo",
      cargo: "Diretor IBP/S&OP e Transformação",
      iniciais: "RS",
      foto: "/landing/depoimentos/rodrigo-sarlo.webp",
    },
  },
];

export const lideranca: Lider[] = [
  {
    nome: "Vandré Oliveira",
    cargo: "CEO & Fundador",
    descricao:
      "+20 anos liderando iniciativas de transformação no ecossistema SAP, conectando estratégia, tecnologia, processos e governança para gerar mais clareza, controle e resultado em grandes empresas.",
    foto: { src: "/landing/lideranca/vandre-oliveira.png", alt: "Vandré Oliveira" },
    linkedin: "https://www.linkedin.com/in/vandr%C3%A9-oliveira-b5316298/",
    rotuloLinkedin: "LinkedIn Vandré Oliveira",
    etiquetas: ["SAP", "Governança", "PMO", "Business Transformation"],
  },
  {
    nome: "Ana Senko",
    cargo: "Head de Operações",
    descricao: "Estratégia, Operações, Financeiro e Gestão de Backoffice",
    foto: { src: "/landing/lideranca/ana-senko.png", alt: "Ana Senko" },
    linkedin: "https://www.linkedin.com/in/ana-carolina-melim-senko-171717b/",
    rotuloLinkedin: "LinkedIn Ana Senko",
  },
  {
    nome: "Vinícios Garcia",
    cargo: "Head de Processos & Testes",
    descricao: "Centro de Excelência SAP, Gestão de Processos, SAP Signavio e Testes",
    foto: { src: "/landing/lideranca/vinicios-garcia.png", alt: "Vinícios Garcia" },
    linkedin: "https://www.linkedin.com/in/vinicios-garcia-21945643/",
    rotuloLinkedin: "LinkedIn Vinicios Garcia",
  },
  {
    nome: "Fábio Fernandes",
    cargo: "Head de Tax & S/4 Operate",
    descricao: "Reforma Tributária no SAP, Melhorias e Demandas SAP S/4HANA",
    foto: { src: "/landing/lideranca/fabio-fernandes.png", alt: "Fábio Fernandes" },
    linkedin: "https://www.linkedin.com/in/fabio-fernandes-29a33162/",
    rotuloLinkedin: "LinkedIn Fábio Fernandes",
  },
];

export const escritoriosBto: EscritorioBto[] = [
  {
    sigla: "PMO",
    nome: "Escritório de Gestão de Portfólio",
    titulo: "Gestão de Portfólio e Projetos",
    descricao:
      "Prioriza iniciativas, organiza roadmaps, acompanha entregas e fortalece a governança da carteira de projetos.",
    imagem: { src: "/landing/pmo.jpg", alt: "PMO em operação" },
  },
  {
    sigla: "BMO",
    nome: "Escritório de Gestão de Negócios",
    titulo: "Gestão de Processos",
    descricao:
      "Mapeia a cadeia de valor, organiza processos ponta a ponta e identifica gargalos que afetam eficiência e escala.",
  },
  {
    sigla: "TMO",
    nome: "Escritório de Gestão de Tecnologia",
    titulo: "Gestão de Plataformas",
    descricao:
      "Conecta tecnologia à operação, avaliando arquitetura, integrações e sustentabilidade do ambiente tecnológico.",
  },
  {
    sigla: "CMO",
    nome: "Escritório de Gestão de Mudanças",
    titulo: "Gestão de Mudanças",
    descricao: "Apoia comunicação, capacitação e engajamento para que a transformação seja absorvida pela operação.",
  },
  {
    sigla: "AMO",
    nome: "Escritório de Gestão de Riscos",
    titulo: "Gestão de Acessos e Compliance",
    descricao:
      "Organiza acessos, riscos, segregação de funções e segurança operacional desde o desenho da transformação.",
  },
  {
    sigla: "VMO",
    nome: "Escritório de Gestão de Valor",
    titulo: "Gestão de Valor",
    descricao:
      "Conecta investimento, business case, custos e benefícios para acompanhar se a transformação está gerando valor real.",
  },
];
