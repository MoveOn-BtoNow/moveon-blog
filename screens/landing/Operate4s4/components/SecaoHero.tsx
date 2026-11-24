import SeloHero from "@/components/SeloHero";

export default function SecaoHero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <SeloHero className="eyebrow">4s4.Operate · Pós Go-live</SeloHero>
        <h1>Seu SAP não termina no go-live. A operação começa aí.</h1>
        <p className="sub">Garantimos a <b>sustentabilidade</b> e a <b>evolução</b> do seu SAP no cenário pós-go-live, com <b>governança técnica</b> e <b>planos de evolução estruturados</b> — assegurando que o investimento continue gerando valor a longo prazo, e preparando a empresa para modelos de serviços gerenciados.</p>
        <div className="hero-ctas">
          <a href="#contato" className="btn btn-primary">Falar com um especialista</a>
          {" "}
          <a href="#solucoes" className="btn btn-secondary">Conheça nossas soluções</a>
        </div>
      </div>
    </section>
  );
}
