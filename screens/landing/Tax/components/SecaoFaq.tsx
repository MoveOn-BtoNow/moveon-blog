import Faq from "@/components/Faq";
import { perguntasFrequentes } from "../constants/dados";

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
