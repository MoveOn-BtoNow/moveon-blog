"use client";

import { Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Identidade = {
  nome: string;
  caminhoLogo: string;
  corPrimaria: string;
  corFundoClaro: string;
  corFundoEscuro: string;
  corTextoClaro: string;
  corTextoEscuro: string;
  exibirQuemSomos: boolean;
  exibirOQueResolvemos: boolean;
  exibirContato: boolean;
};

export default function CabecalhoPortal() {
  const [escuro, setEscuro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [identidade, setIdentidade] = useState<Identidade | null>(null);

  useEffect(() => {
    const temaEscuro = localStorage.getItem("tema_moveon") === "dark";
    document.documentElement.dataset.theme = temaEscuro ? "dark" : "light";
    const quadro = requestAnimationFrame(() => setEscuro(temaEscuro));
    return () => cancelAnimationFrame(quadro);
  }, []);

  useEffect(() => {
    fetch("/api/portal/inicial")
      .then((resposta) => resposta.json())
      .then((resultado) => {
        const dados = resultado as { configuracoes: Identidade };
        setIdentidade(dados.configuracoes);
        const raiz = document.documentElement;
        raiz.style.setProperty("--red", dados.configuracoes.corPrimaria);
        raiz.style.setProperty("--bg-claro", dados.configuracoes.corFundoClaro);
        raiz.style.setProperty("--bg-escuro", dados.configuracoes.corFundoEscuro);
        raiz.style.setProperty("--texto-claro", dados.configuracoes.corTextoClaro);
        raiz.style.setProperty("--texto-escuro", dados.configuracoes.corTextoEscuro);
      })
      .catch(() => undefined);
  }, []);

  function alternarTema() {
    const proximo = !escuro;
    setEscuro(proximo);
    document.documentElement.dataset.theme = proximo ? "dark" : "light";
    localStorage.setItem("tema_moveon", proximo ? "dark" : "light");
  }

  const caminhoLogo = identidade?.caminhoLogo;
  const logo =
    caminhoLogo && !["/logo.png", "/logo-white.png"].includes(caminhoLogo)
      ? caminhoLogo
      : escuro
        ? "/logo.png"
        : "/logo-white.png";

  return (
    <header className="cabecalho cabecalho-compartilhado">
      <Link className="marca" href="/" aria-label="Ir para a página inicial">
        <Image src={logo} alt={identidade?.nome || "MOVE.ON"} width={150} height={58} />
      </Link>
      <nav className={`nav ${menuAberto ? "aberta" : ""}`}>
        <Link href="/">Início</Link>
        <Link href="/#publicacoes">Publicações</Link>
        {identidade?.exibirQuemSomos === true && <Link href="/sobre">Quem Somos</Link>}
        {identidade?.exibirOQueResolvemos === true && <Link href="/solucoes">O que resolvemos</Link>}
        {identidade?.exibirContato === true && <Link href="/contato">Contato</Link>}
      </nav>
      <div className="acoes">
        <Link className="icon-btn acesso-admin" href="/admin" aria-label="Abrir administração" title="Administração"><Settings /></Link>
        <Link className="icon-btn" href="/?buscar=1" aria-label="Buscar publicações" title="Buscar"><Search /></Link>
        <button className="theme" aria-label="Alternar tema" onClick={alternarTema}>{escuro ? <Sun /> : <Moon />}</button>
        <button className="menu" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"} aria-expanded={menuAberto} onClick={() => setMenuAberto((valor) => !valor)}>{menuAberto ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
