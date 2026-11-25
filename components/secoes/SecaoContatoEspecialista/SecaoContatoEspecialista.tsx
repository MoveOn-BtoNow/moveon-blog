import FormularioLead from "@/components/FormularioLead";
import RedeAnimada from "@/components/RedeAnimada";
import type { ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";

interface SecaoContatoEspecialistaProps {
  /** `id` do bloco do formulário, usado pelos botões da página (ex.: "form-pmo"). */
  idFormulario: string;
  titulo: string;
  texto: string;
  formulario: ConfiguracaoFormularioLead;
  /** Mostra a animação de rede no fundo. */
  comRede?: boolean;
}

/** Bloco de contato escuro com formulário (PMO, Tax e COE SAP). */
export default function SecaoContatoEspecialista({
  idFormulario,
  titulo,
  texto,
  formulario,
  comRede,
}: SecaoContatoEspecialistaProps) {
  return (
    <section className="section dark" id="contato">
      {comRede && <RedeAnimada className="contato-net" />}
      <div className="grid-bg" />
      <div className="container">
        <div className="cta-box reveal" id={idFormulario}>
          <div style={{ position: "relative", zIndex: "1" }}>
            <span className="eyebrow">Vamos conversar</span>
            <h2 className="section-title" style={{ color: "#fff" }}>
              {titulo}
            </h2>
            <p className="section-copy">{texto}</p>
          </div>
          <FormularioLead configuracao={formulario} />
        </div>
      </div>
    </section>
  );
}
