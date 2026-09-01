ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS armazenamento_modo varchar(10) NOT NULL DEFAULT 'local' CHECK (armazenamento_modo IN ('local','s3')),
  ADD COLUMN IF NOT EXISTS s3_endpoint varchar(500),
  ADD COLUMN IF NOT EXISTS s3_regiao varchar(100) NOT NULL DEFAULT 'us-east-1',
  ADD COLUMN IF NOT EXISTS s3_bucket varchar(255),
  ADD COLUMN IF NOT EXISTS s3_chave_acesso_criptografada text,
  ADD COLUMN IF NOT EXISTS s3_chave_secreta_criptografada text,
  ADD COLUMN IF NOT EXISTS s3_url_publica varchar(500),
  ADD COLUMN IF NOT EXISTS s3_forcar_path_style boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analytics_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analytics_id_medicao varchar(30),
  ADD COLUMN IF NOT EXISTS consentimento_ativo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS politica_dados_texto text NOT NULL DEFAULT 'Utilizamos dados essenciais para o funcionamento e, com sua permissão, dados de análise para melhorar sua experiência.',
  ADD COLUMN IF NOT EXISTS permitir_analytics boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS permitir_preferencias boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS permitir_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS otel_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS otel_endpoint varchar(500),
  ADD COLUMN IF NOT EXISTS otel_cabecalhos_criptografados text,
  ADD COLUMN IF NOT EXISTS otel_nome_servico varchar(120) NOT NULL DEFAULT 'portal-moveon',
  ADD COLUMN IF NOT EXISTS otel_nivel_minimo varchar(10) NOT NULL DEFAULT 'info' CHECK (otel_nivel_minimo IN ('debug','info','warn','error'));

CREATE TABLE IF NOT EXISTS consentimentos_privacidade (
  id bigserial PRIMARY KEY,
  visitante_hash char(64) NOT NULL,
  versao_politica char(64) NOT NULL,
  analytics boolean NOT NULL,
  preferencias boolean NOT NULL,
  marketing boolean NOT NULL,
  ip_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS consentimentos_privacidade_visitante_idx ON consentimentos_privacidade(visitante_hash,criado_em DESC);

