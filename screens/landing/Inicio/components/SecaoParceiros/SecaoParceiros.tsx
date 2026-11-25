export default function SecaoParceiros() {
  return (
    <section className="section off" id="parceiros">
      <div className="container partner-section-grid">
        <div className="partner-section-copy reveal">
          <span className="eyebrow">Parceiros e tecnologia</span>
          <h2 className="section-title">Parceiro oficial dos principais players de tecnologia do mundo.</h2>
        </div>
        <div className="partner-logos-grid reveal" aria-label="Parceiros MOVE.ON">
          <div className="partner-logo">
            <img src="/landing/parceiros/sap.png" alt="SAP" loading="lazy" decoding="async" />
          </div>
          <div className="partner-logo">
            <img src="/landing/parceiros/aws.png" alt="Amazon Web Services" loading="lazy" decoding="async" />
          </div>
          <div className="partner-logo">
            <img src="/landing/parceiros/google-cloud.png" alt="Google Cloud" loading="lazy" decoding="async" />
          </div>
          <div className="partner-logo">
            <img src="/landing/parceiros/asug-brasil.png" alt="ASUG Brasil" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}
