import FormularioLead from "@/components/FormularioLead";
import { formularioLead } from "../../constants/dados";

export default function SecaoContato() {
  return (
    <section className="section dark" id="contato">
      <div className="container">
        <div className="cta-box reveal">
          <div style={{ position: "relative", zIndex: "1" }}>
            <span className="eyebrow">Contato</span>
            <h2 className="section-title" style={{ color: "#fff" }}>Entenda qual frente se conecta ao seu desafio</h2>
            <p className="section-copy">Nossa equipe analisa seu contexto e indica qual serviço faz mais sentido para você.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
