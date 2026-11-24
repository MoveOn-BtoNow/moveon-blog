import RedeAnimada from "@/components/RedeAnimada";

export default function SecaoInicio() {
  return (
    <section className="hero" id="inicio">
      <RedeAnimada className="hero-net" />
      <div className="hero-bg-image" aria-hidden="true" />
      <div className="grid-bg" />
      <div className="hero-orbits" aria-hidden="true">
        <span className="orbit orbit-1" />
        {" "}
        <span className="orbit orbit-2" />
        {" "}
        <span className="orbit orbit-3" />
        {" "}
        <span className="orbit-core" />
      </div>
      <div className="wide hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">Centro de Excelência SAP · Clean Core</span>
          <h1 className="headline" style={{ maxWidth: "1040px" }}>Governança para seu SAP evoluir <span className="accent">sem perder o controle.</span></h1>
          <p className="lead">Estruturamos Centros de Excelência SAP para empresas que querem organizar o ambiente e sair da operação reativa.</p>
          <div className="hero-actions">
            <a className="btn btn-primary cta-track" data-cta="hero" href="#form-coe">Falar com um especialista SAP</a>
          </div>
        </div>
      </div>
    </section>
  );
}
