"use client";

import {
  FormEvent,
  lazy,
  memo,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  Bold,
  BookOpen,
  Code2,
  Eye,
  EyeOff,
  FilePenLine,
  FolderTree,
  Heading2,
  Heading3,
  Handshake,
  Home,
  Inbox,
  Archive,
  Reply,
  Cloud,
  ShieldCheck,
  FileText,
  Image,
  Italic,
  Link,
  Link2Off,
  List,
  ListOrdered,
  LogIn,
  Menu,
  Mail,
  Moon,
  Pencil,
  Plus,
  Quote,
  Redo2,
  RemoveFormatting,
  Search,
  Settings,
  Strikethrough,
  Sun,
  Trash2,
  Underline,
  Undo2,
  UserRound,
  Video,
  X,
} from "lucide-react";
import RedesSociaisFlutuantes from "./componentes/RedesSociaisFlutuantes";
import RodapePortal from "./componentes/RodapePortal";

const EditorPublicacaoCompleto = lazy(() =>
  import("./componentes/EditorPublicacaoCompleto").then((modulo) => ({
    default: modulo.EditorPublicacaoCompleto,
  })),
);
const PainelIntegracoes = lazy(() => import("./componentes/PainelIntegracoes"));
const PainelConteudoLegal = lazy(
  () => import("./componentes/PainelConteudoLegal"),
);

type Categoria = {
  id: string;
  nome: string;
  slug?: string;
  descricao?: string;
  publicacoes?: number;
};
type Publicacao = {
  id: string;
  titulo: string;
  slug?: string;
  resumo: string;
  conteudo: { texto?: string } | string;
  situacao?: string;
  destaque: boolean;
  imagemCapaUrl?: string;
  imagemSocialUrl?: string;
  textoAlternativoCapa?: string;
  publicadoEm?: string;
  agendadoPara?: string;
  criadoEm?: string;
  categorias: (Categoria | string)[];
  acessos?: number;
  metatitulo?: string;
  metadescricao?: string;
};
type Configuracoes = {
  nome: string;
  descricao: string;
  caminhoLogo: string;
  caminhoFavicon: string;
  corPrimaria: string;
  corFundoClaro: string;
  corFundoEscuro: string;
  corTextoClaro: string;
  corTextoEscuro: string;
  exibirQuemSomos: boolean;
  exibirOQueResolvemos: boolean;
  exibirContato: boolean;
  exibirNewsletter: boolean;
  exibirRedesSociais: boolean;
  instagramUrl: string;
  linkedinUrl: string;
};
type DadosPortal = {
  configuracoes: Configuracoes;
  categorias: Categoria[];
  publicacoes: Publicacao[];
  destaques: Publicacao[];
  parceiros: Parceiro[];
  proximoCursor?: string | null;
};
type Parceiro = {
  id: string;
  nome: string;
  caminhoLogo: string;
  enderecoSite?: string;
  ativo: boolean;
  ordem: number;
};
type Administrador = {
  id: string;
  nome: string;
  email: string;
  caminhoFoto?: string;
};
type ModeloNewsletterPainel = {
  assunto: string;
  texto: string;
  exibirNewsletter: boolean;
  emailAtivo: boolean;
  smtpHost: string;
  smtpPorta: number;
  smtpSeguro: boolean;
  smtpUsuario: string;
  smtpSenha: string;
  smtpSenhaConfigurada: boolean;
  emailRemetenteNome: string;
  emailRemetenteEndereco: string;
  emailSegredoCancelamento: string;
  emailSegredoConfigurado: boolean;
};
type Tela =
  | "inicio"
  | "publicacoes"
  | "editor"
  | "categorias"
  | "metricas"
  | "configuracoes"
  | "administrador"
  | "newsletter"
  | "parceiros"
  | "contato"
  | "integracoes"
  | "consentimento"
  | "politica_privacidade"
  | "termos_uso";
type CampoModal = {
  nome: string;
  rotulo: string;
  valor?: string;
  tipo?: "text" | "url" | "number";
};
type PedidoModal = {
  titulo: string;
  mensagem?: string;
  confirmar?: string;
  perigo?: boolean;
  campos?: CampoModal[];
  resolver: (valor: false | Record<string, string>) => void;
};
function abrirModal(opcoes: Omit<PedidoModal, "resolver">) {
  return new Promise<false | Record<string, string>>((resolver) =>
    window.dispatchEvent(
      new CustomEvent("moveon:modal", { detail: { ...opcoes, resolver } }),
    ),
  );
}

async function api<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    credentials: "include",
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => ({}))) as {
      erro?: string;
      aguardeSegundos?: number;
      errosCampos?: Record<string, string[]>;
      detalhes?: { fieldErrors?: Record<string, string[]> };
    };
    const erro = new Error(
      corpo.erro || "Não foi possível concluir a operação.",
    ) as Error & {
      aguardeSegundos?: number;
      errosCampos?: Record<string, string[]>;
    };
    erro.aguardeSegundos = corpo.aguardeSegundos;
    erro.errosCampos = corpo.errosCampos || corpo.detalhes?.fieldErrors;
    throw erro;
  }
  return resposta.status === 204 ? (undefined as T) : resposta.json();
}
async function enviarImagemCapa(
  arquivo: File,
): Promise<{ caminho: string; caminhoSocial: string }> {
  const dados = new FormData();
  dados.append("imagem", arquivo);
  const resposta = await fetch("/api/painel/uploads/capas", {
    method: "POST",
    credentials: "include",
    body: dados,
  });
  const corpo = (await resposta.json().catch(() => ({}))) as {
    caminho?: string;
    caminhoSocial?: string;
    erro?: string;
  };
  if (!resposta.ok || !corpo.caminho || !corpo.caminhoSocial)
    throw new Error(corpo.erro || "Não foi possível otimizar a imagem.");
  return { caminho: corpo.caminho!, caminhoSocial: corpo.caminhoSocial! };
}
async function enviarImagemGenerica(
  caminho: string,
  arquivo: File,
): Promise<string> {
  const dados = new FormData();
  dados.append("imagem", arquivo);
  const resposta = await fetch(`/api${caminho}`, {
    method: "POST",
    credentials: "include",
    body: dados,
  });
  const corpo = (await resposta.json().catch(() => ({}))) as {
    caminho?: string;
    erro?: string;
  };
  if (!resposta.ok || !corpo.caminho)
    throw new Error(corpo.erro || "Não foi possível enviar a imagem.");
  return corpo.caminho;
}
const texto = (p: Publicacao) =>
  typeof p.conteudo === "string" ? p.conteudo : p.conteudo?.texto || "";
const nomesCategorias = (p: Publicacao) =>
  p.categorias.map((c) => (typeof c === "string" ? c : c.nome));
const dataBrasil = (valor?: string) =>
  valor
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Bahia",
      }).format(new Date(valor))
    : "—";
const imagemPadrao = "/og.png";
const urlImagemExibicao = (caminho?: string) => {
  if (!caminho || !caminho.startsWith("/")) return caminho || "";
  return typeof window === "undefined"
    ? caminho
    : new URL(caminho, window.location.origin).toString();
};
const formatarTamanhoArquivo = (bytes: number) => {
  const decimal = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const total = new Intl.NumberFormat("pt-BR").format(bytes);
  if (bytes < 1024) return `${total} bytes`;
  if (bytes < 1024 * 1024)
    return `${decimal.format(bytes / 1024)} KB (${total} bytes)`;
  return `${decimal.format(bytes / 1024 / 1024)} MB (${total} bytes)`;
};
function idVisitante() {
  let id = localStorage.getItem("moveon_visitante");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("moveon_visitante", id);
  }
  return id;
}
const registrar = (dados: object) =>
  api<void>("/portal/eventos", {
    method: "POST",
    headers: { "x-visitante": idVisitante() },
    body: JSON.stringify(dados),
  }).catch(() => undefined);

export default function Pagina() {
  const [sessao, setSessao] = useState<Administrador | null>(null),
    [verificando, setVerificando] = useState(true),
    [modoAdmin, setModoAdmin] = useState(
      () => typeof window !== "undefined" && location.pathname === "/admin",
    );
  useEffect(() => {
    api<{ autenticado: boolean; administrador?: Administrador }>(
      "/autenticacao/sessao",
    )
      .then((r) => setSessao(r.administrador || null))
      .catch(() => setSessao(null))
      .finally(() => setVerificando(false));
  }, []);
  if (verificando)
    return <div className="tela-estado">Carregando aplicação…</div>;
  const conteudo =
    modoAdmin && !sessao ? (
      <Login
        aoEntrar={(a) => setSessao(a)}
        aoVoltar={() => {
          location.href = "/";
        }}
      />
    ) : modoAdmin && sessao ? (
      <Painel
        administrador={sessao}
        aoSair={() => {
          location.href = "/";
        }}
      />
    ) : (
      <Portal
        aoAdministrar={() => {
          location.href = "/admin";
        }}
      />
    );
  return (
    <>
      {conteudo}
      <ModalGlobal />
    </>
  );
}

