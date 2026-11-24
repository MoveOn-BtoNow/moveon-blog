export default function SecaoDiferenciais() {
  return (
    <section className="section off" id="diferenciais">
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">Por que escolher a MOVE.ON para a Reforma no seu SAP.</h2>
        </div>
        <div className="diff-grid">
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 3 3 5-6" />
                <path d="M21 8v3h-3" />
              </svg>
            </div>
            <h3>Expertise SAP e Fiscal</h3>
            <p>Unimos visão tributária, conhecimento SAP e gestão do programa para transformar exigências legais em processos e entregas executáveis.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5" cy="6" r="2.4" />
                <circle cx="19" cy="6" r="2.4" />
                <circle cx="12" cy="18" r="2.4" />
                <path d="M5 8.4v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3M12 13.4v2.2" />
              </svg>
            </div>
            <h3>Método integrado de ponta a ponta</h3>
            <p>Conectamos escopo, processos, SAP e sistemas integrados/satélites e acompanhamento executivo.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3>Independência de implementadora</h3>
            <p>Não vendemos licença SAP nem temos contrato de implementação amarrado. Defendemos só o seu interesse.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="9" r="5" />
                <path d="m8.5 13.5-2 7 5.5-3 5.5 3-2-7" />
              </svg>
            </div>
            <h3>Credibilidade no ecossistema SAP</h3>
            <p>Combinamos metodologia proprietária BTO, parcerias e valorização do ecossistema SAP para atuar em ambientes complexos.</p>
          </article>
        </div>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="diferenciais" href="#form-tax">Quero falar com um especialista</a>
        </div>
      </div>
    </section>
  );
}
