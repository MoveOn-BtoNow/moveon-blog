import "./bpm.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import { LINKS_PAGINA_SOLUCAO } from "@/layout/links-site";
import Jornada from "@/components/secoes/Jornada";
import SecaoCenarios from "@/components/secoes/SecaoCenarios";
import SecaoChamadaBanner from "@/components/secoes/SecaoChamadaBanner";
import SecaoComoFunciona from "@/components/secoes/SecaoComoFunciona";
import SecaoContato from "@/components/secoes/SecaoContato";
import SecaoDiferenciais from "@/components/secoes/SecaoDiferenciais";
import SecaoFaq from "@/components/secoes/SecaoFaq";
import SecaoHeroSolucao from "@/components/secoes/SecaoHeroSolucao";
import SecaoSolucoes from "@/components/secoes/SecaoSolucoes";
import SecaoProofQuote from "./components/SecaoProofQuote";
import SecaoEntregaveis from "./components/SecaoEntregaveis";
import { hero, cenarios, solucoes, diferenciais, comoFunciona, banner, contato } from "./constants/conteudo";
import { formularioLead, perguntasFrequentes } from "./constants/dados";

export default function TelaBpm() {
  return (
    <RaizLanding pagina="bpm">
      <CabecalhoSite links={LINKS_PAGINA_SOLUCAO} chamada={{ href: "#contato" }} />
      <SecaoHeroSolucao selo={hero.selo} titulo={hero.titulo} subtitulo={hero.subtitulo}>
        <Jornada etapas={hero.jornada} />
      </SecaoHeroSolucao>
      <SecaoCenarios {...cenarios} fundo="dim" />
      <SecaoProofQuote />
      <SecaoSolucoes {...solucoes} fundo="dim" />
      <SecaoEntregaveis />
      <SecaoDiferenciais {...diferenciais} fundo="dim" />
      <SecaoChamadaBanner {...banner} />
      <SecaoComoFunciona {...comoFunciona} fundo="dim" />
      <SecaoContato {...contato} formulario={formularioLead} />
      <SecaoFaq perguntas={perguntasFrequentes} fundo="dim" />
      <RodapeSite />
    </RaizLanding>
  );
}
