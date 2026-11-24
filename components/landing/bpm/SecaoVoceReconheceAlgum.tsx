export default function SecaoVoceReconheceAlgum() {
  return (
    <section className="section dim">
      <div className="container">
        <div className="section-head">
          <span className="tag">Diagnóstico</span>
          <h2>Você reconhece algum destes cenários?</h2>
        </div>
        <div className="scenarios">
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Processos redesenhados no papel que nunca se transformam em mudança real na operação</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Iniciativas de automação e IA implantadas sem um redesenho de processo por trás</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Melhoria contínua que não conecta processo, tecnologia, dados e pessoas</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Redesenho de processo sem plano de adoção — a mudança não acontece na prática</p>
          </div>
          <div className="scenario-item">
            <span className="mark">—</span>
            <p>Várias iniciativas de transformação andando desconectadas, sem um roadmap único</p>
          </div>
        </div>
        <div className="cta-inline">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
        </div>
      </div>
    </section>
  );
}
