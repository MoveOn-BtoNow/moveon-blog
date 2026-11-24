import type { LinkNavegacao } from "@/interfaces/navegacao";

/** Menu principal do site (cabeçalho do blog e rodapé de todas as páginas). */
export const LINKS_SITE: LinkNavegacao[] = [
  { rotulo: "Quem Somos", href: "/#quem-somos" },
  { rotulo: "Soluções", href: "/#servicos" },
  { rotulo: "Cases", href: "/#cases" },
  { rotulo: "Blog", href: "/blog" },
  { rotulo: "Contato", href: "/#contato" },
];
