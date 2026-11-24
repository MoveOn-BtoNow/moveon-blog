import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import GoogleTagManager from "@/components/landing/compartilhados/GoogleTagManager";
import Cabecalho from "./Cabecalho";
import SecaoInicio from "./SecaoInicio";
import SecaoDor from "./SecaoDor";
import SecaoContexto from "./SecaoContexto";
import SecaoSolucao from "./SecaoSolucao";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoChamadaPortfoliosSemClareza from "./SecaoChamadaPortfoliosSemClareza";
import SecaoComoComeca from "./SecaoComoComeca";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";
import RedeAnimada from "@/components/landing/compartilhados/RedeAnimada";
import DadosEstruturados from "@/components/landing/compartilhados/DadosEstruturados";
import dadosEstruturados from "./dados-estruturados.json";

export default function PaginaPmo() {
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
