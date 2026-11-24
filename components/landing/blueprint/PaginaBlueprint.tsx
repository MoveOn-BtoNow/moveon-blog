import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import Cabecalho from "./Cabecalho";
import SecaoHero from "./SecaoHero";
import SecaoQueMudaCom from "./SecaoQueMudaCom";
import SecaoSolucoes from "./SecaoSolucoes";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoSuaProximaGrande from "./SecaoSuaProximaGrande";
import SecaoComoFunciona from "./SecaoComoFunciona";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";

export default function PaginaBlueprint() {
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
