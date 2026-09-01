ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_quem_somos boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_o_que_resolvemos boolean NOT NULL DEFAULT true;
