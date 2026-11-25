import "./4s4-governance.css";
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
import SecaoRiscosSaoDiferentes from "./components/SecaoRiscosSaoDiferentes";
import { hero, cenarios, solucoes, diferenciais, comoFunciona, banner, contato } from "./constants/conteudo";
import { formularioLead, perguntasFrequentes } from "./constants/dados";

export default function TelaGovernance4s4() {
  return (
    <RaizLanding pagina="4s4-governance">
      <CabecalhoSite links={LINKS_PAGINA_SOLUCAO} chamada={{ href: "#contato" }} />
      <SecaoHeroSolucao selo={hero.selo} titulo={hero.titulo} subtitulo={hero.subtitulo}>
        <Jornada etapas={hero.jornada} />
      </SecaoHeroSolucao>
      <SecaoCenarios {...cenarios} fundo="dim" />
      <SecaoRiscosSaoDiferentes />
      <SecaoSolucoes {...solucoes} fundo="dim" />
      <SecaoDiferenciais {...diferenciais} />
      <SecaoChamadaBanner {...banner} fundo="dim" />
      <SecaoComoFunciona {...comoFunciona} />
      <SecaoContato {...contato} formulario={formularioLead} fundo="dim" />
      <SecaoFaq perguntas={perguntasFrequentes} />
      <RodapeSite />
    </RaizLanding>
  );
}
