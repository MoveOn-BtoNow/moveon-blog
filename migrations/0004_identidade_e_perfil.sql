ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS cor_primaria varchar(7) NOT NULL DEFAULT '#fe3000',
  ADD COLUMN IF NOT EXISTS cor_fundo_claro varchar(7) NOT NULL DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS cor_fundo_escuro varchar(7) NOT NULL DEFAULT '#070707',
  ADD COLUMN IF NOT EXISTS cor_texto_claro varchar(7) NOT NULL DEFAULT '#101010',
  ADD COLUMN IF NOT EXISTS cor_texto_escuro varchar(7) NOT NULL DEFAULT '#f7f7f7';
ALTER TABLE administradores ADD COLUMN IF NOT EXISTS caminho_foto varchar(500);
