import type { FundoSecao, TituloSecao } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoCenariosProps extends TituloSecao {
  cenarios: string[];
  fundo?: FundoSecao;
}

/** "Você reconhece algum destes cenários?": lista de dores com chamada para contato. */
export default function SecaoCenarios({ cenarios, fundo, ...titulo }: SecaoCenariosProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"}>
      <div className="container">
        <CabecalhoSecao {...titulo} />
        <div className="scenarios">
          {cenarios.map((cenario) => (
            <div key={cenario} className="scenario-item">
              <span className="mark">—</span>
              <p>{cenario}</p>
            </div>
          ))}
        </div>
        <div className="cta-inline">
          <a href="#contato" className="btn btn-primary">
            Falar com um especialista
          </a>
        </div>
      </div>
    </section>
  );
}
