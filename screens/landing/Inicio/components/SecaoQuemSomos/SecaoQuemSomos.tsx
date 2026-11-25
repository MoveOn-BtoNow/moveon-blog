export default function SecaoQuemSomos() {
  return (
    <section className="section dark about-section" id="quem-somos">
      <div className="grid-bg" />
      <div className="red-line" style={{ top: "54%" }} />
      <div className="container about-grid">
        <div className="about-visual reveal">
          <span className="eyebrow problem-badge">Quem Somos</span>
          <h2 className="section-title">Ecossistema de gestão que conecta processos, tecnologia e projetos</h2>
          <div className="team-frame team-wide-photo" aria-label="Equipe MOVE.ON">
            <img src="/landing/quem-somos.png" alt="Equipe MOVE.ON reunida em evento institucional" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="about-copy reveal">
          <p className="section-copy">A MOVE.ON é uma consultoria de transformação de negócios que ajuda empresas de médio e grande porte a <strong>organizar, governar e acelerar suas agendas estratégicas</strong>. Integramos <strong>projetos, processos, plataformas e pessoas</strong> para gerar mais <strong>eficiência, clareza e resultado</strong>.</p>
          <p className="section-copy">Com <strong>metodologia e plataforma proprietárias</strong>, atuamos em múltiplas frentes como: <strong>Governança e gestão de projetos, gestão de processo, reforma tributária, governança de projetos SAP e eficiência operacional</strong>, sempre com uma atuação próxima, estruturada e orientada à <strong>geração de valor real</strong>.</p>
          <div className="metric-row">
            <div className="metric">
              <span className="metric-frame-line" aria-hidden="true" />
              <strong>
                <span className="metric-number" data-target="100">0</span>
                <span className="plus">+</span>
              </strong>
              <span>projetos em 24 meses</span>
            </div>
            <div className="metric">
              <span className="metric-frame-line" aria-hidden="true" />
              <strong>95k<span className="plus">+</span></strong>
              <span>horas de projetos</span>
            </div>
            <div className="metric">
              <span className="metric-frame-line" aria-hidden="true" />
              <strong>
                <span className="metric-number" data-target="400">0</span>
                <span className="plus">+</span>
              </strong>
              <span>processos estruturados</span>
            </div>
          </div>
          <a className="btn btn-primary metric-cta" href="#contato">Conhecer a MOVE.ON</a>
        </div>
      </div>
    </section>
  );
}
