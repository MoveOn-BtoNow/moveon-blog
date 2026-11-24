"use client";

import { useState } from "react";

interface AvatarDepoimentoProps {
  nome: string;
  iniciais: string;
  foto?: string;
}

/** Foto do autor do depoimento; se a imagem falhar, ficam só as iniciais. */
export default function AvatarDepoimento({ nome, iniciais, foto }: AvatarDepoimentoProps) {
  const [falhou, setFalhou] = useState(false);
  return (
    <div className="case-avatar">
      {foto && !falhou && <img src={foto} alt={nome} loading="eager" decoding="async" onError={() => setFalhou(true)} />}
      <span>{iniciais}</span>
    </div>
  );
}
