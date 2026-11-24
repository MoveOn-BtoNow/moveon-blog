export default function SecaoSolucoes() {
  return (
    <section className="section" id="solucoes">
      <div className="container">
        <div className="section-head">
          <span className="tag">Nossas soluções</span>
          <h2>Como estruturamos o seu Blueprint</h2>
          <p>Três frentes que conectam diagnóstico, desenho estratégico e governança de investimento antes de qualquer implementação.</p>
        </div>
        <div className="solutions">
          <div className="solution">
            <div className="num">01</div>
            <div>
              <span className="tag-pill">Para enxergar o cenário atual</span>
              <h3>Diagnóstico de Arquitetura e Processos</h3>
              <p className="desc">Mapeamento de processos, sistemas e arquitetura corporativa atual — com apoio de Process Mining e entrevistas — identificando riscos e gaps antes da implementação.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Mapa do cenário atual (as-is)</li>
                <li>Riscos e gaps priorizados</li>
                <li>Visão única entre negócio e TI</li>
                <li>Base factual para decisão</li>
              </ul>
            </div>
          </div>
          <div className="solution">
            <div className="num">02</div>
            <div>
              <span className="tag-pill">Para desenhar o caminho</span>
              <h3>Blueprint Estratégico</h3>
              <p className="desc">Desenho do modelo futuro (to-be) de processos, tecnologia e arquitetura, com escopo e investimento claros para o CFO — seja a transformação uma troca de ERP, uma reestruturação de arquitetura, uma fusão/aquisição ou outro tipo de mudança estrutural.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Modelo to-be de processos e arquitetura</li>
                <li>Escopo validado com as áreas</li>
                <li>Estimativa de investimento estruturada</li>
                <li>Roadmap de implementação priorizado</li>
              </ul>
            </div>
          </div>
          <div className="solution">
            <div className="num">03</div>
            <div>
              <span className="tag-pill">Para blindar o investimento</span>
              <h3>Business Case e Governança de Escopo</h3>
              <p className="desc">Estruturação do business case, previsibilidade de custo e critérios de governança para a execução do projeto.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Business case estruturado</li>
                <li>Critérios de governança de escopo</li>
                <li>Previsibilidade de custo para o CFO</li>
                <li>Handoff estruturado para a implementação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
