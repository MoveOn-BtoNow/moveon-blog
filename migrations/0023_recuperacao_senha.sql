BEGIN;
CREATE TABLE IF NOT EXISTS recuperacoes_senha (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  administrador_id uuid NOT NULL REFERENCES administradores(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  criado_em timestamptz NOT NULL DEFAULT now(),
  expira_em timestamptz NOT NULL,
  utilizado_em timestamptz,
  CHECK (expira_em > criado_em)
);
CREATE INDEX IF NOT EXISTS recuperacoes_senha_administrador_idx ON recuperacoes_senha(administrador_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS recuperacoes_senha_expiracao_idx ON recuperacoes_senha(expira_em);
CREATE TABLE IF NOT EXISTS limites_recuperacao_senha (
  tipo varchar(12) NOT NULL CHECK (tipo IN ('origem','identidade')),
  chave_hash char(64) NOT NULL,
  tentativas integer NOT NULL DEFAULT 0,
  janela_inicio timestamptz NOT NULL DEFAULT now(),
  proximo_envio_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tipo,chave_hash)
);
COMMIT;
