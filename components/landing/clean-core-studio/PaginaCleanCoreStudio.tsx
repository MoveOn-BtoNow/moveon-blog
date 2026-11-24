import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import Cabecalho from "./Cabecalho";
import SecaoHero from "./SecaoHero";
import SecaoODesafio from "./SecaoODesafio";
import SecaoComoFunciona from "./SecaoComoFunciona";
import SecaoDimensoes from "./SecaoDimensoes";
import SecaoJornada from "./SecaoJornada";
import SecaoTendencia from "./SecaoTendencia";
import SecaoResultados from "./SecaoResultados";
import SecaoPorQueMoveon from "./SecaoPorQueMoveon";
import SecaoCleanCoreNao from "./SecaoCleanCoreNao";
import Rodape from "./Rodape";

export default function PaginaCleanCoreStudio() {
  return (
    <RaizLanding pagina="clean-core-studio">
      <Cabecalho />
      <SecaoHero />
      <SecaoODesafio />
      <SecaoComoFunciona />
      <SecaoDimensoes />
      <SecaoJornada />
      <SecaoTendencia />
      <SecaoResultados />
      <SecaoPorQueMoveon />
      <SecaoCleanCoreNao />
      <Rodape />
    </RaizLanding>
  );
}
