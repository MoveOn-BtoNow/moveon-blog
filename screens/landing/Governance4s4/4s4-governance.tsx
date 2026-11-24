import "./4s4-governance.css";
import RaizLanding from "@/layout/RaizLanding";
import Cabecalho from "./components/Cabecalho";
import SecaoHero from "./components/SecaoHero";
import SecaoVoceReconheceAlgum from "./components/SecaoVoceReconheceAlgum";
import SecaoRiscosSaoDiferentes from "./components/SecaoRiscosSaoDiferentes";
import SecaoSolucoes from "./components/SecaoSolucoes";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoSeuProjetoSAP from "./components/SecaoSeuProjetoSAP";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";

export default function TelaGovernance4s4() {
  return (
    <RaizLanding pagina="4s4-governance">
      <Cabecalho />
      <SecaoHero />
      <SecaoVoceReconheceAlgum />
      <SecaoRiscosSaoDiferentes />
      <SecaoSolucoes />
      <SecaoDiferenciais />
      <SecaoSeuProjetoSAP />
      <SecaoComoFunciona />
      <SecaoContato />
      <SecaoFaq />
      <Rodape />
    </RaizLanding>
  );
}
