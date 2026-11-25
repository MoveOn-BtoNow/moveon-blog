import "./clean-core-studio.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import { links, chamadaCabecalho } from "./constants/navegacao";
import SecaoHero from "./components/SecaoHero";
import SecaoODesafio from "./components/SecaoODesafio";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoDimensoes from "./components/SecaoDimensoes";
import SecaoJornada from "./components/SecaoJornada";
import SecaoTendencia from "./components/SecaoTendencia";
import SecaoResultados from "./components/SecaoResultados";
import SecaoPorQueMoveon from "./components/SecaoPorQueMoveon";
import SecaoCleanCoreNao from "./components/SecaoCleanCoreNao";

export default function TelaCleanCoreStudio() {
  return (
    <RaizLanding pagina="clean-core-studio">
      <CabecalhoSite links={links} chamada={chamadaCabecalho} />
      <SecaoHero />
      <SecaoODesafio />
      <SecaoComoFunciona />
      <SecaoDimensoes />
      <SecaoJornada />
      <SecaoTendencia />
      <SecaoResultados />
      <SecaoPorQueMoveon />
      <SecaoCleanCoreNao />
      <RodapeSite />
    </RaizLanding>
  );
}
