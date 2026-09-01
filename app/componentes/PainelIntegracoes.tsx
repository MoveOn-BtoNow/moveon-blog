"use client";
import { BarChart3, Cloud, Settings } from "lucide-react";
import { useEffect, useState } from "react";
type Servico = "armazenamento" | "analytics" | "opentelemetry";
type C = {
  armazenamentoModo: "local" | "s3";
  s3Endpoint: string;
  s3Regiao: string;
  s3Bucket: string;
  s3Autenticacao: "iam_role" | "chaves";
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
  const d = (await r.json()) as T & {
    erro?: string;
    detalhes?: { fieldErrors?: Record<string, string[]> };
  };
  if (!r.ok) {
    const campos = Object.entries(d.detalhes?.fieldErrors || {})
      .flatMap(([campo, erros]) => erros.map((erro) => `${campo}: ${erro}`))
      .join(" ");
    throw new Error(
      [d.erro || "Não foi possível concluir.", campos].filter(Boolean).join(" "),
    );
  }
  return d;
}
export default function PainelIntegracoes() {
  const [f, setF] = useState<C | null>(null),
    [editarS3, setEditarS3] = useState(false),
    [editarOtel, setEditarOtel] = useState(false),
    [mensagens, setMensagens] = useState<Partial<Record<Servico, string>>>({}),
    [salvando, setSalvando] = useState<Servico | null>(null),
    [erroInicial, setErroInicial] = useState("");
  useEffect(() => {
    api<C>("/painel/integracoes")
      .then(setF)
      .catch((e) => setErroInicial(e.message));
  }, []);
  if (!f) return <div className="tela-estado">Carregando integrações…</div>;
  const a = (k: keyof C, v: unknown) => setF({ ...f, [k]: v });
  async function salvar(servico: Servico) {
    if (!f) return;
    const dados: Record<Servico, Record<string, unknown>> = {
      armazenamento: {
        armazenamentoModo: f.armazenamentoModo,
        s3Endpoint: f.s3Endpoint,
        s3Regiao: f.s3Regiao,
        s3Bucket: f.s3Bucket,
        s3Autenticacao: f.s3Autenticacao,
        s3ChaveAcesso: f.s3ChaveAcesso,
        s3ChaveSecreta: f.s3ChaveSecreta,
        s3UrlPublica: f.s3UrlPublica,
        s3ForcarPathStyle: f.s3ForcarPathStyle,
      },
      analytics: {
        analyticsAtivo: f.analyticsAtivo,
        analyticsIdMedicao: f.analyticsIdMedicao,
        consentimentoAtivo: f.consentimentoAtivo,
        permitirAnalytics: f.permitirAnalytics,
        permitirPreferencias: f.permitirPreferencias,
        permitirMarketing: f.permitirMarketing,
      },
      opentelemetry: {
        otelAtivo: f.otelAtivo,
        otelEndpoint: f.otelEndpoint,
        otelCabecalhos: f.otelCabecalhos,
        otelNomeServico: f.otelNomeServico,
        otelNivelMinimo: f.otelNivelMinimo,
      },
    };
    setSalvando(servico);
    setMensagens((atual) => ({ ...atual, [servico]: "" }));
    try {
      setF(
        await api<C>(`/painel/integracoes/${servico}`, {
          method: "PUT",
          body: JSON.stringify(dados[servico]),
        }),
      );
      if (servico === "armazenamento") setEditarS3(false);
      if (servico === "opentelemetry") setEditarOtel(false);
      setMensagens((atual) => ({
        ...atual,
        [servico]: "Configuração salva com sucesso.",
      }));
    } catch (e) {
      setMensagens((atual) => ({
        ...atual,
        [servico]: (e as Error).message,
      }));
    } finally {
      setSalvando(null);
    }
  }
  return (
    <div className="pagina2 integracoes-admin">
      <div className="card-head2">
        <div>
          <span>INFRAESTRUTURA E DADOS</span>
          <h2>Integrações</h2>
        </div>
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
              <label>
                Autenticação no S3
                <select
                  value={f.s3Autenticacao}
                  onChange={(e) =>
                    a("s3Autenticacao", e.target.value as C["s3Autenticacao"])
                  }
                >
                  <option value="iam_role">IAM Role / credenciais automáticas</option>
                  <option value="chaves">Access Key e Secret Key</option>
                </select>
              </label>
              {f.s3Autenticacao === "chaves" && (
                <>
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
                    desativado={!editarS3}
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
                    desativado={!editarS3}
                  />
                </>
              )}
            </div>
            <Toggle
              n="Forçar path-style"
              v={f.s3ForcarPathStyle}
              set={(v) => a("s3ForcarPathStyle", v)}
            />
            {f.s3Autenticacao === "chaves" && (
              <button
                type="button"
                className="habilitar-servidor-email"
                onClick={() => setEditarS3((v) => !v)}
              >
                {editarS3
                  ? "Bloquear segredos"
                  : "Alterar credenciais e segredos"}
              </button>
            )}
            <small>
              {f.s3Autenticacao === "iam_role"
                ? "A aplicação usará automaticamente a IAM Role associada à EC2. Para arquivos privados, configure uma URL pública/CDN com acesso autorizado."
                : "As chaves são criptografadas antes de serem armazenadas. O PostgreSQL guarda apenas metadados e URLs dos arquivos."}
            </small>
          </>
        )}
        <AcaoSalvar
          carregando={salvando === "armazenamento"}
          mensagem={mensagens.armazenamento}
          onClick={() => salvar("armazenamento")}
          texto="Salvar armazenamento"
        />
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
        <AcaoSalvar
          carregando={salvando === "analytics"}
          mensagem={mensagens.analytics}
          onClick={() => salvar("analytics")}
          texto="Salvar Google Analytics"
        />
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
              disabled={!editarOtel}
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
        <button
          type="button"
          className="habilitar-servidor-email"
          onClick={() => setEditarOtel((valor) => !valor)}
        >
          {editarOtel ? "Bloquear cabeçalhos" : "Alterar cabeçalhos protegidos"}
        </button>
        <small>
          Informe um cabeçalho por linha. Os valores são criptografados e não
          retornam ao navegador.
        </small>
        <AcaoSalvar
          carregando={salvando === "opentelemetry"}
          mensagem={mensagens.opentelemetry}
          onClick={() => salvar("opentelemetry")}
          texto="Salvar OpenTelemetry"
        />
      </Bloco>
      {erroInicial && <p className="contato-retorno">{erroInicial}</p>}
    </div>
  );
}
function AcaoSalvar({
  carregando,
  mensagem,
  onClick,
  texto,
}: {
  carregando: boolean;
  mensagem?: string;
  onClick: () => void;
  texto: string;
}) {
  return (
    <div className="acao-integracao">
      <button
        type="button"
        className="primario"
        disabled={carregando}
        onClick={onClick}
      >
        {carregando ? "Salvando…" : texto}
      </button>
      {mensagem && <p className="contato-retorno">{mensagem}</p>}
    </div>
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
