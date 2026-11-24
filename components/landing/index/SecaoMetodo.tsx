import AbasBto from "./AbasBto";

/** Seção da metodologia BTO. Está oculta (display: none) também no HTML original. */
export default function SecaoMetodo() {
  return (
    <section className="section dark bto-method-section" id="metodo" style={{ display: "none" }}>
      <div className="grid-bg" />
      <div className="container">
        <div style={{ textAlign: "center" }}>
          <span className="eyebrow problem-badge reveal">BTO Methodology</span>
        </div>
        <h2 className="section-title reveal" style={{ marginInline: "auto", textAlign: "center" }}>Nossa metodologia proprietária</h2>
        <p className="section-copy reveal" style={{ marginInline: "auto", textAlign: "center" }}>O BTO (Business Transformation Office) é a metodologia da MOVE.ON para integrar projetos, processos, tecnologia, pessoas, riscos e valor em uma única estrutura de governança.</p>
        <div className="bto-pillars reveal">
          <div className="bto-pillar">
            <div className="bto-pillar-head">
              <div className="bto-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <strong>Gestão integrada</strong>
            </div>
            <span>Reúne as principais frentes de transformação em uma estrutura integrada de gestão.</span>
          </div>
          <div className="bto-pillar">
            <div className="bto-pillar-head">
              <div className="bto-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <strong>6 escritórios especializados</strong>
            </div>
            <span>Gestão de Projetos, Processos, Plataformas, Mudança, Riscos e Valor.</span>
          </div>
          <div className="bto-pillar">
            <div className="bto-pillar-head">
              <div className="bto-pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                  <path d="M6 12l3-3 3 3 4-5" />
                </svg>
              </div>
              <strong>BTO.NOW</strong>
            </div>
            <span>Plataforma proprietária para acompanhar governança, indicadores e evolução.</span>
          </div>
        </div>
        <AbasBto />
        <div className="hero-actions reveal" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary" href="#contato">Aplicar o método no meu cenário</a>
        </div>
      </div>
    </section>
  );
}
