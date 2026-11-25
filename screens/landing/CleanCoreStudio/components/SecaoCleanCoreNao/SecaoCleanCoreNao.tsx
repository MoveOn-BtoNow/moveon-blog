import FormularioLead from "@/components/FormularioLead";
import { formularioLead } from "../../constants/dados";

export default function SecaoCleanCoreNao() {
  return (
    <section className="cta-final">
      <div className="wrap">
        <div className="eyebrow">Vamos conversar</div>
        <h2>Clean Core não é um momento.<br />É uma capacidade contínua.</h2>
        <p>Fale com a equipe MOVE.ON e entenda como o Clean Core Studio pode atuar no seu ambiente SAP S/4HANA — do diagnóstico à evolução contínua.</p>
        <div className="cta-form-wrap">
          <FormularioLead configuracao={formularioLead} />
        </div>
        <div className="tagline">Mais rápido. Mais claro. Mais integrado.</div>
      </div>
    </section>
  );
}
