ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS newsletter_assunto varchar(180) NOT NULL DEFAULT 'Nova publicação no {{nome_portal}}: {{titulo}}',
  ADD COLUMN IF NOT EXISTS newsletter_texto text NOT NULL DEFAULT 'Olá! Temos uma nova publicação preparada para você. Confira os destaques e continue acompanhando o conteúdo da {{nome_portal}}.';
CREATE TABLE IF NOT EXISTS envios_newsletter (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inscricao_id uuid NOT NULL REFERENCES inscricoes_newsletter(id) ON DELETE CASCADE,
  publicacao_id uuid NOT NULL REFERENCES publicacoes(id) ON DELETE CASCADE,
  situacao varchar(20) NOT NULL DEFAULT 'pendente' CHECK (situacao IN ('pendente','enviando','enviado','falhou')),
  tentativas smallint NOT NULL DEFAULT 0,
  erro varchar(1000),
  criado_em timestamptz NOT NULL DEFAULT now(), enviado_em timestamptz,
  UNIQUE(inscricao_id,publicacao_id)
);
CREATE INDEX IF NOT EXISTS envios_newsletter_pendentes_idx ON envios_newsletter(situacao,criado_em) WHERE situacao IN ('pendente','falhou');
