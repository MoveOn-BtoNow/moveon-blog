import FormularioLead from "@/components/FormularioLead";
import type { FundoSecao, SecaoContatoConteudo } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoContatoProps extends SecaoContatoConteudo {
  fundo?: FundoSecao;
}

/** Bloco de contato com o formulário de lead. */
export default function SecaoContato({ formulario, fundo, ...titulo }: SecaoContatoProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"} id="contato">
      <div className="container">
        <div className="cta-box">
          <CabecalhoSecao {...titulo} />
          <FormularioLead configuracao={formulario} />
        </div>
      </div>
    </section>
  );
}
