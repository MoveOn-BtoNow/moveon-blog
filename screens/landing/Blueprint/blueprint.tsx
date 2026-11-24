import "./blueprint.css";
import RaizLanding from "@/layout/RaizLanding";
import Cabecalho from "./components/Cabecalho";
import SecaoHero from "./components/SecaoHero";
import SecaoQueMudaCom from "./components/SecaoQueMudaCom";
import SecaoSolucoes from "./components/SecaoSolucoes";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoSuaProximaGrande from "./components/SecaoSuaProximaGrande";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";

export default function TelaBlueprint() {
  return (
    <RaizLanding pagina="blueprint">
      <Cabecalho />
      <SecaoHero />
      <SecaoQueMudaCom />
      <SecaoSolucoes />
      <SecaoDiferenciais />
      <SecaoSuaProximaGrande />
      <SecaoComoFunciona />
      <SecaoContato />
      <SecaoFaq />
      <Rodape />
    </RaizLanding>
  );
}
