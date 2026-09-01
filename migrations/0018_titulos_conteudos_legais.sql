ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS politica_privacidade_titulo varchar(180) NOT NULL DEFAULT 'Política de Privacidade',
  ADD COLUMN IF NOT EXISTS politica_privacidade_subtitulo varchar(500) NOT NULL DEFAULT 'Transparência sobre o tratamento de dados pessoais no Portal MOVE.ON, conforme a Lei nº 13.709/2018 (LGPD).',
  ADD COLUMN IF NOT EXISTS termos_uso_titulo varchar(180) NOT NULL DEFAULT 'Termos de Uso',
  ADD COLUMN IF NOT EXISTS termos_uso_subtitulo varchar(500) NOT NULL DEFAULT 'Condições para acesso e utilização do Portal de Conteúdo MOVE.ON.';
