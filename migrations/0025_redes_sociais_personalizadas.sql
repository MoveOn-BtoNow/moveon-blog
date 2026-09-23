CREATE TABLE IF NOT EXISTS redes_sociais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(80) NOT NULL,
  endereco_url varchar(1000) NOT NULL,
  caminho_icone varchar(1000),
  ativa boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0 CHECK (ordem BETWEEN 0 AND 10000),
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT redes_sociais_nome_nao_vazio CHECK (btrim(nome) <> ''),
  CONSTRAINT redes_sociais_url_http CHECK (endereco_url ~* '^https?://')
);

CREATE INDEX IF NOT EXISTS redes_sociais_exibicao_idx
  ON redes_sociais (ativa, ordem, nome);

INSERT INTO redes_sociais (nome, endereco_url, ordem)
SELECT 'Instagram', instagram_url, 10
FROM configuracoes_portal
WHERE id = 1 AND coalesce(instagram_url, '') <> ''
  AND NOT EXISTS (SELECT 1 FROM redes_sociais WHERE lower(nome) = 'instagram');

INSERT INTO redes_sociais (nome, endereco_url, ordem)
SELECT 'LinkedIn', linkedin_url, 20
FROM configuracoes_portal
WHERE id = 1 AND coalesce(linkedin_url, '') <> ''
  AND NOT EXISTS (SELECT 1 FROM redes_sociais WHERE lower(nome) = 'linkedin');
