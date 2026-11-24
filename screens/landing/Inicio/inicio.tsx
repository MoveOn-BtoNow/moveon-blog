import "./inicio.css";
import RaizLanding from "@/layout/RaizLanding";
import GoogleTagManager from "@/components/GoogleTagManager";
import Cabecalho from "./components/Cabecalho";
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
import Rodape from "./components/Rodape";
import DadosEstruturados from "@/components/DadosEstruturados";
import dadosEstruturados from "./constants/dados-estruturados.json";

export default function TelaInicio() {
  return (
    <RaizLanding pagina="index">
      <GoogleTagManager />
      <DadosEstruturados dados={dadosEstruturados} />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho />
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
      <Rodape />
    </RaizLanding>
  );
}
