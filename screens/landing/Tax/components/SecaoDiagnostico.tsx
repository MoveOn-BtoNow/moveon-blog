export default function SecaoDiagnostico() {
  return (
    <section className="section off" id="diagnostico">
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">Como está a Reforma Tributária na sua empresa?</h2>
        </div>
        <div className="thermo-grid">
          <article className="thermo-card reveal" data-level="red">
            <div className="thermo-top">
              <span className="thermo-dot" aria-hidden="true" />
              <span className="thermo-label">Risco crítico</span>
              <span className="thermo-step">01</span>
            </div>
            <p className="thermo-quote">“Ainda não comecei a planejar”</p>
          </article>
          <article className="thermo-card reveal" data-level="orange">
            <div className="thermo-top">
              <span className="thermo-dot" aria-hidden="true" />
              <span className="thermo-label">Risco alto</span>
              <span className="thermo-step">02</span>
            </div>
            <p className="thermo-quote">“O tema já está no radar, mas ainda falta desenvolver as áreas”</p>
          </article>
          <article className="thermo-card reveal" data-level="yellow">
            <div className="thermo-top">
              <span className="thermo-dot" aria-hidden="true" />
              <span className="thermo-label">Atenção</span>
              <span className="thermo-step">03</span>
            </div>
            <p className="thermo-quote">“Estamos esperando a implementadora se manifestar”</p>
          </article>
          <article className="thermo-card reveal" data-level="green">
            <div className="thermo-top">
              <span className="thermo-dot" aria-hidden="true" />
              <span className="thermo-label">No caminho</span>
              <span className="thermo-step">04</span>
            </div>
            <p className="thermo-quote">“Já temos um plano, mas falta capacidade para executar”</p>
          </article>
        </div>
      </div>
    </section>
  );
}
