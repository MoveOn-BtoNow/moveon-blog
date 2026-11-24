import "./bpm.css";
import RaizLanding from "@/layout/RaizLanding";
import Cabecalho from "./components/Cabecalho";
import SecaoHero from "./components/SecaoHero";
import SecaoVoceReconheceAlgum from "./components/SecaoVoceReconheceAlgum";
import SecaoProofQuote from "./components/SecaoProofQuote";
import SecaoSolucoes from "./components/SecaoSolucoes";
import SecaoEntregaveis from "./components/SecaoEntregaveis";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoSuaOperacaoMerece from "./components/SecaoSuaOperacaoMerece";
import SecaoComoFunciona from "./components/SecaoComoFunciona";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";

export default function TelaBpm() {
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
