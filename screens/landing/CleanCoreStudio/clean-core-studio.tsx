import "./clean-core-studio.css";
import RaizLanding from "@/layout/RaizLanding";
import Cabecalho from "./components/Cabecalho";
import SecaoHero from "./components/SecaoHero";
import SecaoODesafio from "./components/SecaoODesafio";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoDimensoes from "./components/SecaoDimensoes";
import SecaoJornada from "./components/SecaoJornada";
import SecaoTendencia from "./components/SecaoTendencia";
import SecaoResultados from "./components/SecaoResultados";
import SecaoPorQueMoveon from "./components/SecaoPorQueMoveon";
import SecaoCleanCoreNao from "./components/SecaoCleanCoreNao";
import Rodape from "./components/Rodape";

export default function TelaCleanCoreStudio() {
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
