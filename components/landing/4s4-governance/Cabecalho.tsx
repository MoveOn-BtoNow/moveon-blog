import CabecalhoSite from "@/components/compartilhados/CabecalhoSite";

export default function Cabecalho() {
  return (
    <CabecalhoSite
      links={[
        { rotulo: "Soluções", href: "#solucoes" },
        { rotulo: "Diferenciais", href: "#diferenciais" },
        { rotulo: "Como funciona", href: "#como-funciona" },
        { rotulo: "FAQ", href: "#faq" },
        { rotulo: "Blog", href: "/blog" },
        { rotulo: "Contato", href: "#contato" },
      ]}
      chamada={{ href: "#contato" }}
    />
  );
}
