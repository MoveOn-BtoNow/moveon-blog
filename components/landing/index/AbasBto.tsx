"use client";

import { Fragment, useState } from "react";
import { escritoriosBto } from "./conteudo";

const numero = (indice: number) => String(indice + 1).padStart(2, "0");

/** Abas (desktop) e acordeão (mobile) dos escritórios da metodologia BTO. */
export default function AbasBto() {
  const [ativo, setAtivo] = useState<number | null>(0);
  const alternarAcordeao = (indice: number) => setAtivo((atual) => (atual === indice ? null : indice));

  return (
    <div className="bto-tabs-wrap reveal">
      <div className="bto-sidebar" role="tablist" aria-label="Escritórios BTO">
        {escritoriosBto.map((escritorio, indice) => (
          <Fragment key={escritorio.sigla}>
            {indice > 0 && " "}
            <button
              className={ativo === indice ? "bto-tab-btn is-active" : "bto-tab-btn"}
              role="tab"
              aria-selected={ativo === indice}
              onClick={() => setAtivo(indice)}
            >
              <span className="bto-tab-num">{numero(indice)}</span>
              <span className="bto-tab-info">
                <span className="bto-sigla">{escritorio.sigla}</span>
                <span className="bto-tab-name">{escritorio.nome}</span>
              </span>
            </button>
          </Fragment>
        ))}
      </div>
      <div className="bto-content-panel">
        {escritoriosBto.map((escritorio, indice) => (
          <div key={escritorio.sigla} className={ativo === indice ? "bto-tab-content is-active" : "bto-tab-content"}>
            <button className="bto-acc-btn" onClick={() => alternarAcordeao(indice)}>
              <div className="bto-acc-btn-left">
                <span className="bto-acc-num">{numero(indice)}</span>
                <div className="bto-acc-text">
                  <span className="bto-sigla">{escritorio.sigla}</span>
                  <span className="bto-tab-name">{escritorio.nome}</span>
                </div>
              </div>
              <svg className="bto-acc-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="bto-tab-body">
              <div className="bto-tab-text">
                <span className="bto-office-tag">{escritorio.sigla}</span>
                <h3>{escritorio.titulo}</h3>
                <p>{escritorio.descricao}</p>
              </div>
              {escritorio.imagem ? (
                <div className="bto-img-ph has-image">
                  <img src={escritorio.imagem.src} alt={escritorio.imagem.alt} />
                </div>
              ) : (
                <div className="bto-img-ph">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <span>Imagem</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