function ModalGlobal() {
  const [pedido, setPedido] = useState<PedidoModal | null>(null),
    [valores, setValores] = useState<Record<string, string>>({});
  useEffect(() => {
    const ouvir = (evento: Event) => {
      const p = (evento as CustomEvent<PedidoModal>).detail;
      setPedido(p);
      setValores(
        Object.fromEntries(
          (p.campos || []).map((c) => [c.nome, c.valor || ""]),
        ),
      );
    };
    window.addEventListener("moveon:modal", ouvir);
    return () => window.removeEventListener("moveon:modal", ouvir);
  }, []);
  if (!pedido) return null;
  const fechar = (resultado: false | Record<string, string>) => {
    pedido.resolver(resultado);
    setPedido(null);
  };
  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && fechar(false)}
    >
      <form
        className="modal-personalizado"
        role="dialog"
        aria-modal="true"
        onSubmit={(e) => {
          e.preventDefault();
          fechar(valores);
        }}
      >
        <button
          type="button"
          className="modal-fechar"
          onClick={() => fechar(false)}
        >
          <X />
        </button>
        <span>MOVE.ON</span>
        <h2>{pedido.titulo}</h2>
        {pedido.mensagem && <p>{pedido.mensagem}</p>}
        {pedido.campos?.map((c) => (
          <label key={c.nome}>
            {c.rotulo}
            <input
              autoFocus={pedido.campos?.[0] === c}
              type={c.tipo || "text"}
              value={valores[c.nome] || ""}
              onChange={(e) =>
                setValores({ ...valores, [c.nome]: e.target.value })
              }
              required
            />
          </label>
        ))}
        <div className="modal-acoes">
          <button type="button" onClick={() => fechar(false)}>
            Cancelar
          </button>
          <button className={pedido.perigo ? "perigo" : "primario"}>
            {pedido.confirmar || "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Login({
  aoEntrar,
  aoVoltar,
}: {
  aoEntrar: (a: Administrador) => void;
  aoVoltar: () => void;
}) {
  const [email, setEmail] = useState(""),
    [senha, setSenha] = useState(""),
    [mostrarSenha, setMostrarSenha] = useState(false),
    [erro, setErro] = useState(""),
    [enviando, setEnviando] = useState(false),
    [senhaAlterada, setSenhaAlterada] = useState(false),
    [lembrarAcesso, setLembrarAcesso] = useState(false),
    [bloqueadoAte, setBloqueadoAte] = useState(0),
    [segundosRestantes, setSegundosRestantes] = useState(0);
  useEffect(() => {
    setSenhaAlterada(
      new URLSearchParams(window.location.search).get("senha") === "alterada",
    );
    const emailSalvo = localStorage.getItem("moveon_email_administrador") || "";
    if (emailSalvo) {
      setEmail(emailSalvo);
      setLembrarAcesso(true);
    }
  }, []);
  useEffect(() => {
    if (!bloqueadoAte) return;
    const atualizar = () => {
      const segundos = Math.max(
        0,
        Math.ceil((bloqueadoAte - Date.now()) / 1000),
      );
      setSegundosRestantes(segundos);
      if (segundos === 0) setBloqueadoAte(0);
    };
    atualizar();
    const temporizador = window.setInterval(atualizar, 250);
    return () => window.clearInterval(temporizador);
  }, [bloqueadoAte]);
  async function entrar(e: FormEvent) {
    e.preventDefault();
    if (segundosRestantes > 0) return;
    setEnviando(true);
    setErro("");
    try {
      const r = await api<{ administrador: Administrador }>(
        "/autenticacao/entrar",
        { method: "POST", body: JSON.stringify({ email, senha }) },
      );
      if (lembrarAcesso)
        localStorage.setItem("moveon_email_administrador", email.trim());
      else localStorage.removeItem("moveon_email_administrador");
      aoEntrar(r.administrador);
    } catch (e) {
      const falha = e as Error & { aguardeSegundos?: number };
      if (falha.aguardeSegundos && falha.aguardeSegundos > 0)
        setBloqueadoAte(Date.now() + falha.aguardeSegundos * 1000);
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }
  return (
    <main className="login-banco">
      <form onSubmit={entrar} aria-busy={enviando}>
        <img src="/logo.png" alt="MOVE.ON" />
        <span>ACESSO ADMINISTRATIVO</span>
        <h1>Entrar no dashboard</h1>
        {senhaAlterada && (
          <div className="sucesso-seguranca" role="status">
            Senha alterada com segurança. Todas as sessões foram encerradas;
            entre novamente com a nova senha.
          </div>
        )}
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail"
            required
            autoComplete="username"
            disabled={segundosRestantes > 0}
          />
        </label>
        <label>
          Senha
          <div className="campo-senha">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
              disabled={segundosRestantes > 0}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              disabled={segundosRestantes > 0}
            >
              {mostrarSenha ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        <label className="lembrar-acesso">
          <input
            type="checkbox"
            checked={lembrarAcesso}
            onChange={(evento) => setLembrarAcesso(evento.target.checked)}
            disabled={segundosRestantes > 0}
          />
          <span>
            Lembrar meu acesso
            <small>Salva somente o e-mail neste dispositivo</small>
          </span>
        </label>
        {erro && <div className="erro-api" role="alert">{erro}</div>}
        {segundosRestantes > 0 && (
          <div className="bloqueio-login" role="status" aria-live="polite">
            Tente novamente em <strong>{segundosRestantes}s</strong>. O bloqueio
            é controlado pelo servidor.
          </div>
        )}
        <button className="salvar2" disabled={enviando || segundosRestantes > 0}>
          <LogIn />{" "}
          {segundosRestantes > 0
            ? `Bloqueado por ${segundosRestantes}s`
            : enviando
              ? "Entrando…"
              : "Entrar"}
        </button>
        <button type="button" className="link-voltar" onClick={aoVoltar}>
          ← Voltar ao portal
        </button>
      </form>
    </main>
  );
}

function Portal({ aoAdministrar }: { aoAdministrar: () => void }) {
  const [dados, setDados] = useState<DadosPortal | null>(null),
    [erro, setErro] = useState(""),
    [categoria, setCategoria] = useState(""),
    [termo, setTermo] = useState(""),
    [busca, setBusca] = useState(false),
    [aberta, setAberta] = useState<Publicacao | null>(null),
    [limite, setLimite] = useState(6),
    [escuro, setEscuro] = useState(false),
    [indiceDestaque, setIndiceDestaque] = useState(0),
    [mostrarTopo, setMostrarTopo] = useState(false),
    [cursor, setCursor] = useState<string | null>(null),
    [carregandoMais, setCarregandoMais] = useState(false),
    sentinela = useRef<HTMLDivElement>(null),
    campoBusca = useRef<HTMLInputElement>(null),
    temaInicializado = useRef(false);
  useEffect(() => {
    api<DadosPortal>("/portal/inicial")
      .then((resultado) => {
        setDados(resultado);
        setCursor(resultado.proximoCursor || null);
      })
      .catch((e) => setErro(e.message));
  }, []);
  useEffect(() => {
    if (!dados) return;
    const atraso = setTimeout(async () => {
      try {
        const slugCategoria = dados.categorias.find(
          (c) => c.nome === categoria,
        )?.slug;
        const parametros = new URLSearchParams({ limite: "12" });
        if (termo.trim()) parametros.set("busca", termo.trim());
        if (slugCategoria) parametros.set("categoria", slugCategoria);
        const resultado = await api<{
          itens: Publicacao[];
          proximoCursor: string | null;
        }>(`/portal/publicacoes?${parametros}`);
        setDados((atual) =>
          atual ? { ...atual, publicacoes: resultado.itens } : atual,
        );
        setCursor(resultado.proximoCursor);
        setLimite(resultado.itens.length);
      } catch (e) {
        setErro((e as Error).message);
      }
    }, 300);
    return () => clearTimeout(atraso);
  }, [categoria, termo]);
  useEffect(() => {
    if (!dados || sessionStorage.getItem("restaurar_scroll_portal") !== "1")
      return;
    sessionStorage.removeItem("restaurar_scroll_portal");
    requestAnimationFrame(() =>
      scrollTo({
        top: Number(sessionStorage.getItem("scroll_portal") || 0),
        behavior: "instant",
      }),
    );
  }, [dados]);
  useEffect(() => {
    if (!dados) return;
    const raiz = document.documentElement;
    raiz.style.setProperty("--red", dados.configuracoes.corPrimaria);
    raiz.style.setProperty("--bg-claro", dados.configuracoes.corFundoClaro);
    raiz.style.setProperty("--bg-escuro", dados.configuracoes.corFundoEscuro);
    raiz.style.setProperty("--texto-claro", dados.configuracoes.corTextoClaro);
    raiz.style.setProperty(
      "--texto-escuro",
      dados.configuracoes.corTextoEscuro,
    );
    document.title = `${dados.configuracoes.nome} — ${dados.configuracoes.descricao}`;
  }, [dados]);
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema_moveon");
    const quadro = requestAnimationFrame(() => {
      temaInicializado.current = true;
      setEscuro(temaSalvo === "dark");
    });
    return () => cancelAnimationFrame(quadro);
  }, []);
  useEffect(() => {
    const parametros = new URLSearchParams(location.search);
    if (parametros.get("buscar") !== "1") return;
    const quadro = requestAnimationFrame(() => setBusca(true));
    parametros.delete("buscar");
    history.replaceState(
      null,
      "",
      `${location.pathname}${parametros.size ? `?${parametros}` : ""}${location.hash}`,
    );
    return () => cancelAnimationFrame(quadro);
  }, []);
  useEffect(() => {
    if (!busca) return;
    const transbordamentoAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const quadro = requestAnimationFrame(() => campoBusca.current?.focus());
    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setBusca(false);
    };
    document.addEventListener("keydown", fecharComEscape);
    return () => {
      cancelAnimationFrame(quadro);
      document.body.style.overflow = transbordamentoAnterior;
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [busca]);
  useEffect(() => {
    if (!temaInicializado.current) return;
    document.documentElement.dataset.theme = escuro ? "dark" : "light";
  }, [escuro]);
  useEffect(() => {
    const quantidade = dados?.destaques?.length || 0;
    if (quantidade < 2) return;
    const temporizador = window.setInterval(
      () => setIndiceDestaque((indice) => (indice + 1) % quantidade),
      7_000,
    );
    return () => window.clearInterval(temporizador);
  }, [dados?.destaques]);
  useEffect(() => {
    const observar = () => setMostrarTopo(window.scrollY > 320);
    observar();
    window.addEventListener("scroll", observar, { passive: true });
    return () => window.removeEventListener("scroll", observar);
  }, []);
  useEffect(() => {
    const botao = document.querySelector<HTMLButtonElement>(".cabecalho .menu");
    const navegacao = document.querySelector<HTMLElement>(".cabecalho .nav");
    if (!botao || !navegacao) return;
    const alternar = () => {
      const aberta = navegacao.classList.toggle("aberta");
      botao.setAttribute("aria-expanded", String(aberta));
      botao.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
    };
    const fechar = () => {
      navegacao.classList.remove("aberta");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu");
    };
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    botao.addEventListener("click", alternar);
    navegacao.addEventListener("click", fechar);
    return () => {
      botao.removeEventListener("click", alternar);
      navegacao.removeEventListener("click", fechar);
    };
  }, [dados]);
  const filtradas = useMemo(() => dados?.publicacoes || [], [dados]);
  useEffect(() => {
    const el = sentinela.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting && cursor && !carregandoMais && dados) {
          setCarregandoMais(true);
          const slugCategoria = dados.categorias.find(
            (c) => c.nome === categoria,
          )?.slug;
          const parametros = new URLSearchParams({ limite: "12", cursor });
          if (termo.trim()) parametros.set("busca", termo.trim());
          if (slugCategoria) parametros.set("categoria", slugCategoria);
          api<{ itens: Publicacao[]; proximoCursor: string | null }>(
            `/portal/publicacoes?${parametros}`,
          )
            .then((resultado) => {
              setDados((atual) =>
                atual
                  ? {
                      ...atual,
                      publicacoes: [
                        ...atual.publicacoes,
                        ...resultado.itens.filter(
                          (novo) =>
                            !atual.publicacoes.some(
                              (existente) => existente.id === novo.id,
                            ),
                        ),
                      ],
                    }
                  : atual,
              );
              setCursor(resultado.proximoCursor);
              setLimite((n) => n + resultado.itens.length);
            })
            .catch((e) => setErro(e.message))
            .finally(() => setCarregandoMais(false));
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [cursor, carregandoMais, dados, categoria, termo]);
  function selecionarCategoria(c?: Categoria) {
    setCategoria(c?.nome || "");
    setLimite(6);
    if (c) registrar({ tipo: "clique_categoria", categoriaId: c.id });
  }
  function limparPesquisa() {
    setTermo("");
    setBusca(false);
    requestAnimationFrame(() =>
      document.getElementById("publicacoes")?.scrollIntoView({ block: "start" }),
    );
  }
  function abrir(p: Publicacao) {
    registrar({ tipo: "visualizacao", publicacaoId: p.id });
    location.href = `/publicacao/${encodeURIComponent(p.slug || p.id)}`;
  }
  if (erro)
    return (
      <div className="tela-estado erro-api">
        {erro}
        <small>Confirme se a API e o PostgreSQL estão em execução.</small>
      </div>
    );
  if (!dados)
    return <div className="tela-estado">Consultando o PostgreSQL…</div>;
  if (aberta)
    return (
      <article className="artigo">
        <button
          className="voltar"
          onClick={() => {
            setAberta(null);
            requestAnimationFrame(() =>
              window.scrollTo({
                top: Number(sessionStorage.getItem("scroll_portal") || 0),
              }),
            );
          }}
        >
          <ArrowLeft /> Voltar às publicações
        </button>
        <header>
          <span className="tag">
            {nomesCategorias(aberta)[0] || "Conteúdo"}
          </span>
          <h1>{aberta.titulo}</h1>
          <p>{aberta.resumo}</p>
          <div className="artigo-meta">
            Publicado em {dataBrasil(aberta.publicadoEm)}
          </div>
        </header>
        <img
          className="capa-artigo"
          src={aberta.imagemCapaUrl || imagemPadrao}
          alt=""
        />
        <div className="artigo-layout">
          <aside>
            <b>COMPARTILHE</b>
            <button
              onClick={() => {
                navigator.clipboard.writeText(location.href);
                registrar({
                  tipo: "compartilhamento",
                  publicacaoId: aberta.id,
                  referencia: "copiar_link",
                });
              }}
            >
              ↗
            </button>
          </aside>
          <div
            className="texto conteudo-formatado ck-content"
            dangerouslySetInnerHTML={{ __html: texto(aberta) }}
          />
        </div>
        <button
          className="subir-topo na-publicacao"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp />
          <span>Topo</span>
        </button>
      </article>
    );
  const destaquesDisponiveis = dados.destaques?.length
    ? dados.destaques
    : dados.publicacoes.slice(0, 1);
  const indiceDestaqueAtual = destaquesDisponiveis.length
    ? indiceDestaque % destaquesDisponiveis.length
    : 0;
  const destaque = destaquesDisponiveis[indiceDestaqueAtual];
  const caminhoLogoConfigurado = dados.configuracoes.caminhoLogo || "/logo.png";
  const usaLogoPadrao = ["/logo.png", "/logo-white.png"].includes(
    caminhoLogoConfigurado,
  );
  const logoCabecalho = usaLogoPadrao
    ? escuro
      ? "/logo.png"
      : "/logo-white.png"
    : caminhoLogoConfigurado;
  return (
    <div className="site-shell">
      <header className="cabecalho">
        <button className="marca">
          <img src={logoCabecalho} alt={dados.configuracoes.nome} />
        </button>
        <nav className="nav">
          <button onClick={() => selecionarCategoria()}>Início</button>
          <button
            onClick={() =>
              document.querySelector(".conteudo")?.scrollIntoView()
            }
          >
            Publicações
          </button>
          {dados.configuracoes.exibirQuemSomos && (
            <button onClick={() => (location.href = "/sobre")}>
              Quem Somos
            </button>
          )}
          {dados.configuracoes.exibirOQueResolvemos && (
            <button onClick={() => (location.href = "/solucoes")}>
              O que resolvemos
            </button>
          )}
          {dados.configuracoes.exibirContato && (
            <button onClick={() => (location.href = "/contato")}>
              Contato
            </button>
          )}
        </nav>
        <div className="acoes">
          <button
            className="icon-btn acesso-admin"
            aria-label="Abrir administração"
            title="Administração"
            onClick={aoAdministrar}
          >
            <Settings />
          </button>
          <button
            className="icon-btn"
            aria-label="Buscar"
            onClick={() => setBusca(true)}
          >
            <Search />
          </button>
          <button
            className="theme"
            aria-label="Alternar tema"
            onClick={() =>
              setEscuro((atual) => {
                const proximo = !atual;
                localStorage.setItem("tema_moveon", proximo ? "dark" : "light");
                return proximo;
              })
            }
          >
            {escuro ? <Sun /> : <Moon />}
          </button>
          <button className="menu">
            <Menu />
          </button>
        </div>
      </header>
      {busca && (
        <div
          className="busca-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setBusca(false)}
        >
          <div
            className="busca-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-busca-portal"
          >
            <button
              type="button"
              className="fechar-busca"
              aria-label="Fechar pesquisa"
              onClick={() => setBusca(false)}
            >
              <X />
            </button>
            <span>BUSCA NO BANCO</span>
            <h2 id="titulo-busca-portal">O que você procura?</h2>
            <p id="ajuda-busca-portal">
              Pesquise pelo título, conteúdo, categoria ou assunto.
            </p>
            <form
              className="campo-busca"
              role="search"
              onSubmit={(evento) => {
                evento.preventDefault();
                if (!termo.trim()) return campoBusca.current?.focus();
                setBusca(false);
                registrar({ tipo: "busca", referencia: termo.trim() });
                requestAnimationFrame(() =>
                  document
                    .getElementById("publicacoes")
                    ?.scrollIntoView({ block: "start" }),
                );
              }}
            >
              <Search />
              <label className="somente-leitor" htmlFor="busca-publicacoes">
                Termo da pesquisa
              </label>
              <input
                ref={campoBusca}
                id="busca-publicacoes"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                aria-describedby="ajuda-busca-portal"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Título, conteúdo, categoria ou assunto"
              />
              <button type="submit" disabled={!termo.trim()}>
                Buscar
              </button>
            </form>
            {termo.trim() && (
              <button
                type="button"
                className="limpar-busca-modal"
                onClick={limparPesquisa}
              >
                <X /> Limpar pesquisa atual
              </button>
            )}
          </div>
        </div>
      )}
      {destaque ? (
        <section className="hero">
          <div
            className="hero-img"
            style={{
              backgroundImage: `linear-gradient(90deg,#000d,#0002),url(${destaque.imagemCapaUrl || imagemPadrao})`,
            }}
          />
          <div className="hero-content">
            <span className="chapeu">EM DESTAQUE</span>
            <h1>{destaque.titulo}</h1>
            <p>{destaque.resumo}</p>
            <button className="primario" onClick={() => abrir(destaque)}>
              Ler publicação →
            </button>
          </div>
          {destaquesDisponiveis.length > 1 && (
            <div
              className="dots"
              aria-label="Selecionar publicação em destaque"
            >
              {destaquesDisponiveis.map((item, indice) => (
                <button
                  type="button"
                  key={item.id}
                  className={indice === indiceDestaqueAtual ? "ativo" : ""}
                  aria-label={`Exibir destaque ${indice + 1}: ${item.titulo}`}
                  aria-current={
                    indice === indiceDestaqueAtual ? "true" : undefined
                  }
                  onClick={() => setIndiceDestaque(indice)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="hero hero-vazio">
          <div className="hero-content">
            <span className="chapeu">MOVE.ON</span>
            <h1>{dados.configuracoes.descricao}</h1>
            <p>
              As publicações criadas e publicadas no dashboard aparecerão aqui
              automaticamente.
            </p>
          </div>
        </section>
      )}
      {dados.parceiros?.length > 0 && (
        <section
          className="carrossel-parceiros"
          aria-label="Parceiros e clientes MOVE.ON"
        >
          <span>EMPRESAS QUE CONFIAM NA MOVE.ON</span>
          <div className="trilho-parceiros">
            <div>
              {[...dados.parceiros, ...dados.parceiros].map(
                (parceiro, indice) => {
                  const logo = (
                    <img
                      src={parceiro.caminhoLogo}
                      alt={parceiro.nome}
                      loading="lazy"
                    />
                  );
                  return parceiro.enderecoSite ? (
                    <a
                      href={parceiro.enderecoSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`${parceiro.id}-${indice}`}
                      aria-label={`Conhecer ${parceiro.nome}`}
                    >
                      {logo}
                    </a>
                  ) : (
                    <figure
                      key={`${parceiro.id}-${indice}`}
                      title={parceiro.nome}
                    >
                      {logo}
                    </figure>
                  );
                },
              )}
            </div>
          </div>
        </section>
      )}
      <main id="publicacoes" className="conteudo">
        <div className="titulo-secao">
          <div>
            <span className="eyebrow">CONTEÚDO ATUALIZADO</span>
            <h2>Publicações recentes</h2>
          </div>
          <p>{dados.configuracoes.descricao}</p>
        </div>
        {termo.trim() && (
          <div className="busca-ativa" role="status" aria-live="polite">
            <div>
              <Search />
              <span>
                Resultados para <strong>“{termo.trim()}”</strong>
              </span>
            </div>
            <button type="button" onClick={limparPesquisa}>
              <X /> Limpar pesquisa e mostrar todas
            </button>
          </div>
        )}
        <div className="categorias">
          <button
            className={!categoria ? "ativa" : ""}
            onClick={() => selecionarCategoria()}
          >
            Todas
          </button>
          {dados.categorias.map((c) => (
            <button
              key={c.id}
              className={categoria === c.nome ? "ativa" : ""}
              onClick={() => selecionarCategoria(c)}
            >
              {c.nome}
            </button>
          ))}
        </div>
        {filtradas.length ? (
          <div className="grid-posts">
            {filtradas.slice(0, limite).map((p) => (
              <article
                className="post-card"
                key={p.id}
                onClick={() => {
                  sessionStorage.setItem("scroll_portal", String(scrollY));
                  abrir(p);
                }}
              >
                <div className="card-img">
                  <img
                    src={p.imagemCapaUrl || imagemPadrao}
                    alt={p.textoAlternativoCapa || p.titulo}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="card-tags">
                    {nomesCategorias(p).map((n) => (
                      <button
                        key={n}
                        onClick={(e) => {
                          e.stopPropagation();
                          const c = dados.categorias.find((x) => x.nome === n);
                          selecionarCategoria(c);
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card-body">
                  <div className="meta">
                    <span>{dataBrasil(p.publicadoEm)}</span>
                  </div>
                  <h3>{p.titulo}</h3>
                  <p>{p.resumo}</p>
                  <span className="leia">
                    Ler publicação <b>→</b>
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="vazio">
            <h3>Nenhuma publicação encontrada</h3>
            <p>Publique um conteúdo no dashboard ou altere os filtros.</p>
          </div>
        )}
        <div className="sentinela-posts" ref={sentinela}>
          <small>
            {limite < filtradas.length
              ? "Carregando mais publicações…"
              : "Você chegou ao fim"}
          </small>
        </div>
      </main>
      {dados.configuracoes.exibirNewsletter && (
        <InscricaoNewsletter nome={dados.configuracoes.nome} />
      )}
      <RodapePortal
        logo={dados.configuracoes.caminhoLogo || "/logo.png"}
        descricao={dados.configuracoes.descricao}
      />
      <RedesSociaisFlutuantes
        configuracao={{
          exibirRedesSociais: dados.configuracoes.exibirRedesSociais,
          instagramUrl: dados.configuracoes.instagramUrl,
          linkedinUrl: dados.configuracoes.linkedinUrl,
        }}
      />
      {mostrarTopo && (
        <button
          className="subir-topo"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp />
          <span>Voltar ao topo</span>
        </button>
      )}
    </div>
  );
}
function InscricaoNewsletter({ nome }: { nome: string }) {
  const [email, setEmail] = useState(""),
    [mensagem, setMensagem] = useState(""),
    [cadastroConcluido, setCadastroConcluido] = useState(false);
  async function inscrever(e: FormEvent) {
    e.preventDefault();
    setMensagem("");
    setCadastroConcluido(false);
    try {
      const resposta = await api<{ mensagem?: string }>("/portal/newsletter", {
        method: "POST",
        body: JSON.stringify({ email, website: "" }),
      });
      setEmail("");
      setCadastroConcluido(true);
      setMensagem(
        resposta.mensagem ||
          "E-mail cadastrado com sucesso na newsletter MOVE.ON!",
      );
    } catch (erro) {
      setCadastroConcluido(false);
      setMensagem((erro as Error).message);
    }
  }
  return (
    <section className="newsletter">
      <span>NEWSLETTER {nome}</span>
      <h2>Conteúdo novo, direto no seu e-mail.</h2>
      <p>Receba uma mensagem sempre que uma nova publicação for lançada.</p>
      <form onSubmit={inscrever}>
        <input
          className="newsletter-armadilha"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        <button>Quero receber</button>
      </form>
      {mensagem && (
        <small
          className={`newsletter-mensagem ${cadastroConcluido ? "sucesso" : "erro"}`}
          role={cadastroConcluido ? "status" : "alert"}
          aria-live="polite"
        >
          {mensagem}
        </small>
      )}
    </section>
  );
}

function Painel({
  administrador,
  aoSair,
}: {
  administrador: Administrador;
  aoSair: () => void;
}) {
  const telaInicial = (() => {
    const valor =
      typeof window !== "undefined"
        ? sessionStorage.getItem("moveon_tela_admin") || "inicio"
        : "inicio";
    return (
      [
        "inicio",
        "publicacoes",
        "editor",
        "categorias",
        "metricas",
        "configuracoes",
        "administrador",
        "newsletter",
        "parceiros",
        "contato",
        "integracoes",
        "consentimento",
        "politica_privacidade",
        "termos_uso",
      ] as Tela[]
    ).includes(valor as Tela)
      ? (valor as Tela)
      : "inicio";
  })();
  const [tela, setTela] = useState<Tela>(telaInicial),
    [publicacoes, setPublicacoes] = useState<Publicacao[]>([]),
    [proximoCursorPublicacoes, setProximoCursorPublicacoes] = useState<
      string | null
    >(null),
    [carregandoPublicacoes, setCarregandoPublicacoes] = useState(false),
    [categorias, setCategorias] = useState<Categoria[]>([]),
    [resumo, setResumo] = useState<any>(null),
    [metricas, setMetricas] = useState<any>(null),
    [config, setConfig] = useState<Configuracoes | null>(null),
    [parceiros, setParceiros] = useState<Parceiro[]>([]),
    [admin, setAdmin] = useState<Administrador>(administrador),
    [editando, setEditando] = useState<Publicacao | null>(null),
    [erro, setErro] = useState(""),
    [aviso, setAviso] = useState(""),
    [mensagensNovas, setMensagensNovas] = useState(0),
    [versaoContato, setVersaoContato] = useState(0);
  async function carregar() {
    try {
      setErro("");
      const [r, p, c] = await Promise.all([
        api<any>("/painel/resumo"),
        api<{ itens: Publicacao[]; proximoCursor: string | null }>(
          "/painel/publicacoes?limite=20",
        ),
        api<Categoria[]>("/painel/categorias"),
      ]);
      setResumo(r);
      setPublicacoes(p.itens);
      setProximoCursorPublicacoes(p.proximoCursor);
      setCategorias(c);
    } catch (e) {
      setErro((e as Error).message);
    }
  }
  async function carregarMaisPublicacoes() {
    if (!proximoCursorPublicacoes || carregandoPublicacoes) return;
    setCarregandoPublicacoes(true);
    try {
      const pagina = await api<{
        itens: Publicacao[];
        proximoCursor: string | null;
      }>(
        `/painel/publicacoes?limite=20&cursor=${encodeURIComponent(proximoCursorPublicacoes)}`,
      );
      setPublicacoes((atuais) => [
        ...atuais,
        ...pagina.itens.filter(
          (item) => !atuais.some((atual) => atual.id === item.id),
        ),
      ]);
      setProximoCursorPublicacoes(pagina.proximoCursor);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregandoPublicacoes(false);
    }
  }
  useEffect(() => {
    carregar();
    const timer = setInterval(() => {
      api<any>("/painel/resumo")
        .then(setResumo)
        .catch(() => undefined);
    }, 15000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const eventos = new EventSource("/api/painel/contato/eventos", {
      withCredentials: true,
    });
    const resumo = (evento: MessageEvent) =>
      setMensagensNovas(Number(JSON.parse(evento.data).totalNovas || 0));
    const contato = (evento: MessageEvent) => {
      const d = JSON.parse(evento.data);
      setMensagensNovas((v) => v + 1);
      setVersaoContato((v) => v + 1);
      notificar(`Nova mensagem de ${d.nome}.`);
    };
    eventos.addEventListener("resumo", resumo as EventListener);
    eventos.addEventListener("contato", contato as EventListener);
    return () => eventos.close();
  }, []);
  function notificar(m: string) {
    setAviso(m);
    setTimeout(() => setAviso(""), 2500);
  }
  const nav = (destino: Tela) => {
    setTela(destino);
    setErro("");
  };
  useEffect(() => {
    sessionStorage.setItem("moveon_tela_admin", tela);
    if (tela === "metricas")
      api<any>("/painel/metricas")
        .then(setMetricas)
        .catch((e) => setErro(e.message));
    if (tela === "configuracoes")
      api<Configuracoes>("/painel/configuracoes")
        .then(setConfig)
        .catch((e) => setErro(e.message));
    if (tela === "administrador")
      api<Administrador>("/painel/administrador")
        .then(setAdmin)
        .catch((e) => setErro(e.message));
    if (tela === "parceiros")
      api<Parceiro[]>("/painel/parceiros")
        .then(setParceiros)
        .catch((e) => setErro(e.message));
  }, [tela]);
  const itens: [Tela, string, React.ReactNode][] = [
    ["inicio", "Visão geral", <Home />],
    ["publicacoes", "Publicações", <BookOpen />],
    ["editor", "Nova publicação", <FilePenLine />],
    ["categorias", "Categorias", <FolderTree />],
    ["metricas", "Métricas", <BarChart3 />],
    ["newsletter", "Newsletter", <Mail />],
    ["contato", "Contato", <Inbox />],
    ["integracoes", "Integrações", <Cloud />],
    ["consentimento", "Consentimento", <ShieldCheck />],
    ["politica_privacidade", "Política Privacidade", <FileText />],
    ["termos_uso", "Termos de Uso", <FileText />],
    ["parceiros", "Parcerias", <Handshake />],
    ["configuracoes", "Portal", <Settings />],
    ["administrador", "Administrador", <UserRound />],
  ];
  return (
    <div className="dash2">
      <aside className="dash-nav">
        <div className="dash-brand">
          <img src="/logo.png" alt="MOVE.ON" />
          <small>CONTEÚDO / ADMIN</small>
        </div>
        <nav>
          {itens.map(([id, nome, icone]) => (
            <button
              key={id}
              className={tela === id ? "ativo" : ""}
              onClick={() => {
                if (id === "editor") setEditando(null);
                nav(id);
              }}
            >
              {icone}
              <span>{nome}</span>
              {id === "contato" && mensagensNovas > 0 && (
                <b className="badge-mensagens">
                  {mensagensNovas > 99 ? "99+" : mensagensNovas}
                </b>
              )}
            </button>
          ))}
        </nav>
        <button className="ver-site" onClick={aoSair}>
          <ArrowLeft />
          <span>Ver portal</span>
        </button>
        <button
          className="sair-admin"
          onClick={async () => {
            const resposta = await abrirModal({
              titulo: "Sair da administração?",
              mensagem: "Sua sessão será encerrada com segurança.",
              confirmar: "Sair",
              perigo: true,
            });
            if (resposta !== false) {
              await api("/autenticacao/sair", { method: "POST" });
              sessionStorage.removeItem("moveon_tela_admin");
              location.href = "/admin";
            }
          }}
        >
          <LogIn />
          <span>Deslogar</span>
        </button>
      </aside>
      <div className="dash-area">
        <header className="dash-header">
          <div>
            <small>DASHBOARD EM TEMPO REAL</small>
            <h1>{itens.find((i) => i[0] === tela)?.[1]}</h1>
          </div>
          <div className="dash-user">
            <div>
              <b>{admin.nome}</b>
              <span>{admin.email}</span>
            </div>
            {admin.caminhoFoto ? (
              <img
                className="avatar-foto"
                src={admin.caminhoFoto}
                alt="Foto do administrador"
                onError={(evento) => {
                  evento.currentTarget.hidden = true;
                }}
                onLoad={(evento) => {
                  evento.currentTarget.hidden = false;
                }}
              />
            ) : (
              <strong>{admin.nome.slice(0, 2).toUpperCase()}</strong>
            )}
          </div>
        </header>
        <main className="dash-conteudo">
          {erro && <div className="erro-api">{erro}</div>}
          {tela === "inicio" && <Inicio resumo={resumo} nav={nav} />}{" "}
          {tela === "publicacoes" && (
            <Publicacoes
              itens={publicacoes}
              editar={async (p) => {
                const completa = await api<Publicacao>(
                  `/painel/publicacoes/${p.id}`,
                );
                setEditando(completa);
                setTela("editor");
              }}
              excluir={async (p) => {
                const resposta = await abrirModal({
                  titulo: "Excluir publicação?",
                  mensagem: `“${p.titulo}” e sua imagem de capa armazenada serão removidas definitivamente.`,
                  confirmar: "Excluir",
                  perigo: true,
                });
                if (resposta !== false) {
                  await api(`/painel/publicacoes/${p.id}`, {
                    method: "DELETE",
                  });
                  await carregar();
                  notificar("Publicação excluída.");
                }
              }}
              nova={() => {
                setEditando(null);
                setTela("editor");
              }}
              carregarMais={carregarMaisPublicacoes}
              temMais={Boolean(proximoCursorPublicacoes)}
              carregandoMais={carregandoPublicacoes}
            />
          )}
          {tela === "editor" && (
            <Editor
              publicacao={editando}
              categorias={categorias}
              salvo={async () => {
                await carregar();
                setTela("publicacoes");
                notificar("Publicação salva no banco.");
              }}
            />
          )}
          {tela === "categorias" && (
            <Categorias
              itens={categorias}
              atualizar={async () => {
                await carregar();
                notificar("Categorias atualizadas.");
              }}
            />
          )}
          {tela === "metricas" && <Metricas dados={metricas} />}{" "}
          {tela === "parceiros" && (
            <GestaoParceiros
              itens={parceiros}
              atualizar={async () => {
                setParceiros(await api<Parceiro[]>("/painel/parceiros"));
                notificar("Parceiros atualizados.");
              }}
            />
          )}
          {tela === "configuracoes" && config && (
            <Configuracao
              dados={config}
              salvo={() => notificar("Configurações salvas.")}
            />
          )}{" "}
          {tela === "administrador" && (
            <DadosAdmin
              dados={admin}
              mudou={(a) => {
                setAdmin(a);
                notificar("Administrador atualizado.");
              }}
            />
          )}
          {tela === "newsletter" && <PainelNewsletter />}
          {tela === "contato" && (
            <PainelContato versao={versaoContato} aoLer={setMensagensNovas} />
          )}
          {tela === "integracoes" && (
            <Suspense
              fallback={
                <div className="tela-estado">Carregando integrações…</div>
              }
            >
              <PainelIntegracoes />
            </Suspense>
          )}
          {tela === "consentimento" && (
            <Suspense fallback={<div className="tela-estado">Carregando…</div>}>
              <PainelConteudoLegal tipo="consentimento" />
            </Suspense>
          )}
          {tela === "politica_privacidade" && (
            <Suspense fallback={<div className="tela-estado">Carregando…</div>}>
              <PainelConteudoLegal tipo="privacidade" />
            </Suspense>
          )}
          {tela === "termos_uso" && (
            <Suspense fallback={<div className="tela-estado">Carregando…</div>}>
              <PainelConteudoLegal tipo="termos" />
            </Suspense>
          )}
        </main>
      </div>
      {aviso && <div className="toast">{aviso}</div>}
    </div>
  );
}

function Inicio({ resumo, nav }: { resumo: any; nav: (t: Tela) => void }) {
  if (!resumo) return <div className="tela-estado">Consultando métricas…</div>;
  const m = resumo.metricas;
  return (
    <>
      <div className="dash-stats">
        {[
          [m.acessos_mes, "Acessos no mês", <Eye />],
          [m.leitores_unicos, "Leitores únicos", <UserRound />],
          [m.publicacoes, "Publicações", <BookOpen />],
          [m.categorias, "Categorias", <FolderTree />],
        ].map(([v, l, i]) => (
          <div className="stat2" key={String(l)}>
            <strong>{Number(v).toLocaleString("pt-BR")}</strong>
            <span>{l}</span>
            <div>{i}</div>
          </div>
        ))}
      </div>
      <div className="dash-duas-colunas">
        <div className="dash-card">
          <div className="card-head2">
            <div>
              <small>ÚLTIMOS 7 DIAS</small>
              <h2>Acessos válidos</h2>
            </div>
          </div>
          <Grafico serie={resumo.serie} />
        </div>
        <div className="dash-card atalhos2">
          <h2>Ações rápidas</h2>
          <button onClick={() => nav("editor")}>
            <Plus />
            <span>
              Nova publicação<small>Criar conteúdo no banco</small>
            </span>
          </button>
          <button onClick={() => nav("categorias")}>
            <FolderTree />
            <span>
              Categorias<small>Organizar assuntos</small>
            </span>
          </button>
          <button onClick={() => nav("metricas")}>
            <BarChart3 />
            <span>
              Métricas<small>Dados sem acessos administrativos</small>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
function Grafico({ serie = [] }: { serie: any[] }) {
  const max = Math.max(1, ...serie.map((x) => Number(x.acessos)));
  return (
    <div className="barras2">
      {serie.map((x) => (
        <div key={x.dia}>
          <span
            style={{
              height: `${Math.max(3, (Number(x.acessos) / max) * 100)}%`,
            }}
            title={`${x.acessos} acessos`}
          />
          <small>{x.dia}</small>
        </div>
      ))}
    </div>
  );
}
function Publicacoes({
  itens,
  editar,
  excluir,
  nova,
  carregarMais,
  temMais,
  carregandoMais,
}: {
  itens: Publicacao[];
  editar: (p: Publicacao) => void;
  excluir: (p: Publicacao) => void;
  nova: () => void;
  carregarMais: () => void;
  temMais: boolean;
  carregandoMais: boolean;
}) {
  const [q, setQ] = useState("");
  const sentinelaPublicacoes = useRef<HTMLDivElement>(null);
  const lista = itens.filter((p) =>
    p.titulo.toLowerCase().includes(q.toLowerCase()),
  );
  useEffect(() => {
    const elemento = sentinelaPublicacoes.current;
    if (!elemento || !temMais || carregandoMais || q) return;
    const observador = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && carregarMais(),
      { rootMargin: "240px" },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [temMais, carregandoMais, q, carregarMais]);
  return (
    <section className="dash-card tabela2">
      <div className="card-head2">
        <div>
          <small>BANCO DE DADOS</small>
          <h2>Todas as publicações</h2>
        </div>
        <button className="salvar2" onClick={nova}>
          <Plus /> Nova
        </button>
      </div>
      <div className="lista-tools">
        <label>
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar publicação"
          />
        </label>
      </div>
      {lista.length ? (
        lista.map((p) => (
          <div className="linha2" key={p.id}>
            <img src={p.imagemCapaUrl || imagemPadrao} alt="" />
            <div className="titulo-post2">
              <b>{p.titulo}</b>
              <span>
                {nomesCategorias(p).join(", ") || "Sem categoria"} ·{" "}
                {dataBrasil(p.publicadoEm || p.criadoEm)}
              </span>
            </div>
            <em className={p.situacao}>{p.situacao}</em>
            <strong>{p.acessos || 0} acessos</strong>
            <div className="acoes-linha">
              <button title="Editar" onClick={() => editar(p)}>
                <Pencil />
              </button>
              <button title="Excluir" onClick={() => excluir(p)}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="vazio">Nenhuma publicação cadastrada.</div>
      )}
      {temMais && !q && (
        <div className="sentinela-publicacoes-admin" ref={sentinelaPublicacoes}>
          <button
            type="button"
            className="carregar-mais-admin"
            onClick={carregarMais}
            disabled={carregandoMais}
          >
            {carregandoMais ? "Carregando…" : "Carregar mais publicações"}
          </button>
        </div>
      )}
    </section>
  );
}

const EditorRico = memo(
  function EditorRico({
    valor,
    aoAlterar,
  }: {
    valor: string;
    aoAlterar: (html: string) => void;
  }) {
    const area = useRef<HTMLDivElement>(null);
    const selecaoSalva = useRef<Range | null>(null);
    const [midiaSelecionada, setMidiaSelecionada] =
      useState<HTMLElement | null>(null);
    const [linkSelecionado, setLinkSelecionado] =
      useState<HTMLAnchorElement | null>(null);
    useEffect(() => {
      if (area.current) area.current.innerHTML = valor;
    }, []);
    const htmlLimpo = () => {
      if (!area.current) return "";
      const copia = area.current.cloneNode(true) as HTMLElement;
      copia
        .querySelectorAll(".alca-redimensionamento")
        .forEach((item) => item.remove());
      copia
        .querySelectorAll(".midia-redimensionando")
        .forEach((item) => item.classList.remove("midia-redimensionando"));
      copia.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (/^https?:\/\//i.test(href)) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        } else {
          link.removeAttribute("target");
          link.removeAttribute("rel");
        }
      });
      return copia.innerHTML;
    };
    const salvarSelecao = () => {
      const selecao = window.getSelection();
      if (selecao?.rangeCount && area.current?.contains(selecao.anchorNode))
        selecaoSalva.current = selecao.getRangeAt(0).cloneRange();
    };
    const restaurarSelecao = () => {
      if (!selecaoSalva.current) return;
      const selecao = window.getSelection();
      selecao?.removeAllRanges();
      selecao?.addRange(selecaoSalva.current);
    };
    const recipienteMidiaDoNo = (no: Node | null) => {
      const elemento = no instanceof Element ? no : no?.parentElement || null;
      return elemento?.closest(
        "figure, .video-conteudo, .midia-redimensionavel",
      ) as HTMLElement | null;
    };
    const blocoTextoDaSelecao = () => {
      const intervalo = selecaoSalva.current;
      if (!intervalo || !area.current) return null;
      const elemento =
        intervalo.startContainer instanceof Element
          ? intervalo.startContainer
          : intervalo.startContainer.parentElement;
      const bloco = elemento?.closest(
        "p, h1, h2, h3, h4, h5, h6, blockquote, li, pre, div",
      ) as HTMLElement | null;
      return bloco && bloco !== area.current && area.current.contains(bloco)
        ? bloco
        : null;
    };
    const intervaloSelecionaElemento = (
      intervalo: Range | null,
      elemento: HTMLElement,
    ) => {
      if (!intervalo) return false;
      if (recipienteMidiaDoNo(intervalo.startContainer) === elemento)
        return true;
      if (intervalo.startContainer !== intervalo.endContainer) return false;
      if (intervalo.endOffset - intervalo.startOffset !== 1) return false;
      return (
        intervalo.startContainer.childNodes[intervalo.startOffset] === elemento
      );
    };
    const executar = (
      comando: string,
      argumento?: string,
      usarEstilosCss = true,
    ) => {
      area.current?.focus();
      restaurarSelecao();
      document.execCommand(
        "styleWithCSS",
        false,
        usarEstilosCss ? "true" : "false",
      );
      document.execCommand(comando, false, argumento);
      aoAlterar(htmlLimpo());
      salvarSelecao();
    };
    const tamanhoFonte = (tamanho: string) => {
      executar("fontSize", "7", false);
      area.current?.querySelectorAll('font[size="7"]').forEach((elemento) => {
        const fonte = elemento as HTMLElement;
        fonte.removeAttribute("size");
        fonte.style.fontSize = `${tamanho}px`;
      });
      aoAlterar(htmlLimpo());
      salvarSelecao();
    };
    const selecionarElemento = (alvo: EventTarget | null) => {
      if (!(alvo instanceof Element)) return;
      const link = alvo.closest("a") as HTMLAnchorElement | null;
      setLinkSelecionado(link && area.current?.contains(link) ? link : null);
      area.current
        ?.querySelectorAll(".midia-redimensionando")
        .forEach((item) => item.classList.remove("midia-redimensionando"));
      area.current
        ?.querySelectorAll(".alca-redimensionamento")
        .forEach((item) => item.remove());
      const elemento = alvo.closest("img, iframe, .video-conteudo");
      if (!elemento || !area.current?.contains(elemento)) {
        setMidiaSelecionada(null);
        return;
      }
      let recipiente = elemento.closest(
        "figure, .video-conteudo, .midia-redimensionavel",
      ) as HTMLElement | null;
      if (!recipiente && elemento instanceof HTMLImageElement) {
        recipiente = document.createElement("span");
        recipiente.className = "midia-redimensionavel";
        elemento.parentNode?.insertBefore(recipiente, elemento);
        recipiente.appendChild(elemento);
      }
      if (!recipiente) return;
      const largura = Math.round(recipiente.getBoundingClientRect().width);
      recipiente.style.width = `${Math.min(1600, Math.max(120, largura))}px`;
      recipiente.classList.add("midia-redimensionando");
      const alca = document.createElement("span");
      alca.className = "alca-redimensionamento";
      alca.contentEditable = "false";
      alca.setAttribute("role", "slider");
      alca.setAttribute("aria-label", "Arraste para redimensionar a mídia");
      alca.title = "Arraste para redimensionar";
      recipiente.appendChild(alca);
      const intervaloMidia = document.createRange();
      intervaloMidia.selectNode(recipiente);
      selecaoSalva.current = intervaloMidia;
      setMidiaSelecionada(recipiente);
    };
    const atualizarDimensoesInternas = (
      recipiente: HTMLElement,
      largura: number,
    ) => {
      const midia = recipiente.querySelector(
        "img, iframe",
      ) as HTMLElement | null;
      if (!midia) return;
      midia.setAttribute("width", String(largura));
      midia.style.width = "100%";
      midia.style.maxWidth = "100%";
      if (midia.tagName === "IFRAME") {
        midia.setAttribute("height", String(Math.round((largura * 9) / 16)));
        midia.style.height = "100%";
      }
    };
    const iniciarRedimensionamento = (
      evento: React.PointerEvent<HTMLDivElement>,
    ) => {
      const alvo = (evento.target as Element).closest(
        ".alca-redimensionamento",
      );
      if (!alvo) return;
      evento.preventDefault();
      evento.stopPropagation();
      const recipiente = alvo.parentElement as HTMLElement;
      const inicioX = evento.clientX;
      const larguraInicial = recipiente.getBoundingClientRect().width;
      const larguraMaxima = Math.min(1600, area.current?.clientWidth || 1600);
      const mover = (movimento: PointerEvent) => {
        const largura = Math.round(
          Math.min(
            larguraMaxima,
            Math.max(120, larguraInicial + movimento.clientX - inicioX),
          ),
        );
        recipiente.style.width = `${largura}px`;
        atualizarDimensoesInternas(recipiente, largura);
      };
      const encerrar = () => {
        document.removeEventListener("pointermove", mover);
        document.removeEventListener("pointerup", encerrar);
        aoAlterar(htmlLimpo());
      };
      document.addEventListener("pointermove", mover);
      document.addEventListener("pointerup", encerrar, { once: true });
    };
    const posicionarMidia = (
      alinhamento: "esquerda" | "centro" | "direita",
    ) => {
      if (!midiaSelecionada) return;
      const recipiente = midiaSelecionada;
      recipiente.classList.remove(
        "alinha-esquerda",
        "alinha-centro",
        "alinha-direita",
      );
      recipiente.classList.add(`alinha-${alinhamento}`);
      recipiente.dataset.alinhamento = alinhamento;
      recipiente.classList.remove("midia-redimensionando");
      recipiente.querySelector(".alca-redimensionamento")?.remove();
      let paragrafo = recipiente.nextElementSibling as HTMLElement | null;
      if (!paragrafo || paragrafo.tagName !== "P") {
        paragrafo = document.createElement("p");
        paragrafo.appendChild(document.createElement("br"));
        recipiente.insertAdjacentElement("afterend", paragrafo);
      }
      paragrafo.style.textAlign = "left";
      const intervalo = document.createRange();
      intervalo.selectNodeContents(paragrafo);
      intervalo.collapse(true);
      const selecao = window.getSelection();
      selecao?.removeAllRanges();
      selecao?.addRange(intervalo);
      selecaoSalva.current = intervalo.cloneRange();
      setMidiaSelecionada(null);
      aoAlterar(htmlLimpo());
      area.current?.focus();
    };
    const ajustarAlinhamento = (
      comando: "justifyLeft" | "justifyCenter" | "justifyRight",
      alinhamento: "esquerda" | "centro" | "direita",
    ) => {
      if (
        midiaSelecionada &&
        intervaloSelecionaElemento(selecaoSalva.current, midiaSelecionada)
      ) {
        posicionarMidia(alinhamento);
        return;
      }
      if (midiaSelecionada) {
        midiaSelecionada.classList.remove("midia-redimensionando");
        midiaSelecionada.querySelector(".alca-redimensionamento")?.remove();
        setMidiaSelecionada(null);
      }
      executar(comando);
      const bloco = blocoTextoDaSelecao();
      if (bloco)
        bloco.style.textAlign =
          alinhamento === "centro"
            ? "center"
            : alinhamento === "direita"
              ? "right"
              : "left";
      aoAlterar(htmlLimpo());
    };
    const tratarEnter = (evento: React.KeyboardEvent<HTMLDivElement>) => {
      if (evento.key !== "Enter") return;
      const selecao = window.getSelection();
      const recipiente = recipienteMidiaDoNo(selecao?.anchorNode || null);
      if (!recipiente || !area.current?.contains(recipiente)) return;
      evento.preventDefault();
      const paragrafo = document.createElement("p");
      paragrafo.style.textAlign = "left";
      paragrafo.appendChild(document.createElement("br"));
      recipiente.insertAdjacentElement("afterend", paragrafo);
      const intervalo = document.createRange();
      intervalo.setStart(paragrafo, 0);
      intervalo.collapse(true);
      selecao?.removeAllRanges();
      selecao?.addRange(intervalo);
      selecaoSalva.current = intervalo.cloneRange();
      recipiente.classList.remove("midia-redimensionando");
      recipiente.querySelector(".alca-redimensionamento")?.remove();
      setMidiaSelecionada(null);
      aoAlterar(htmlLimpo());
    };
    const removerLinkSelecionado = () => {
      if (!linkSelecionado) return;
      linkSelecionado.replaceWith(...Array.from(linkSelecionado.childNodes));
      setLinkSelecionado(null);
      aoAlterar(htmlLimpo());
    };
    const inserirLink = async () => {
      const resposta = await abrirModal({
        titulo: "Inserir link",
        mensagem: "O link será aberto em uma nova janela.",
        confirmar: "Inserir",
        campos: [{ nome: "url", rotulo: "Endereço HTTPS", tipo: "url" }],
      });
      if (resposta) {
        try {
          const url = new URL(resposta.url);
          if (url.protocol !== "https:" && url.protocol !== "http:")
            throw new Error();
          executar("createLink", url.href);
        } catch {
          await abrirModal({
            titulo: "Link inválido",
            mensagem: "Informe um endereço HTTP ou HTTPS válido.",
            confirmar: "Entendi",
          });
        }
      }
    };
    const inserirImagem = async () => {
      const resposta = await abrirModal({
        titulo: "Inserir imagem no conteúdo",
        mensagem:
          "Informe a imagem, sua descrição acessível e o tamanho inicial.",
        confirmar: "Inserir imagem",
        campos: [
          { nome: "url", rotulo: "URL HTTPS", tipo: "url" },
          { nome: "alt", rotulo: "Descrição da imagem" },
          {
            nome: "largura",
            rotulo: "Largura em pixels",
            valor: "800",
            tipo: "number",
          },
        ],
      });
      if (!resposta) return;
      const endereco = new URL(resposta.url);
      if (!/^https?:$/.test(endereco.protocol)) return;
      const url = endereco.href,
        alt = resposta.alt.replace(/[<>"']/g, ""),
        largura = String(
          Math.min(1600, Math.max(120, Number(resposta.largura) || 800)),
        );
      executar(
        "insertHTML",
        `<figure class="midia-conteudo"><img src="${url}" alt="${alt.replace(/[<>"]/g, "")}" width="${largura}"><figcaption>${alt.replace(/[<>]/g, "")}</figcaption></figure><p><br></p>`,
      );
    };
    const inserirVideo = async () => {
      const resposta = await abrirModal({
        titulo: "Inserir vídeo",
        mensagem: "Use um endereço do YouTube ou Vimeo.",
        confirmar: "Inserir vídeo",
        campos: [
          { nome: "url", rotulo: "URL do vídeo", tipo: "url" },
          {
            nome: "largura",
            rotulo: "Largura em pixels",
            valor: "800",
            tipo: "number",
          },
        ],
      });
      if (!resposta) return;
      let url = resposta.url,
        largura = String(
          Math.min(1600, Math.max(120, Number(resposta.largura) || 800)),
        );
      url = url
        .replace("youtu.be/", "www.youtube.com/embed/")
        .replace("youtube.com/watch?v=", "youtube.com/embed/")
        .replace("vimeo.com/", "player.vimeo.com/video/");
      executar(
        "insertHTML",
        `<div class="video-conteudo"><iframe src="${url}" title="Vídeo incorporado" width="${largura}" height="450" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><p><br></p>`,
      );
    };
    const botao = (
      titulo: string,
      icone: React.ReactNode,
      acao: () => void,
    ) => (
      <button
        type="button"
        title={titulo}
        aria-label={titulo}
        onMouseDown={(e) => e.preventDefault()}
        onClick={acao}
      >
        {icone}
      </button>
    );
    return (
      <div className="editor-rico">
        <div
          className="toolbar-rica"
          role="toolbar"
          aria-label="Formatação do conteúdo"
        >
          <div>
            {botao("Desfazer", <Undo2 />, () => executar("undo"))}
            {botao("Refazer", <Redo2 />, () => executar("redo"))}
          </div>
          <div>
            {botao("Título 2", <Heading2 />, () =>
              executar("formatBlock", "h2"),
            )}
            {botao("Título 3", <Heading3 />, () =>
              executar("formatBlock", "h3"),
            )}
            {botao("Parágrafo", <span>P</span>, () =>
              executar("formatBlock", "p"),
            )}
          </div>
          <div>
            {botao("Negrito", <Bold />, () => executar("bold"))}
            {botao("Itálico", <Italic />, () => executar("italic"))}
            {botao("Sublinhado", <Underline />, () => executar("underline"))}
            {botao("Tachado", <Strikethrough />, () =>
              executar("strikeThrough"),
            )}
          </div>
          <div>
            {botao("Alinhar à esquerda", <AlignLeft />, () =>
              ajustarAlinhamento("justifyLeft", "esquerda"),
            )}
            {botao("Centralizar", <AlignCenter />, () =>
              ajustarAlinhamento("justifyCenter", "centro"),
            )}
            {botao("Alinhar à direita", <AlignRight />, () =>
              ajustarAlinhamento("justifyRight", "direita"),
            )}
            {botao("Justificar texto", <AlignJustify />, () =>
              executar("justifyFull"),
            )}
          </div>
          <div>
            {botao("Lista com marcadores", <List />, () =>
              executar("insertUnorderedList"),
            )}
            {botao("Lista numerada", <ListOrdered />, () =>
              executar("insertOrderedList"),
            )}
            {botao("Citação", <Quote />, () =>
              executar("formatBlock", "blockquote"),
            )}
            {botao("Bloco de código", <Code2 />, () =>
              executar("formatBlock", "pre"),
            )}
          </div>
          <div>
            {botao("Inserir link", <Link />, inserirLink)}
            {botao("Remover link", <Link2Off />, () => executar("unlink"))}
            {botao("Inserir imagem", <Image />, inserirImagem)}
            {botao("Inserir vídeo", <Video />, inserirVideo)}
            {botao("Limpar formatação", <RemoveFormatting />, () =>
              executar("removeFormat"),
            )}
          </div>
          <div className="controles-tipografia">
            <select
              aria-label="Tipo da fonte"
              defaultValue=""
              onMouseDown={salvarSelecao}
              onChange={(e) => {
                if (e.target.value) executar("fontName", e.target.value, false);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Fonte
              </option>
              <option>Arial</option>
              <option>Verdana</option>
              <option>Tahoma</option>
              <option>Trebuchet MS</option>
              <option>Georgia</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
              <option value="system-ui">Sistema</option>
            </select>
            <select
              aria-label="Tamanho da fonte"
              defaultValue=""
              onMouseDown={salvarSelecao}
              onChange={(e) => {
                if (e.target.value) tamanhoFonte(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Tamanho
              </option>
              {[12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map((t) => (
                <option key={t} value={t}>
                  {t}px
                </option>
              ))}
            </select>
            <label title="Cor do texto">
              A
              <input
                type="color"
                defaultValue="#111111"
                onMouseDown={salvarSelecao}
                onChange={(e) => executar("foreColor", e.target.value, false)}
              />
            </label>
            <label title="Cor de fundo">
              Fundo
              <input
                type="color"
                defaultValue="#fff2a8"
                onMouseDown={salvarSelecao}
                onChange={(e) => executar("hiliteColor", e.target.value)}
              />
            </label>
          </div>
        </div>
        {linkSelecionado && (
          <div className="link-contextual" role="status">
            <Link />
            <span title={linkSelecionado.href}>{linkSelecionado.href}</span>
            <button type="button" onClick={removerLinkSelecionado}>
              <Link2Off /> Remover link
            </button>
          </div>
        )}
        <div
          ref={area}
          className="area-editor-rico"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Comece a escrever sua publicação aqui…"
          onInput={() => aoAlterar(htmlLimpo())}
          onMouseUp={salvarSelecao}
          onPointerDown={iniciarRedimensionamento}
          onKeyDown={tratarEnter}
          onKeyUp={salvarSelecao}
          onClick={(e) => {
            if ((e.target as Element).closest(".alca-redimensionamento")) {
              e.preventDefault();
              return;
            }
            if ((e.target as Element).closest("a")) e.preventDefault();
            selecionarElemento(e.target);
          }}
        />
      </div>
    );
  },
  () => true,
);

function Editor({
  publicacao,
  categorias,
  salvo,
}: {
  publicacao: Publicacao | null;
  categorias: Categoria[];
  salvo: () => void;
}) {
  const [form, setForm] = useState({
      titulo: publicacao?.titulo || "",
      resumo: publicacao?.resumo || "",
      conteudo: publicacao ? texto(publicacao) : "",
      situacao: publicacao?.situacao || "rascunho",
      destaque: publicacao?.destaque || false,
      categorias:
        publicacao?.categorias.map((c) => (typeof c === "string" ? c : c.id)) ||
        [],
      imagemCapaUrl: publicacao?.imagemCapaUrl || "",
      imagemSocialUrl:
        publicacao?.imagemSocialUrl || publicacao?.imagemCapaUrl || "",
      textoAlternativoCapa:
        publicacao?.textoAlternativoCapa || publicacao?.titulo || "",
      agendadoPara: publicacao?.agendadoPara
        ? new Date(publicacao.agendadoPara).toISOString().slice(0, 16)
        : "",
      metatitulo: publicacao?.metatitulo || "",
      metadescricao: publicacao?.metadescricao || "",
    }),
    [erro, setErro] = useState(""),
    [enviando, setEnviando] = useState(false),
    [enviandoCapa, setEnviandoCapa] = useState(false),
    [enviandoVideo, setEnviandoVideo] = useState(false),
    [versaoEditor, setVersaoEditor] = useState(0),
    [previsualizacaoCapaLocal, setPrevisualizacaoCapaLocal] = useState(""),
    [arquivoCapa, setArquivoCapa] = useState<{
      nome: string;
      tamanho: number;
    } | null>(null),
    [visualizando, setVisualizando] = useState(false);
  useEffect(
    () => () => {
      if (previsualizacaoCapaLocal)
        URL.revokeObjectURL(previsualizacaoCapaLocal);
    },
    [previsualizacaoCapaLocal],
  );
  async function selecionarCapa(arquivo?: File) {
    if (!arquivo) return;
    setErro("");
    setPrevisualizacaoCapaLocal((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return URL.createObjectURL(arquivo);
    });
    setArquivoCapa({ nome: arquivo.name, tamanho: arquivo.size });
    setEnviandoCapa(true);
    try {
      const imagem = await enviarImagemCapa(arquivo);
      setForm((atual) => ({
        ...atual,
        imagemCapaUrl: imagem.caminho,
        imagemSocialUrl: imagem.caminhoSocial,
      }));
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviandoCapa(false);
    }
  }
  async function selecionarVideo(arquivo?: File) {
    if (!arquivo) return;
    setEnviandoVideo(true);
    setErro("");
    try {
      const dados = new FormData();
      dados.append("video", arquivo);
      const resposta = await fetch("/api/painel/uploads/videos", {
        method: "POST",
        credentials: "include",
        body: dados,
      });
      const corpo = (await resposta.json()) as {
        caminho?: string;
        erro?: string;
      };
      if (!resposta.ok || !corpo.caminho)
        throw new Error(corpo.erro || "Não foi possível enviar o vídeo.");
      const urlVideo = new URL(corpo.caminho, window.location.origin)
        .toString()
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;");
      setForm((atual) => ({
        ...atual,
        conteudo: `${atual.conteudo}<figure class="media"><oembed url="${urlVideo}"></oembed></figure><p><br></p>`,
      }));
      setVersaoEditor((versao) => versao + 1);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviandoVideo(false);
    }
  }
  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!form.conteudo.replace(/<[^>]*>/g, "").trim()) {
      setErro("Escreva o conteúdo da publicação.");
      return;
    }
    setEnviando(true);
    setErro("");
    try {
      const corpo = {
        ...form,
        agendadoPara:
          form.situacao === "agendada" && form.agendadoPara
            ? new Date(form.agendadoPara).toISOString()
            : null,
      };
      await api(`/painel/publicacoes${publicacao ? `/${publicacao.id}` : ""}`, {
        method: publicacao ? "PUT" : "POST",
        body: JSON.stringify(corpo),
      });
      salvo();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }
  return (
    <form className="novo-editor" onSubmit={enviar}>
      <div className="editor-top">
        <div>
          <h2>{publicacao ? "Editar publicação" : "Criar publicação"}</h2>
          <p>
            Formate textos e insira mídias; o backend higieniza todo o HTML
            antes de salvar.
          </p>
        </div>
        <div className="acoes-editor-publicacao">
          <button type="button" onClick={() => setVisualizando(true)}>
            <Eye /> Visualizar
          </button>
          <button className="salvar2" disabled={enviando}>
            {enviando ? "Salvando…" : "Salvar publicação"}
          </button>
        </div>
      </div>
      {visualizando && (
        <div
          className="preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Prévia da publicação"
        >
          <div className="preview-publicacao">
            <button
              type="button"
              className="fechar-preview"
              onClick={() => setVisualizando(false)}
            >
              <X /> Fechar prévia
            </button>
            <span>PRÉ-VISUALIZAÇÃO — NÃO PUBLICADA</span>
            <h1>{form.titulo || "Título da publicação"}</h1>
            <p>{form.resumo || "O resumo aparecerá aqui."}</p>
            {(previsualizacaoCapaLocal || form.imagemCapaUrl) && (
              <img
                src={
                  previsualizacaoCapaLocal ||
                  urlImagemExibicao(form.imagemCapaUrl)
                }
                alt="Prévia da capa"
              />
            )}
            <iframe
              sandbox=""
              title="Conteúdo da prévia"
              srcDoc={`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>body{font:20px/1.75 Georgia,serif;color:#171717;padding:24px;margin:auto;max-width:900px}img,iframe{max-width:100%;height:auto}blockquote{border-left:5px solid #fe3000;padding:16px;background:#f5f5f5}pre{padding:18px;background:#111;color:#fff;overflow:auto}h2,h3{font-family:Arial,sans-serif}figure.media[data-largura-video]{display:block;margin:24px auto;max-width:100%}figure.media[data-largura-video="25"]{width:25%}figure.media[data-largura-video="50"]{width:50%}figure.media[data-largura-video="75"]{width:75%}figure.media[data-largura-video="100"]{width:100%}</style></head><body>${form.conteudo}</body></html>`}
            />
          </div>
        </div>
      )}
      {erro && <div className="erro-api">{erro}</div>}
      <div className="editor-grid2">
        <div className="dash-card editor-principal">
          <label>
            Título
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </label>
          <label>
            Resumo
            <textarea
              value={form.resumo}
              onChange={(e) => setForm({ ...form, resumo: e.target.value })}
              required
              rows={4}
            />
          </label>
          <label>Conteúdo</label>
          <Suspense
            fallback={
              <div className="carregando-editor" role="status">
                Carregando ferramentas de edição…
              </div>
            }
          >
            <EditorPublicacaoCompleto
              key={`${publicacao?.id || "nova-publicacao"}-${versaoEditor}`}
              valor={form.conteudo}
              aoAlterar={(conteudo) =>
                setForm((atual) => ({ ...atual, conteudo }))
              }
            />
          </Suspense>
          <label className="campo-capa upload-capa">
            Enviar vídeo ao conteúdo
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              disabled={enviandoVideo}
              onChange={(e) => void selecionarVideo(e.target.files?.[0])}
            />
            <span>
              {enviandoVideo
                ? "Enviando vídeo…"
                : "MP4, WebM ou MOV — requer storage S3 ativo"}
            </span>
          </label>
          <label className="campo-capa upload-capa">
            Enviar imagem de capa
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => selecionarCapa(e.target.files?.[0])}
              disabled={enviandoCapa}
            />
            <span>
              {enviandoCapa
                ? "Enviando e validando…"
                : arquivoCapa
                  ? `${arquivoCapa.nome} — ${formatarTamanhoArquivo(arquivoCapa.tamanho)}`
                  : "JPEG, PNG, WebP ou AVIF"}
            </span>
          </label>
          <div className="separador-capa">
            <span>OU</span>
          </div>
          <label className="campo-capa">
            Usar imagem por link
            <input
              type="url"
              value={
                form.imagemCapaUrl.startsWith("/uploads/")
                  ? ""
                  : form.imagemCapaUrl
              }
              onChange={(e) => {
                if (previsualizacaoCapaLocal)
                  URL.revokeObjectURL(previsualizacaoCapaLocal);
                setPrevisualizacaoCapaLocal("");
                setArquivoCapa(null);
                setForm({
                  ...form,
                  imagemCapaUrl: e.target.value,
                  imagemSocialUrl: e.target.value,
                });
              }}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </label>
          {(previsualizacaoCapaLocal || form.imagemCapaUrl) && (
            <div className="preview-capa">
              <img
                src={
                  previsualizacaoCapaLocal ||
                  urlImagemExibicao(form.imagemCapaUrl)
                }
                alt="Prévia da capa"
                onError={() =>
                  setErro(
                    "Não foi possível carregar a prévia da imagem. Selecione o arquivo novamente.",
                  )
                }
              />
              <button
                type="button"
                onClick={() => {
                  if (previsualizacaoCapaLocal)
                    URL.revokeObjectURL(previsualizacaoCapaLocal);
                  setPrevisualizacaoCapaLocal("");
                  setArquivoCapa(null);
                  setForm({ ...form, imagemCapaUrl: "", imagemSocialUrl: "" });
                }}
              >
                Remover capa
              </button>
            </div>
          )}
          <label className="campo-capa">
            Texto alternativo da capa (acessibilidade e SEO)
            <input
              value={form.textoAlternativoCapa}
              onChange={(e) =>
                setForm({ ...form, textoAlternativoCapa: e.target.value })
              }
              maxLength={300}
              placeholder="Descreva objetivamente o que aparece na imagem"
            />
          </label>
        </div>
        <aside className="dash-card opcoes-editor">
          <h3>Publicação</h3>
          <label>
            Status
            <select
              value={form.situacao}
              onChange={(e) =>
                setForm({
                  ...form,
                  situacao: e.target.value,
                  agendadoPara:
                    e.target.value === "agendada" ? form.agendadoPara : "",
                })
              }
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicada">Publicada</option>
              <option value="agendada">Agendada</option>
              <option value="arquivada">Arquivada</option>
            </select>
          </label>
          {form.situacao === "agendada" && (
            <label>
              Data e hora
              <input
                type="datetime-local"
                value={form.agendadoPara}
                onChange={(e) =>
                  setForm({ ...form, agendadoPara: e.target.value })
                }
                required
              />
            </label>
          )}
          <fieldset>
            <legend>Categorias</legend>
            {categorias.map((c) => (
              <button
                type="button"
                key={c.id}
                className={form.categorias.includes(c.id) ? "selecionada" : ""}
                onClick={() =>
                  setForm({
                    ...form,
                    categorias: form.categorias.includes(c.id)
                      ? form.categorias.filter((x) => x !== c.id)
                      : [...form.categorias, c.id],
                  })
                }
              >
                {c.nome}
              </button>
            ))}
          </fieldset>
          <label className="check-real">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            />{" "}
            Publicação em destaque
          </label>
        </aside>
      </div>
    </form>
  );
}

function Categorias({
  itens,
  atualizar,
}: {
  itens: Categoria[];
  atualizar: () => void;
}) {
  const [nome, setNome] = useState(""),
    [erro, setErro] = useState("");
  async function criar(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/painel/categorias", {
        method: "POST",
        body: JSON.stringify({ nome, descricao: "" }),
      });
      setNome("");
      atualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }
  async function editar(c: Categoria) {
    const resposta = await abrirModal({
      titulo: "Editar categoria",
      confirmar: "Salvar alterações",
      campos: [{ nome: "nome", rotulo: "Nome da categoria", valor: c.nome }],
    });
    if (resposta) {
      await api(`/painel/categorias/${c.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: resposta.nome,
          descricao: c.descricao || "",
        }),
      });
      atualizar();
    }
  }
  return (
    <section className="dash-card pagina2">
      <div className="card-head2">
        <div>
          <small>ORGANIZAÇÃO</small>
          <h2>Categorias</h2>
        </div>
      </div>
      {erro && <div className="erro-api">{erro}</div>}
      <form className="criar-categoria" onSubmit={criar}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da nova categoria"
          required
          minLength={2}
        />
        <button>
          <Plus /> Adicionar
        </button>
      </form>
      <div className="grade-categorias2">
        {itens.map((c) => (
          <div key={c.id}>
            <span>
              <FolderTree />
            </span>
            <div>
              <b>{c.nome}</b>
              <small>{c.publicacoes || 0} publicações</small>
            </div>
            <button onClick={() => editar(c)}>
              <Pencil />
            </button>
            <button
              onClick={async () => {
                const resposta = await abrirModal({
                  titulo: "Excluir categoria?",
                  mensagem: `A categoria “${c.nome}” será removida. Categorias vinculadas a publicações são protegidas pelo sistema.`,
                  confirmar: "Excluir",
                  perigo: true,
                });
                if (resposta !== false) {
                  try {
                    await api(`/painel/categorias/${c.id}`, {
                      method: "DELETE",
                    });
                    atualizar();
                  } catch (e) {
                    setErro((e as Error).message);
                  }
                }
              }}
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
function Metricas({ dados }: { dados: any }) {
  if (!dados) return <div className="tela-estado">Consultando eventos…</div>;
  return (
    <>
      <div className="dash-stats">
        {[
          [dados.totais.hoje, "Hoje"],
          [dados.totais.mes, "Neste mês"],
          [dados.totais.ano, "Neste ano"],
          [dados.totais.visitantes, "Visitantes únicos"],
        ].map(([v, l]) => (
          <div className="stat2" key={l}>
            <strong>{Number(v).toLocaleString("pt-BR")}</strong>
            <span>{l}</span>
            <div>
              <BarChart3 />
            </div>
          </div>
        ))}
      </div>
      <div className="dash-stats metricas-engajamento">
        {[
          [dados.engajamentos?.compartilhamentos, "Compartilhamentos no mês"],
          [dados.engajamentos?.buscas, "Buscas no mês"],
          [dados.engajamentos?.cliquesCategorias, "Cliques em categorias"],
          [dados.engajamentos?.publicacoesAcessadas, "Publicações acessadas"],
          [dados.engajamentos?.mediaAcessosDia, "Média diária (30 dias)"],
        ].map(([v, l]) => (
          <div className="stat2" key={l}>
            <strong>{Number(v || 0).toLocaleString("pt-BR")}</strong>
            <span>{l}</span>
            <div>
              <BarChart3 />
            </div>
          </div>
        ))}
      </div>
      <div className="dash-duas-colunas">
        <div className="dash-card">
          <h2>Últimos 30 dias</h2>
          <div
            className="grafico-rolagem"
            aria-label="Gráfico de acessos dos últimos 30 dias"
          >
            <Grafico serie={dados.serie} />
          </div>
        </div>
        <div className="dash-card">
          <h2>Mais acessadas</h2>
          <p className="nota-metrica">
            Robôs, administradores e visualizações repetidas no mesmo dia não
            inflam estes números.
          </p>
          {dados.ranking.map((p: any, i: number) => (
            <div className="ranking2" key={p.id}>
              <b>{i + 1}</b>
              <span>{p.titulo}</span>
              <strong>{p.acessos} acessos</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="dash-card ranking-reacoes-admin">
        <h2>Publicações que os leitores mais gostaram</h2>
        <p className="nota-metrica">
          Cada navegador recebe um identificador seguro e só pode manter uma
          reação por publicação.
        </p>
        {dados.rankingReacoes?.map((p: any, i: number) => (
          <div className="ranking2" key={p.id}>
            <b>{i + 1}</b>
            <span>{p.titulo}</span>
            <strong>{p.reacoes} gostei</strong>
          </div>
        ))}
      </div>
    </>
  );
}
function Configuracao({
  dados,
  salvo,
}: {
  dados: Configuracoes;
  salvo: () => void;
}) {
  const [form, setForm] = useState(dados),
    [erro, setErro] = useState("");
  return (
    <form
      className="dash-card pagina2"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await api("/painel/configuracoes", {
            method: "PUT",
            body: JSON.stringify(form),
          });
          salvo();
        } catch (e) {
          setErro((e as Error).message);
        }
      }}
    >
      <h2>Aparência e identidade do portal</h2>
      {erro && <div className="erro-api">{erro}</div>}
      <div className="config-grid2">
        <label>
          Nome
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </label>
        <label>
          Descrição
          <input
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </label>
        <label>
          Caminho ou URL da logo
          <input
            value={form.caminhoLogo}
            onChange={(e) => setForm({ ...form, caminhoLogo: e.target.value })}
          />
        </label>
        <label>
          Caminho ou URL do favicon
          <input
            value={form.caminhoFavicon}
            onChange={(e) =>
              setForm({ ...form, caminhoFavicon: e.target.value })
            }
          />
        </label>
        {[
          ["corPrimaria", "Cor principal"],
          ["corFundoClaro", "Fundo claro"],
          ["corFundoEscuro", "Fundo escuro"],
          ["corTextoClaro", "Texto no modo claro"],
          ["corTextoEscuro", "Texto no modo escuro"],
        ].map(([campo, rotulo]) => (
          <label key={campo}>
            {rotulo}
            <div className="campo-cor">
              <input
                type="color"
                value={String(form[campo as keyof Configuracoes])}
                onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
              />
              <code>{String(form[campo as keyof Configuracoes])}</code>
            </div>
          </label>
        ))}
        <div className="preferencias-navegacao">
          <div>
            <b>Itens do menu público</b>
            <span>
              Ative ou desative páginas institucionais na navegação do portal.
            </span>
          </div>
          <label className="interruptor-configuracao">
            <span>Quem Somos</span>
            <input
              type="checkbox"
              checked={form.exibirQuemSomos}
              onChange={(e) =>
                setForm({ ...form, exibirQuemSomos: e.target.checked })
              }
            />
          </label>
          <label className="interruptor-configuracao">
            <span>O que resolvemos</span>
            <input
              type="checkbox"
              checked={form.exibirOQueResolvemos}
              onChange={(e) =>
                setForm({ ...form, exibirOQueResolvemos: e.target.checked })
              }
            />
          </label>
        </div>
        <div className="preferencias-navegacao preferencias-redes">
          <div>
            <b>Redes sociais flutuantes</b>
            <span>
              Configure os destinos dos botões exibidos nas páginas públicas.
            </span>
          </div>
          <label className="interruptor-configuracao">
            <span>Exibir botões</span>
            <input
              type="checkbox"
              checked={form.exibirRedesSociais}
              onChange={(e) =>
                setForm({ ...form, exibirRedesSociais: e.target.checked })
              }
            />
          </label>
          <span />
          <label>
            Link do Instagram
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(e) =>
                setForm({ ...form, instagramUrl: e.target.value })
              }
              placeholder="https://www.instagram.com/..."
            />
          </label>
          <label>
            Link do LinkedIn
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) =>
                setForm({ ...form, linkedinUrl: e.target.value })
              }
              placeholder="https://www.linkedin.com/company/..."
            />
          </label>
        </div>
        <div
          className="preview-cores"
          style={{
            background: form.corFundoClaro,
            color: form.corTextoClaro,
            borderColor: form.corPrimaria,
          }}
        >
          <b style={{ color: form.corPrimaria }}>Prévia da identidade</b>
          <span>
            Botões, destaques, fundos e textos serão aplicados ao portal.
          </span>
        </div>
        <button className="salvar2">Salvar e aplicar no portal</button>
      </div>
    </form>
  );
}
function DadosAdmin({
  dados,
  mudou,
}: {
  dados: Administrador;
  mudou: (a: Administrador) => void;
}) {
  const [form, setForm] = useState({
      ...dados,
      caminhoFoto: dados.caminhoFoto || "",
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
      alterarEmail: false,
      alterarSenha: false,
    }),
    [erro, setErro] = useState(""),
    [errosCampos, setErrosCampos] = useState<Record<string, string[]>>({}),
    [enviandoFoto, setEnviandoFoto] = useState(false);
  useEffect(() => {
    setForm((atual) => ({
      ...atual,
      nome: dados.nome,
      email: dados.email,
      caminhoFoto: dados.caminhoFoto || "",
    }));
  }, [dados.id, dados.nome, dados.email, dados.caminhoFoto]);
  async function foto(arquivo?: File) {
    if (!arquivo) return;
    setEnviandoFoto(true);
    try {
      const caminho = await enviarImagemGenerica(
        "/painel/uploads/perfil",
        arquivo,
      );
      setForm((atual) => ({ ...atual, caminhoFoto: caminho }));
    } catch (e) {
      setErro((e as Error).message);
      setErrosCampos({ caminhoFoto: [(e as Error).message] });
    } finally {
      setEnviandoFoto(false);
    }
  }
  function limparErroCampo(campo: string) {
    setErrosCampos((atuais) => {
      const proximos = { ...atuais };
      delete proximos[campo];
      return proximos;
    });
  }
  return (
    <form
      className="dash-card pagina2"
      onSubmit={async (e) => {
        e.preventDefault();
        const botao = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const acao = botao?.value || "perfil";
        setErro("");
        setErrosCampos({});
        try {
          const resultado = await api<{
            ok: boolean;
            sessoesRevogadas?: boolean;
          }>("/painel/administrador", {
            method: "PUT",
            body: JSON.stringify({
              nome: form.nome,
              email: form.email,
              caminhoFoto: form.caminhoFoto,
              alterarEmail: acao === "email",
              alterarSenha: acao === "senha",
              senhaAtual: acao === "email" || acao === "senha" ? form.senhaAtual : undefined,
              novaSenha: acao === "senha" ? form.novaSenha : undefined,
              confirmarNovaSenha: acao === "senha" ? form.confirmarNovaSenha : undefined,
            }),
          });
          if (resultado.sessoesRevogadas) {
            sessionStorage.removeItem("moveon_tela_admin");
            location.href = "/admin?senha=alterada";
            return;
          }
          mudou({
            ...dados,
            nome: form.nome,
            email: form.email,
            caminhoFoto: form.caminhoFoto,
          });
          setForm({
            ...form,
            senhaAtual: "",
            novaSenha: "",
            confirmarNovaSenha: "",
            alterarEmail: false,
            alterarSenha: false,
          });
        } catch (e) {
          const falha = e as Error & { errosCampos?: Record<string, string[]> };
          setErro(falha.message);
          setErrosCampos(falha.errosCampos || {});
          window.setTimeout(() => {
            document.querySelector<HTMLInputElement>(".dados-administrador [aria-invalid='true']")?.focus();
          });
        }
      }}
      noValidate
      data-formulario="administrador"
    >
      <h2>Dados do administrador</h2>
      {erro && <div className="erro-api">{erro}</div>}
      <div className="config-grid2 dados-administrador">
        <label className={`foto-admin ${errosCampos.caminhoFoto?.length ? "campo-invalido" : ""}`}>
          Foto de perfil
          <div>
            {form.caminhoFoto ? (
              <img
                src={form.caminhoFoto}
                alt="Foto do administrador"
                onError={(evento) => {
                  evento.currentTarget.hidden = true;
                }}
                onLoad={(evento) => {
                  evento.currentTarget.hidden = false;
                }}
              />
            ) : (
              <UserRound />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => foto(e.target.files?.[0])}
            />
            <span>
              {enviandoFoto ? "Validando e enviando…" : "Selecionar foto"}
            </span>
          </div>
          {errosCampos.caminhoFoto?.[0] && <small className="mensagem-campo-erro">{errosCampos.caminhoFoto[0]}</small>}
        </label>
        <label className={errosCampos.nome?.length ? "campo-invalido" : ""}>
          Nome
          <input
            value={form.nome}
            onChange={(e) => { setForm({ ...form, nome: e.target.value }); limparErroCampo("nome"); }}
            aria-invalid={Boolean(errosCampos.nome?.length)}
          />
          {errosCampos.nome?.[0] && <small className="mensagem-campo-erro">{errosCampos.nome[0]}</small>}
        </label>
        <button type="submit" name="acao" value="perfil" className="salvar2">Salvar perfil</button>
        <label className={errosCampos.email?.length ? "campo-invalido" : ""}>
          E-mail
          <div className="campo-protegido">
            <input
              value={form.email}
              disabled={!form.alterarEmail}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); limparErroCampo("email"); }}
              aria-invalid={Boolean(errosCampos.email?.length)}
            />
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, alterarEmail: !form.alterarEmail, alterarSenha: false, senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" })
              }
            >
              {form.alterarEmail ? "Cancelar" : "Alterar e-mail"}
            </button>
          </div>
          {errosCampos.email?.[0] && <small className="mensagem-campo-erro">{errosCampos.email[0]}</small>}
        </label>
        {form.alterarEmail && (
          <>
            <label className={errosCampos.senhaAtual?.length ? "campo-invalido" : ""}>
              Senha atual para confirmar o e-mail
              <input type="password" value={form.senhaAtual} onChange={(e) => { setForm({ ...form, senhaAtual: e.target.value }); limparErroCampo("senhaAtual"); }} aria-invalid={Boolean(errosCampos.senhaAtual?.length)} autoComplete="current-password" />
              {errosCampos.senhaAtual?.[0] && <small className="mensagem-campo-erro">{errosCampos.senhaAtual[0]}</small>}
            </label>
            <button type="submit" name="acao" value="email" className="salvar2">Salvar novo e-mail</button>
          </>
        )}
        <button
          type="button"
          className="habilitar-senha"
          onClick={() =>
            setForm({
              ...form,
              alterarSenha: !form.alterarSenha,
              alterarEmail: false,
              senhaAtual: "",
              novaSenha: "",
              confirmarNovaSenha: "",
            })
          }
        >
          {form.alterarSenha
            ? "Cancelar alteração de senha"
            : "Alterar minha senha"}
        </button>
        {form.alterarSenha && (
          <label className={errosCampos.senhaAtual?.length ? "campo-invalido" : ""}>
            Senha atual
            <input
              type="password"
              value={form.senhaAtual}
              onChange={(e) => { setForm({ ...form, senhaAtual: e.target.value }); limparErroCampo("senhaAtual"); }}
              aria-invalid={Boolean(errosCampos.senhaAtual?.length)}
              autoComplete="current-password"
            />
            {errosCampos.senhaAtual?.[0] && <small className="mensagem-campo-erro">{errosCampos.senhaAtual[0]}</small>}
          </label>
        )}
        {form.alterarSenha && (
          <>
            <label className={errosCampos.novaSenha?.length ? "campo-invalido" : ""}>
              Nova senha
              <input type="password" value={form.novaSenha} onChange={(e) => { setForm({ ...form, novaSenha: e.target.value }); limparErroCampo("novaSenha"); }} aria-invalid={Boolean(errosCampos.novaSenha?.length)} autoComplete="new-password" />
              {errosCampos.novaSenha?.[0] && <small className="mensagem-campo-erro">{errosCampos.novaSenha[0]}</small>}
            </label>
            <label className={errosCampos.confirmarNovaSenha?.length ? "campo-invalido" : ""}>
              Confirmar nova senha
              <input type="password" value={form.confirmarNovaSenha} onChange={(e) => { setForm({ ...form, confirmarNovaSenha: e.target.value }); limparErroCampo("confirmarNovaSenha"); }} aria-invalid={Boolean(errosCampos.confirmarNovaSenha?.length)} autoComplete="new-password" />
              {errosCampos.confirmarNovaSenha?.[0] && <small className="mensagem-campo-erro">{errosCampos.confirmarNovaSenha[0]}</small>}
            </label>
            <button type="submit" name="acao" value="senha" className="salvar2">Alterar senha</button>
          </>
        )}
      </div>
    </form>
  );
}

type ConfigContato = {
  exibirContato: boolean;
  exibirFormulario: boolean;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  horario: string;
  encaminharEmail: boolean;
  recaptchaAtivo: boolean;
  recaptchaChaveSite: string;
  recaptchaChaveSecreta: string;
  recaptchaSegredoConfigurado: boolean;
  recaptchaPontuacaoMinima: number;
};
type MensagemContato = {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  cargo: string;
  clienteSap: string;
  assunto: string;
  mensagem: string;
  situacao: string;
  criadoEm: string;
  resposta?: string;
};
const mascararTelefoneBrasil = (valor: string, comPais = false) => {
  const digitos = valor.replace(/\D/g, "").slice(0, comPais ? 13 : 11);
  const nacional =
    comPais && digitos.startsWith("55") ? digitos.slice(2) : digitos;
  const pais = comPais && digitos.startsWith("55") ? "+55 " : "";
  if (nacional.length <= 2) return pais + nacional;
  if (nacional.length <= 6)
    return `${pais}(${nacional.slice(0, 2)}) ${nacional.slice(2)}`;
  const corte = nacional.length > 10 ? 7 : 6;
  return `${pais}(${nacional.slice(0, 2)}) ${nacional.slice(2, corte)}-${nacional.slice(corte, 11)}`;
};

function PainelContato({
  versao,
  aoLer,
}: {
  versao: number;
  aoLer: (total: number) => void;
}) {
  const [config, setConfig] = useState<ConfigContato | null>(null),
    [editarSegredo, setEditarSegredo] = useState(false),
    [mensagens, setMensagens] = useState<MensagemContato[]>([]),
    [selecionada, setSelecionada] = useState<MensagemContato | null>(null),
    [busca, setBusca] = useState(""),
    [filtro, setFiltro] = useState("todas"),
    [cursor, setCursor] = useState<string | null>(null),
    [carregando, setCarregando] = useState(false),
    [resposta, setResposta] = useState(""),
    [retorno, setRetorno] = useState("");
  const sentinela = useRef<HTMLDivElement>(null);
  const carregar = async (reset = true) => {
    if (carregando) return;
    setCarregando(true);
    try {
      const q = new URLSearchParams({ limite: "20", situacao: filtro });
      if (busca) q.set("busca", busca);
      if (!reset && cursor) q.set("cursor", cursor);
      const d = await api<{
        itens: MensagemContato[];
        proximoCursor: string | null;
        totalNovas: number;
      }>(`/painel/contato/mensagens?${q}`);
      setMensagens((a) =>
        reset
          ? d.itens
          : [...a, ...d.itens.filter((n) => !a.some((x) => x.id === n.id))],
      );
      setCursor(d.proximoCursor);
      aoLer(d.totalNovas);
    } catch (e) {
      setRetorno((e as Error).message);
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => {
    api<ConfigContato>("/painel/contato/configuracao")
      .then(setConfig)
      .catch((e) => setRetorno(e.message));
  }, []);
  useEffect(() => {
    const t = setTimeout(() => void carregar(true), 300);
    return () => clearTimeout(t);
  }, [busca, filtro, versao]);
  useEffect(() => {
    const alvo = sentinela.current;
    if (!alvo) return;
    const o = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && cursor) void carregar(false);
      },
      { rootMargin: "250px" },
    );
    o.observe(alvo);
    return () => o.disconnect();
  }, [cursor, carregando]);
  async function abrir(m: MensagemContato) {
    const d = await api<MensagemContato>(`/painel/contato/mensagens/${m.id}`);
    setSelecionada(d);
    setResposta(d.resposta || "");
    await carregar(true);
  }
  async function salvarConfig(e: FormEvent) {
    e.preventDefault();
    if (!config) return;
    try {
      const dados = {
        exibirContato: config.exibirContato,
        exibirFormulario: config.exibirFormulario,
        email: config.email,
        telefone: config.telefone,
        whatsapp: config.whatsapp,
        endereco: config.endereco,
        horario: config.horario,
        encaminharEmail: config.encaminharEmail,
        recaptchaAtivo: config.recaptchaAtivo,
        recaptchaChaveSite: config.recaptchaChaveSite,
        recaptchaChaveSecreta: config.recaptchaChaveSecreta,
        recaptchaPontuacaoMinima: config.recaptchaPontuacaoMinima,
      };
      const d = await api<ConfigContato>("/painel/contato/configuracao", {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      setConfig(d);
      setEditarSegredo(false);
      setRetorno("Configurações de contato salvas.");
    } catch (e) {
      setRetorno((e as Error).message);
    }
  }
  async function alterar(situacao: "lida" | "arquivada") {
    if (!selecionada) return;
    await api(`/painel/contato/mensagens/${selecionada.id}`, {
      method: "PATCH",
      body: JSON.stringify({ situacao }),
    });
    setSelecionada(null);
    await carregar(true);
  }
  async function excluir() {
    if (!selecionada) return;
    const ok = await abrirModal({
      titulo: "Excluir mensagem?",
      mensagem: "A mensagem será removida definitivamente.",
      confirmar: "Excluir",
      perigo: true,
    });
    if (ok === false) return;
    await api(`/painel/contato/mensagens/${selecionada.id}`, {
      method: "DELETE",
    });
    setSelecionada(null);
    await carregar(true);
  }
  async function responder() {
    if (!selecionada || !resposta.trim()) return;
    await api(`/painel/contato/mensagens/${selecionada.id}/responder`, {
      method: "POST",
      body: JSON.stringify({ resposta }),
    });
    setRetorno("Resposta enviada por e-mail.");
    setSelecionada(await api(`/painel/contato/mensagens/${selecionada.id}`));
    await carregar(true);
  }
  if (!config)
    return <div className="tela-estado">Carregando caixa de contato…</div>;
  const campo = (
    chave: keyof ConfigContato,
    rotulo: string,
    placeholder: string,
  ) => (
    <label>
      {rotulo}
      <input
        value={String(config[chave] || "")}
        placeholder={placeholder}
        onChange={(e) => setConfig({ ...config, [chave]: e.target.value })}
      />
    </label>
  );
  return (
    <section className="painel-contato">
      <form className="dash-card configuracao-contato" onSubmit={salvarConfig}>
        <div className="card-head2">
          <div>
            <span>CANAL PÚBLICO</span>
            <h2>Contato e proteção</h2>
          </div>
          <button className="primario">Salvar configurações</button>
        </div>
        <div className="contato-toggles">
          <label className="interruptor-configuracao">
            <span>Página de contato</span>
            <input
              type="checkbox"
              checked={config.exibirContato}
              onChange={(e) =>
                setConfig({ ...config, exibirContato: e.target.checked })
              }
            />
            <i />
          </label>
          <label className="interruptor-configuracao">
            <span>Formulário de contato</span>
            <input
              type="checkbox"
              checked={config.exibirFormulario}
              onChange={(e) =>
                setConfig({ ...config, exibirFormulario: e.target.checked })
              }
            />
            <i />
          </label>
          <label className="interruptor-configuracao">
            <span>Encaminhar ao e-mail</span>
            <input
              type="checkbox"
              checked={config.encaminharEmail}
              onChange={(e) =>
                setConfig({ ...config, encaminharEmail: e.target.checked })
              }
            />
            <i />
          </label>
        </div>
        <div className="config-grid2">
          {campo("email", "E-mail da empresa", "contato@empresa.com")}
          <label>
            Telefone
            <input
              type="tel"
              inputMode="tel"
              maxLength={15}
              value={config.telefone}
              placeholder="(00) 00000-0000"
              onChange={(e) =>
                setConfig({
                  ...config,
                  telefone: mascararTelefoneBrasil(e.target.value),
                })
              }
            />
          </label>
          <label>
            WhatsApp
            <input
              type="tel"
              inputMode="tel"
              maxLength={19}
              value={config.whatsapp}
              placeholder="+55 (00) 00000-0000"
              onChange={(e) =>
                setConfig({
                  ...config,
                  whatsapp: mascararTelefoneBrasil(e.target.value, true),
                })
              }
            />
          </label>
          {campo("endereco", "Endereço", "Endereço para atendimento")}
          {campo(
            "horario",
            "Horário de atendimento",
            "Segunda a sexta, 9h às 18h",
          )}
        </div>
        <div className="recaptcha-config">
          <div className="card-head2">
            <div>
              <b>Google reCAPTCHA v3</b>
              <small>Validação por pontuação, ação e token no backend.</small>
            </div>
            <label className="interruptor-configuracao">
              <input
                type="checkbox"
                checked={config.recaptchaAtivo}
                onChange={(e) =>
                  setConfig({ ...config, recaptchaAtivo: e.target.checked })
                }
              />
              <i />
              <span>{config.recaptchaAtivo ? "Ativo" : "Desativado"}</span>
            </label>
          </div>
          <div className="config-grid2">
            {campo("recaptchaChaveSite", "Chave do site", "Chave pública v3")}
            <label>
              Chave secreta
              <input
                type="password"
                disabled={!editarSegredo}
                value={config.recaptchaChaveSecreta}
                placeholder={
                  config.recaptchaSegredoConfigurado
                    ? "Segredo já configurado"
                    : "Informe o segredo v3"
                }
                onChange={(e) =>
                  setConfig({
                    ...config,
                    recaptchaChaveSecreta: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Pontuação mínima
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.recaptchaPontuacaoMinima}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    recaptchaPontuacaoMinima: Number(e.target.value),
                  })
                }
              />
            </label>
            <button
              type="button"
              className="habilitar-servidor-email"
              onClick={() => setEditarSegredo((v) => !v)}
            >
              {editarSegredo ? "Bloquear segredo" : "Alterar segredo"}
            </button>
          </div>
        </div>
        {retorno && <p className="contato-retorno">{retorno}</p>}
      </form>
      <div className="dash-card caixa-contato">
        <div className="caixa-filtros">
          <div>
            <span>CAIXA DE ENTRADA</span>
            <h2>Mensagens recebidas</h2>
          </div>
          <div className="busca-mensagens">
            <Search />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar nome, empresa, assunto ou mensagem"
            />
          </div>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="nova">Não visualizadas</option>
            <option value="lida">Lidas</option>
            <option value="respondida">Respondidas</option>
            <option value="arquivada">Arquivadas</option>
          </select>
        </div>
        <div className="mailbox">
          <div className="lista-mensagens">
            {mensagens.map((m) => (
              <button
                key={m.id}
                className={`${m.situacao} ${selecionada?.id === m.id ? "selecionada" : ""}`}
                onClick={() => void abrir(m)}
              >
                <span className="ponto-nova" />
                <div>
                  <b>{m.nome}</b>
                  <strong>{m.assunto}</strong>
                  <small>
                    {m.empresa} · {new Date(m.criadoEm).toLocaleString("pt-BR")}
                  </small>
                  <p>{m.mensagem}</p>
                </div>
              </button>
            ))}
            {!mensagens.length && !carregando && (
              <p className="sem-mensagens">Nenhuma mensagem encontrada.</p>
            )}
            <div ref={sentinela} />
            {carregando && <p className="sem-mensagens">Carregando…</p>}
          </div>
          <article className="mensagem-aberta">
            {selecionada ? (
              <>
                <header>
                  <span className={`status-mensagem ${selecionada.situacao}`}>
                    {selecionada.situacao}
                  </span>
                  <h2>{selecionada.assunto}</h2>
                  <p>
                    <b>{selecionada.nome}</b> &lt;{selecionada.email}&gt;
                  </p>
                  <small>
                    {new Date(selecionada.criadoEm).toLocaleString("pt-BR")}
                  </small>
                </header>
                <dl>
                  <div>
                    <dt>Empresa</dt>
                    <dd>{selecionada.empresa}</dd>
                  </div>
                  <div>
                    <dt>Cargo</dt>
                    <dd>{selecionada.cargo}</dd>
                  </div>
                  <div>
                    <dt>Cliente SAP?</dt>
                    <dd>
                      {
                        { sim: "Sim", nao: "Não", nao_sei: "Não sei" }[
                          selecionada.clienteSap
                        ]
                      }
                    </dd>
                  </div>
                </dl>
                <div className="corpo-mensagem">{selecionada.mensagem}</div>
                <label>
                  Responder
                  <textarea
                    rows={7}
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    placeholder="Digite uma resposta profissional…"
                  />
                </label>
                <div className="acoes-mensagem">
                  <button className="primario" onClick={() => void responder()}>
                    <Reply />
                    Responder por e-mail
                  </button>
                  <button onClick={() => void alterar("arquivada")}>
                    <Archive />
                    Arquivar
                  </button>
                  <button className="perigo" onClick={() => void excluir()}>
                    <Trash2 />
                    Excluir
                  </button>
                </div>
              </>
            ) : (
              <div className="mensagem-placeholder">
                <Mail />
                <h3>Selecione uma mensagem</h3>
                <p>O conteúdo completo será exibido aqui.</p>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function PainelNewsletter() {
  const [pagina, setPagina] = useState(1),
    [dados, setDados] = useState<any>(null),
    [modelo, setModelo] = useState<ModeloNewsletterPainel>({
      assunto: "",
      texto: "",
      exibirNewsletter: true,
      emailAtivo: false,
      smtpHost: "",
      smtpPorta: 587,
      smtpSeguro: false,
      smtpUsuario: "",
      smtpSenha: "",
      smtpSenhaConfigurada: false,
      emailRemetenteNome: "MOVE.ON",
      emailRemetenteEndereco: "",
      emailSegredoCancelamento: "",
      emailSegredoConfigurado: false,
    }),
    [erro, setErro] = useState(""),
    [editandoServidor, setEditandoServidor] = useState(false),
    [salvando, setSalvando] = useState(false);
  const carregar = () =>
    Promise.all([
      api<any>(`/painel/newsletter?pagina=${pagina}`),
      api<any>("/painel/newsletter-modelo"),
    ])
      .then(([lista, m]) => {
        setDados(lista);
        setModelo({
          ...m,
          smtpSenha: "",
          emailSegredoCancelamento: "",
        });
      })
      .catch((e) => setErro(e.message));
  async function salvarModelo(ajustes: Partial<ModeloNewsletterPainel> = {}) {
    const atualizado = { ...modelo, ...ajustes };
    setModelo(atualizado);
    setSalvando(true);
    try {
      await api("/painel/newsletter-modelo", {
        method: "PUT",
        body: JSON.stringify({
          assunto: atualizado.assunto,
          texto: atualizado.texto,
          exibirNewsletter: atualizado.exibirNewsletter,
          emailAtivo: atualizado.emailAtivo,
          smtpHost: atualizado.smtpHost,
          smtpPorta: Number(atualizado.smtpPorta),
          smtpSeguro: atualizado.smtpSeguro,
          smtpUsuario: atualizado.smtpUsuario,
          smtpSenha: atualizado.smtpSenha || undefined,
          emailRemetenteNome: atualizado.emailRemetenteNome,
          emailRemetenteEndereco: atualizado.emailRemetenteEndereco,
          emailSegredoCancelamento:
            atualizado.emailSegredoCancelamento || undefined,
        }),
      });
      setErro("");
      setEditandoServidor(false);
      setModelo((valor) => ({
        ...valor,
        smtpSenha: "",
        emailSegredoCancelamento: "",
        smtpSenhaConfigurada:
          valor.smtpSenhaConfigurada || Boolean(atualizado.smtpSenha),
        emailSegredoConfigurado:
          valor.emailSegredoConfigurado ||
          Boolean(atualizado.emailSegredoCancelamento),
      }));
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  }
  useEffect(() => {
    carregar();
  }, [pagina]);
  return (
    <section className="pagina2 newsletter-admin">
      <div className="dash-card controle-newsletter-publica">
        <div>
          <small>EXIBIÇÃO NO PORTAL</small>
          <h2>Seção NEWSLETTER MOVE.ON</h2>
          <p>
            Ao desativar, a área de inscrição é removida da página inicial e das
            publicações.
          </p>
        </div>
        <label className="interruptor-configuracao">
          <span>{modelo.exibirNewsletter ? "Ativa" : "Desativada"}</span>
          <input
            type="checkbox"
            checked={modelo.exibirNewsletter}
            disabled={salvando}
            onChange={(evento) =>
              void salvarModelo({ exibirNewsletter: evento.target.checked })
            }
          />
        </label>
      </div>
      <div className="dash-card">
        <small>ENVIO AUTOMÁTICO</small>
        <h2>Modelo profissional da newsletter</h2>
        <p>
          Variáveis disponíveis: <code>{"{{nome_portal}}"}</code>,{" "}
          <code>{"{{titulo}}"}</code>, <code>{"{{resumo}}"}</code>,{" "}
          <code>{"{{categorias}}"}</code>, <code>{"{{data_publicacao}}"}</code>{" "}
          e <code>{"{{link_publicacao}}"}</code>. Logo, capa, dados da
          publicação, botão direto e cancelamento são inseridos automaticamente.
        </p>
        {erro && <div className="erro-api">{erro}</div>}
        <label>
          Assunto
          <input
            value={modelo.assunto}
            onChange={(e) => setModelo({ ...modelo, assunto: e.target.value })}
          />
        </label>
        <label>
          Texto principal
          <textarea
            rows={7}
            value={modelo.texto}
            onChange={(e) => setModelo({ ...modelo, texto: e.target.value })}
          />
        </label>
        <button
          className="salvar2"
          onClick={() => void salvarModelo()}
          disabled={salvando}
        >
          {salvando ? "Salvando…" : "Salvar modelo"}
        </button>
      </div>
      <div className="dash-card servidor-email-admin">
        <div className="card-head2">
          <div>
            <small>CONFIGURAÇÃO PROTEGIDA</small>
            <h2>Servidor de e-mail</h2>
          </div>
          <button
            type="button"
            className="habilitar-servidor-email"
            onClick={() => setEditandoServidor((valor) => !valor)}
          >
            {editandoServidor ? "Cancelar edição" : "Habilitar edição"}
          </button>
        </div>
        <p className="nota-metrica">
          Senha SMTP e segredo de cancelamento são criptografados e nunca são
          exibidos novamente. Alterar o segredo invalida links de cancelamento
          enviados anteriormente.
        </p>
        <div className="config-grid2">
          <label className="check-email-ativo">
            <span>EMAIL_ATIVO</span>
            <input
              type="checkbox"
              checked={modelo.emailAtivo}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, emailAtivo: e.target.checked })
              }
            />
          </label>
          <label>
            SMTP_HOST
            <input
              value={modelo.smtpHost}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, smtpHost: e.target.value })
              }
            />
          </label>
          <label>
            SMTP_PORTA
            <input
              type="number"
              min="1"
              max="65535"
              value={modelo.smtpPorta}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, smtpPorta: Number(e.target.value) })
              }
            />
          </label>
          <label className="check-email-ativo">
            <span>SMTP_SEGURO</span>
            <input
              type="checkbox"
              checked={modelo.smtpSeguro}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, smtpSeguro: e.target.checked })
              }
            />
          </label>
          <label>
            SMTP_USUARIO
            <input
              value={modelo.smtpUsuario}
              disabled={!editandoServidor}
              autoComplete="username"
              onChange={(e) =>
                setModelo({ ...modelo, smtpUsuario: e.target.value })
              }
            />
          </label>
          <label>
            SMTP_SENHA
            <input
              type="password"
              value={modelo.smtpSenha}
              disabled={!editandoServidor}
              autoComplete="new-password"
              placeholder={
                modelo.smtpSenhaConfigurada
                  ? "Senha configurada — digite apenas para alterar"
                  : "Digite a senha SMTP"
              }
              onChange={(e) =>
                setModelo({ ...modelo, smtpSenha: e.target.value })
              }
            />
          </label>
          <label>
            EMAIL_REMETENTE_NOME
            <input
              value={modelo.emailRemetenteNome}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, emailRemetenteNome: e.target.value })
              }
            />
          </label>
          <label>
            EMAIL_REMETENTE_ENDERECO
            <input
              type="email"
              value={modelo.emailRemetenteEndereco}
              disabled={!editandoServidor}
              onChange={(e) =>
                setModelo({ ...modelo, emailRemetenteEndereco: e.target.value })
              }
            />
          </label>
          <label className="segredo-email">
            EMAIL_SEGREDO_CANCELAMENTO
            <input
              type="password"
              minLength={32}
              value={modelo.emailSegredoCancelamento}
              disabled={!editandoServidor}
              autoComplete="new-password"
              placeholder={
                modelo.emailSegredoConfigurado
                  ? "Segredo configurado — digite apenas para alterar"
                  : "Mínimo de 32 caracteres"
              }
              onChange={(e) =>
                setModelo({
                  ...modelo,
                  emailSegredoCancelamento: e.target.value,
                })
              }
            />
          </label>
          {editandoServidor && (
            <button
              type="button"
              className="salvar2"
              disabled={salvando}
              onClick={() => void salvarModelo()}
            >
              {salvando ? "Salvando…" : "Salvar servidor de e-mail"}
            </button>
          )}
        </div>
      </div>
      <div className="dash-card">
        <div className="card-head2">
          <div>
            <small>INSCRITOS</small>
            <h2>E-mails cadastrados</h2>
          </div>
          <b>{dados?.total || 0} no total</b>
        </div>
        {dados?.itens?.map((i: any) => (
          <div className="inscrito-newsletter" key={i.id}>
            <div>
              <b>{i.email}</b>
              <small>
                {i.canceladoEm
                  ? `Cancelado em ${dataBrasil(i.canceladoEm)}`
                  : `Inscrito em ${dataBrasil(i.inscritoEm)}`}
              </small>
            </div>
            <em className={i.canceladoEm ? "cancelado" : "ativo"}>
              {i.canceladoEm ? "Cancelado" : "Ativo"}
            </em>
            <button
              title="Remover e-mail cadastrado"
              aria-label={`Remover ${i.email} da newsletter`}
              onClick={async () => {
                const ok = await abrirModal({
                  titulo: "Remover e-mail cadastrado?",
                  mensagem: `${i.email} será removido definitivamente da lista da newsletter.`,
                  confirmar: "Remover cadastro",
                  perigo: true,
                });
                if (ok !== false) {
                  await api(`/painel/newsletter/${i.id}`, {
                    method: "DELETE",
                  });
                  carregar();
                }
              }}
            >
              <Trash2 />
            </button>
          </div>
        ))}
        <div className="paginacao-newsletter">
          <button
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {dados?.pagina || 1} de {dados?.paginas || 1}
          </span>
          <button
            disabled={pagina >= Number(dados?.paginas || 1)}
            onClick={() => setPagina((p) => p + 1)}
          >
            Próxima →
          </button>
        </div>
      </div>
    </section>
  );
}

function GestaoParceiros({
  itens,
  atualizar,
}: {
  itens: Parceiro[];
  atualizar: () => Promise<void>;
}) {
  const vazio = {
    nome: "",
    caminhoLogo: "",
    enderecoSite: "",
    ativo: true,
    ordem: (itens.length + 1) * 10,
  };
  const [form, setForm] = useState<Omit<Parceiro, "id">>(vazio);
  const [editando, setEditando] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exibirCarrossel, setExibirCarrossel] = useState(true);
  useEffect(() => {
    api<{ exibir: boolean }>("/painel/parceiros-exibicao")
      .then((resultado) => setExibirCarrossel(resultado.exibir))
      .catch((e) => setErro((e as Error).message));
  }, []);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    try {
      await api(`/painel/parceiros${editando ? `/${editando}` : ""}`, {
        method: editando ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setEditando(null);
      setForm({ ...vazio, ordem: (itens.length + 2) * 10 });
      await atualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <section className="pagina2 parceiros-admin">
      <div className="dash-card controle-carrossel-parceiros">
        <div>
          <small>EXIBIÇÃO PÚBLICA</small>
          <h2>Carrossel de parcerias</h2>
          <p>
            Os cadastros permanecem salvos mesmo quando o carrossel estiver
            oculto.
          </p>
        </div>
        <label className="interruptor-parceiros">
          <input
            type="checkbox"
            checked={exibirCarrossel}
            onChange={async (evento) => {
              const proximo = evento.target.checked;
              setExibirCarrossel(proximo);
              try {
                await api("/painel/parceiros-exibicao", {
                  method: "PUT",
                  body: JSON.stringify({ exibir: proximo }),
                });
              } catch (e) {
                setExibirCarrossel(!proximo);
                setErro((e as Error).message);
              }
            }}
          />
          <span>
            {exibirCarrossel ? "Carrossel ativo" : "Carrossel desativado"}
          </span>
        </label>
      </div>
      <form className="dash-card" onSubmit={salvar}>
        <div className="card-head2">
          <div>
            <small>PARCERIAS</small>
            <h2>{editando ? "Editar parceiro" : "Cadastrar parceiro"}</h2>
          </div>
        </div>
        {erro && <div className="erro-api">{erro}</div>}
        <div className="config-grid2">
          <label>
            Nome da empresa
            <input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              minLength={2}
            />
          </label>
          <label>
            Site do parceiro (opcional)
            <input
              type="url"
              value={form.enderecoSite}
              onChange={(e) =>
                setForm({ ...form, enderecoSite: e.target.value })
              }
              placeholder="https://"
            />
          </label>
          <label>
            Caminho ou URL da logo
            <input
              value={form.caminhoLogo}
              onChange={(e) =>
                setForm({ ...form, caminhoLogo: e.target.value })
              }
              required
              placeholder="/logo-parceiro.png"
            />
          </label>
          <label className="upload-config">
            Enviar logo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={enviando}
              onChange={async (e) => {
                const arquivo = e.target.files?.[0];
                if (!arquivo) return;
                setEnviando(true);
                try {
                  const caminho = await enviarImagemGenerica("/painel/uploads/logos", arquivo);
                  setForm((atual) => ({
                    ...atual,
                    caminhoLogo: caminho,
                  }));
                } catch (erroUpload) {
                  setErro((erroUpload as Error).message);
                } finally {
                  setEnviando(false);
                }
              }}
            />
          </label>
          <label>
            Ordem
            <input
              type="number"
              min="0"
              max="10000"
              value={form.ordem}
              onChange={(e) =>
                setForm({ ...form, ordem: Number(e.target.value) })
              }
            />
          </label>
          <label className="check-real">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />{" "}
            Exibir no portal
          </label>
          <div className="acoes-parceiro-form">
            <button className="salvar2" disabled={enviando}>
              {enviando
                ? "Enviando…"
                : editando
                  ? "Salvar alterações"
                  : "Cadastrar parceiro"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm(vazio);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="grade-parceiros-admin">
        {itens.map((item) => (
          <article className="dash-card" key={item.id}>
            {item.caminhoLogo ? (
              <img src={item.caminhoLogo} alt={item.nome} />
            ) : (
              <div className="logo-parceiro-pendente">Logo pendente</div>
            )}
            <div>
              <b>{item.nome}</b>
              <small>{item.ativo ? "Visível no portal" : "Oculto"}</small>
            </div>
            <button
              onClick={() => {
                setEditando(item.id);
                setForm({
                  nome: item.nome,
                  caminhoLogo: item.caminhoLogo,
                  enderecoSite: item.enderecoSite || "",
                  ativo: item.ativo,
                  ordem: item.ordem,
                });
              }}
            >
              Editar
            </button>
            <button
              className="perigo"
              onClick={async () => {
                const resposta = await abrirModal({
                  titulo: "Excluir parceiro?",
                  mensagem: `${item.nome} será removido do carrossel.`,
                  confirmar: "Excluir",
                  perigo: true,
                });
                if (resposta !== false) {
                  await api(`/painel/parceiros/${item.id}`, {
                    method: "DELETE",
                  });
                  await atualizar();
                }
              }}
            >
              Excluir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
