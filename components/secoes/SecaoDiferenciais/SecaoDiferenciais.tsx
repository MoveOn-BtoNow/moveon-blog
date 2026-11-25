import type { FundoSecao, ItemTexto, TituloSecao } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoDiferenciaisProps extends TituloSecao {
  diferenciais: ItemTexto[];
  fundo?: FundoSecao;
}

const numero = (indice: number) => String(indice + 1).padStart(2, "0");

/** Grade de diferenciais numerados ("Por que a MOVE.ON é diferente"). */
export default function SecaoDiferenciais({ diferenciais, fundo, ...titulo }: SecaoDiferenciaisProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"} id="diferenciais">
      <div className="container">
        <CabecalhoSecao {...titulo} />
        <div className="diff-grid">
          {diferenciais.map((item, indice) => (
            <div key={item.titulo} className="diff-card">
              <span className="idx">{numero(indice)}</span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
