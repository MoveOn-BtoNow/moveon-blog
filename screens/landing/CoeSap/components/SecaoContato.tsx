import FormularioLead from "@/components/FormularioLead";
import RedeAnimada from "@/components/RedeAnimada";
import { formularioLead } from "../constants/dados";

export default function SecaoContato() {
  return (
    <section className="section dark" id="contato">
      <RedeAnimada className="contato-net" />
      <div className="grid-bg" />
      <div className="container">
        <div className="cta-box reveal" id="form-coe">
          <div style={{ position: "relative", zIndex: "1" }}>
            <span className="eyebrow">Vamos conversar</span>
            <h2 className="section-title" style={{ color: "#fff" }}>Entenda como evoluir seu SAP com mais controle.</h2>
            <p className="section-copy">Assim que preencher o formulário a equipe da MOVE.ON vai entrar em contato para indicar o melhor caminho para estruturar seu SAP.</p>
          </div>
          <FormularioLead configuracao={formularioLead} />
        </div>
      </div>
    </section>
  );
}
