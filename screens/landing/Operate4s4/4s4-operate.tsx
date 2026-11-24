import "./4s4-operate.css";
import RaizLanding from "@/layout/RaizLanding";
import Cabecalho from "./components/Cabecalho";
import SecaoHero from "./components/SecaoHero";
import SecaoQueMudaCom from "./components/SecaoQueMudaCom";
import SecaoSolucoes from "./components/SecaoSolucoes";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoSeuSAPNao from "./components/SecaoSeuSAPNao";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";

export default function TelaOperate4s4() {
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
