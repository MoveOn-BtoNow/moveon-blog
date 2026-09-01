"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

type ConfiguracaoRedes = {
  exibirRedesSociais: boolean;
  instagramUrl: string;
  linkedinUrl: string;
};

export default function RedesSociaisFlutuantes({
  configuracao,
}: {
  configuracao?: ConfiguracaoRedes;
}) {
  const [dados, setDados] = useState<ConfiguracaoRedes | null>(
    configuracao ?? null,
  );

  useEffect(() => {
    if (configuracao) {
      setDados(configuracao);
      return;
    }
    fetch("/api/portal/inicial")
      .then(async (resposta) =>
        (await resposta.json()) as { configuracoes: ConfiguracaoRedes },
      )
      .then((resultado) => setDados(resultado.configuracoes))
      .catch(() => setDados(null));
  }, [configuracao]);

  if (!dados?.exibirRedesSociais) return null;
  const redes = [
    dados.instagramUrl
      ? { nome: "Instagram", url: dados.instagramUrl, icone: <FaInstagram aria-hidden="true" /> }
      : null,
    dados.linkedinUrl
      ? { nome: "LinkedIn", url: dados.linkedinUrl, icone: <FaLinkedinIn aria-hidden="true" /> }
      : null,
  ].filter((rede): rede is NonNullable<typeof rede> => Boolean(rede));
  if (!redes.length) return null;

  return (
    <nav className="redes-sociais-flutuantes" aria-label="Redes sociais da MOVE.ON">
      {redes.map((rede) => (
        <a
          href={rede.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Acessar a MOVE.ON no ${rede.nome} (abre em nova aba)`}
          title={`MOVE.ON no ${rede.nome}`}
          key={rede.nome}
        >
          {rede.icone}
          <span>{rede.nome}</span>
        </a>
      ))}
    </nav>
  );
}
