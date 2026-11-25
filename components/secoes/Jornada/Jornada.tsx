import { Fragment } from "react";

/** Etapas em linha separadas por setas (usado no hero). */
export default function Jornada({ etapas }: { etapas: string[] }) {
  return (
    <div className="journey">
      {etapas.map((etapa, indice) => (
        <Fragment key={etapa}>
          {indice > 0 && <span className="sep">→</span>}
          <b>{etapa}</b>
        </Fragment>
      ))}
    </div>
  );
}
