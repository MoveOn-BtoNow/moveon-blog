export default function SecaoEntregaveis() {
  return (
    <section className="section" id="entregaveis">
      <div className="container">
        <div className="section-head">
          <span className="tag">Entregáveis</span>
          <h2>O que você recebe</h2>
          <p>Artefatos que ficam com o seu time e sustentam a operação depois que terminamos.</p>
        </div>
        <div className="chips">
          <span className="chip">Arquitetura de Processos</span>
          {" "}
          <span className="chip">Cadeia de Valor</span>
          {" "}
          <span className="chip">BPMN</span>
          {" "}
          <span className="chip">Matriz RACI</span>
          {" "}
          <span className="chip">SIPOC</span>
          {" "}
          <span className="chip">Catálogo de Processos</span>
          {" "}
          <span className="chip">KPIs</span>
          {" "}
          <span className="chip">Business Case</span>
          {" "}
          <span className="chip">Roadmap</span>
          {" "}
          <span className="chip">Backlog</span>
          {" "}
          <span className="chip">Plano de Governança</span>
        </div>
      </div>
    </section>
  );
}
