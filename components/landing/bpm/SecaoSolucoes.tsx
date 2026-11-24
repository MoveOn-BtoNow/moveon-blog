export default function SecaoSolucoes() {
  return (
    <section className="section dim" id="solucoes">
      <div className="container">
        <div className="section-head">
          <span className="tag">Nossas soluções</span>
          <h2>Como estruturamos a transformação do seu processo</h2>
          <p>Cada frente combina processo, arquitetura, dados e tecnologia — de ERP e automação a workflow, low code e IA — para transformar como a operação funciona de verdade.</p>
        </div>
        <div className="solutions">
          <div className="solution">
            <div className="num">01</div>
            <div>
              <span className="tag-pill">Para entender o cenário com profundidade</span>
              <h3>BPM Diagnose</h3>
              <p className="desc">Diagnóstico operacional baseado em dados: mapeamento ponta a ponta, entrevistas, shadowing, mineração de processos (quando aplicável) e análise de indicadores para revelar onde a operação perde performance.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Mapa de processos ponta a ponta (as-is)</li>
                <li>Matriz de dores e causas-raiz</li>
                <li>Análise de indicadores e mineração de processos</li>
                <li>Oportunidades de digitalização e automação priorizadas</li>
              </ul>
            </div>
          </div>
          <div className="solution">
            <div className="num">02</div>
            <div>
              <span className="tag-pill">Para redesenhar com arquitetura e tecnologia</span>
              <h3>BPM Redesign</h3>
              <p className="desc">Redesenho to-be que vai além do fluxo: eliminação e simplificação de atividades, automação, arquitetura funcional, definição de papéis, integração entre áreas e levantamento de requisitos — com a experiência do usuário e os impactos organizacionais no centro do desenho.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Processos to-be simplificados e automatizados</li>
                <li>Arquitetura funcional e requisitos levantados</li>
                <li>Papéis, responsabilidades e integração entre áreas</li>
                <li>Plano de impacto organizacional e experiência do usuário</li>
              </ul>
            </div>
          </div>
          <div className="solution">
            <div className="num">03</div>
            <div>
              <span className="tag-pill">Para sustentar a transformação</span>
              <h3>BPM Governance</h3>
              <p className="desc">Modelo de governança completo: ownership, matriz RACI, cadência de gestão, fóruns de decisão, SLAs e OKRs — com roadmap e backlog priorizados para manter a melhoria contínua viva depois da entrega.</p>
            </div>
            <div>
              <span className="gains-label">O que você ganha</span>
              <ul className="gains">
                <li>Ownership e matriz RACI definidos</li>
                <li>KPIs, SLAs e OKRs implantados</li>
                <li>Cadência de gestão e fóruns estruturados</li>
                <li>Roadmap e backlog de melhoria contínua</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
