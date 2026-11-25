import type { LinkNavegacao } from "@/interfaces/navegacao";

/** Menu principal do site (cabeçalho do blog e rodapé de todas as páginas). */
export const LINKS_SITE: LinkNavegacao[] = [
  { rotulo: "Quem Somos", href: "/#quem-somos" },
  { rotulo: "Soluções", href: "/#servicos" },
  { rotulo: "Cases", href: "/#cases" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "/#contato" },
];

/** Menu das páginas de solução (BPM, Blueprint, 4s4.Governance e 4s4.Operate). */
export const LINKS_PAGINA_SOLUCAO: LinkNavegacao[] = [
  { rotulo: "Soluções", href: "#solucoes" },
  { rotulo: "Diferenciais", href: "#diferenciais" },
  { rotulo: "Como funciona", href: "#como-funciona" },
  { rotulo: "FAQ", href: "#faq" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "#contato" },
];
