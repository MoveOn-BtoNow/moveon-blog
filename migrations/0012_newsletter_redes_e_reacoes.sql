ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_newsletter boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_redes_sociais boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS instagram_url varchar(1000) NOT NULL DEFAULT 'https://www.instagram.com/moveonconsulting_/',
  ADD COLUMN IF NOT EXISTS linkedin_url varchar(1000) NOT NULL DEFAULT 'https://www.linkedin.com/company/moveonbto/',
  ADD COLUMN IF NOT EXISTS email_ativo boolean,
  ADD COLUMN IF NOT EXISTS smtp_host varchar(255),
  ADD COLUMN IF NOT EXISTS smtp_porta integer CHECK (smtp_porta IS NULL OR smtp_porta BETWEEN 1 AND 65535),
  ADD COLUMN IF NOT EXISTS smtp_seguro boolean,
  ADD COLUMN IF NOT EXISTS smtp_usuario varchar(500),
  ADD COLUMN IF NOT EXISTS smtp_senha_criptografada text,
  ADD COLUMN IF NOT EXISTS email_remetente_nome varchar(180),
  ADD COLUMN IF NOT EXISTS email_remetente_endereco varchar(254),
  ADD COLUMN IF NOT EXISTS email_segredo_cancelamento_criptografado text;

CREATE TABLE IF NOT EXISTS reacoes_publicacoes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  publicacao_id uuid NOT NULL REFERENCES publicacoes(id) ON DELETE CASCADE,
  identificador_visitante_hash char(64) NOT NULL,
  endereco_ip_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (publicacao_id, identificador_visitante_hash)
);

CREATE INDEX IF NOT EXISTS reacoes_publicacoes_ranking_idx
  ON reacoes_publicacoes (publicacao_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS reacoes_publicacoes_ip_data_idx
  ON reacoes_publicacoes (endereco_ip_hash, criado_em DESC);

CREATE TABLE IF NOT EXISTS tentativas_reacoes_publicacoes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  endereco_ip_hash char(64) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tentativas_reacoes_ip_data_idx
  ON tentativas_reacoes_publicacoes (endereco_ip_hash, criado_em DESC);
