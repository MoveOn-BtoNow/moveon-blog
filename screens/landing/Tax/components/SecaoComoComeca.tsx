export default function SecaoComoComeca() {
  return (
    <section className="section off" id="como-comeca">
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Como começa a adequação da Reforma Tributária no seu SAP</h2>
        </div>
        <ol className="timeline cols-4">
          <li className="timeline-step reveal">
            <span className="timeline-num">1</span>
            <h3>Conversa inicial</h3>
            <p>Entendemos o cenário atual da empresa, o ambiente SAP utilizado, o que já foi feito e quais pontos precisam ser avaliados.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">2</span>
            <h3>Mapeamento de impactos</h3>
            <p>Identificamos como a Reforma Tributária impacta processos, dados, obrigações fiscais, sistemas e áreas envolvidas.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">3</span>
            <h3>Plano de adequação</h3>
            <p>Organizamos prioridades, escopo, responsabilidades, prazos, riscos, testes e frentes de atuação para conduzir a adequação.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">4</span>
            <h3>Acompanhamento</h3>
            <p>Apoiamos a adequação no SAP e sistemas integrados. Acompanhamos também as mudanças regulatórias.</p>
          </li>
        </ol>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="como-comeca" href="#form-tax">Falar com Especialista</a>
        </div>
      </div>
    </section>
  );
}
