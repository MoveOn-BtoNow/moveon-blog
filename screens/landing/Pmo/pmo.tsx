import "./pmo.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import SecaoChamadaFaixa from "@/components/secoes/SecaoChamadaFaixa";
import SecaoContatoEspecialista from "@/components/secoes/SecaoContatoEspecialista";
import SecaoFaqAcordeao from "@/components/secoes/SecaoFaqAcordeao";
import { links, chamadaCabecalho } from "./constants/navegacao";
import { chamadaPortfoliosSemClareza, contato } from "./constants/conteudo-secoes";
import { perguntasFrequentes, formularioLead } from "./constants/dados";
import GoogleTagManager from "@/components/GoogleTagManager";
import SecaoInicio from "./components/SecaoInicio";
import SecaoDor from "./components/SecaoDor";
import SecaoContexto from "./components/SecaoContexto";
import SecaoSolucao from "./components/SecaoSolucao";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoComoComeca from "./components/SecaoComoComeca";
import RedeAnimada from "@/components/RedeAnimada";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaPmo() {
  return (
    <RaizLanding pagina="pmo">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <RedeAnimada className="page-net" />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <CabecalhoSite links={links} chamada={chamadaCabecalho} comEspaco={false} />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoDor />
        <SecaoContexto />
        <SecaoSolucao />
        <SecaoDiferenciais />
        <SecaoChamadaFaixa {...chamadaPortfoliosSemClareza} comGrade />
        <SecaoComoComeca />
        <SecaoContatoEspecialista {...contato} formulario={formularioLead} />
        <SecaoFaqAcordeao perguntas={perguntasFrequentes} />
      </main>
      <RodapeSite />
    </RaizLanding>
  );
}
