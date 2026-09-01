CREATE UNIQUE INDEX IF NOT EXISTS eventos_visualizacao_unica_diaria_idx
ON eventos_acesso (publicacao_id, identificador_visitante_hash, ((ocorrido_em AT TIME ZONE 'America/Bahia')::date), tipo)
WHERE tipo = 'visualizacao' AND e_robo = false AND e_administrador = false;
