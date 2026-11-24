import RaizLanding from "@/components/landing/compartilhados/RaizLanding";
import GoogleTagManager from "@/components/landing/compartilhados/GoogleTagManager";
import Cabecalho from "./Cabecalho";
import SecaoInicio from "./SecaoInicio";
import SecaoLogoStrip from "./SecaoLogoStrip";
import SecaoProblema from "./SecaoProblema";
import SecaoServicos from "./SecaoServicos";
import SecaoMetodo from "./SecaoMetodo";
import SecaoQuemSomos from "./SecaoQuemSomos";
import SecaoLideranca from "./SecaoLideranca";
import SecaoCases from "./SecaoCases";
import SecaoParceiros from "./SecaoParceiros";
import SecaoContato from "./SecaoContato";
import Rodape from "./Rodape";
import DadosEstruturados from "@/components/landing/compartilhados/DadosEstruturados";
import dadosEstruturados from "./dados-estruturados.json";

export default function PaginaInicio() {
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
