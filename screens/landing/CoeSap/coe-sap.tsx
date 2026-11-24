import "./coe-sap.css";
import RaizLanding from "@/layout/RaizLanding";
import GoogleTagManager from "@/components/GoogleTagManager";
import Cabecalho from "./components/Cabecalho";
import SecaoInicio from "./components/SecaoInicio";
import SecaoOQueE from "./components/SecaoOQueE";
import SecaoChamadaQuerEntenderComo from "./components/SecaoChamadaQuerEntenderComo";
import SecaoServicos from "./components/SecaoServicos";
import SecaoDiferenciais from "./components/SecaoDiferenciais";
import SecaoChamadaSuaEmpresaPrecisa from "./components/SecaoChamadaSuaEmpresaPrecisa";
import SecaoComoComeca from "./components/SecaoComoComeca";
import SecaoContato from "./components/SecaoContato";
import SecaoFaq from "./components/SecaoFaq";
import Rodape from "./components/Rodape";
import RedeAnimada from "@/components/RedeAnimada";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaCoeSap() {
  return (
    <RaizLanding pagina="coe-sap">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <RedeAnimada className="page-net" />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoOQueE />
        <SecaoChamadaQuerEntenderComo />
        <SecaoServicos />
        <SecaoDiferenciais />
        <SecaoChamadaSuaEmpresaPrecisa />
        <SecaoComoComeca />
        <SecaoContato />
        <SecaoFaq />
      </main>
      <Rodape />
    </RaizLanding>
  );
}
