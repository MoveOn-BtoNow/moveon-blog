"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

type ConfiguracaoRedes = {
  exibirRedesSociais: boolean;
  redesSociais?: RedeSocial[];
};
type RedeSocial = {
  id: string;
  nome: string;
  enderecoUrl: string;
  caminhoIcone?: string | null;
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
    if (configuracao) return;
    fetch("/api/portal/inicial")
      .then(async (resposta) =>
        (await resposta.json()) as {
          configuracoes: ConfiguracaoRedes;
          redesSociais?: RedeSocial[];
        },
      )
      .then((resultado) =>
        setDados({
          ...resultado.configuracoes,
          redesSociais: resultado.redesSociais ?? [],
        }),
      )
      .catch(() => setDados(null));
  }, [configuracao]);

  const configuracaoAtiva = configuracao ?? dados;
  if (!configuracaoAtiva?.exibirRedesSociais) return null;
  const redes = configuracaoAtiva.redesSociais ?? [];
  if (!redes.length) return null;

  return (
    <nav className="redes-sociais-flutuantes" aria-label="Redes sociais da MOVE.ON">
      {redes.map((rede) => (
        <a
          href={rede.enderecoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Acessar a MOVE.ON no ${rede.nome} (abre em nova aba)`}
          title={`MOVE.ON no ${rede.nome}`}
          key={rede.id}
        >
          {rede.caminhoIcone ? (
            <img src={rede.caminhoIcone} alt="" aria-hidden="true" />
          ) : /^instagram$/i.test(rede.nome) ? (
            <FaInstagram aria-hidden="true" />
          ) : (
            <FaLinkedinIn aria-hidden="true" />
          )}
          <span>{rede.nome}</span>
        </a>
      ))}
    </nav>
  );
}
