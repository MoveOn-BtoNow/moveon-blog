import FormularioLead from "@/components/FormularioLead";
import { formularioLead } from "../constants/dados";

export default function SecaoContato() {
  return (
    <section className="section" id="contato">
      <div className="container">
        <div className="cta-box">
          <div className="section-head">
            <span className="tag">Vamos conversar</span>
            <h2>Entenda se sua empresa precisa de um Blueprint</h2>
            <p>Agende uma conversa com o time da MOVE.ON para entendermos o cenário da sua transformação.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
