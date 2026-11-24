import Faq from "@/components/Faq";
import { perguntasFrequentes } from "../constants/dados";

export default function SecaoFaq() {
  return (
    <section className="section dim" id="faq">
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
