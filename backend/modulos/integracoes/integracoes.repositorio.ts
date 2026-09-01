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
      `SELECT armazenamento_modo "armazenamentoModo",s3_endpoint "s3Endpoint",s3_regiao "s3Regiao",s3_bucket "s3Bucket",s3_autenticacao "s3Autenticacao",s3_chave_acesso_criptografada acesso,s3_chave_secreta_criptografada segredo,s3_url_publica "s3UrlPublica",s3_forcar_path_style "s3ForcarPathStyle",analytics_ativo "analyticsAtivo",analytics_id_medicao "analyticsIdMedicao",consentimento_ativo "consentimentoAtivo",politica_dados_texto "politicaDadosTexto",consentimento_titulo "consentimentoTitulo",coalesce(consentimento_texto_html,'') "consentimentoTextoHtml",coalesce(politica_privacidade_html,'') "politicaPrivacidadeHtml",coalesce(termos_uso_html,'') "termosUsoHtml",conteudos_legais_atualizados_em "conteudosLegaisAtualizadosEm",permitir_analytics "permitirAnalytics",permitir_preferencias "permitirPreferencias",permitir_marketing "permitirMarketing",otel_ativo "otelAtivo",otel_endpoint "otelEndpoint",otel_cabecalhos_criptografados cabecalhos,otel_nome_servico "otelNomeServico",otel_nivel_minimo "otelNivelMinimo" FROM configuracoes_portal WHERE id=1`,
    );
    const d = rows[0] ?? {};
    return {
      ...d,
      armazenamentoModo: d.armazenamentoModo || "local",
      s3Endpoint: d.s3Endpoint || "",
      s3Regiao: d.s3Regiao || "us-east-1",
      s3Bucket: d.s3Bucket || "",
      s3UrlPublica: d.s3UrlPublica || "",
      s3Autenticacao: d.s3Autenticacao || "iam_role",
      s3ForcarPathStyle: Boolean(d.s3ForcarPathStyle),
      analyticsAtivo: Boolean(d.analyticsAtivo),
      analyticsIdMedicao: d.analyticsIdMedicao || "",
      consentimentoAtivo: Boolean(d.consentimentoAtivo),
      politicaDadosTexto:
        d.politicaDadosTexto ||
        "Utilizamos dados essenciais para o funcionamento do portal.",
      permitirAnalytics: Boolean(d.permitirAnalytics),
      permitirPreferencias: Boolean(d.permitirPreferencias),
      permitirMarketing: Boolean(d.permitirMarketing),
      otelAtivo: Boolean(d.otelAtivo),
      otelEndpoint: d.otelEndpoint || "",
      otelNomeServico: d.otelNomeServico || "portal-moveon",
      otelNivelMinimo: d.otelNivelMinimo || "info",
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
        (d.s3Autenticacao === "chaves" &&
          ((!d.s3ChaveAcesso && !atual.s3CredenciaisConfiguradas) ||
            (!d.s3ChaveSecreta && !atual.s3CredenciaisConfiguradas))))
    )
      throw new Error(
        "Configure o bucket e, no modo manual, informe Access Key e Secret Key.",
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
      `UPDATE configuracoes_portal SET armazenamento_modo=$1,s3_endpoint=nullif($2,''),s3_regiao=$3,s3_bucket=nullif($4,''),s3_autenticacao=$5::varchar(20),s3_chave_acesso_criptografada=CASE WHEN $5::text='iam_role' THEN NULL WHEN $6='' THEN s3_chave_acesso_criptografada ELSE $7 END,s3_chave_secreta_criptografada=CASE WHEN $5::text='iam_role' THEN NULL WHEN $8='' THEN s3_chave_secreta_criptografada ELSE $9 END,s3_url_publica=nullif($10,''),s3_forcar_path_style=$11,analytics_ativo=$12,analytics_id_medicao=nullif($13,''),consentimento_ativo=$14,politica_dados_texto=coalesce($15,politica_dados_texto),permitir_analytics=$16,permitir_preferencias=$17,permitir_marketing=$18,otel_ativo=$19,otel_endpoint=nullif($20,''),otel_cabecalhos_criptografados=CASE WHEN $21='' THEN otel_cabecalhos_criptografados ELSE $22 END,otel_nome_servico=$23,otel_nivel_minimo=$24,atualizado_por=$25,atualizado_em=now() WHERE id=1`,
      [
        d.armazenamentoModo,
        d.s3Endpoint,
        d.s3Regiao,
        d.s3Bucket,
        d.s3Autenticacao,
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
  async salvarArmazenamento(d: Record<string, unknown>, adminId: string) {
    const atual = await this.obter(false);
    if (
      d.armazenamentoModo === "s3" &&
      (!d.s3Bucket ||
        (d.s3Autenticacao === "chaves" &&
          ((!d.s3ChaveAcesso && !atual.s3CredenciaisConfiguradas) ||
            (!d.s3ChaveSecreta && !atual.s3CredenciaisConfiguradas))))
    )
      throw new Error(
        "Configure o bucket e, no modo manual, informe Access Key e Secret Key.",
      );
    const acesso = String(d.s3ChaveAcesso || "");
    const segredo = String(d.s3ChaveSecreta || "");
    await conexao.query(
      `UPDATE configuracoes_portal SET armazenamento_modo=$1,s3_endpoint=nullif($2,''),s3_regiao=$3,s3_bucket=nullif($4,''),s3_autenticacao=$5::varchar(20),s3_chave_acesso_criptografada=CASE WHEN $5::text='iam_role' THEN NULL WHEN $6='' THEN s3_chave_acesso_criptografada ELSE $7 END,s3_chave_secreta_criptografada=CASE WHEN $5::text='iam_role' THEN NULL WHEN $8='' THEN s3_chave_secreta_criptografada ELSE $9 END,s3_url_publica=nullif($10,''),s3_forcar_path_style=$11,atualizado_por=$12,atualizado_em=now() WHERE id=1`,
      [
        d.armazenamentoModo,
        d.s3Endpoint,
        d.s3Regiao,
        d.s3Bucket,
        d.s3Autenticacao,
        acesso,
        acesso ? criptografarConfiguracao(acesso) : null,
        segredo,
        segredo ? criptografarConfiguracao(segredo) : null,
        d.s3UrlPublica,
        d.s3ForcarPathStyle,
        adminId,
      ],
    );
  }
  async salvarAnalytics(d: Record<string, unknown>, adminId: string) {
    if (d.analyticsAtivo && !d.analyticsIdMedicao)
      throw new Error("Informe o ID de medição do Google Analytics.");
    await conexao.query(
      `UPDATE configuracoes_portal SET analytics_ativo=$1,analytics_id_medicao=nullif($2,''),consentimento_ativo=$3,permitir_analytics=$4,permitir_preferencias=$5,permitir_marketing=$6,atualizado_por=$7,atualizado_em=now() WHERE id=1`,
      [
        d.analyticsAtivo,
        d.analyticsIdMedicao,
        d.consentimentoAtivo,
        d.permitirAnalytics,
        d.permitirPreferencias,
        d.permitirMarketing,
        adminId,
      ],
    );
  }
  async salvarOpenTelemetry(d: Record<string, unknown>, adminId: string) {
    if (d.otelAtivo && !d.otelEndpoint)
      throw new Error(
        "Informe o endpoint OTLP antes de ativar a observabilidade.",
      );
    const headers = String(d.otelCabecalhos || "");
    await conexao.query(
      `UPDATE configuracoes_portal SET otel_ativo=$1,otel_endpoint=nullif($2,''),otel_cabecalhos_criptografados=CASE WHEN $3='' THEN otel_cabecalhos_criptografados ELSE $4 END,otel_nome_servico=$5,otel_nivel_minimo=$6,atualizado_por=$7,atualizado_em=now() WHERE id=1`,
      [
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
        [
          d.consentimentoTitulo,
          d.consentimentoTextoHtml,
          d.politicaPrivacidadeHtml,
          d.analyticsAtivo,
          d.analyticsIdMedicao,
          d.permitirAnalytics,
          d.permitirPreferencias,
          d.permitirMarketing,
        ].join("|"),
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
