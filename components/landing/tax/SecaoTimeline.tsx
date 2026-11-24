export default function SecaoTimeline() {
  return (
    <section className="section dark" id="timeline">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">A linha do tempo que vai mexer no seu SAP.</h2>
        </div>
        <div className="reform-timeline">
          <article className="reform-step reveal">
            <span className="reform-year">2025</span>
            <p>Desenho e implementação do IBS/CBS estático.</p>
          </article>
          <article className="reform-step reveal">
            <span className="reform-year">2026</span>
            <p>Início do IBS/CBS estático e desenhos da cobrança inicial em 2027.</p>
          </article>
          <article className="reform-step reveal">
            <span className="reform-year">2027</span>
            <p>Entrada da cobrança inicial da CBS na operação.</p>
          </article>
          <article className="reform-step reveal">
            <span className="reform-year">2028–2032</span>
            <p>Transição gradual da operação para CBS/IBS.</p>
          </article>
          <article className="reform-step reveal">
            <span className="reform-year">2033</span>
            <p>ICMS, ISS e PIS/COFINS extintos. Operação 100% no novo modelo.</p>
          </article>
        </div>
        <div className="reform-closer reveal">
          <p>Em cada um desses marcos, sua empresa precisa estar pronta no SAP. <strong>Quem começa antes, paga menos.</strong></p>
        </div>
      </div>
    </section>
  );
}
