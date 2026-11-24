"use client";

import type { Lider } from "@/interfaces/conteudo-institucional";
import { useCarrossel } from "@/hooks/useCarrossel";
import { lideranca } from "../constants/conteudo";

/** 3 cartões lado a lado em qualquer tamanho de tela. */
const lideresPorVez = () => 3;

function IconeLinkedin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 9h4v12H2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CartaoLider({ lider }: { lider: Lider }) {
  const nome = (
    <div className="leader-name-row">
      <h3>{lider.nome}</h3>
      <a className="linkedin" href={lider.linkedin} target="_blank" rel="noreferrer" aria-label={lider.rotuloLinkedin}>
        <IconeLinkedin />
      </a>
    </div>
  );
  return (
    <article className="card leader-card">
      <span className="leader-card-frame-line" aria-hidden="true" />
      <div className="leader-photo">
        <img src={lider.foto.src} alt={lider.foto.alt} loading="lazy" decoding="async" />
      </div>
      {lider.etiquetas ? (
        <div className="leader-card-copy">
          {nome}
          <div className="role">{lider.cargo}</div>
          <p>{lider.descricao}</p>
          <div className="leader-tags">
            {lider.etiquetas.map((etiqueta) => (
              <span key={etiqueta} className="leader-tag">
                {etiqueta}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {nome}
          <div className="role">{lider.cargo}</div>
          <p>{lider.descricao}</p>
        </>
      )}
    </article>
  );
}

export default function SecaoLideranca() {
  const { trilhaRef, estiloTrilha, indice, maximo, anterior, proximo, irPara } = useCarrossel<HTMLDivElement>(lideranca.length, lideresPorVez);
  return (
    <section className="section dark" id="lideranca">
      <div className="grid-bg" />
      <div className="container">
        <div className="leadership-head">
          <div>
            <span className="eyebrow problem-badge reveal">Liderança</span>
            <h2 className="section-title reveal">Quem lidera a MOVE.ON</h2>
            <p className="section-copy reveal">
              Projetos críticos exigem método, mas também confiança. Conheça parte da liderança
              <br />
              que conduz a governança, a entrega e o relacionamento com nossos clientes.
            </p>
          </div>
          <div className="carousel-controls reveal" aria-label="Controles do carrossel de liderança">
            <button className="carousel-btn" type="button" aria-label="Anterior" disabled={indice === 0} onClick={anterior}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>{" "}
            <button className="carousel-btn" type="button" aria-label="Próximo" disabled={indice === maximo} onClick={proximo}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="leadership-carousel reveal">
          <div className="leadership-viewport">
            <div className="leadership-track" ref={trilhaRef} style={estiloTrilha}>
              {lideranca.map((lider) => (
                <CartaoLider key={lider.nome} lider={lider} />
              ))}
            </div>
          </div>
          <div className="carousel-dots" aria-label="Indicadores do carrossel">
            {Array.from({ length: maximo + 1 }, (_, posicao) => (
              <button
                key={posicao}
                className={posicao === indice ? "carousel-dot is-active" : "carousel-dot"}
                type="button"
                aria-label={`Ir para grupo ${posicao + 1}`}
                onClick={() => irPara(posicao)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
