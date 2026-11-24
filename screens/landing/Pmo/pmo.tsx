import "./pmo.css";
import RaizLanding from "@/layout/RaizLanding";
import GoogleTagManager from "@/components/GoogleTagManager";
import Cabecalho from "./components/Cabecalho";
import SecaoInicio from "./components/SecaoInicio";
import SecaoDor from "./components/SecaoDor";
import SecaoContexto from "./components/SecaoContexto";
import SecaoSolucao from "./components/SecaoSolucao";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoChamadaPortfoliosSemClareza from "./components/SecaoChamadaPortfoliosSemClareza";
import SecaoComoComeca from "./components/SecaoComoComeca";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";
import RedeAnimada from "@/components/RedeAnimada";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaPmo() {
  return (
    <RaizLanding pagina="pmo">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <RedeAnimada className="page-net" />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoDor />
        <SecaoContexto />
        <SecaoSolucao />
        <SecaoDiferenciais />
        <SecaoChamadaPortfoliosSemClareza />
        <SecaoComoComeca />
        <SecaoContato />
        <SecaoFaq />
      </main>
      <Rodape />
    </RaizLanding>
  );
}
