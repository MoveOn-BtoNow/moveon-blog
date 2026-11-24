"use client";
import { Building2, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import CabecalhoPortal from "../componentes/CabecalhoPortal";
import RodapePortal from "../componentes/RodapePortal";

type Config = {
  exibirContato: boolean;
  exibirFormulario: boolean;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  horario: string;
  recaptchaAtivo: boolean;
  recaptchaChaveSite: string;
};
declare global {
  interface Window {
    grecaptcha?: {
      ready: (fn: () => void) => void;
      execute: (chave: string, opcoes: { action: string }) => Promise<string>;
    };
  }
}
const inicial = {
  nome: "",
  email: "",
  empresa: "",
  cargo: "",
  clienteSap: "nao_sei",
  desafio: "",
  website: "",
};

export default function PaginaContato() {
  const [config, setConfig] = useState<Config | null>(null),
    [form, setForm] = useState(inicial),
    [estado, setEstado] = useState(""),
    [enviando, setEnviando] = useState(false);
  useEffect(() => {
    fetch("/api/portal/contato/configuracao")
      .then(async (r) => (await r.json()) as Config)
      .then((d) => {
        setConfig(d);
        if (
          d.recaptchaAtivo &&
          d.recaptchaChaveSite &&
          !document.querySelector("script[data-moveon-recaptcha]")
        ) {
          const s = document.createElement("script");
          s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(d.recaptchaChaveSite)}&trustedtypes=true`;
          s.async = true;
          s.defer = true;
          s.dataset.moveonRecaptcha = "true";
          document.head.appendChild(s);
        }
      })
      .catch(() => setEstado("Não foi possível carregar os dados de contato."));
  }, []);
  const token = () =>
    new Promise<string>((resolver, rejeitar) => {
      if (!config?.recaptchaAtivo) return resolver("");
      const limite = setTimeout(
        () =>
          rejeitar(
            new Error("A proteção anti-robô não carregou. Tente novamente."),
          ),
        8000,
      );
      window.grecaptcha?.ready(() =>
        window
          .grecaptcha!.execute(config.recaptchaChaveSite, { action: "contato" })
          .then((v) => {
            clearTimeout(limite);
            resolver(v);
          })
          .catch(rejeitar),
      );
    });
  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setEstado("");
    try {
      const tokenRecaptcha = await token();
      const r = await fetch("/api/portal/contato/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tokenRecaptcha }),
      });
      const d = (await r.json()) as { erro?: string; mensagem?: string };
      if (!r.ok) throw new Error(d.erro || "Não foi possível enviar.");
      setForm(inicial);
      setEstado(d.mensagem || "Mensagem enviada.");
    } catch (erro) {
      setEstado(
        erro instanceof Error ? erro.message : "Não foi possível enviar.",
      );
    } finally {
      setEnviando(false);
    }
  }
  if (config && !config.exibirContato)
    return (
      <>
        <CabecalhoPortal />
        <main className="contato-indisponivel">
          <h1>Contato indisponível</h1>
          <p>Esta página está temporariamente desativada.</p>
        </main>
        <RodapePortal />
      </>
    );
  return (
    <div className="site-shell">
      <CabecalhoPortal />
      <main className="pagina-contato">
        <header>
          <span>FALE COM A MOVE.ON</span>
          <h1>Vamos transformar seu desafio em um plano claro.</h1>
          <p>
            Conte o contexto da sua empresa. Nossa equipe receberá as
            informações diretamente e entrará em contato.
          </p>
        </header>
        <div
          className={`contato-layout ${!config?.exibirFormulario ? "somente-dados" : ""}`}
        >
          {config?.exibirFormulario && (
            <form className="formulario-contato" onSubmit={enviar}>
              <div className="contato-campos">
                <label>
                  Nome
                  <input
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </label>
                <label>
                  E-mail corporativo
                  <input
                    required
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="nome@empresa.com.br"
                  />
                </label>
                <label>
                  Empresa
                  <input
                    required
                    maxLength={160}
                    autoComplete="organization"
                    value={form.empresa}
                    onChange={(e) =>
                      setForm({ ...form, empresa: e.target.value })
                    }
                    placeholder="Nome da empresa"
                  />
                </label>
                <label>
                  Cargo
                  <input
                    required
                    maxLength={120}
                    autoComplete="organization-title"
                    value={form.cargo}
                    onChange={(e) =>
                      setForm({ ...form, cargo: e.target.value })
                    }
                    placeholder="Seu cargo"
                  />
                </label>
              </div>
              <label>
                É cliente SAP?
                <select
                  value={form.clienteSap}
                  onChange={(e) =>
                    setForm({ ...form, clienteSap: e.target.value })
                  }
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="nao_sei">Não sei</option>
                </select>
              </label>
              <label>
                Qual o seu desafio?
                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={8}
                  value={form.desafio}
                  onChange={(e) =>
                    setForm({ ...form, desafio: e.target.value })
                  }
                  placeholder="Descreva o cenário, objetivo ou desafio da sua empresa…"
                />
              </label>
              <input
                className="contato-armadilha"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <small>
                Seus dados são enviados diretamente para a equipe MOVE.ON.
              </small>
              <button className="primario" disabled={enviando}>
                <Send />
                {enviando ? "Enviando…" : "Enviar mensagem"}
              </button>
              {estado && (
                <p className="contato-retorno" role="status">
                  {estado}
                </p>
              )}
            </form>
          )}
          <aside className="dados-contato">
            <span>CONTATO DIRETO</span>
            <h2>Prefere outro canal?</h2>
            <p>Use os dados cadastrados pela equipe MOVE.ON.</p>
            {config?.email && (
              <a href={`mailto:${config.email}`}>
                <Mail />
                <div>
                  <small>E-mail</small>
                  <strong>{config.email}</strong>
                </div>
              </a>
            )}
            {config?.telefone && (
              <a href={`tel:${config.telefone.replace(/\D/g, "")}`}>
                <Phone />
                <div>
                  <small>Telefone</small>
                  <strong>{config.telefone}</strong>
                </div>
              </a>
            )}
            {config?.whatsapp && (
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone />
                <div>
                  <small>WhatsApp</small>
                  <strong>{config.whatsapp}</strong>
                </div>
              </a>
            )}
            {config?.endereco && (
              <div className="dado-contato">
                <MapPin />
                <div>
                  <small>Endereço</small>
                  <strong>{config.endereco}</strong>
                </div>
              </div>
            )}
            {config?.horario && (
              <div className="dado-contato">
                <Clock3 />
                <div>
                  <small>Atendimento</small>
                  <strong>{config.horario}</strong>
                </div>
              </div>
            )}
            {!config && (
              <div className="dado-contato">
                <Building2 />
                <strong>Carregando dados…</strong>
              </div>
            )}
          </aside>
        </div>
      </main>
      <RodapePortal />
    </div>
  );
}
