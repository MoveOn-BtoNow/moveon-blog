import CabecalhoSite from "@/components/compartilhados/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "Soluções", href: "#servicos" },
        { rotulo: "Diferenciais", href: "#diferenciais" },
        { rotulo: "Como funciona", href: "#como-comeca" },
        { rotulo: "FAQ", href: "#faq" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#form-coe" },
      ]}
      chamada={{ href: "#form-coe", dataCta: "nav" }}
      comEspaco={false}
    />
  );
}
