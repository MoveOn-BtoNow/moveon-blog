import SeloHero from "@/components/SeloHero";

export default function SecaoHero() {
  return (
    <section className="hero">
      <div className="wrap">
        <SeloHero className="kicker">IA da MOVE.ON · SAP S/4HANA</SeloHero>
        <h1>Clean Core Studio</h1>
        <p className="lede"> Eleve a eficiência dos processos e extensões da sua empresa no SAP S/4HANA com agentes de Inteligência Artificial que entendem seu landscape — antes, durante e depois de qualquer transformação. </p>
        <div className="ctas">
          <a className="btn btn-primary" href="#leadForm">Agendar uma conversa</a>
        </div>
      </div>
    </section>
  );
}
