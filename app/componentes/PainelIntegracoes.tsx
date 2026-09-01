"use client";
import { BarChart3, Cloud, Settings } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
type C = {
  armazenamentoModo: "local" | "s3";
  s3Endpoint: string;
  s3Regiao: string;
  s3Bucket: string;
  s3ChaveAcesso: string;
  s3ChaveSecreta: string;
  s3UrlPublica: string;
  s3ForcarPathStyle: boolean;
  s3CredenciaisConfiguradas: boolean;
  analyticsAtivo: boolean;
  analyticsIdMedicao: string;
  consentimentoAtivo: boolean;
  politicaDadosTexto: string;
  consentimentoTitulo: string;
  consentimentoTextoHtml: string;
  politicaPrivacidadeHtml: string;
  termosUsoHtml: string;
  permitirAnalytics: boolean;
  permitirPreferencias: boolean;
  permitirMarketing: boolean;
  otelAtivo: boolean;
  otelEndpoint: string;
  otelCabecalhos: string;
  otelNomeServico: string;
  otelNivelMinimo: "debug" | "info" | "warn" | "error";
  otelCabecalhosConfigurados: boolean;
};
async function api<T>(url: string, opcoes: RequestInit = {}) {
  const r = await fetch(`/api${url}`, {
    credentials: "include",
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });
  const d = (await r.json()) as T & { erro?: string };
  if (!r.ok) throw new Error(d.erro || "Não foi possível concluir.");
  return d;
}
export default function PainelIntegracoes() {
  const [f, setF] = useState<C | null>(null),
    [editar, setEditar] = useState(false),
    [msg, setMsg] = useState("");
  useEffect(() => {
    api<C>("/painel/integracoes")
      .then(setF)
      .catch((e) => setMsg(e.message));
  }, []);
  if (!f) return <div className="tela-estado">Carregando integrações…</div>;
  const a = (k: keyof C, v: unknown) => setF({ ...f, [k]: v });
  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!f) return;
    const d = {
      armazenamentoModo: f.armazenamentoModo,
      s3Endpoint: f.s3Endpoint,
      s3Regiao: f.s3Regiao,
      s3Bucket: f.s3Bucket,
      s3ChaveAcesso: f.s3ChaveAcesso,
      s3ChaveSecreta: f.s3ChaveSecreta,
      s3UrlPublica: f.s3UrlPublica,
      s3ForcarPathStyle: f.s3ForcarPathStyle,
      analyticsAtivo: f.analyticsAtivo,
      analyticsIdMedicao: f.analyticsIdMedicao,
      consentimentoAtivo: f.consentimentoAtivo,
      politicaDadosTexto: f.politicaDadosTexto,
      permitirAnalytics: f.permitirAnalytics,
      permitirPreferencias: f.permitirPreferencias,
      permitirMarketing: f.permitirMarketing,
      otelAtivo: f.otelAtivo,
      otelEndpoint: f.otelEndpoint,
      otelCabecalhos: f.otelCabecalhos,
      otelNomeServico: f.otelNomeServico,
      otelNivelMinimo: f.otelNivelMinimo,
    };
    try {
      setF(
        await api<C>("/painel/integracoes", {
          method: "PUT",
          body: JSON.stringify(d),
        }),
      );
      setEditar(false);
      setMsg("Integrações atualizadas.");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }
  return (
    <form className="pagina2 integracoes-admin" onSubmit={salvar}>
      <div className="card-head2">
        <div>
          <span>INFRAESTRUTURA E DADOS</span>
          <h2>Integrações</h2>
        </div>
        <button className="primario">Salvar configurações</button>
      </div>
      <Bloco
        icone={<Cloud />}
        titulo="Armazenamento de imagens e vídeos"
        texto="Use arquivos locais ou Object Storage compatível com AWS S3."
      >
        <label>
          Modo
          <select
            value={f.armazenamentoModo}
            onChange={(e) => a("armazenamentoModo", e.target.value)}
          >
            <option value="local">Storage local</option>
            <option value="s3">AWS S3 / compatível</option>
          </select>
        </label>
        {f.armazenamentoModo === "s3" && (
          <>
            <div className="config-grid2">
              <Campo
                n="Endpoint S3"
                v={f.s3Endpoint}
                set={(v) => a("s3Endpoint", v)}
                p="Opcional para AWS"
              />
              <Campo
                n="Região"
                v={f.s3Regiao}
                set={(v) => a("s3Regiao", v)}
                p="sa-east-1"
              />
              <Campo
                n="Bucket"
                v={f.s3Bucket}
                set={(v) => a("s3Bucket", v)}
                p="moveon-conteudos"
              />
              <Campo
                n="URL pública/CDN"
                v={f.s3UrlPublica}
                set={(v) => a("s3UrlPublica", v)}
                p="https://cdn.exemplo.com"
              />
              <Campo
                n="Access Key"
                v={f.s3ChaveAcesso}
                set={(v) => a("s3ChaveAcesso", v)}
                p={
                  f.s3CredenciaisConfiguradas
                    ? "Credencial configurada"
                    : "Access Key"
                }
                senha
                desativado={!editar}
              />
              <Campo
                n="Secret Key"
                v={f.s3ChaveSecreta}
                set={(v) => a("s3ChaveSecreta", v)}
                p={
                  f.s3CredenciaisConfiguradas
                    ? "Credencial configurada"
                    : "Secret Key"
                }
                senha
                desativado={!editar}
              />
            </div>
            <Toggle
              n="Forçar path-style"
              v={f.s3ForcarPathStyle}
              set={(v) => a("s3ForcarPathStyle", v)}
            />
            <button
              type="button"
              className="habilitar-servidor-email"
              onClick={() => setEditar((v) => !v)}
            >
              {editar ? "Bloquear segredos" : "Alterar credenciais e segredos"}
            </button>
            <small>
              Novos uploads usarão o modo selecionado. O PostgreSQL guarda
              apenas metadados e URLs.
            </small>
          </>
        )}
      </Bloco>
      <Bloco
        icone={<BarChart3 />}
        titulo="Google Analytics 4"
        texto="A tag só é carregada após consentimento."
      >
        <Toggle
          n="Habilitar Analytics"
          v={f.analyticsAtivo}
          set={(v) => a("analyticsAtivo", v)}
        />
        <Campo
          n="ID de medição"
          v={f.analyticsIdMedicao}
          set={(v) => a("analyticsIdMedicao", v.toUpperCase())}
          p="G-XXXXXXXXXX"
        />
        <Toggle
          n="Exibir gestão de consentimento"
          v={f.consentimentoAtivo}
          set={(v) => a("consentimentoAtivo", v)}
        />
        <div className="permissoes-admin">
          <Toggle
            n="Análise e desempenho"
            v={f.permitirAnalytics}
            set={(v) => a("permitirAnalytics", v)}
          />
          <Toggle
            n="Preferências"
            v={f.permitirPreferencias}
            set={(v) => a("permitirPreferencias", v)}
          />
          <Toggle
            n="Marketing"
            v={f.permitirMarketing}
            set={(v) => a("permitirMarketing", v)}
          />
        </div>
      </Bloco>
      <Bloco
        icone={<Settings />}
        titulo="OpenTelemetry — logs OTLP"
        texto="Exportação estruturada em lote para o Collector interno."
      >
        <Toggle
          n="Habilitar exportação"
          v={f.otelAtivo}
          set={(v) => a("otelAtivo", v)}
        />
        <div className="config-grid2">
          <Campo
            n="Endpoint OTLP"
            v={f.otelEndpoint}
            set={(v) => a("otelEndpoint", v)}
            p="https://collector/v1/logs"
          />
          <Campo
            n="Nome do serviço"
            v={f.otelNomeServico}
            set={(v) => a("otelNomeServico", v)}
            p="portal-moveon"
          />
          <label>
            Nível mínimo
            <select
              value={f.otelNivelMinimo}
              onChange={(e) => a("otelNivelMinimo", e.target.value)}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </label>
          <label>
            Cabeçalhos OTLP
            <textarea
              rows={4}
              disabled={!editar}
              value={f.otelCabecalhos}
              onChange={(e) => a("otelCabecalhos", e.target.value)}
              placeholder={
                f.otelCabecalhosConfigurados
                  ? "Cabeçalhos protegidos configurados"
                  : "Authorization: Bearer ..."
              }
            />
          </label>
        </div>
        <small>
          Informe um cabeçalho por linha. Os valores são criptografados e não
          retornam ao navegador.
        </small>
      </Bloco>
      {msg && <p className="contato-retorno">{msg}</p>}
    </form>
  );
}
function Bloco({
  icone,
  titulo,
  texto,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  texto: string;
  children: React.ReactNode;
}) {
  return (
    <section className="dash-card">
      <div className="integracao-cabecalho">
        {icone}
        <div>
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
function Campo({
  n,
  v,
  set,
  p,
  senha = false,
  desativado = false,
}: {
  n: string;
  v: string;
  set: (v: string) => void;
  p: string;
  senha?: boolean;
  desativado?: boolean;
}) {
  return (
    <label>
      {n}
      <input
        type={senha ? "password" : "text"}
        value={v}
        disabled={desativado}
        placeholder={p}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
function Toggle({
  n,
  v,
  set,
}: {
  n: string;
  v: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <label className="interruptor-configuracao">
      <span>{n}</span>
      <input
        type="checkbox"
        checked={v}
        onChange={(e) => set(e.target.checked)}
      />
      <i />
    </label>
  );
}
