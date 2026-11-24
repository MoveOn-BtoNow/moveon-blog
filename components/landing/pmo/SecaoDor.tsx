export default function SecaoDor() {
  return (
    <section className="section dark" id="dor">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head head-left">
          <h2 className="section-title reveal">Você reconhece algum destes cenários?</h2>
        </div>
        <div className="scenarios-split">
          <div className="check-list">
            <div className="check-item reveal">
              <span className="check-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Muitas iniciativas rodando, mas pouca clareza do que realmente avança</p>
              <span className="check-sig" aria-hidden="true" />
            </div>
            <div className="check-item reveal">
              <span className="check-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Alto custo de projetos por falta de priorização e controle de escopo</p>
              <span className="check-sig" aria-hidden="true" />
            </div>
            <div className="check-item reveal">
              <span className="check-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Relatórios que mostram números soltos, e não revelam riscos e gargalos</p>
              <span className="check-sig" aria-hidden="true" />
            </div>
            <div className="check-item reveal">
              <span className="check-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Tecnologia implementada, mas com baixa adoção e pouco value capture</p>
              <span className="check-sig" aria-hidden="true" />
            </div>
            <div className="check-item reveal">
              <span className="check-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Falta de visibilidade sobre prazos, responsáveis e próximos passos</p>
              <span className="check-sig" aria-hidden="true" />
            </div>
          </div>
          <aside className="pain-closer pain-aside reveal">
            <span className="pain-closer-mark" aria-hidden="true" />
            {" "}
            <span className="pain-aside-eyebrow">É o seu caso?</span>
            <p>Se isso acontece no seu negócio, <strong>falta uma estrutura de governança para alinhar prioridades, decisões e execução.</strong></p>
            <span className="pain-aside-glyph" aria-hidden="true">”</span>
          </aside>
        </div>
      </div>
    </section>
  );
}
