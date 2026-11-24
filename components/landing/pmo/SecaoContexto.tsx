export default function SecaoContexto() {
  return (
    <section className="section off" id="contexto">
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">O problema é maior do que você imagina.</h2>
        </div>
        <div className="stat-row">
          <div className="stat reveal">
            <strong>
              <span className="metric-number" data-target="50">0</span>
              <span className="pct">%</span>
            </strong>
            <span>dos projetos atrasam</span>
            <span className="stat-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.2 2" />
              </svg>
            </span>
          </div>
          <div className="stat reveal">
            <strong>
              <span className="metric-number" data-target="60">0</span>
              <span className="pct">%</span>
            </strong>
            <span>estouram orçamento</span>
            <span className="stat-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M21 7v6h-6" />
              </svg>
            </span>
          </div>
          <div className="stat reveal">
            <strong>
              <span className="metric-number" data-target="30">0</span>
              <span className="pct">%</span>
            </strong>
            <span>são considerados bem-sucedidos</span>
            <span className="stat-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </span>
          </div>
        </div>
        <p className="data-source reveal">Fonte: Team Building April 2026 MOVE.ON</p>
        <div className="context-closer reveal">
          <p>E sabe o que esses números têm em comum? Quase nenhum problema é por falha técnica. <strong>Projetos não falham na execução. Falham na gestão.</strong></p>
          <a className="btn btn-primary cta-track" data-cta="contexto" href="#form-pmo">Quero resolver esse problema</a>
        </div>
      </div>
    </section>
  );
}
