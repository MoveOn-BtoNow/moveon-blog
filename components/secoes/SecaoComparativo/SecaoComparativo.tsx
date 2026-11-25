import type { ColunaComparativo, FundoSecao, TituloSecao } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoComparativoProps extends TituloSecao {
  sem: ColunaComparativo;
  com: ColunaComparativo;
  fundo?: FundoSecao;
}

/** Comparativo "sem × com" a solução, em duas colunas. */
export default function SecaoComparativo({ sem, com, fundo, ...titulo }: SecaoComparativoProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"}>
      <div className="container">
        <CabecalhoSecao {...titulo} />
        <div className="compare-grid">
          {(
            [
              ["sem", sem],
              ["com", com],
            ] as const
          ).map(([classe, coluna]) => (
            <div key={classe} className={`compare-col ${classe}`}>
              <h3>{coluna.titulo}</h3>
              <ul>
                {coluna.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
