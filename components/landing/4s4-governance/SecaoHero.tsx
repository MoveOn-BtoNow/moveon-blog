import SeloHero from "@/components/compartilhados/SeloHero";

export default function SecaoHero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <SeloHero className="eyebrow">4s4.Governance · Brownfield, Greenfield ou Híbrido</SeloHero>
        <h1>Seu projeto SAP, com rigor técnico e uma governança dedicada só aos seus interesses.</h1>
        <p className="sub">Atuamos como o <b>braço direito do cliente</b> na gestão de <b>prazos, escopo e riscos</b> em projetos SAP (Brownfield, Greenfield ou híbrido), com uma camada de governança dedicada <b>exclusivamente aos interesses do cliente</b> ao longo de toda a jornada.</p>
        <div className="hero-ctas">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
          {" "}
          <a href="#solucoes" className="btn btn-secondary">Conheça nossas soluções</a>
        </div>
        <div className="journey">
          <b>Diagnóstico</b>
          <span className="sep">→</span>
          <b>Modelo de Governança</b>
          <span className="sep">→</span>
          <b>Implantação</b>
          <span className="sep">→</span>
          <b>Acompanhamento Contínuo</b>
        </div>
      </div>
    </section>
  );
}
