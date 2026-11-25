import type { TituloSecao } from "@/interfaces/secoes";

/** Etiqueta, título e textos de apoio de uma seção (bloco `.section-head`). */
export default function CabecalhoSecao({ etiqueta, titulo, textos }: TituloSecao) {
  return (
    <div className="section-head">
      <span className="tag">{etiqueta}</span>
      <h2>{titulo}</h2>
      {textos?.map((texto) => (
        <p key={texto}>{texto}</p>
      ))}
    </div>
  );
}
