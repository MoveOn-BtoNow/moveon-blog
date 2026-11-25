export default function SecaoDiferenciais() {
  return (
    <section className="section off" id="diferenciais">
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">Por que a MOVE.ON é diferente.</h2>
        </div>
        <div className="diff-grid">
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <path d="M6 12l3-3 3 3 4-5" />
              </svg>
            </div>
            <h3>Plataforma proprietária (BTO.NOW)</h3>
            <p>Sua liderança acompanha o avanço dos projetos com indicadores atualizados, sem depender de reuniões para entender o cenário.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Mão na massa, junto com seu time</h3>
            <p>Atuamos dentro da operação, lado a lado com os times, acompanhando decisões e entregas até que a execução avance.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
            </div>
            <h3>Visão integrada de ponta a ponta</h3>
            <p>Conectamos a execução aos processos, plataformas, áreas envolvidas e objetivos da empresa, não apenas às entregas de tecnologia.</p>
          </article>
          <article className="diff-card reveal">
            <div className="diff-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </div>
            <h3>Decisão orientada a resultado e valor</h3>
            <p>Cada projeto é avaliado por impacto, investimento e retorno esperado, para que a liderança tenha segurança e transparência.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
