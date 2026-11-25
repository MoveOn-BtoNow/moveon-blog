import { Fragment } from "react";
import type { FundoSecao, Solucao, TituloSecao } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoSolucoesProps extends TituloSecao {
  solucoes: Solucao[];
  fundo?: FundoSecao;
}

const numero = (indice: number) => String(indice + 1).padStart(2, "0");

/** Lista numerada de soluções com "O que você ganha". */
export default function SecaoSolucoes({ solucoes, fundo, ...titulo }: SecaoSolucoesProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"} id="solucoes">
      <div className="container">
        <CabecalhoSecao {...titulo} />
        <div className="solutions">
          {solucoes.map((solucao, indice) => (
            <div key={solucao.titulo} className="solution">
              <div className="num">{numero(indice)}</div>
              <div>
                <span className="tag-pill">{solucao.rotulo}</span>
                <h3>{solucao.titulo}</h3>
                <p className="desc">{solucao.descricao}</p>
              </div>
              <div>
                <span className="gains-label">O que você ganha</span>
                <ul className="gains">
                  {solucao.ganhos.map((ganho) => (
                    <li key={ganho}>{ganho}</li>
                  ))}
                </ul>
                {solucao.selos && (
                  <div className="chips-inline">
                    {solucao.selos.map((selo, i) => (
                      <Fragment key={selo}>
                        {i > 0 && " "}
                        <span className="chip-sm">{selo}</span>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
