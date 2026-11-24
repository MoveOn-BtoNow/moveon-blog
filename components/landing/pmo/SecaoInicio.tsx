import RedeAnimada from "@/components/landing/compartilhados/RedeAnimada";

export default function SecaoInicio() {
  return (
    <section className="hero" id="inicio">
      <RedeAnimada className="hero-net" />
      <div className="hero-bg-image" aria-hidden="true" />
      <div className="grid-bg" />
      <div className="wide hero-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">PMO Governance</span>
          <h1 className="headline">Governança para tirar a estratégia do plano e levar para a execução.</h1>
          <p className="lead">Estruturamos e operamos PMOs para <strong>organizar portfólios, priorizar iniciativas, acompanhar riscos</strong> e <strong>trazer clareza</strong> às decisões que geram transformação.</p>
          <div className="hero-actions">
            <a className="btn btn-primary cta-track" data-cta="hero" href="#form-pmo">Falar com um especialista</a>
            {" "}
            <a className="btn btn-ghost" href="#solucao">Conheça nossas soluções</a>
          </div>
          <div className="hero-roadmap" aria-hidden="true">
            <span className="hero-roadmap-cap">Do plano à execução</span>
            <div className="hero-roadmap-track">
              <span className="hr-pulse" />
              <div className="hr-stop">
                <span className="hr-dot" />
                <span className="hr-label">Estratégia</span>
              </div>
              <div className="hr-stop">
                <span className="hr-dot" />
                <span className="hr-label">Portfólio</span>
              </div>
              <div className="hr-stop">
                <span className="hr-dot" />
                <span className="hr-label">Prioridades</span>
              </div>
              <div className="hr-stop">
                <span className="hr-dot" />
                <span className="hr-label">Riscos</span>
              </div>
              <div className="hr-stop">
                <span className="hr-dot" />
                <span className="hr-label">Execução</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
