import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import Cabecalho from "./Cabecalho";
import SecaoHero from "./SecaoHero";
import SecaoQueMudaCom from "./SecaoQueMudaCom";
import SecaoSolucoes from "./SecaoSolucoes";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoSeuSAPNao from "./SecaoSeuSAPNao";
import SecaoComoFunciona from "./SecaoComoFunciona";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";

export default function Pagina4s4Operate() {
  return (
    <RaizLanding pagina="4s4-operate">
      <Cabecalho />
      <SecaoHero />
      <SecaoQueMudaCom />
      <SecaoSolucoes />
      <SecaoDiferenciais />
      <SecaoSeuSAPNao />
      <SecaoComoFunciona />
      <SecaoContato />
      <SecaoFaq />
      <Rodape />
    </RaizLanding>
  );
}
