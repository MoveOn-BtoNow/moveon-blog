export default function SecaoComoComeca() {
  return (
    <section className="section off" id="como-comeca">
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Como começa a estruturação do seu CoE SAP</h2>
        </div>
        <ol className="timeline">
          <li className="timeline-step reveal">
            <span className="timeline-num">1</span>
            <h3>Conversa inicial</h3>
            <p>Entendemos o cenário atual, os desafios da operação e os principais riscos do ambiente SAP.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">2</span>
            <h3>Diagnóstico</h3>
            <p>Analisamos processos, integrações, customizações e pontos de melhoria.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">3</span>
            <h3>{"Roadmap "}</h3>
            <p>Definimos prioridades e organizamos um plano de evolução alinhado ao negócio.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">4</span>
            <h3>Estruturação CoE</h3>
            <p>Definimos papéis, responsabilidades e a governança do Centro de Excelência.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">5</span>
            <h3>Operação contínua</h3>
            <p style={{ width: "172px" }}>Ativamos o CoE SAP para acompanhar mudanças, garantir qualidade e apoiar a evolução.</p>
          </li>
        </ol>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="como-comeca" href="#form-coe">Falar com um especialista SAP</a>
        </div>
      </div>
    </section>
  );
}
