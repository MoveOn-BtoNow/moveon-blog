-- Alinha as cores do tema escuro do blog às das landing pages.
-- Só altera quem ainda usa as cores padrão antigas (não sobrescreve cores personalizadas).
ALTER TABLE configuracoes_portal
  ALTER COLUMN cor_fundo_escuro SET DEFAULT '#050505',
  ALTER COLUMN cor_texto_escuro SET DEFAULT '#ffffff';
UPDATE configuracoes_portal SET cor_fundo_escuro = '#050505' WHERE lower(cor_fundo_escuro) = '#070707';
UPDATE configuracoes_portal SET cor_texto_escuro = '#ffffff' WHERE lower(cor_texto_escuro) = '#f7f7f7';
