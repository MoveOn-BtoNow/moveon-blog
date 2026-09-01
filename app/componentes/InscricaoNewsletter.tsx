"use client";

import { FormEvent, useState } from "react";

export default function InscricaoNewsletter({ nome }: { nome: string }) {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function inscrever(evento: FormEvent) {
    evento.preventDefault();
    setMensagem("");
    setCadastroConcluido(false);
    setEnviando(true);
    try {
      const resposta = await fetch("/api/portal/newsletter", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      const dados = (await resposta.json().catch(() => ({}))) as {
        mensagem?: string;
        erro?: string;
      };
      if (!resposta.ok)
        throw new Error(dados.erro || "Não foi possível realizar o cadastro.");
      setEmail("");
      setCadastroConcluido(true);
      setMensagem(
        dados.mensagem ||
          "E-mail cadastrado com sucesso na newsletter MOVE.ON!",
      );
    } catch (erro) {
      setMensagem((erro as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="newsletter newsletter-publicacao">
      <span>NEWSLETTER {nome}</span>
      <h2>Conteúdo novo, direto no seu e-mail.</h2>
      <p>Receba uma mensagem sempre que uma nova publicação for lançada.</p>
      <form onSubmit={inscrever}>
        <input className="newsletter-armadilha" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="email" value={email} onChange={(evento) => setEmail(evento.target.value)} placeholder="seu@email.com" autoComplete="email" required />
        <button disabled={enviando}>{enviando ? "Cadastrando…" : "Quero receber"}</button>
      </form>
      {mensagem && (
        <small className={`newsletter-mensagem ${cadastroConcluido ? "sucesso" : "erro"}`} role={cadastroConcluido ? "status" : "alert"} aria-live="polite">
          {mensagem}
        </small>
      )}
    </section>
  );
}
