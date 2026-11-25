import "./coe-sap.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import SecaoChamadaFaixa from "@/components/secoes/SecaoChamadaFaixa";
import SecaoContatoEspecialista from "@/components/secoes/SecaoContatoEspecialista";
import SecaoFaqAcordeao from "@/components/secoes/SecaoFaqAcordeao";
import { links, chamadaCabecalho } from "./constants/navegacao";
import { chamadaQuerEntenderComo, chamadaSuaEmpresaPrecisa, contato } from "./constants/conteudo-secoes";
import { perguntasFrequentes, formularioLead } from "./constants/dados";
import GoogleTagManager from "@/components/GoogleTagManager";
import SecaoInicio from "./components/SecaoInicio";
import SecaoOQueE from "./components/SecaoOQueE";
import SecaoServicos from "./components/SecaoServicos";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoComoComeca from "./components/SecaoComoComeca";
import RedeAnimada from "@/components/RedeAnimada";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaCoeSap() {
  return (
    <RaizLanding pagina="coe-sap">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <RedeAnimada className="page-net" />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <CabecalhoSite links={links} chamada={chamadaCabecalho} comEspaco={false} />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoOQueE />
        <SecaoChamadaFaixa {...chamadaQuerEntenderComo} />
        <SecaoServicos />
        <SecaoDiferenciais />
        <SecaoChamadaFaixa {...chamadaSuaEmpresaPrecisa} solida comGrade />
        <SecaoComoComeca />
        <SecaoContatoEspecialista {...contato} formulario={formularioLead} comRede />
        <SecaoFaqAcordeao perguntas={perguntasFrequentes} />
      </main>
      <RodapeSite />
    </RaizLanding>
  );
}
