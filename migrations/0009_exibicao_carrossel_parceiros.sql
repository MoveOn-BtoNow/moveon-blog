ALTER TABLE configuracoes_portal
ADD COLUMN IF NOT EXISTS exibir_carrossel_parceiros boolean NOT NULL DEFAULT true;
