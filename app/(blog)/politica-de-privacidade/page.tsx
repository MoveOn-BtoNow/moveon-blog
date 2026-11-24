import type { Metadata } from "next";
import PaginaLegal from "../componentes/PaginaLegal";
import { obterConteudosLegais } from "../lib/conteudos-legais";

export async function generateMetadata():Promise<Metadata>{const c=await obterConteudosLegais();return {title:c?.politicaPrivacidadeTitulo||"Política de Privacidade",description:c?.politicaPrivacidadeSubtitulo||"Como a MOVE.ON trata e protege dados pessoais no portal, em conformidade com a LGPD.",alternates:{canonical:"/politica-de-privacidade"}};}

export default async function PoliticaDePrivacidade() {
  const configuracao = await obterConteudosLegais();
  const personalizado = configuracao?.politicaPrivacidadeHtml;
  return (
    <PaginaLegal
      titulo={
        configuracao?.politicaPrivacidadeTitulo || "Política de Privacidade"
      }
      resumo={
        configuracao?.politicaPrivacidadeSubtitulo ||
        "Transparência sobre o tratamento de dados pessoais no Portal MOVE.ON, conforme a Lei nº 13.709/2018 (LGPD)."
      }
    >
      {personalizado ? (
        <div
          className="conteudo-legal-personalizado"
          dangerouslySetInnerHTML={{ __html: personalizado }}
        />
      ) : (
        <>
          <h2>1. Controlador e contato</h2>
          <p>
            A MOVE.ON, CNPJ 43.247.308/0001-49, é responsável pelas decisões
            relativas aos tratamentos descritos nesta política. Solicitações
            sobre privacidade e exercício de direitos podem ser enviadas para{" "}
            <a href="mailto:contato@moveon.consulting">
              contato@moveon.consulting
            </a>
            .
          </p>
          <h2>2. Dados tratados</h2>
          <p>
            No formulÃ¡rio de contato, tratamos nome, e-mail corporativo,
            empresa, cargo, relaÃ§Ã£o informada com a SAP e o desafio descrito
            pelo titular. TambÃ©m mantemos registros tÃ©cnicos minimizados,
            inclusive identificadores protegidos por hash e resultado da
            verificaÃ§Ã£o antiabuso, quando habilitada.
          </p>
          <p>
            Podemos tratar o endereço de e-mail fornecido na newsletter;
            informações administrativas fornecidas pelo responsável pelo portal;
            dados técnicos de acesso, como data, horário, página acessada,
            navegador e identificadores protegidos por técnicas de hash;
            preferências de interface, como tema visual; e registros
            indispensáveis à segurança e autenticação.
          </p>
          <h2>3. Finalidades e bases legais</h2>
          <ul>
            <li>
              <strong>Newsletter:</strong> enviar novas publicações solicitadas
              pelo titular, com base no consentimento, até seu cancelamento.
            </li>
            <li>
              <strong>Funcionamento e segurança:</strong> autenticar o
              administrador, prevenir fraude, abuso e incidentes, com fundamento
              no legítimo interesse, cumprimento de obrigações e proteção do
              exercício regular de direitos, conforme o contexto.
            </li>
            <li>
              <strong>Métricas:</strong> compreender acessos e engajamento,
              melhorar conteúdo e desempenho, utilizando dados minimizados e
              evitando contabilização artificial.
            </li>
            <li>
              <strong>Atendimento:</strong> responder solicitações e manter os
              registros necessários à comunicação e ao cumprimento de
              obrigações.
            </li>
          </ul>
          <h2>4. Cookies e armazenamento local</h2>
          <p>
            O portal utiliza recursos estritamente necessários para sessão,
            segurança, prevenção de duplicidade nas métricas e preferências de
            tema. Cookies administrativos são configurados com proteções como
            HttpOnly, Secure e SameSite quando aplicável. Não utilizamos esses
            recursos para vender dados pessoais.
          </p>
          <h2>5. Compartilhamento</h2>
          <p>
            Dados podem ser tratados por fornecedores de infraestrutura, banco
            de dados, hospedagem e envio de e-mail estritamente para operação do
            serviço, sob obrigações de segurança e finalidade. Também poderão
            ser compartilhados quando exigido por lei, ordem válida ou para
            proteção de direitos. Os botões de redes sociais somente direcionam
            o usuário ao serviço escolhido, sujeito às regras da respectiva
            plataforma.
          </p>
          <h2>6. Retenção e eliminação</h2>
          <p>
            Os dados são conservados pelo período necessário às finalidades
            informadas e às obrigações legais ou regulatórias. O e-mail da
            newsletter deixa de integrar a lista ativa quando o titular cancela
            o recebimento. Registros mínimos poderão ser mantidos quando
            necessários para comprovar o atendimento, prevenir fraude ou exercer
            direitos.
          </p>
          <h2>7. Segurança</h2>
          <p>
            Adotamos medidas técnicas e administrativas proporcionais aos
            riscos, incluindo validação no servidor, controle de acesso,
            proteção de sessão, filtragem de entradas, limitação de requisições
            e restrições de arquivos. Nenhum ambiente é totalmente imune;
            incidentes relevantes serão tratados e comunicados conforme a
            legislação e a regulamentação aplicáveis.
          </p>
          <h2>8. Direitos do titular</h2>
          <p>
            Nos termos da LGPD, o titular pode solicitar confirmação e acesso,
            correção, anonimização, bloqueio ou eliminação quando cabíveis,
            portabilidade conforme regulamentação, informação sobre
            compartilhamentos, revogação do consentimento, oposição e revisão de
            decisões automatizadas, quando aplicável. A identidade poderá ser
            validada para proteger o próprio titular.
          </p>
          <h2>9. Crianças e adolescentes</h2>
          <p>
            O portal não é direcionado intencionalmente à coleta de dados de
            crianças. Caso seja identificado tratamento indevido, o responsável
            poderá solicitar análise e exclusão pelo canal de contato.
          </p>
          <h2>10. Transferência internacional</h2>
          <p>
            Fornecedores tecnológicos podem processar dados em outros países.
            Quando isso ocorrer, serão observados os requisitos legais
            aplicáveis e salvaguardas compatíveis com a LGPD.
          </p>
          <h2>11. Atualizações e autoridade</h2>
          <p>
            Esta política poderá ser atualizada para refletir mudanças legais ou
            operacionais. O titular também pode apresentar petição à Autoridade
            Nacional de Proteção de Dados, observados os procedimentos oficiais.
          </p>
        </>
      )}
    </PaginaLegal>
  );
}
