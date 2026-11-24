import "./tax.css";
import RaizLanding from "@/layout/RaizLanding";
import GoogleTagManager from "@/components/GoogleTagManager";
import Cabecalho from "./components/Cabecalho";
import SecaoInicio from "./components/SecaoInicio";
import SecaoContexto from "./components/SecaoContexto";
import SecaoDiagnostico from "./components/SecaoDiagnostico";
import SecaoChamadaQuerEntenderQual from "./components/SecaoChamadaQuerEntenderQual";
import SecaoSolucao from "./components/SecaoSolucao";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoTimeline from "./components/SecaoTimeline";
import SecaoChamadaAntecipeProximaMudanca from "./components/SecaoChamadaAntecipeProximaMudanca";
import SecaoComoComeca from "./components/SecaoComoComeca";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";
import RedeAnimada from "@/components/RedeAnimada";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaTax() {
  return (
    <RaizLanding pagina="tax">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <RedeAnimada className="page-net" />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoContexto />
        <SecaoDiagnostico />
        <SecaoChamadaQuerEntenderQual />
        <SecaoSolucao />
        <SecaoDiferenciais />
        <SecaoTimeline />
        <SecaoChamadaAntecipeProximaMudanca />
        <SecaoComoComeca />
        <SecaoContato />
        <SecaoFaq />
      </main>
      <Rodape />
    </RaizLanding>
  );
}
