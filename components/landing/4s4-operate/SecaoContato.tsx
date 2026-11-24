import FormularioLead from "@/components/landing/compartilhados/FormularioLead";
import { formularioLead } from "./dados";

export default function SecaoContato() {
  return (
    <section className="section" id="contato">
      <div className="container">
        <div className="cta-box">
          <div className="section-head">
            <span className="tag">Vamos conversar</span>
            <h2>Entenda como o 4s4.Operate pode sustentar seu SAP</h2>
            <p>Agende uma conversa com o time da MOVE.ON para entendermos o momento do seu ambiente.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
