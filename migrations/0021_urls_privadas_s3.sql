DO $$
DECLARE
  bucket_atual text;
  regiao_atual text;
  base_s3 text;
  base_proxy constant text := '/api/portal/midias';
BEGIN
  SELECT s3_bucket, s3_regiao
    INTO bucket_atual, regiao_atual
    FROM configuracoes_portal
   WHERE id = 1;

  IF bucket_atual IS NULL OR bucket_atual = '' THEN
    RETURN;
  END IF;

  base_s3 := CASE
    WHEN coalesce(regiao_atual, 'us-east-1') = 'us-east-1'
      THEN 'https://' || bucket_atual || '.s3.amazonaws.com'
    ELSE 'https://' || bucket_atual || '.s3.' || regiao_atual || '.amazonaws.com'
  END;

  UPDATE publicacoes
     SET imagem_capa_url = replace(imagem_capa_url, base_s3, base_proxy)
   WHERE imagem_capa_url LIKE base_s3 || '/%';

  UPDATE publicacoes
     SET imagem_social_url = replace(imagem_social_url, base_s3, base_proxy)
   WHERE imagem_social_url LIKE base_s3 || '/%';

  UPDATE publicacoes
     SET conteudo = replace(conteudo::text, base_s3, base_proxy)::jsonb
   WHERE conteudo::text LIKE '%' || base_s3 || '/%';

  UPDATE administradores
     SET caminho_foto = replace(caminho_foto, base_s3, base_proxy)
   WHERE caminho_foto LIKE base_s3 || '/%';

  UPDATE parceiros
     SET caminho_logo = replace(caminho_logo, base_s3, base_proxy)
   WHERE caminho_logo LIKE base_s3 || '/%';

  UPDATE configuracoes_portal
     SET caminho_logo = replace(caminho_logo, base_s3, base_proxy),
         caminho_favicon = replace(caminho_favicon, base_s3, base_proxy)
   WHERE id = 1;
END $$;
