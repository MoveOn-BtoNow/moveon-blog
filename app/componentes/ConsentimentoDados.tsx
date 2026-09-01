"use client";
import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
type Config = {
  analyticsAtivo: boolean;
  analyticsIdMedicao: string;
  consentimentoAtivo: boolean;
  politicaDadosTexto: string;
  consentimentoTitulo: string;
  consentimentoTextoHtml: string;
  permitirAnalytics: boolean;
  permitirPreferencias: boolean;
  permitirMarketing: boolean;
  versaoPolitica: string;
};
type Escolhas = {
  analytics: boolean;
  preferencias: boolean;
  marketing: boolean;
};
const padrao = { analytics: false, preferencias: false, marketing: false };
function carregarAnalytics(id: string) {
  if (!id || document.querySelector(`script[data-ga-id="${id}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  s.dataset.gaId = id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...argumentos: unknown[]) => window.dataLayer!.push(argumentos);
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export default function ConsentimentoDados() {
  const [cfg, setCfg] = useState<Config | null>(null),
    [aberto, setAberto] = useState(false),
    [detalhes, setDetalhes] = useState(false),
    [escolhas, setEscolhas] = useState<Escolhas>(padrao);
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    fetch("/api/portal/privacidade/configuracao")
      .then(async (r) => (await r.json()) as Config)
      .then((c) => {
        setCfg(c);
        const salvo = localStorage.getItem("moveon_consentimento");
        if (salvo) {
          try {
            const d = JSON.parse(salvo) as Escolhas & { versao: string };
            if (d.versao === c.versaoPolitica) {
              setEscolhas(d);
              if (d.analytics && c.analyticsAtivo)
                carregarAnalytics(c.analyticsIdMedicao);
              return;
            }
          } catch { localStorage.removeItem("moveon_consentimento"); }
        }
        if (c.consentimentoAtivo) setAberto(true);
        else if (c.analyticsAtivo) carregarAnalytics(c.analyticsIdMedicao);
      })
      .catch(() => undefined);
  }, []);
  async function salvar(valor: Escolhas) {
    if (!cfg) return;
    const permitido = {
      analytics: cfg.permitirAnalytics && valor.analytics,
      preferencias: cfg.permitirPreferencias && valor.preferencias,
      marketing: cfg.permitirMarketing && valor.marketing,
    };
    localStorage.setItem(
      "moveon_consentimento",
      JSON.stringify({ ...permitido, versao: cfg.versaoPolitica }),
    );
    setEscolhas(permitido);
    setAberto(false);
    if (permitido.analytics && cfg.analyticsAtivo)
      carregarAnalytics(cfg.analyticsIdMedicao);
    await fetch("/api/portal/privacidade/consentimento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permitido),
    }).catch(() => undefined);
  }
  if (!cfg?.consentimentoAtivo) return null;
  return (
    <>
      {aberto && (
        <div className="consentimento-overlay">
          <section
            className="consentimento-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-consentimento"
          >
            <div className="consentimento-icone">
              <Cookie />
            </div>
            <button
              className="fechar-consentimento"
              aria-label="Fechar"
              onClick={() => setAberto(false)}
            >
              <X />
            </button>
            <h2 id="titulo-consentimento">{cfg.consentimentoTitulo || "Sua privacidade, sua escolha"}</h2>
            <div className="texto-consentimento-formatado" dangerouslySetInnerHTML={{__html:cfg.consentimentoTextoHtml || `<p>${cfg.politicaDadosTexto}</p>`}} />
            {detalhes && (
              <div className="permissoes-consentimento">
                <label>
                  <span>
                    <b>Essenciais</b>
                    <small>Segurança, sessão e funcionamento do portal.</small>
                  </span>
                  <input aria-label="Permissão essencial sempre ativa" type="checkbox" checked disabled />
                  <i />
                </label>
                {cfg.permitirAnalytics && (
                  <label>
                    <span>
                      <b>Análise e desempenho</b>
                      <small>
                        Ajuda a entender o uso e melhorar o conteúdo.
                      </small>
                    </span>
                    <input
                      aria-label="Permitir análise e desempenho"
                      type="checkbox"
                      checked={escolhas.analytics}
                      onChange={(e) =>
                        setEscolhas({
                          ...escolhas,
                          analytics: e.target.checked,
                        })
                      }
                    />
                    <i />
                  </label>
                )}
                {cfg.permitirPreferencias && (
                  <label>
                    <span>
                      <b>Preferências</b>
                      <small>Memoriza escolhas não essenciais do portal.</small>
                    </span>
                    <input
                      aria-label="Permitir preferências"
                      type="checkbox"
                      checked={escolhas.preferencias}
                      onChange={(e) =>
                        setEscolhas({
                          ...escolhas,
                          preferencias: e.target.checked,
                        })
                      }
                    />
                    <i />
                  </label>
                )}
                {cfg.permitirMarketing && (
                  <label>
                    <span>
                      <b>Marketing</b>
                      <small>
                        Permite mensuração e personalização de campanhas.
                      </small>
                    </span>
                    <input
                      aria-label="Permitir marketing"
                      type="checkbox"
                      checked={escolhas.marketing}
                      onChange={(e) =>
                        setEscolhas({
                          ...escolhas,
                          marketing: e.target.checked,
                        })
                      }
                    />
                    <i />
                  </label>
                )}
              </div>
            )}
            <a href="/politica-de-privacidade">Ler Política de Privacidade</a>
            <div className="acoes-consentimento">
              <button onClick={() => void salvar(padrao)}>
                Recusar opcionais
              </button>
              <button onClick={() => setDetalhes((v) => !v)}>
                <Settings2 />
                Personalizar
              </button>
              <button
                className="primario"
                onClick={() =>
                  void salvar({
                    analytics: cfg.permitirAnalytics,
                    preferencias: cfg.permitirPreferencias,
                    marketing: cfg.permitirMarketing,
                  })
                }
              >
                Aceitar permitidos
              </button>
            </div>
            {detalhes && (
              <button
                className="salvar-preferencias"
                onClick={() => void salvar(escolhas)}
              >
                Salvar minhas preferências
              </button>
            )}
          </section>
        </div>
      )}
      <button
        className="abrir-privacidade"
        onClick={() => setAberto(true)}
        aria-label="Gerenciar preferências de privacidade"
        title="Privacidade"
      >
        <Cookie />
      </button>
    </>
  );
}
