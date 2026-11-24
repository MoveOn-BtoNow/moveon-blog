import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import Cabecalho from "./Cabecalho";
import SecaoHero from "./SecaoHero";
import SecaoVoceReconheceAlgum from "./SecaoVoceReconheceAlgum";
import SecaoRiscosSaoDiferentes from "./SecaoRiscosSaoDiferentes";
import SecaoSolucoes from "./SecaoSolucoes";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoSeuProjetoSAP from "./SecaoSeuProjetoSAP";
import SecaoComoFunciona from "./SecaoComoFunciona";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";

export default function Pagina4s4Governance() {
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
