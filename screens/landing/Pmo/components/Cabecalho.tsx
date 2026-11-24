import CabecalhoSite from "@/layout/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "Soluções", href: "#solucao" },
        { rotulo: "Diferenciais", href: "#diferenciais" },
        { rotulo: "Como funciona", href: "#como-comeca" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#form-pmo" },
      ]}
      chamada={{ href: "#form-pmo", dataCta: "nav" }}
      comEspaco={false}
    />
  );
}
