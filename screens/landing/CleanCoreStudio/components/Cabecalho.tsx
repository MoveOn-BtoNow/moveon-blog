import CabecalhoSite from "@/layout/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "O desafio", href: "#o-desafio" },
        { rotulo: "Como funciona", href: "#como-funciona" },
        { rotulo: "Resultados", href: "#resultados" },
        { rotulo: "Por que a MOVE.ON", href: "#por-que-moveon" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#leadForm" },
      ]}
      chamada={{ href: "#leadForm" }}
    />
  );
}
