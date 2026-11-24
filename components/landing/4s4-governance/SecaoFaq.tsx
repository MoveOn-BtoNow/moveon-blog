import Faq from "@/components/landing/compartilhados/Faq";
import { perguntasFrequentes } from "./dados";

export default function SecaoFaq() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="tag">FAQ</span>
          <h2>Perguntas Frequentes</h2>
        </div>
        <Faq variante="details" itens={perguntasFrequentes} />
      </div>
    </section>
  );
}
