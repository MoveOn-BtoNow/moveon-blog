"use client";

import { type FormEvent, useEffect, useState } from "react";
import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import type { Lead } from "@/interfaces/lead";
import { DESTINO_LEADS, abrirEmailComLead, enviarLead } from "@/services/lead.service";

const MENSAGENS = {
  enviando: "Enviando...",
  enviado: "Mensagem enviada! A equipe MOVE.ON vai entrar em contato em breve.",
  ativacao: `Quase lá: confirme a ativação no e-mail enviado para ${DESTINO_LEADS}. Abrindo seu e-mail para envio direto...`,
  falha: "Não foi possível enviar automaticamente. Abrindo seu programa de e-mail para enviar direto à MOVE.ON...",
};

/** Estado e envio do formulário de lead de uma landing page. */
export function useFormularioLead(configuracao: ConfiguracaoFormularioLead) {
  const [mensagem, setMensagem] = useState(configuracao.mensagemInicial);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!configuracao.focarAoNavegar) return;
    const aoClicar = (evento: MouseEvent) => {
      const link = (evento.target as Element | null)?.closest?.('a[href="#leadForm"]');
      if (link) setTimeout(() => document.getElementById("nome")?.focus({ preventScroll: true }), 400);
    };
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, [configuracao.focarAoNavegar]);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);
    const valor = (nome: string) => (dados.get(nome) || "").toString().trim();
    const nome = valor("nome");
    const empresa = valor("empresa");
    const lead: Lead = {
      assunto: `${configuracao.prefixoAssunto ?? "Contato via site MOVE.ON"} - ${empresa || nome}`,
      origem: configuracao.origem,
      email: valor("email"),
      campos: configuracao.campos.map((campo) => ({ rotulo: campo.rotuloEnvio, valor: valor(campo.nome) })),
    };

    setMensagem(MENSAGENS.enviando);
    setEnviando(true);
    const resultado = await enviarLead(lead);
    setEnviando(false);

    if (resultado === "enviado") {
      formulario.reset();
      setMensagem(MENSAGENS.enviado);
      return;
    }
    setMensagem(resultado === "ativacao-pendente" ? MENSAGENS.ativacao : MENSAGENS.falha);
    abrirEmailComLead(lead);
  }

  return { mensagem, enviando, aoEnviar };
}
