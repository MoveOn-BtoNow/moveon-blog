"use client";

import { ArrowLeft, Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa6";
import { useEffect, useState } from "react";
import RodapePortal from "../componentes/RodapePortal";
import RedesSociaisFlutuantes from "../componentes/RedesSociaisFlutuantes";

const indicadores = [
  { numero: "100", rotulo: "projetos em 24 meses" },
  { numero: "95k", rotulo: "horas de projetos" },
  { numero: "400", rotulo: "processos estruturados" },
];

const lideres = [
  { nome: "Ana Senko", cargo: "Head de Operações", descricao: "Estratégia, Operações, Financeiro e Gestão de Backoffice", foto: "/ana-senko.png", linkedin: "https://www.linkedin.com/in/ana-carolina-melim-senko-171717b/" },
  { nome: "Vinícios Garcia", cargo: "Head de Processos & Testes", descricao: "Centro de Excelência SAP, Gestão de Processos, SAP Signavio e Testes", foto: "/vinicios-garcia.png", linkedin: "https://www.linkedin.com/in/vinicios-garcia-21945643/" },
  { nome: "Fábio Fernandes", cargo: "Head de Tax & S/4 Operate", descricao: "Reforma Tributária no SAP, Melhorias e Demandas SAP S/4HANA", foto: "/fabio-fernandes.png", linkedin: "https://www.linkedin.com/in/fabio-fernandes-29a33162/" },
  { nome: "Marylice Antunes", cargo: "Head SAP", descricao: "Governança de Programas S/4HANA, PMO as a Service e Gestão de Mudança", foto: "/marylice-antunes.png", linkedin: "https://www.linkedin.com/in/marylice-antunes-96410a49/" },
];

type IdentidadePortal = {
  nome: string;
  descricao: string;
  caminhoLogo: string;
  corPrimaria: string;
  corFundoClaro: string;
  corFundoEscuro: string;
  corTextoClaro: string;
  corTextoEscuro: string;
  exibirQuemSomos: boolean;
  exibirOQueResolvemos: boolean;
  exibirContato: boolean;
  exibirRedesSociais: boolean;
  instagramUrl: string;
  linkedinUrl: string;
};

export default function PaginaSobre() {
  const [escuro, setEscuro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [identidade, setIdentidade] = useState<IdentidadePortal | null>(null);

  useEffect(() => {
    const temaEscuro =
      localStorage.getItem("tema_moveon") === "dark" ||
      document.documentElement.dataset.theme === "dark";
    const quadro = requestAnimationFrame(() => setEscuro(temaEscuro));
    return () => cancelAnimationFrame(quadro);
  }, []);

  useEffect(() => {
    fetch("/api/portal/inicial")
      .then((resposta) => resposta.json())
      .then((resultado) => {
        const dados = resultado as { configuracoes: IdentidadePortal };
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

  return (
    <div className="pagina-sobre">
      <header className="cabecalho cabecalho-sobre">
        <Link className="marca" href="/" aria-label="Ir para a página inicial">
          <Image src={identidade?.caminhoLogo && !["/logo.png", "/logo-white.png"].includes(identidade.caminhoLogo) ? identidade.caminhoLogo : escuro ? "/logo.png" : "/logo-white.png"} alt={identidade?.nome || "MOVE.ON"} width={150} height={58} priority />
        </Link>
        <nav className={`nav ${menuAberto ? "aberta" : ""}`}>
          <Link href="/">Início</Link>
          <Link href="/#publicacoes">Publicações</Link>
          {identidade?.exibirQuemSomos === true && <Link className="ativo" href="/sobre" aria-current="page">Quem Somos</Link>}
          {identidade?.exibirOQueResolvemos === true && <Link href="/solucoes">O que resolvemos</Link>}
          {identidade?.exibirContato === true && <Link href="/contato">Contato</Link>}
        </nav>
        <div className="acoes">
          <Link
            className="icon-btn acesso-admin"
            href="/admin"
            aria-label="Abrir administração"
            title="Administração"
          >
            <Settings />
          </Link>
          <Link
            className="icon-btn"
            href="/?buscar=1"
            aria-label="Buscar publicações"
            title="Buscar"
          >
            <Search />
          </Link>
          <button className="theme" aria-label="Alternar tema" onClick={alternarTema}>
            {escuro ? <Sun /> : <Moon />}
          </button>
          <button className="menu" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"} aria-expanded={menuAberto} onClick={() => setMenuAberto((atual) => !atual)}>
            {menuAberto ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="sobre-hero">
          <div className="sobre-texto">
            <Link className="sobre-voltar" href="/"><ArrowLeft /> Voltar ao portal</Link>
            <span>QUEM SOMOS</span>
            <h1>Ecossistema de gestão que conecta processos, tecnologia e projetos</h1>
            <p>A MOVE.ON é uma consultoria de transformação de negócios que ajuda empresas de médio e grande porte a organizar, governar e acelerar suas agendas estratégicas. Integramos projetos, processos, plataformas e pessoas para gerar mais eficiência, clareza e resultado.</p>
            <p>Com metodologia e plataforma proprietárias, atuamos em múltiplas frentes como: Governança e gestão de projetos, gestão de processo, reforma tributária, governança de projetos SAP e eficiência operacional, sempre com uma atuação próxima, estruturada e orientada à geração de valor real.</p>
          </div>
          <figure className="sobre-imagem">
            <Image src="/evento.png" alt="Evento realizado pela MOVE.ON" width={1200} height={900} priority sizes="(max-width: 1000px) 86vw, 43vw" />
          </figure>
        </section>

        <section className="sobre-indicadores" aria-label="Números da MOVE.ON">
          {indicadores.map((indicador) => (
            <article key={indicador.numero}>
              <div><strong>{indicador.numero}</strong><b>+</b></div>
              <p>{indicador.rotulo}</p>
            </article>
          ))}
        </section>
        <section className="lideranca" aria-labelledby="titulo-lideranca">
          <header>
            <span>NOSSA LIDERANÇA</span>
            <h2 id="titulo-lideranca">Quem lidera a MOVE.ON</h2>
            <p>Experiência executiva para conectar estratégia, operação e transformação.</p>
          </header>

          <article className="lider-destaque">
            <Image src="/vandre-oliveira.png" alt="Vandré Oliveira" width={760} height={900} sizes="(max-width: 800px) 100vw, 42vw" />
            <div>
              <div className="lider-nome">
                <div><h3>Vandré Oliveira</h3><strong>CEO &amp; Fundador</strong></div>
                <a href="https://www.linkedin.com/in/vandré-oliveira-b5316298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Vandré Oliveira" title="LinkedIn de Vandré Oliveira"><FaLinkedinIn /></a>
              </div>
              <p>+20 anos liderando iniciativas de transformação no ecossistema SAP, conectando estratégia, tecnologia, processos e governança para gerar mais clareza, controle e resultado em grandes empresas.</p>
              <div className="lider-tags" aria-label="Especialidades de Vandré Oliveira">
                {["SAP", "GOVERNANÇA", "PMO", "BUSINESS TRANSFORMATION"].map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>

          <div className="grade-lideres">
            {lideres.map((lider) => (
              <article className="lider-card" key={lider.nome}>
                <Image src={lider.foto} alt={lider.nome} width={520} height={580} sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                <div>
                  <div className="lider-nome">
                    <div><h3>{lider.nome}</h3><strong>{lider.cargo}</strong></div>
                    <a href={lider.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${lider.nome}`} title={`LinkedIn de ${lider.nome}`}><FaLinkedinIn /></a>
                  </div>
                  <p>{lider.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {identidade && (
        <RedesSociaisFlutuantes
          configuracao={{
            exibirRedesSociais: identidade.exibirRedesSociais,
            instagramUrl: identidade.instagramUrl,
            linkedinUrl: identidade.linkedinUrl,
          }}
        />
      )}
      <RodapePortal logo={identidade?.caminhoLogo || "/logo.png"} descricao={identidade?.descricao || "Conteúdo que move"} />
    </div>
  );
}
