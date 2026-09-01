ALTER TABLE publicacoes
  ADD COLUMN IF NOT EXISTS documento_busca tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(titulo, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(resumo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(conteudo::text, '')), 'C')
  ) STORED;

ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS documento_busca tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(nome, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(descricao, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_publicacoes_documento_busca ON publicacoes USING GIN (documento_busca);
CREATE INDEX IF NOT EXISTS idx_categorias_documento_busca ON categorias USING GIN (documento_busca);
CREATE INDEX IF NOT EXISTS idx_publicacoes_feed_publicado ON publicacoes (publicado_em DESC, id DESC) WHERE situacao = 'publicada';
CREATE INDEX IF NOT EXISTS idx_publicacoes_categorias_categoria_publicacao ON publicacoes_categorias (categoria_id, publicacao_id);
CREATE INDEX IF NOT EXISTS idx_categorias_slug_ativas ON categorias (slug) WHERE ativa;
