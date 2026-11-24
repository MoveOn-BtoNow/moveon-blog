export default function SecaoVoceReconheceAlgum() {
  return (
    <section className="section dim">
      <div className="container">
        <div className="section-head">
          <span className="tag">Diagnóstico</span>
          <h2>Você reconhece algum destes cenários?</h2>
          <p>{"Quando falamos em \"camada de governança\", queremos dizer isso: um conjunto de ritos, painéis e responsáveis que atuam como uma camada superior de governança em relação a quem está implementando a nível operacional — sem interferir na entrega técnica do projeto. Essa governança pode ser aplicada a projetos, programas ou portfólio, dependendo da escala da iniciativa."}</p>
        </div>
        <div className="scenarios">
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Falta de uma camada independente para acompanhar prazos, escopo e riscos do projeto</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Escopo muda sem controle formal de impacto em prazo e custo</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Riscos técnicos são identificados tarde demais, já em fase crítica</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Falta visão executiva sobre o real andamento do projeto SAP</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Decisões técnicas tomadas sem considerar o interesse de longo prazo do cliente</p>
          </div>
        </div>
        <div className="cta-inline">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
        </div>
      </div>
    </section>
  );
}
