BEGIN;
CREATE TABLE IF NOT EXISTS bloqueios_autenticacao (
  tipo varchar(12) NOT NULL CHECK (tipo IN ('origem','identidade')),
  chave_hash char(64) NOT NULL,
  falhas_acumuladas integer NOT NULL DEFAULT 0 CHECK (falhas_acumuladas >= 0),
  nivel_bloqueio integer NOT NULL DEFAULT 0 CHECK (nivel_bloqueio >= 0),
  bloqueado_ate timestamptz,
  ultima_falha_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tipo, chave_hash)
);
CREATE INDEX IF NOT EXISTS bloqueios_autenticacao_expiracao_idx
  ON bloqueios_autenticacao (bloqueado_ate) WHERE bloqueado_ate IS NOT NULL;
COMMIT;
