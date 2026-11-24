import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import Cabecalho from "./Cabecalho";
import SecaoHero from "./SecaoHero";
import SecaoVoceReconheceAlgum from "./SecaoVoceReconheceAlgum";
import SecaoProofQuote from "./SecaoProofQuote";
import SecaoSolucoes from "./SecaoSolucoes";
import SecaoEntregaveis from "./SecaoEntregaveis";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoSuaOperacaoMerece from "./SecaoSuaOperacaoMerece";
import SecaoComoFunciona from "./SecaoComoFunciona";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";

export default function PaginaBpm() {
  return (
    <RaizLanding pagina="bpm">
      <Cabecalho />
      <SecaoHero />
      <SecaoVoceReconheceAlgum />
      <SecaoProofQuote />
      <SecaoSolucoes />
      <SecaoEntregaveis />
      <SecaoDiferenciais />
      <SecaoSuaOperacaoMerece />
      <SecaoComoFunciona />
      <SecaoContato />
      <SecaoFaq />
      <Rodape />
    </RaizLanding>
  );
}
