import Faq from "@/components/Faq";
import type { PerguntaFrequente } from "@/interfaces/secoes";

/** Perguntas frequentes em acordeão (PMO, Tax e COE SAP). */
export default function SecaoFaqAcordeao({ perguntas }: { perguntas: PerguntaFrequente[] }) {
  return (
    <section className="section off" id="faq">
      <div className="container faq-wrap">
        <div className="centered-head">
          <span className="eyebrow eyebrow-pill reveal">FAQ</span>
          <h2 className="section-title reveal">Perguntas Frequentes</h2>
        </div>
        <Faq variante="acordeao" className="faq-list reveal" itens={perguntas} />
      </div>
    </section>
  );
}
