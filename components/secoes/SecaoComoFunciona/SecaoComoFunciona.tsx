import type { FundoSecao, ItemTexto, TituloSecao } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoComoFuncionaProps extends TituloSecao {
  passos: ItemTexto[];
  /** Exibe os passos em grade (classe `steps-grid`); sem ela, em lista. */
  emGrade?: boolean;
  fundo?: FundoSecao;
}

const numero = (indice: number) => String(indice + 1).padStart(2, "0");

/** Passo a passo numerado ("Como funciona"). */
export default function SecaoComoFunciona({ passos, emGrade, fundo, ...titulo }: SecaoComoFuncionaProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"} id="como-funciona">
      <div className="container">
        <CabecalhoSecao {...titulo} />
        <div className={emGrade ? "steps-grid" : undefined}>
          {passos.map((passo, indice) => (
            <div key={passo.titulo} className="step">
              <div className="snum">{numero(indice)}</div>
              <div>
                <h3>{passo.titulo}</h3>
                <p>{passo.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
