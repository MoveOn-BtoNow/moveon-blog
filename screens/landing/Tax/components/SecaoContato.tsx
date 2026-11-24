import FormularioLead from "@/components/FormularioLead";
import { formularioLead } from "../constants/dados";

export default function SecaoContato() {
  return (
    <section className="section dark" id="contato">
      <div className="grid-bg" />
      <div className="container">
        <div className="cta-box reveal" id="form-tax">
          <div style={{ position: "relative", zIndex: "1" }}>
            <span className="eyebrow">Vamos conversar</span>
            <h2 className="section-title" style={{ color: "#fff" }}>Não espere a próxima mudança regulatória chegar.</h2>
            <p className="section-copy">Agende uma conversa com o time da MOVE.ON para entendermos o cenário da sua empresa e como podemos te ajudar.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
