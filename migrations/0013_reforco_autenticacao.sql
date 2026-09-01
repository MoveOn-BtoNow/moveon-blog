CREATE TABLE IF NOT EXISTS tentativas_autenticacao (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  origem_hash char(64) NOT NULL,
  identidade_hash char(64) NOT NULL,
  sucesso boolean NOT NULL DEFAULT false,
  ocorrido_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tentativas_autenticacao_origem_data_idx
  ON tentativas_autenticacao (origem_hash, ocorrido_em DESC);
CREATE INDEX IF NOT EXISTS tentativas_autenticacao_identidade_data_idx
  ON tentativas_autenticacao (identidade_hash, ocorrido_em DESC);
