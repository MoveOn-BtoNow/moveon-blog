WITH destaques_ordenados AS (
  SELECT id,
         row_number() OVER (
           ORDER BY atualizado_em DESC, criado_em DESC, id DESC
         ) AS posicao
    FROM publicacoes
   WHERE destaque
)
UPDATE publicacoes AS publicacao
   SET destaque = false
  FROM destaques_ordenados AS destaque
 WHERE publicacao.id = destaque.id
   AND destaque.posicao > 5;
