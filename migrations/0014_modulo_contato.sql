ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_contato boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_formulario_contato boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS contato_email varchar(254),
  ADD COLUMN IF NOT EXISTS contato_telefone varchar(40),
  ADD COLUMN IF NOT EXISTS contato_whatsapp varchar(40),
  ADD COLUMN IF NOT EXISTS contato_endereco varchar(500),
  ADD COLUMN IF NOT EXISTS contato_horario varchar(300),
  ADD COLUMN IF NOT EXISTS encaminhar_contato_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recaptcha_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recaptcha_chave_site varchar(500),
  ADD COLUMN IF NOT EXISTS recaptcha_chave_secreta_criptografada text,
  ADD COLUMN IF NOT EXISTS recaptcha_pontuacao_minima numeric(3,2) NOT NULL DEFAULT 0.50;

DO $$ BEGIN
  ALTER TABLE configuracoes_portal ADD CONSTRAINT configuracoes_recaptcha_pontuacao_ck
    CHECK (recaptcha_pontuacao_minima BETWEEN 0 AND 1);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  empresa varchar(160) NOT NULL,
  cargo varchar(120) NOT NULL,
  cliente_sap varchar(10) NOT NULL CHECK (cliente_sap IN ('sim','nao','nao_sei')),
  assunto varchar(180) NOT NULL,
  mensagem text NOT NULL CHECK (char_length(mensagem) BETWEEN 10 AND 5000),
  situacao varchar(12) NOT NULL DEFAULT 'nova' CHECK (situacao IN ('nova','lida','respondida','arquivada')),
  ip_hash char(64) NOT NULL,
  conteudo_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  pontuacao_recaptcha numeric(4,3),
  criado_em timestamptz NOT NULL DEFAULT now(),
  lido_em timestamptz,
  respondido_em timestamptz,
  arquivado_em timestamptz,
  resposta text,
  respondido_por uuid REFERENCES administradores(id) ON DELETE SET NULL,
  busca tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(nome,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(empresa,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(email,'')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(cargo,'')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(assunto,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(mensagem,'')), 'C')
  ) STORED
);

CREATE INDEX IF NOT EXISTS mensagens_contato_busca_gin_idx ON mensagens_contato USING gin(busca);
CREATE INDEX IF NOT EXISTS mensagens_contato_cursor_idx ON mensagens_contato(criado_em DESC,id DESC);
CREATE INDEX IF NOT EXISTS mensagens_contato_novas_idx ON mensagens_contato(criado_em DESC) WHERE situacao='nova';
CREATE INDEX IF NOT EXISTS mensagens_contato_ip_idx ON mensagens_contato(ip_hash,criado_em DESC);
CREATE INDEX IF NOT EXISTS mensagens_contato_duplicadas_idx ON mensagens_contato(conteudo_hash,criado_em DESC);

CREATE TABLE IF NOT EXISTS tentativas_contato (
  id bigserial PRIMARY KEY,
  ip_hash char(64) NOT NULL,
  aceito boolean NOT NULL,
  motivo varchar(60) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tentativas_contato_limite_idx ON tentativas_contato(ip_hash,criado_em DESC);

