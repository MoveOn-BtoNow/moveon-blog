export default function SecaoComoComeca() {
  return (
    <section className="section off" id="como-comeca">
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Como estruturamos seu PMO</h2>
        </div>
        <ol className="timeline">
          <li className="timeline-step reveal">
            <span className="timeline-num">1</span>
            <h3>Alinhamento inicial</h3>
            <p>Entendemos o cenário atual, os desafios da operação, o nível de maturidade em gestão de projetos e a forma como são acompanhados hoje.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">2</span>
            <h3>Diagnóstico do portfólio</h3>
            <p>Mapeamos iniciativas em andamento, prioridades, responsáveis, prazos, riscos, indicadores e pontos de desalinhamento.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">3</span>
            <h3>Modelo de governança</h3>
            <p>Definimos ritos, fóruns, papéis, critérios de priorização e regras de decisão estruturadas, antes de partirmos para a implementação.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">4</span>
            <h3>Implantação do PMO</h3>
            <p>Estruturamos a rotina de acompanhamento com indicadores, dashboards, status reports, gestão de riscos e pontos de atenção.</p>
          </li>
          <li className="timeline-step reveal">
            <span className="timeline-num">5</span>
            <h3>Operação contínua</h3>
            <p>Ativamos o PMO Governance para acompanhar o portfólio, apoiar decisões e manter a execução alinhada à estratégia.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
