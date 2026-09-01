CREATE TABLE IF NOT EXISTS parceiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(160) NOT NULL,
  caminho_logo varchar(1000) NOT NULL,
  endereco_site varchar(1000),
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS parceiros_publicos_idx ON parceiros(ativo,ordem,nome);

INSERT INTO parceiros(nome,caminho_logo,ordem) VALUES
('Cimed','/cimed-logo-1-1.png',10),
('Kellogg''s','/Kellogg-Logo.png',20),
('Leo Madeiras','/Leo Madeiras.png',30),
('GDM','/GDM.png',40),
('Marcopolo','/Marcopolo.png',50),
('Usina','/usina.png',60),
('Pátria Investimentos','/Patria Investimentos.png',70),
('Arklok','/Arklok.png',80)
ON CONFLICT DO NOTHING;

-- A marca permanece cadastrada para edição, mas não é publicada sem o arquivo.
UPDATE parceiros SET ativo=false,caminho_logo='' WHERE caminho_logo='/Patria Investimentos.png';
