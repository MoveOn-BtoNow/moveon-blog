import FormularioLead from "@/components/FormularioLead";
import { formularioLead } from "../constants/dados";

export default function SecaoContato() {
  return (
    <section className="section dim" id="contato">
      <div className="container">
        <div className="cta-box">
          <div className="section-head">
            <span className="tag">Vamos conversar</span>
            <h2>Entenda como o 4s4.Governance pode proteger seu projeto SAP</h2>
            <p>Agende uma conversa com o time da MOVE.ON para entendermos o cenário do seu projeto.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
