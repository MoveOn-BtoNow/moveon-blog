import Faq from "@/components/Faq";
import type { FundoSecao, PerguntaFrequente } from "@/interfaces/secoes";
import CabecalhoSecao from "../CabecalhoSecao";

interface SecaoFaqProps {
  perguntas: PerguntaFrequente[];
  fundo?: FundoSecao;
}

/** Perguntas frequentes em <details> (páginas de solução). */
export default function SecaoFaq({ perguntas, fundo }: SecaoFaqProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"} id="faq">
      <div className="container">
        <CabecalhoSecao etiqueta="FAQ" titulo="Perguntas Frequentes" />
        <Faq variante="details" itens={perguntas} />
      </div>
    </section>
  );
}
