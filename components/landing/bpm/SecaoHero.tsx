import SeloHero from "@/components/compartilhados/SeloHero";

export default function SecaoHero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <SeloHero className="eyebrow">BPM · Business Transformation</SeloHero>
        <h1>Transformação operacional que conecta processo, tecnologia e negócio numa só entrega.</h1>
        <p className="sub">Combinamos <b>arquitetura de processos</b>, <b>tecnologia</b>, <b>dados</b> e <b>gestão da mudança</b> em uma jornada única — da descoberta estratégica à melhoria contínua — para que a operação evolua de verdade, não só no papel.</p>
        <div className="hero-ctas">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
          {" "}
          <a href="#solucoes" className="btn btn-secondary">Conheça nossas soluções</a>
        </div>
        <div className="journey">
          <b>Descobrir</b>
          <span className="sep">→</span>
          <b>Priorizar</b>
          <span className="sep">→</span>
          <b>Transformar</b>
          <span className="sep">→</span>
          <b>Implantar</b>
          <span className="sep">→</span>
          <b>Sustentar</b>
        </div>
      </div>
    </section>
  );
}
