"use client";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Pencil, Save } from "lucide-react";
import { EditorPublicacaoCompleto } from "./EditorPublicacaoCompleto";
type Tipo = "consentimento" | "privacidade" | "termos";
type Dados = {
  consentimentoTitulo: string;
  consentimentoTextoHtml: string;
  politicaPrivacidadeTitulo: string;
  politicaPrivacidadeSubtitulo: string;
  politicaPrivacidadeHtml: string;
  termosUsoTitulo: string;
  termosUsoSubtitulo: string;
  termosUsoHtml: string;
};
async function api<T>(url: string, opcoes: RequestInit = {}) {
  const r = await fetch(`/api${url}`, {
    credentials: "include",
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });
  const d = (await r.json()) as T & { erro?: string };
  if (!r.ok) throw new Error(d.erro || "Não foi possível salvar.");
  return d;
}
const nomes = {
  consentimento: [
    "Consentimento de dados",
    "Personalize a mensagem apresentada antes das escolhas de privacidade.",
  ],
  privacidade: [
    "Política de Privacidade",
    "Edite o título, subtítulo e o documento completo publicado no portal.",
  ],
  termos: [
    "Termos de Uso",
    "Edite o título, subtítulo e o documento completo publicado no portal.",
  ],
} as const;
export default function PainelConteudoLegal({ tipo }: { tipo: Tipo }) {
  const [dados, setDados] = useState<Dados | null>(null),
    [editando, setEditando] = useState(false),
    [mensagem, setMensagem] = useState("");
  useEffect(() => {
    api<Dados>("/painel/conteudos-legais")
      .then(setDados)
      .catch((e) => setMensagem(e.message));
  }, [tipo]);
  if (!dados) return <div className="tela-estado">Carregando conteúdo…</div>;
  const consentimento = tipo === "consentimento";
  const titulo = consentimento
    ? dados.consentimentoTitulo
    : tipo === "privacidade"
      ? dados.politicaPrivacidadeTitulo
      : dados.termosUsoTitulo;
  const subtitulo = consentimento
    ? ""
    : tipo === "privacidade"
      ? dados.politicaPrivacidadeSubtitulo
      : dados.termosUsoSubtitulo;
  const html = consentimento
    ? dados.consentimentoTextoHtml
    : tipo === "privacidade"
      ? dados.politicaPrivacidadeHtml
      : dados.termosUsoHtml;
  const atualizar = (campo: keyof Dados, valor: string) =>
    setDados((estadoAtual) =>
      estadoAtual ? { ...estadoAtual, [campo]: valor } : estadoAtual,
    );
  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!editando) return;
    try {
      const corpo = consentimento
        ? { titulo, conteudoHtml: html }
        : { titulo, subtitulo, conteudoHtml: html };
      setDados(
        await api<Dados>(`/painel/conteudos-legais/${tipo}`, {
          method: "PUT",
          body: JSON.stringify(corpo),
        }),
      );
      setEditando(false);
      setMensagem("Conteúdo salvo e publicado no portal.");
    } catch (e) {
      setMensagem((e as Error).message);
    }
  }
  return (
    <form
      className={`pagina2 conteudo-legal-admin ${editando ? "edicao-habilitada" : "edicao-bloqueada"}`}
      onSubmit={salvar}
    >
      <div className="card-head2">
        <div>
          <span>CONTEÚDO INSTITUCIONAL</span>
          <h2>{nomes[tipo][0]}</h2>
          <p>{nomes[tipo][1]}</p>
        </div>
        <div className="acoes-editor-legal">
          <button
            type="button"
            className="habilitar-servidor-email"
            onClick={() => setEditando((v) => !v)}
          >
            {editando ? (
              <>
                <LockKeyhole />
                Bloquear edição
              </>
            ) : (
              <>
                <Pencil />
                Habilitar alteração
              </>
            )}
          </button>
          <button className="primario" disabled={!editando}>
            <Save />
            Salvar {consentimento ? "consentimento" : "documento"}
          </button>
        </div>
      </div>
      <fieldset disabled={!editando}>
        <label>
          Título
          <input
            value={titulo}
            maxLength={180}
            onChange={(e) =>
              atualizar(
                consentimento
                  ? "consentimentoTitulo"
                  : tipo === "privacidade"
                    ? "politicaPrivacidadeTitulo"
                    : "termosUsoTitulo",
                e.target.value,
              )
            }
          />
        </label>
        {!consentimento && (
          <label>
            Subtítulo
            <textarea
              rows={3}
              maxLength={500}
              value={subtitulo}
              onChange={(e) =>
                atualizar(
                  tipo === "privacidade"
                    ? "politicaPrivacidadeSubtitulo"
                    : "termosUsoSubtitulo",
                  e.target.value,
                )
              }
            />
          </label>
        )}
        <p className="rotulo-editor-legal">Conteúdo completo</p>
        <div className="editor-legal-admin">
          <EditorPublicacaoCompleto
            key={`${tipo}-${editando}`}
            valor={html}
            aoAlterar={(v) =>
              atualizar(
                consentimento
                  ? "consentimentoTextoHtml"
                  : tipo === "privacidade"
                    ? "politicaPrivacidadeHtml"
                    : "termosUsoHtml",
                v,
              )
            }
          />
        </div>
      </fieldset>
      {!editando && (
        <div className="aviso-edicao-bloqueada">
          <LockKeyhole />
          <span>
            A edição está protegida. Clique em “Habilitar alteração” para
            modificar este conteúdo.
          </span>
        </div>
      )}
      {mensagem && <p className="contato-retorno">{mensagem}</p>}
    </form>
  );
}
