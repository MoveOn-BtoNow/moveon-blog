export default function SecaoSolucao() {
  return (
    <section className="section dark" id="solucao">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">Por isso desenhamos nossas soluções PMO Governance</h2>
        </div>
        <div className="solution-list">
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">01</span>
              {" "}
              <span className="card-tag">Para estruturar a governança</span>
              <h3>PMO Organizer</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.66)" }}>Estruturamos a base do PMO, definindo papéis, ritos, fóruns, indicadores e padrões de acompanhamento.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Estrutura inicial de governança implantada</li>
                <li>Ritos, fóruns e responsabilidades definidos</li>
                <li>Método, templates e cadências padronizadas</li>
                <li>Mais visibilidade executiva sobre o portfólio</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">02</span>
              {" "}
              <span className="card-tag">Para múltiplas iniciativas</span>
              <h3>PMO Scale Up</h3>
              <p>Operamos a rotina do portfólio, centralizando informações, riscos, prazos e decisões em cadência disciplinada.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Controle contínuo do portfólio com dashboards executivos</li>
                <li>Decisões estruturadas, rastreáveis e seguras</li>
                <li>Gestão recorrente de riscos, prazo, custo e escopo</li>
                <li>Menos ruído entre áreas e maior capacidade de resposta</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">03</span>
              {" "}
              <span className="card-tag">Para transformações complexas</span>
              <h3>PMO Transform</h3>
              <p>Orquestramos programas que exigem mais controle, integração entre frentes e sustentação da captura de valor.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Governança reforçada para programas de transformação</li>
                <li>Escalonamento rápido de riscos e decisões críticas</li>
                <li>Controle de marcos, dependências e impactos relevantes</li>
                <li>Sustentação do business case ao longo da execução</li>
              </ul>
            </div>
          </article>
        </div>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="solucao" href="#form-pmo">Quero falar com a MOVE.ON</a>
        </div>
      </div>
    </section>
  );
}
