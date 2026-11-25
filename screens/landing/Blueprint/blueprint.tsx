import "./blueprint.css";
import RaizLanding from "@/layout/RaizLanding";
import CabecalhoSite from "@/layout/CabecalhoSite";
import RodapeSite from "@/layout/RodapeSite";
import { LINKS_PAGINA_SOLUCAO } from "@/layout/links-site";
import SecaoChamadaBanner from "@/components/secoes/SecaoChamadaBanner";
import SecaoComoFunciona from "@/components/secoes/SecaoComoFunciona";
import SecaoComparativo from "@/components/secoes/SecaoComparativo";
import SecaoContato from "@/components/secoes/SecaoContato";
import SecaoDiferenciais from "@/components/secoes/SecaoDiferenciais";
import SecaoFaq from "@/components/secoes/SecaoFaq";
import SecaoHeroSolucao from "@/components/secoes/SecaoHeroSolucao";
import SecaoSolucoes from "@/components/secoes/SecaoSolucoes";
import { hero, comparativo, solucoes, diferenciais, comoFunciona, banner, contato } from "./constants/conteudo";
import { formularioLead, perguntasFrequentes } from "./constants/dados";

export default function TelaBlueprint() {
  return (
    <RaizLanding pagina="blueprint">
      <CabecalhoSite links={LINKS_PAGINA_SOLUCAO} chamada={{ href: "#contato" }} />
      <SecaoHeroSolucao selo={hero.selo} titulo={hero.titulo} subtitulo={hero.subtitulo}>
        {hero.complemento}
      </SecaoHeroSolucao>
      <SecaoComparativo {...comparativo} fundo="dim" />
      <SecaoSolucoes {...solucoes} />
      <SecaoDiferenciais {...diferenciais} fundo="dim" />
      <SecaoChamadaBanner {...banner} />
      <SecaoComoFunciona {...comoFunciona} fundo="dim" />
      <SecaoContato {...contato} formulario={formularioLead} />
      <SecaoFaq perguntas={perguntasFrequentes} fundo="dim" />
      <RodapeSite />
    </RaizLanding>
  );
}
