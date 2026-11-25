import "./inicio.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import { links, chamadaCabecalho } from "./constants/navegacao";
import GoogleTagManager from "@/components/GoogleTagManager";
import SecaoInicio from "./components/SecaoInicio";
import SecaoLogoStrip from "./components/SecaoLogoStrip";
import SecaoProblema from "./components/SecaoProblema";
import SecaoServicos from "./components/SecaoServicos";
import SecaoMetodo from "./components/SecaoMetodo";
import SecaoQuemSomos from "./components/SecaoQuemSomos";
import SecaoLideranca from "./components/SecaoLideranca";
import SecaoCases from "./components/SecaoCases";
import SecaoParceiros from "./components/SecaoParceiros";
import SecaoContato from "./components/SecaoContato";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaInicio() {
  return (
    <RaizLanding pagina="index">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <CabecalhoSite links={links} chamada={chamadaCabecalho} comEspaco={false} />
      <main id="conteudo">
        <SecaoInicio />
        <SecaoLogoStrip />
        <SecaoProblema />
        <SecaoServicos />
        <SecaoMetodo />
        <SecaoQuemSomos />
        <SecaoLideranca />
        <SecaoCases />
        <SecaoParceiros />
        <SecaoContato />
      </main>
      <RodapeSite />
    </RaizLanding>
  );
}
