"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Copy, Heart, Mail, Share2 } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import RedesSociaisFlutuantes from "../../componentes/RedesSociaisFlutuantes";

function identificadorVisitante() {
  let identificador = localStorage.getItem("moveon_visitante");
  if (!identificador) {
    identificador = crypto.randomUUID();
    localStorage.setItem("moveon_visitante", identificador);
  }
  return identificador;
}

export default function Compartilhamento({
  id,
  titulo,
  configuracaoRedes,
}: {
  id: string;
  titulo: string;
  configuracaoRedes: {
    exibirRedesSociais: boolean;
    redesSociais: {
      id: string;
      nome: string;
      enderecoUrl: string;
      caminhoIcone?: string | null;
    }[];
  };
}) {
  const [mostrarTopo, setMostrarTopo] = useState(false);
  const [aviso, setAviso] = useState("");
  const [reacao, setReacao] = useState({ quantidade: 0, curtiu: false });
  const [enviandoReacao, setEnviandoReacao] = useState(false);
  useEffect(() => {
    const atualizar = () => setMostrarTopo(scrollY > 500);
    addEventListener("scroll", atualizar, { passive: true });
    fetch("/api/portal/eventos", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-visitante": identificadorVisitante(),
      },
      body: JSON.stringify({ tipo: "visualizacao", publicacaoId: id }),
      keepalive: true,
    }).catch(() => undefined);
    fetch(`/api/portal/reacoes/${encodeURIComponent(id)}`, {
      credentials: "include",
    })
      .then(async (resposta) =>
        (await resposta.json()) as { quantidade: number; curtiu: boolean },
      )
      .then((dados) => setReacao(dados))
      .catch(() => undefined);
    return () => removeEventListener("scroll", atualizar);
  }, [id]);
  const url = typeof location === "undefined" ? "" : location.href;
  const registrar = (rede: string) =>
    fetch("/api/portal/eventos", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-visitante": identificadorVisitante(),
      },
      body: JSON.stringify({
        tipo: "compartilhamento",
        publicacaoId: id,
        referencia: rede,
      }),
    }).catch(() => undefined);
  const abrir = (rede: string, destino: string) => {
    void registrar(rede);
    window.open(destino, "_blank", "noopener,noreferrer,width=760,height=640");
  };
  const codUrl = encodeURIComponent(url),
    codTitulo = encodeURIComponent(titulo);
  async function copiar(instagram = false) {
    await navigator.clipboard.writeText(url);
    void registrar(instagram ? "instagram" : "copiar_link");
    setAviso(
      instagram
        ? "Link copiado. Cole-o na sua publicação ou mensagem do Instagram."
        : "Link copiado!",
    );
    if (instagram)
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer",
      );
    setTimeout(() => setAviso(""), 3500);
  }
  async function compartilhar() {
    if (navigator.share) {
      await navigator.share({ title: titulo, text: titulo, url });
      void registrar("compartilhamento_nativo");
    } else await copiar();
  }
  async function alternarReacao() {
    if (enviandoReacao) return;
    setEnviandoReacao(true);
    try {
      const resposta = await fetch(
        `/api/portal/reacoes/${encodeURIComponent(id)}`,
        { method: "POST", credentials: "include" },
      );
      const dados = (await resposta.json().catch(() => ({}))) as {
        quantidade?: number;
        curtiu?: boolean;
        erro?: string;
      };
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível registrar sua reação.");
      setReacao({ quantidade: dados.quantidade || 0, curtiu: Boolean(dados.curtiu) });
      setAviso(dados.curtiu ? "Obrigado! Seu gostei foi registrado." : "Sua reação foi removida.");
      setTimeout(() => setAviso(""), 3000);
    } catch (erro) {
      setAviso((erro as Error).message);
    } finally {
      setEnviandoReacao(false);
    }
  }
  return (
    <>
      <Link
        className="voltar voltar-rota"
        href="/"
        onClick={() => sessionStorage.setItem("restaurar_scroll_portal", "1")}
      >
        <ArrowLeft /> Voltar às publicações
      </Link>
      <aside
        className="compartilhamento-publicacao"
        aria-label="Compartilhar publicação"
      >
        <strong>Compartilhe</strong>
        <div>
          <button
            aria-label="Compartilhar no WhatsApp"
            title="WhatsApp"
            onClick={() =>
              abrir("whatsapp", `https://wa.me/?text=${codTitulo}%20${codUrl}`)
            }
          >
            <FaWhatsapp />
          </button>
          <button
            aria-label="Compartilhar no Instagram"
            title="Instagram: copiar link"
            onClick={() => copiar(true)}
          >
            <FaInstagram />
          </button>
          <button
            aria-label="Compartilhar no LinkedIn"
            title="LinkedIn"
            onClick={() =>
              abrir(
                "linkedin",
                `https://www.linkedin.com/sharing/share-offsite/?url=${codUrl}`,
              )
            }
          >
            <FaLinkedinIn />
          </button>
          <button
            aria-label="Compartilhar no Facebook"
            title="Facebook"
            onClick={() =>
              abrir(
                "facebook",
                `https://www.facebook.com/sharer/sharer.php?u=${codUrl}`,
              )
            }
          >
            <FaFacebookF />
          </button>
          <button
            aria-label="Compartilhar no X"
            title="X"
            onClick={() =>
              abrir(
                "x",
                `https://twitter.com/intent/tweet?text=${codTitulo}&url=${codUrl}`,
              )
            }
          >
            <FaXTwitter />
          </button>
          <button
            aria-label="Compartilhar no Telegram"
            title="Telegram"
            onClick={() =>
              abrir(
                "telegram",
                `https://t.me/share/url?url=${codUrl}&text=${codTitulo}`,
              )
            }
          >
            <FaTelegram />
          </button>
          <button
            aria-label="Compartilhar por e-mail"
            title="E-mail"
            onClick={() => {
              location.href = `mailto:?subject=${codTitulo}&body=${codTitulo}%0A%0A${codUrl}`;
              void registrar("email");
            }}
          >
            <Mail />
          </button>
          <button
            aria-label="Copiar link"
            title="Copiar link"
            onClick={() => copiar()}
          >
            <Copy />
          </button>
          <button
            aria-label="Mais opções"
            title="Mais opções"
            onClick={compartilhar}
          >
            <Share2 />
          </button>
        </div>
        {aviso && <span role="status">{aviso}</span>}
      </aside>
      <aside className="reacao-publicacao" aria-label="Engajamento da publicação">
        <div>
          <strong>Gostou deste conteúdo?</strong>
          <span>{reacao.quantidade.toLocaleString("pt-BR")} pessoas gostaram</span>
        </div>
        <button
          type="button"
          className={reacao.curtiu ? "curtiu" : ""}
          aria-pressed={reacao.curtiu}
          disabled={enviandoReacao}
          onClick={alternarReacao}
        >
          <Heart fill={reacao.curtiu ? "currentColor" : "none"} />
          {reacao.curtiu ? "Você gostou" : "Gostei"}
        </button>
      </aside>
      <RedesSociaisFlutuantes configuracao={configuracaoRedes} />
      {mostrarTopo && (
        <button
          className="subir-topo na-publicacao"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp />
          <span>Topo</span>
        </button>
      )}
    </>
  );
}
