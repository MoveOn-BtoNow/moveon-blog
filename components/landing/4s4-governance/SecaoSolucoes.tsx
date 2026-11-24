export default function SecaoSolucoes() {
  return (
    <section className="section dim" id="solucoes">
      <div className="container">
        <div className="section-head">
          <span className="tag">Nossas soluções</span>
          <h2>Como estruturamos a governança do seu projeto SAP</h2>
          <p>Três frentes que conectam estruturação, acompanhamento contínuo e governança independente ao longo do projeto.</p>
        </div>
        <div className="solutions">
          <div className="solution">
            <div className="num">01</div>
            <div>
              <span className="tag-pill">Para estruturar a governança do projeto</span>
              <h3>4s4.Governance Setup</h3>
              <p className="desc">Definição de ritos, comitês, critérios de decisão e controle de escopo/prazo/risco desde o início do projeto.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Ritos e comitês estruturados</li>
                <li>Critérios claros de decisão</li>
                <li>Controle formal de escopo, prazo e risco</li>
                <li>Base de governança desde o kickoff</li>
              </ul>
              <div className="chips-inline">
                <span className="chip-sm">Plano de Governança</span>
                {" "}
                <span className="chip-sm">Matriz RACI de Decisão</span>
                {" "}
                <span className="chip-sm">Calendário de Ritos</span>
                {" "}
                <span className="chip-sm">Critérios de Escalonamento</span>
              </div>
            </div>
          </div>
          <div className="solution">
            <div className="num">02</div>
            <div>
              <span className="tag-pill">Para acompanhar a execução</span>
              <h3>4s4.Governance Track</h3>
              <p className="desc">Operação contínua da governança, com dashboards, farol de riscos e relatórios executivos independentes.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Dashboards de acompanhamento</li>
                <li>Farol de riscos atualizado</li>
                <li>Relatórios executivos independentes</li>
                <li>Visibilidade contínua do andamento</li>
              </ul>
              <div className="chips-inline">
                <span className="chip-sm">Dashboard Executivo</span>
                {" "}
                <span className="chip-sm">Farol de Riscos</span>
                {" "}
                <span className="chip-sm">Relatório Periódico</span>
                {" "}
                <span className="chip-sm">Ata de Rituais (BTO.NOW)</span>
              </div>
            </div>
          </div>
          <div className="solution">
            <div className="num">03</div>
            <div>
              <span className="tag-pill">Para projetos críticos</span>
              <h3>4s4.Governance Assure</h3>
              <p className="desc">Camada de governança técnica e acompanhamento independente em projetos Brownfield, Greenfield ou híbridos de alta criticidade.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Governança técnica independente</li>
                <li>Checagem técnica independente</li>
                <li>Alertas antecipados de risco crítico</li>
                <li>Camada extra de segurança executiva</li>
              </ul>
              <div className="chips-inline">
                <span className="chip-sm">Relatório de Governança Técnica</span>
                {" "}
                <span className="chip-sm">Checklist de Conformidade</span>
                {" "}
                <span className="chip-sm">Plano de Mitigação</span>
                {" "}
                <span className="chip-sm">Alerta de Risco Crítico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
