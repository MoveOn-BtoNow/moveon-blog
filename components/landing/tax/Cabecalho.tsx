import CabecalhoSite from "@/components/compartilhados/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "Soluções", href: "#solucao" },
        { rotulo: "Diferenciais", href: "#diferenciais" },
        { rotulo: "Cases", href: "#cases" },
        { rotulo: "Como funciona", href: "#como-comeca" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#form-tax" },
      ]}
      chamada={{ href: "#form-tax", dataCta: "nav" }}
      comEspaco={false}
    />
  );
}
