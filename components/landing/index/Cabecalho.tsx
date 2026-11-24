import CabecalhoSite from "@/components/compartilhados/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "Quem Somos", href: "#quem-somos" },
        { rotulo: "Soluções", href: "#servicos" },
        { rotulo: "Cases", href: "#cases" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#contato" },
      ]}
      chamada={{ href: "#contato" }}
      comEspaco={false}
    />
  );
}
