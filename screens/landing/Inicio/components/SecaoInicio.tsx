export default function SecaoInicio() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg-image" aria-hidden="true" />
      <div className="grid-bg" />
      <div className="wide hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">Business Transformation</span>
          <h1 className="headline">Método e governança para transformar projetos em resultado</h1>
          <p className="lead">Metodologia proprietária para orquestrar processos, projetos e tecnologia, aumentando produtividade, reduzindo custos e gerando impacto financeiro mensurável para empresas que exigem resultado.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contato">Fale com um especialista</a>
            {" "}
            <a className="btn btn-secondary" href="#servicos">Conheça nossas soluções</a>
          </div>
        </div>
      </div>
    </section>
  );
}
