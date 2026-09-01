import type { Metadata } from "next";
import { Check } from "lucide-react";
import CabecalhoPortal from "../componentes/CabecalhoPortal";
import RedesSociaisFlutuantes from "../componentes/RedesSociaisFlutuantes";
import RodapePortal from "../componentes/RodapePortal";

export const metadata: Metadata = {
  title: "O que resolvemos na prática",
  description: "Soluções MOVE.ON para projetos estratégicos, SAP, processos, governança e Reforma Tributária.",
  alternates: { canonical: "/solucoes" },
};

const problemas = [
  ["Projetos desorganizados", "Prazos, custos e escopo mudam rápido quando não existe uma gestão clara. Organizar a execução desde o início evita que o resultado seja comprometido."],
  ["Decisão sem dados", "A operação roda, mas você não enxerga onde está o gargalo. Sem processos organizados e indicadores confiáveis, a gestão perde clareza para decidir."],
  ["SAP em risco", "Projetos SAP exigem alinhamento entre tecnologia, processos e negócio. Sem governança, a implementação perde ritmo, clareza e qualidade na entrega."],
  ["Reforma Tributária sem plano", "Novas regras exigem ajustes em áreas, processos e no sistema SAP. Sem uma gestão integrada, cada frente avança de um jeito e o risco aumenta."],
  ["Processos sem clareza", "Quando processos não estão bem estruturados, a empresa gasta mais tempo, dinheiro e energia para entregar o mesmo resultado."],
  ["Plataformas desconectadas", "Sistemas e processos não conversam entre si. Sem uma gestão clara das plataformas, a tecnologia vira mais uma camada de complexidade para a operação."],
];

const entregas = [
  {
    contexto: "Para projetos estratégicos",
    titulo: "Governança de Projetos",
    descricao: "Governança para que seus projetos prioritários sejam entregues no prazo, no orçamento e com adoção real.",
    itens: ["Estruturação e operação de PMO", "Gestão de portfólio de projetos", "Controle de riscos, prazo e qualidade"],
  },
  {
    contexto: "Para projeto S/4HANA",
    titulo: "Reforma Tributária no SAP",
    descricao: "A Reforma Tributária vai exigir ajustes no seu SAP até 2033. Mantemos sua operação adequada a cada nova regra.",
    itens: ["Diagnóstico de impacto regulatório", "Implementação técnica no S/4HANA", "Governança contínua frente à legislação"],
  },
  {
    contexto: "Para projetos SAP",
    titulo: "Centro de Excelência SAP",
    descricao: "Apoiamos empresas na evolução do SAP com governança, Clean Core, testes e padronização metodológica.",
    itens: ["Qualidade e melhores práticas", "Menos retrabalho em projetos", "Evolução contínua do ambiente SAP"],
  },
];

export default function PaginaSolucoes() {
  return (
    <div className="pagina-solucoes">
      <CabecalhoPortal />
      <main>
        <section className="solucoes-abertura">
          <span>O QUE RESOLVEMOS</span>
          <h1>O que resolvemos na prática</h1>
          <p>Empresas em transformação não precisam de mais complexidade.<br />Precisam de clareza, método e governança. A MOVE.ON entra aqui.</p>
        </section>
        <section className="grade-problemas" aria-label="Problemas que a MOVE.ON resolve">
          {problemas.map(([titulo, descricao], indice) => (
            <article key={titulo}><b>{String(indice + 1).padStart(2, "0")}</b><h2>{titulo}</h2><p>{descricao}</p></article>
          ))}
        </section>
        <section className="secao-entregas">
          <header><span>SOLUÇÕES MOVE.ON</span><h2>O que entregamos</h2><p>Estrutura, método e governança aplicados às frentes mais críticas da transformação.</p></header>
          <div className="grade-entregas">
            {entregas.map((entrega) => (
              <article key={entrega.titulo}>
                <span>{entrega.contexto}</span><h3>{entrega.titulo}</h3><p>{entrega.descricao}</p>
                <ul>{entrega.itens.map((item) => <li key={item}><Check />{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      </main>
      <RedesSociaisFlutuantes />
      <RodapePortal />
    </div>
  );
}
