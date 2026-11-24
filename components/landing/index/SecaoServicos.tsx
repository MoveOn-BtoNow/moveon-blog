import Link from "next/link";

export default function SecaoServicos() {
  return (
    <section className="section dark services-section" id="servicos">
      <div className="grid-bg" />
      <div className="container">
        <div className="service-head" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="eyebrow problem-badge" style={{ justifyContent: "center" }}>Nossos serviços</span>
            <h2 className="section-title" style={{ marginInline: "auto" }}>O que entregamos</h2>
          </div>
        </div>
        <div className="services-grid">
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6V5a2 2 0 0 1 2-2h1.8a2 2 0 0 1 2 2v1" />
                  <path d="M4.5 8.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5Z" />
                  <path d="M8 8.5V20" />
                  <path d="M16 8.5V20" />
                </svg>
              </div>
              <span className="sc-num">01</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para projetos estratégicos</span>
              <h3>Governança de Projetos</h3>
              <p>Governança para que seus projetos prioritários sejam entregues no prazo, no orçamento e com adoção real.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Estruturação e operação de PMO</li>
              <li>Gestão de portfólio de projetos</li>
              <li>Controle de riscos, prazo e qualidade</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6V5a2 2 0 0 1 2-2h1.8a2 2 0 0 1 2 2v1" />
                <path d="M4.5 8.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5Z" />
                <path d="M8 8.5V20" />
                <path d="M16 8.5V20" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/pmo" aria-label="Saiba mais sobre Governança de Projetos">Governança de Projetos</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 7v10" />
                  <path d="M15.2 9.2c-.7-.7-1.8-1.2-3.1-1.2-1.7 0-3 .8-3 2.1 0 1.5 1.5 1.9 3 2.2 1.6.3 3 .8 3 2.2 0 1.3-1.3 2.3-3.1 2.3-1.4 0-2.6-.5-3.4-1.4" />
                </svg>
              </div>
              <span className="sc-num">02</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para projeto S/4HANA</span>
              <h3>Reforma Tributária no SAP</h3>
              <p>A Reforma Tributária vai exigir ajustes no seu SAP até 2033. Mantemos sua operação adequada a cada nova regra.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Diagnóstico de impacto regulatório</li>
              <li>Implementação técnica no S/4HANA</li>
              <li>Governança contínua frente à legislação</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v10" />
                <path d="M15.2 9.2c-.7-.7-1.8-1.2-3.1-1.2-1.7 0-3 .8-3 2.1 0 1.5 1.5 1.9 3 2.2 1.6.3 3 .8 3 2.2 0 1.3-1.3 2.3-3.1 2.3-1.4 0-2.6-.5-3.4-1.4" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/tax" aria-label="Saiba mais sobre Reforma Tributária no SAP">Reforma Tributária no SAP</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.8 19 6v5.2c0 4.4-2.7 8.3-7 10-4.3-1.7-7-5.6-7-10V6z" />
                  <path d="m8.8 12.2 2.1 2.1 4.5-4.8" />
                </svg>
              </div>
              <span className="sc-num">03</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para projetos SAP</span>
              <h3>Centro de Excelência SAP</h3>
              <p>Apoiamos empresas na evolução do SAP com governança, Clean Core, testes e padronização metodológica.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Qualidade e melhores práticas</li>
              <li>Menos retrabalho em projetos</li>
              <li>Evolução contínua do ambiente SAP</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.8 19 6v5.2c0 4.4-2.7 8.3-7 10-4.3-1.7-7-5.6-7-10V6z" />
                <path d="m8.8 12.2 2.1 2.1 4.5-4.8" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/coe-sap" aria-label="Saiba mais sobre Centro de Excelência SAP">Centro de Excelência SAP</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m14.8 9.2-2.1 5.6-5.6 2.1 2.1-5.6z" />
                </svg>
              </div>
              <span className="sc-num">04</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para projetos SAP Brownfield e Greenfield</span>
              <h3>Governança de Projetos SAP</h3>
              <p>Atuamos como o braço direito do cliente na gestão de prazos, escopo e riscos em projetos SAP, com governança dedicada aos seus interesses.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Governança independente de prazo, escopo e risco</li>
              <li>Comitês, ritos e critérios de decisão</li>
              <li>Auditoria técnica para programas críticos</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m14.8 9.2-2.1 5.6-5.6 2.1 2.1-5.6z" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/4s4-governance" aria-label="Saiba mais sobre Governança de Projetos SAP">Governança de Projetos SAP</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h4l2 8 4-16 2 8h6" />
                </svg>
              </div>
              <span className="sc-num">05</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para SAP pós go-live</span>
              <h3>Sustentação e Evolução do SAP</h3>
              <p>Garantimos a sustentabilidade e evolução do seu SAP após o go-live, com governança técnica e roadmap estruturado de melhorias.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Diagnóstico e estabilização pós-go-live</li>
              <li>Governança técnica com roadmap priorizado</li>
              <li>Preparação para serviços gerenciados</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l2 8 4-16 2 8h6" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/4s4-operate" aria-label="Saiba mais sobre Sustentação e Evolução do SAP">Sustentação e Evolução do SAP</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="9" width="6" height="6" rx="1.2" />
                  <rect x="15" y="9" width="6" height="6" rx="1.2" />
                  <path d="M9 12h4" />
                  <path d="m11 9.5 2.5 2.5-2.5 2.5" />
                </svg>
              </div>
              <span className="sc-num">06</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para transformação de processos</span>
              <h3>Gestão de Processos (BPM)</h3>
              <p>Redesenhamos processos com metodologias ágeis e Signavio, unindo diagnóstico, tecnologia e indicadores de performance mensurável.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Diagnóstico de processos AS-IS</li>
              <li>Redesenho TO-BE com Signavio</li>
              <li>Indicadores e governança contínua</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="6" height="6" rx="1.2" />
                <rect x="15" y="9" width="6" height="6" rx="1.2" />
                <path d="M9 12h4" />
                <path d="m11 9.5 2.5 2.5-2.5 2.5" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/bpm" aria-label="Saiba mais sobre Gestão de Processos (BPM)">Gestão de Processos (BPM)</Link>
          </article>
          <article className="card service-card reveal">
            <div className="sc-header">
              <div className="sc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5v14l6-3 6 3 4-2V3l-4 2-6-3-6 3z" />
                  <path d="M10 2v14M16 5v14" />
                </svg>
              </div>
              <span className="sc-num">07</span>
            </div>
            <div className="sc-content">
              <span className="card-tag">Para grandes transformações</span>
              <h3>Blueprint Estratégico</h3>
              <p>Integramos processos, tecnologia e arquitetura antes de qualquer transformação, trazendo previsibilidade de custo e clareza de investimento.</p>
            </div>
            <div className="sc-divider" aria-hidden="true" />
            <ul>
              <li>Diagnóstico de arquitetura e processos</li>
              <li>Desenho do modelo futuro (to-be)</li>
              <li>Business case e governança de escopo</li>
            </ul>
            <span className="service-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5v14l6-3 6 3 4-2V3l-4 2-6-3-6 3z" />
                <path d="M10 2v14M16 5v14" />
              </svg>
            </span>
            {" "}
            <Link className="sc-link" href="/blueprint" aria-label="Saiba mais sobre Blueprint Estratégico">Blueprint Estratégico</Link>
          </article>
        </div>
      </div>
    </section>
  );
}
