import type { Metadata } from "next";
import PaginaLegal from "../componentes/PaginaLegal";
import { obterConteudosLegais } from "../lib/conteudos-legais";

export async function generateMetadata():Promise<Metadata>{const c=await obterConteudosLegais();return {title:c?.termosUsoTitulo||"Termos de Uso",description:c?.termosUsoSubtitulo||"Termos e condições de uso do Portal de Conteúdo MOVE.ON.",alternates:{canonical:"/termos"}};}

export default async function TermosDeUso() {
  const configuracao = await obterConteudosLegais();
  const personalizado = configuracao?.termosUsoHtml;
  return (
    <PaginaLegal
      titulo={configuracao?.termosUsoTitulo || "Termos de Uso"}
      resumo={
        configuracao?.termosUsoSubtitulo ||
        "Condições para acesso e utilização do Portal de Conteúdo MOVE.ON."
      }
    >
      {personalizado ? (
        <div
          className="conteudo-legal-personalizado"
          dangerouslySetInnerHTML={{ __html: personalizado }}
        />
      ) : (
        <>
          <h2>1. Identificação e aceitação</h2>
          <p>
            Este portal é mantido pela MOVE.ON, inscrita no CNPJ
            43.247.308/0001-49. Ao navegar, pesquisar, compartilhar conteúdos ou
            cadastrar-se na newsletter, você declara que leu e concorda com
            estes Termos e com a Política de Privacidade.
          </p>
          <h2>2. Finalidade do portal</h2>
          <p>
            O portal disponibiliza conteúdos informativos sobre gestão,
            processos, tecnologia, projetos e temas relacionados. Os materiais
            não constituem aconselhamento jurídico, contábil, financeiro ou
            técnico específico para uma situação concreta.
          </p>
          <h2>3. Uso permitido</h2>
          <p>
            Você deve utilizar o portal de forma lícita e respeitosa. É proibido
            tentar acessar áreas restritas sem autorização, interferir no
            funcionamento da plataforma, explorar vulnerabilidades, inserir
            códigos maliciosos, automatizar requisições abusivas ou utilizar o
            conteúdo para violar direitos de terceiros.
          </p>
          <h2>4. Conteúdo e propriedade intelectual</h2>
          <p>
            Textos, marcas, elementos gráficos, imagens, interfaces e demais
            materiais pertencem à MOVE.ON ou são utilizados mediante
            autorização. É permitida a divulgação dos links das publicações com
            a respectiva atribuição. Reprodução, alteração ou exploração
            comercial depende de autorização prévia, salvo hipóteses legalmente
            permitidas.
          </p>
          <h2>5. Links e serviços externos</h2>
          <p>
            Publicações podem conter links ou recursos de terceiros. A MOVE.ON
            não controla as práticas, disponibilidade ou conteúdos desses
            serviços. Ao acessá-los, consulte seus próprios termos e políticas.
          </p>
          <h2>6. Newsletter</h2>
          <p>
            O cadastro é voluntário. O assinante pode cancelar o recebimento
            pelo link existente nas mensagens. É vedado cadastrar endereço de
            terceiro sem autorização. Medidas de segurança e limitação de
            requisições podem ser aplicadas para prevenir abuso.
          </p>
          <h2>7. Disponibilidade e alterações</h2>
          <p>
            Buscamos manter o portal seguro e disponível, mas interrupções
            técnicas e manutenções podem ocorrer. Conteúdos, funcionalidades e
            estes Termos poderão ser atualizados; a data da versão vigente
            permanecerá indicada nesta página.
          </p>
          <h2>8. Responsabilidade</h2>
          <p>
            Cada usuário é responsável por suas decisões e pelo uso das
            informações disponibilizadas. A responsabilidade da MOVE.ON
            observará os limites e garantias previstos na legislação brasileira
            aplicável.
          </p>
          <h2>9. Legislação e contato</h2>
          <p>
            Aplicam-se as leis da República Federativa do Brasil. Dúvidas podem
            ser enviadas para{" "}
            <a href="mailto:contato@moveon.consulting">
              contato@moveon.consulting
            </a>
            .
          </p>
        </>
      )}
    </PaginaLegal>
  );
}
