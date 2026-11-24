import RedeAnimada from "@/components/landing/compartilhados/RedeAnimada";

export default function SecaoInicio() {
  return (
    <section className="hero" id="inicio">
      <RedeAnimada className="hero-net" />
      <div className="hero-bg-image" aria-hidden="true" />
      <div className="grid-bg" />
      <div className="wide hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">4s4.TAX · Reforma Tributária no S/4HANA</span>
          <h1 className="headline" style={{ maxWidth: "1040px" }}>A Reforma Tributária vai desorganizar seu SAP. <span className="accent">Você tem um plano?</span></h1>
          <p className="lead">A cada nova regulamentação, sua operação fiscal precisa se ajustar na versão SAP. A MOVE.ON é a parceira que cuida dessa adequação, de ponta a ponta, sem comprometer a estabilidade do sistema que já roda.</p>
          <div className="hero-actions">
            <a className="btn btn-primary cta-track" data-cta="hero" href="#form-tax">Falar com um especialista</a>
          </div>
        </div>
      </div>
    </section>
  );
}
