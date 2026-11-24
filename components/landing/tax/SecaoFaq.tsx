import Faq from "@/components/landing/compartilhados/Faq";
import { perguntasFrequentes } from "./dados";

export default function SecaoFaq() {
  return (
    <section className="section off" id="faq">
      <div className="container faq-wrap">
        <div className="centered-head">
          <span className="eyebrow eyebrow-pill reveal">FAQ</span>
          <h2 className="section-title reveal">Perguntas Frequentes</h2>
        </div>
        <Faq variante="acordeao" className="faq-list reveal" itens={perguntasFrequentes} />
      </div>
    </section>
  );
}
