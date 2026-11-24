export default function SecaoSolucao() {
  return (
    <section className="section dark" id="solucao">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Como a MOVE.ON atua na Reforma Tributária do seu SAP</h2>
          <p className="section-copy reveal">Organizamos a adequação à Reforma Tributária conectando fiscal, processos, tecnologia e gestão do programa em uma mesma estrutura de atuação.</p>
        </div>
        <div className="solution-list">
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">01</span>
              {" "}
              <span className="card-tag">Para organizar a adequação</span>
              <h3>Gestão do Programa Tributário</h3>
              <p>Coordenamos as frentes da Reforma Tributária em uma gestão única, garantindo alinhamento, controle da execução e visibilidade para decisão.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Mapa de escopo da Reforma Tributária</li>
                <li>Backlog priorizado de iniciativas fiscais</li>
                <li>Status de riscos e dependências</li>
                <li>Report executivo de acompanhamento</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">02</span>
              {" "}
              <span className="card-tag">Para preparar a operação</span>
              <h3>Processos e Gestão da Mudança</h3>
              <p>Mapeamos os impactos da Reforma nos processos, áreas e stakeholders, preparando a empresa para operar no novo modelo tributário.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Análise de processos impactados</li>
                <li>Desenho dos processos pós-reforma</li>
                <li>Roadmap de adequação organizacional</li>
                <li>Treinamentos e comunicação interna</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">03</span>
              {" "}
              <span className="card-tag">Para ajustar o SAP</span>
              <h3>Adequação SAP e Qualidade</h3>
              <p>Realizamos a adequação funcional e técnica no SAP, com documentação, testes, qualidade e preparação para entrada em produção.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Configurações fiscais no SAP</li>
                <li>Especificações funcionais e técnicas</li>
                <li>Plano de testes da Reforma Tributária</li>
                <li>Revisão de qualidade das entregas</li>
              </ul>
            </div>
          </article>
        </div>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="solucao" href="#form-tax">Quero adequar meu SAP à Reforma</a>
        </div>
      </div>
    </section>
  );
}
