import { conexao } from "../../infraestrutura/banco/conexao";
import {
  criptografarConfiguracao,
  descriptografarConfiguracao,
} from "../../compartilhado/seguranca/criptografia-configuracoes";
export class RepositorioIntegracoes {
  async obterConteudosLegais() {
    const { rows } = await conexao.query(
      `SELECT consentimento_titulo "consentimentoTitulo",coalesce(consentimento_texto_html,'') "consentimentoTextoHtml",politica_privacidade_titulo "politicaPrivacidadeTitulo",politica_privacidade_subtitulo "politicaPrivacidadeSubtitulo",coalesce(politica_privacidade_html,'') "politicaPrivacidadeHtml",termos_uso_titulo "termosUsoTitulo",termos_uso_subtitulo "termosUsoSubtitulo",coalesce(termos_uso_html,'') "termosUsoHtml",conteudos_legais_atualizados_em "atualizadoEm" FROM configuracoes_portal WHERE id=1`,
    );
    return rows[0] ?? null;
  }
  async salvarConsentimento(
    d: { titulo: string; conteudoHtml: string },
    adminId: string,
  ) {
    await conexao.query(
      `UPDATE configuracoes_portal SET consentimento_titulo=$1,consentimento_texto_html=$2,politica_dados_texto=left(regexp_replace($2,'<[^>]*>',' ','g'),10000),conteudos_legais_atualizados_em=now(),atualizado_por=$3,atualizado_em=now() WHERE id=1`,
      [d.titulo, d.conteudoHtml, adminId],
    );
  }
  async salvarDocumento(
    tipo: "privacidade" | "termos",
    d: { titulo: string; subtitulo: string; conteudoHtml: string },
    adminId: string,
  ) {
    if (tipo === "privacidade")
      await conexao.query(
        `UPDATE configuracoes_portal SET politica_privacidade_titulo=$1,politica_privacidade_subtitulo=$2,politica_privacidade_html=$3,conteudos_legais_atualizados_em=now(),atualizado_por=$4,atualizado_em=now() WHERE id=1`,
        [d.titulo, d.subtitulo, d.conteudoHtml, adminId],
      );
    else
      await conexao.query(
        `UPDATE configuracoes_portal SET termos_uso_titulo=$1,termos_uso_subtitulo=$2,termos_uso_html=$3,conteudos_legais_atualizados_em=now(),atualizado_por=$4,atualizado_em=now() WHERE id=1`,
        [d.titulo, d.subtitulo, d.conteudoHtml, adminId],
      );
  }
  async obter(incluirSegredos = false) {
    const { rows } = await conexao.query(
      `SELECT armazenamento_modo "armazenamentoModo",s3_endpoint "s3Endpoint",s3_regiao "s3Regiao",s3_bucket "s3Bucket",s3_chave_acesso_criptografada acesso,s3_chave_secreta_criptografada segredo,s3_url_publica "s3UrlPublica",s3_forcar_path_style "s3ForcarPathStyle",analytics_ativo "analyticsAtivo",analytics_id_medicao "analyticsIdMedicao",consentimento_ativo "consentimentoAtivo",politica_dados_texto "politicaDadosTexto",consentimento_titulo "consentimentoTitulo",coalesce(consentimento_texto_html,'') "consentimentoTextoHtml",coalesce(politica_privacidade_html,'') "politicaPrivacidadeHtml",coalesce(termos_uso_html,'') "termosUsoHtml",conteudos_legais_atualizados_em "conteudosLegaisAtualizadosEm",permitir_analytics "permitirAnalytics",permitir_preferencias "permitirPreferencias",permitir_marketing "permitirMarketing",otel_ativo "otelAtivo",otel_endpoint "otelEndpoint",otel_cabecalhos_criptografados cabecalhos,otel_nome_servico "otelNomeServico",otel_nivel_minimo "otelNivelMinimo" FROM configuracoes_portal WHERE id=1`,
    );
    const d = rows[0] ?? {};
    return {
      ...d,
      s3Endpoint: d.s3Endpoint || "",
      s3Bucket: d.s3Bucket || "",
      s3UrlPublica: d.s3UrlPublica || "",
      analyticsIdMedicao: d.analyticsIdMedicao || "",
      otelEndpoint: d.otelEndpoint || "",
      s3ChaveAcesso: incluirSegredos
        ? descriptografarConfiguracao(d.acesso) || ""
        : "",
      s3ChaveSecreta: incluirSegredos
        ? descriptografarConfiguracao(d.segredo) || ""
        : "",
      otelCabecalhos: incluirSegredos
        ? descriptografarConfiguracao(d.cabecalhos) || ""
        : "",
      s3CredenciaisConfiguradas: Boolean(
        descriptografarConfiguracao(d.acesso) &&
        descriptografarConfiguracao(d.segredo),
      ),
      otelCabecalhosConfigurados: Boolean(
        descriptografarConfiguracao(d.cabecalhos),
      ),
      acesso: undefined,
      segredo: undefined,
      cabecalhos: undefined,
    };
  }
  async salvar(d: Record<string, unknown>, adminId: string) {
    const atual = await this.obter(false);
    if (
      d.armazenamentoModo === "s3" &&
      (!d.s3Bucket ||
        !d.s3UrlPublica ||
        (!d.s3ChaveAcesso && !atual.s3CredenciaisConfiguradas) ||
        (!d.s3ChaveSecreta && !atual.s3CredenciaisConfiguradas))
    )
      throw new Error(
        "Configure bucket, URL pública e credenciais antes de ativar o S3.",
      );
    if (d.analyticsAtivo && !d.analyticsIdMedicao)
      throw new Error("Informe o ID de medição do Google Analytics.");
    if (d.otelAtivo && !d.otelEndpoint)
      throw new Error(
        "Informe o endpoint OTLP antes de ativar a observabilidade.",
      );
    const acesso = String(d.s3ChaveAcesso || ""),
      segredo = String(d.s3ChaveSecreta || ""),
      headers = String(d.otelCabecalhos || "");
    await conexao.query(
      `UPDATE configuracoes_portal SET armazenamento_modo=$1,s3_endpoint=nullif($2,''),s3_regiao=$3,s3_bucket=nullif($4,''),s3_chave_acesso_criptografada=CASE WHEN $5='' THEN s3_chave_acesso_criptografada ELSE $6 END,s3_chave_secreta_criptografada=CASE WHEN $7='' THEN s3_chave_secreta_criptografada ELSE $8 END,s3_url_publica=nullif($9,''),s3_forcar_path_style=$10,analytics_ativo=$11,analytics_id_medicao=nullif($12,''),consentimento_ativo=$13,politica_dados_texto=$14,permitir_analytics=$15,permitir_preferencias=$16,permitir_marketing=$17,otel_ativo=$18,otel_endpoint=nullif($19,''),otel_cabecalhos_criptografados=CASE WHEN $20='' THEN otel_cabecalhos_criptografados ELSE $21 END,otel_nome_servico=$22,otel_nivel_minimo=$23,atualizado_por=$24,atualizado_em=now() WHERE id=1`,
      [
        d.armazenamentoModo,
        d.s3Endpoint,
        d.s3Regiao,
        d.s3Bucket,
        acesso,
        acesso ? criptografarConfiguracao(acesso) : null,
        segredo,
        segredo ? criptografarConfiguracao(segredo) : null,
        d.s3UrlPublica,
        d.s3ForcarPathStyle,
        d.analyticsAtivo,
        d.analyticsIdMedicao,
        d.consentimentoAtivo,
        d.politicaDadosTexto,
        d.permitirAnalytics,
        d.permitirPreferencias,
        d.permitirMarketing,
        d.otelAtivo,
        d.otelEndpoint,
        headers,
        headers ? criptografarConfiguracao(headers) : null,
        d.otelNomeServico,
        d.otelNivelMinimo,
        adminId,
      ],
    );
  }
  async publica() {
    const d = await this.obter(false);
    return {
      analyticsAtivo: Boolean(d.analyticsAtivo && d.analyticsIdMedicao),
      analyticsIdMedicao: d.analyticsIdMedicao,
      consentimentoAtivo: d.consentimentoAtivo,
      politicaDadosTexto: d.politicaDadosTexto,
      consentimentoTitulo: d.consentimentoTitulo,
      consentimentoTextoHtml: d.consentimentoTextoHtml,
      politicaPrivacidadeHtml: d.politicaPrivacidadeHtml,
      termosUsoHtml: d.termosUsoHtml,
      conteudosLegaisAtualizadosEm: d.conteudosLegaisAtualizadosEm,
      permitirAnalytics: d.permitirAnalytics,
      permitirPreferencias: d.permitirPreferencias,
      permitirMarketing: d.permitirMarketing,
      versaoPolitica: (
        await import("../../compartilhado/seguranca/criptografia")
      ).gerarHashSha256(
        `${d.consentimentoTitulo}|${d.consentimentoTextoHtml}|${d.politicaPrivacidadeHtml}`,
      ),
    };
  }
  async consentir(
    d: { analytics: boolean; preferencias: boolean; marketing: boolean },
    visitante: string,
    ip: string,
    agente: string,
    versao: string,
  ) {
    await conexao.query(
      `INSERT INTO consentimentos_privacidade(visitante_hash,versao_politica,analytics,preferencias,marketing,ip_hash,agente_usuario) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [
        visitante,
        versao,
        d.analytics,
        d.preferencias,
        d.marketing,
        ip,
        agente.slice(0, 500),
      ],
    );
  }
}
