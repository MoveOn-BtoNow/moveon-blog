export default function SecaoQueMudaCom() {
  return (
    <section className="section dim">
      <div className="container">
        <div className="section-head">
          <span className="tag">Diagnóstico</span>
          <h2>O que muda com um Blueprint bem feito</h2>
          <p>Grandes transformações não falham por falta de tecnologia. Falham por falta de terreno preparado antes da implementação.</p>
        </div>
        <div className="compare-grid">
          <div className="compare-col sem">
            <h3>Sem Blueprint</h3>
            <ul>
              <li>Escopo definido às pressas</li>
              <li>Retrabalho descoberto só durante o projeto</li>
              <li>Estouro de custo sem explicação clara</li>
              <li>Áreas desalinhadas sobre o que muda</li>
            </ul>
          </div>
          <div className="compare-col com">
            <h3>Com Blueprint</h3>
            <ul>
              <li>Escopo validado antes do projeto</li>
              <li>Riscos mitigados na origem</li>
              <li>Previsibilidade de investimento</li>
              <li>Negócio, processo e tecnologia integrados</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
