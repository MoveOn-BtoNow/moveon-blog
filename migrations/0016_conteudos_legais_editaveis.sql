ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS consentimento_titulo varchar(180) NOT NULL DEFAULT 'Sua privacidade, sua escolha',
  ADD COLUMN IF NOT EXISTS consentimento_texto_html text,
  ADD COLUMN IF NOT EXISTS politica_privacidade_html text,
  ADD COLUMN IF NOT EXISTS termos_uso_html text,
  ADD COLUMN IF NOT EXISTS conteudos_legais_atualizados_em timestamptz;

UPDATE configuracoes_portal
SET consentimento_texto_html = '<p>' || politica_dados_texto || '</p>'
WHERE consentimento_texto_html IS NULL;

