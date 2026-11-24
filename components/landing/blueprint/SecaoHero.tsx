import SeloHero from "@/components/compartilhados/SeloHero";

export default function SecaoHero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <SeloHero className="eyebrow">Blueprint · Strategic Readiness</SeloHero>
        <h1>Antes de qualquer grande transformação, prepare o terreno.</h1>
        <p className="sub">O Blueprint é a <b>inteligência estratégica</b> da MOVE.ON que integra <b>processos, tecnologia e arquitetura corporativa</b> antes de qualquer implementação complexa — mitigando riscos, eliminando retrabalho e trazendo <b>previsibilidade de custo</b> e <b>clareza de investimento</b>.</p>
        <div className="hero-ctas">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
          {" "}
          <a href="#solucoes" className="btn btn-secondary">Conheça nossas soluções</a>
        </div>
        <div className="blueprint-nodes">
          <div className="node">
            <div className="dot">01</div>
            <div className="label">Processos</div>
          </div>
          <div className="node">
            <div className="dot">02</div>
            <div className="label">Tecnologia</div>
          </div>
          <div className="node">
            <div className="dot">03</div>
            <div className="label">Arquitetura<br />Corporativa</div>
          </div>
        </div>
      </div>
    </section>
  );
}
