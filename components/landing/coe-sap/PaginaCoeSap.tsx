import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import GoogleTagManager from "@/components/landing/compartilhados/GoogleTagManager";
import Cabecalho from "./Cabecalho";
import SecaoInicio from "./SecaoInicio";
import SecaoOQueE from "./SecaoOQueE";
import SecaoChamadaQuerEntenderComo from "./SecaoChamadaQuerEntenderComo";
import SecaoServicos from "./SecaoServicos";
import SecaoDiferenciais from "./SecaoDiferenciais";
import SecaoChamadaSuaEmpresaPrecisa from "./SecaoChamadaSuaEmpresaPrecisa";
import SecaoComoComeca from "./SecaoComoComeca";
import SecaoContato from "./SecaoContato";
import SecaoFaq from "./SecaoFaq";
import Rodape from "./Rodape";
import RedeAnimada from "@/components/landing/compartilhados/RedeAnimada";
import DadosEstruturados from "@/components/landing/compartilhados/DadosEstruturados";
import dadosEstruturados from "./dados-estruturados.json";

export default function PaginaCoeSap() {
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
