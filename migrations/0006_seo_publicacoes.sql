ALTER TABLE publicacoes
  ADD COLUMN IF NOT EXISTS imagem_social_url varchar(1000),
  ADD COLUMN IF NOT EXISTS texto_alternativo_capa varchar(300);

UPDATE publicacoes
SET imagem_social_url = imagem_capa_url
WHERE imagem_social_url IS NULL AND imagem_capa_url IS NOT NULL;

