CREATE TABLE IF NOT EXISTS limites_teste_servidor_email (
  administrador_id uuid PRIMARY KEY REFERENCES administradores(id) ON DELETE CASCADE,
  inicio_janela timestamptz NOT NULL DEFAULT now(),
  tentativas integer NOT NULL DEFAULT 1,
  ultimo_teste_em timestamptz NOT NULL DEFAULT now()
);
