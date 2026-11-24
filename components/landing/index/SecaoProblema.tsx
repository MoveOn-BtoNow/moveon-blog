export default function SecaoProblema() {
  return (
    <section className="section dark" id="problema">
      <div className="grid-bg" />
      <div className="container">
        <span className="eyebrow problem-badge reveal">Desafios da gestão</span>
        <h2 className="section-title reveal">O que resolvemos na prática</h2>
        <p className="section-copy reveal">Empresas em transformação não precisam de mais complexidade.<br />Precisam de clareza, método e governança. A MOVE.ON entra aqui.</p>
        <div className="problem-grid">
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h8M5 10h14M7 14h5M7 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M21 20l-1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Projetos desorganizados</h3>
            <p>Prazos, custos e escopo mudam rápido quando não existe uma gestão clara. Organizar a execução desde o início evita que o resultado seja comprometido.</p>
          </article>
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 19V5M4 19h16M8 15v-2M12 15V9M16 15v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
                <path d="M17.5 5H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
              </svg>
            </div>
            <h3>Decisão sem dados</h3>
            <p>A operação roda, mas você não enxerga onde está o gargalo. Sem processos organizados e indicadores confiáveis, a gestão perde clareza para decidir.</p>
          </article>
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14v-3M12 14l1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>SAP em risco</h3>
            <p>Projetos SAP exigem alinhamento entre tecnologia, processos e negócio. Sem governança, a implementação perde ritmo, clareza e qualidade na entrega.</p>
          </article>
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 3h12l3 6H3l3-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" stroke="currentColor" strokeWidth="2" />
                <path d="M9 13h6M12 13v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Reforma Tributária sem plano</h3>
            <p>Novas regras exigem ajustes em áreas, processos e no sistema SAP. Sem uma gestão integrada, cada frente avança de um jeito e o risco aumenta.</p>
          </article>
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 12h5M14 5.5l-1 4.5M14 18.5l-1-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Processos sem clareza</h3>
            <p>Quando processos não estão bem estruturados, a empresa gasta mais tempo, dinheiro e energia para entregar o mesmo resultado.</p>
          </article>
          <article className="card dark-card reveal">
            <span className="problem-card-line" aria-hidden="true" />
            <div className="problem-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="4" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="8.5" y="15" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <path d="M10 7h4M12 10v5M8.5 18H6a2 2 0 0 1-2-2v-4M15.5 18H18a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Plataformas desconectadas</h3>
            <p>Sistemas e processos não conversam entre si. Sem uma gestão clara das plataformas, a tecnologia vira mais uma camada de complexidade para a operação.</p>
          </article>
        </div>
        <div className="hero-actions reveal" style={{ justifyContent: "center" }}>
          <a className="btn btn-primary" href="#servicos">Encontrar a frente certa</a>
        </div>
      </div>
    </section>
  );
}
