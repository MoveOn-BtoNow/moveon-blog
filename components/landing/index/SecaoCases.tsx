import AvatarDepoimento from "./AvatarDepoimento";
import { cases } from "./conteudo";

export default function SecaoCases() {
  return (
    <section className="section dark" id="cases">
      <div className="grid-bg" />
      <div className="container">
        <div className="cases-head">
          <div>
            <span className="eyebrow reveal">Cases e resultados</span>
            <h2 className="section-title reveal">Resultados que sustentam a decisão.</h2>
          </div>
        </div>
        <div className="case-wrap reveal">
          <div className="case-viewport">
            <div className="case-track" aria-label="Carrossel de cases">
              {cases.map((item) => (
                <article key={item.autor.nome} className="case-card">
                  <div className="case-metric">
                    <div className="case-logo">
                      <img src={item.logo.src} alt={item.logo.alt} />
                    </div>
                    <div className="case-number">{item.destaque}</div>
                    <p className="case-number-label">{item.descricao}</p>
                  </div>
                  <div className="case-quote">
                    <div className="quote-mark">”</div>
                    <blockquote>{item.depoimento}</blockquote>
                    <div className="case-author">
                      <AvatarDepoimento nome={item.autor.nome} iniciais={item.autor.iniciais} foto={item.autor.foto} />
                      <div className="case-author-info">
                        <strong>{item.autor.nome}</strong>
                        <span>{item.autor.cargo}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
