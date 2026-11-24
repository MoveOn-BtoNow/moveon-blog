export default function SecaoServicos() {
  return (
    <section className="section dark" id="servicos">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Como a MOVE.ON estrutura a evolução do seu SAP</h2>
          <p className="section-copy reveal">Cinco frentes que organizam diagnóstico, governança, engenharia, qualidade e tecnologia dentro de uma mesma estrutura de Centro de Excelência.</p>
        </div>
        <div className="solution-list">
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">01</span>
              {" "}
              <span className="card-tag">Diagnóstico</span>
              <h3>Diagnóstico do ambiente SAP</h3>
              <p>Antes de propor mudanças, entendemos o cenário atual: processos, aplicações, integrações, extensões, arquitetura e pontos de complexidade.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Visão clara do ambiente de tecnologia atual</li>
                <li>Mapeamento de processos, aplicações e integrações</li>
                <li>Identificação de riscos e débito técnico na operação</li>
                <li>Roteiro de evolução priorizado para o SAP</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">02</span>
              {" "}
              <span className="card-tag">Governança</span>
              <h3>Governança de customizações</h3>
              <p>Criamos uma estrutura de decisão para avaliar demandas, controlar customizações e definir critérios antes que novas mudanças entrem no SAP.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Parâmetros definidos para decisões técnicas</li>
                <li>Comitê de governança para avaliar demandas</li>
                <li>Mais rastreabilidade nas decisões de arquitetura</li>
                <li>Menos customizações desnecessárias no ambiente</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">03</span>
              {" "}
              <span className="card-tag">Engenharia</span>
              <h3>Desenho de soluções SAP</h3>
              <p>Desenhamos soluções SAP considerando necessidade do negócio, aderência ao standard, risco técnico, impacto em upgrades e custo de manutenção.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Avaliação técnica das alternativas de solução</li>
                <li>Recomendação de arquitetura para cada demanda</li>
                <li>Direcionamento para extensões mais seguras</li>
                <li>Soluções mais sustentáveis para evolução do SAP</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">04</span>
              {" "}
              <span className="card-tag">Qualidade</span>
              <h3>Qualidade e redução de riscos</h3>
              <p>Estruturamos uma camada de qualidade para reduzir riscos em mudanças, releases, testes, go-live e evoluções do ambiente SAP.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Mais segurança em mudanças e releases</li>
                <li>Critérios de qualidade para novas entregas</li>
                <li>Suporte em testes, validações e readiness</li>
                <li>Menos retrabalho, instabilidade e correções futuras</li>
              </ul>
            </div>
          </article>
          <article className="solution-card reveal">
            <div className="solution-main">
              <span className="solution-num">05</span>
              {" "}
              <span className="card-tag">Plataforma</span>
              <h3>Plataforma Clean Core Studio</h3>
              <p>Utilizamos uma plataforma proprietária da MOVE.ON, construída no SAP BTP, para apoiar o acompanhamento, análise e controle das extensões do ambiente SAP.</p>
            </div>
            <div className="solution-gains">
              <span className="gains-label">O que você ganha</span>
              <ul>
                <li>Acompanhamento das extensões do SAP</li>
                <li>Mais visibilidade sobre o landscape SAP</li>
                <li>Análise de objetos, código e pontos de complexidade</li>
                <li>Conexão estruturada com SAP Cloud ALM</li>
              </ul>
            </div>
          </article>
        </div>
        <div className="hero-actions reveal is-centered" style={{ marginTop: "48px" }}>
          <a className="btn btn-primary cta-track" data-cta="servicos" href="#form-coe">Quero evoluir meu SAP</a>
        </div>
      </div>
    </section>
  );
}
