export default function SecaoOQueE() {
  return (
    <section className="section dark" id="o-que-e" style={{ backgroundSize: "contain" }}>
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">O que é o Centro de Excelência SAP?</h2>
          <p className="section-copy reveal" style={{ marginInline: "auto", textAlign: "center" }}>O CoE é uma estrutura contínua de governança e arquitetura que decide como cada demanda entra no seu SAP com critérios, qualidade e visão de longo prazo, em vez de customização sob pressão.</p>
        </div>
        <div className="compare reveal" style={{ opacity: "1" }}>
          <div className="compare-col is-without">
            <div className="compare-head">
              <span className="c-dot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </span>
              <div>
                <span style={{ fontSize: "13px" }}>Operação reativa</span>
                <h3>SEM COE</h3>
              </div>
            </div>
            <ul className="compare-list">
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12h7" />
  </svg>
</span>Customizações acumuladas</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12h7" />
  </svg>
</span>Upgrades caros e lentos</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12h7" />
  </svg>
</span>Inovação limitada</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12h7" />
  </svg>
</span>Alto custo de manutenção</li>
            </ul>
          </div>
          <div className="compare-col is-with" style={{ fontWeight: "100" }}>
            <div className="compare-head">
              <span className="c-dot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z" />
                  <path d="m9.2 12 2 2 3.6-3.8" />
                </svg>
              </span>
              <div>
                <span style={{ fontSize: "13px" }}>Evolução governada</span>
                <h3>COM COE</h3>
              </div>
            </div>
            <ul className="compare-list">
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.2 2.6 2.6L16 9.5" />
  </svg>
</span>Núcleo mais limpo</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.2 2.6 2.6L16 9.5" />
  </svg>
</span>Extensões controladas</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.2 2.6 2.6L16 9.5" />
  </svg>
</span>Ambiente preparado para evoluir</li>
              <li style={{ fontSize: "18px" }}><span className="compare-ico">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.2 2.6 2.6L16 9.5" />
  </svg>
</span>Custo menor e previsível</li>
            </ul>
          </div>
        </div>
        <div className="pain-closer reveal">
          <span className="pc-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </span>
          <p>Ele evita que o sistema vire apenas uma operação reativa, onde cada nova demanda gera <strong>mais customização, custo e dependência técnica.</strong></p>
        </div>
      </div>
    </section>
  );
}
