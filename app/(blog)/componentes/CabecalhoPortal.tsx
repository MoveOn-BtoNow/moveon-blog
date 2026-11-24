"use client";

import { useEffect } from "react";
import CabecalhoSite from "@/components/compartilhados/CabecalhoSite";

type Identidade = {
  corPrimaria: string;
  corFundoClaro: string;
  corFundoEscuro: string;
  corTextoClaro: string;
  corTextoEscuro: string;
};

/** Cabeçalho das páginas internas do blog: aplica o tema escuro e as cores do portal. */
export default function CabecalhoPortal() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  useEffect(() => {
    fetch("/api/portal/inicial")
      .then((resposta) => resposta.json())
      .then((resultado) => {
        const dados = resultado as { configuracoes: Identidade };
        const raiz = document.documentElement;
        raiz.style.setProperty("--red", dados.configuracoes.corPrimaria);
        raiz.style.setProperty("--bg-claro", dados.configuracoes.corFundoClaro);
        raiz.style.setProperty("--bg-escuro", dados.configuracoes.corFundoEscuro);
        raiz.style.setProperty("--texto-claro", dados.configuracoes.corTextoClaro);
        raiz.style.setProperty("--texto-escuro", dados.configuracoes.corTextoEscuro);
      })
      .catch(() => undefined);
  }, []);

  return <CabecalhoSite comBusca comAdmin ativo="/blog" />;
}
