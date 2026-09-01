BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE situacao_publicacao AS ENUM ('rascunho','agendada','publicada','arquivada');
CREATE TYPE tipo_midia AS ENUM ('imagem','video','arquivo');
CREATE TYPE tipo_evento AS ENUM ('visualizacao','compartilhamento','busca','clique_categoria');

CREATE TABLE administradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(120) NOT NULL,
  email varchar(254) NOT NULL UNIQUE,
  senha_hash varchar(255) NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  ultimo_acesso_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessoes_administrativas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  administrador_id uuid NOT NULL REFERENCES administradores(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  endereco_ip_hash char(64),
  agente_usuario varchar(500),
  expira_em timestamptz NOT NULL,
  revogada_em timestamptz,
  criada_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessoes_administrador_idx ON sessoes_administrativas(administrador_id);
CREATE INDEX sessoes_expiracao_idx ON sessoes_administrativas(expira_em) WHERE revogada_em IS NULL;

CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(80) NOT NULL,
  slug varchar(100) NOT NULL UNIQUE,
  descricao varchar(300),
  ativa boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE publicacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo varchar(180) NOT NULL,
  slug varchar(200) NOT NULL UNIQUE,
  resumo varchar(500) NOT NULL,
  conteudo jsonb NOT NULL DEFAULT '{}'::jsonb,
  situacao situacao_publicacao NOT NULL DEFAULT 'rascunho',
  destaque boolean NOT NULL DEFAULT false,
  metatitulo varchar(180),
  metadescricao varchar(320),
  publicado_em timestamptz,
  agendado_para timestamptz,
  administrador_id uuid NOT NULL REFERENCES administradores(id) ON DELETE RESTRICT,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT agendamento_valido CHECK (situacao <> 'agendada' OR agendado_para IS NOT NULL)
);
CREATE INDEX publicacoes_situacao_data_idx ON publicacoes(situacao, publicado_em DESC);
CREATE INDEX publicacoes_destaque_idx ON publicacoes(destaque) WHERE situacao = 'publicada';
CREATE INDEX publicacoes_busca_idx ON publicacoes USING gin(to_tsvector('portuguese', titulo || ' ' || resumo));
CREATE TABLE publicacoes_categorias (
  publicacao_id uuid NOT NULL REFERENCES publicacoes(id) ON DELETE CASCADE,
  categoria_id uuid NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  PRIMARY KEY(publicacao_id,categoria_id)
);
CREATE INDEX publicacoes_categorias_categoria_idx ON publicacoes_categorias(categoria_id,publicacao_id);
CREATE TABLE midias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publicacao_id uuid REFERENCES publicacoes(id) ON DELETE CASCADE,
  tipo tipo_midia NOT NULL,
  nome_original varchar(255) NOT NULL,
  nome_armazenado varchar(255) NOT NULL UNIQUE,
  tipo_mime varchar(100) NOT NULL,
  tamanho_bytes bigint NOT NULL CHECK (tamanho_bytes > 0 AND tamanho_bytes <= 52428800),
  largura integer CHECK (largura IS NULL OR largura > 0),
  altura integer CHECK (altura IS NULL OR altura > 0),
  texto_alternativo varchar(300),
  ordem integer NOT NULL DEFAULT 0 CHECK (ordem >= 0),
  capa boolean NOT NULL DEFAULT false,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX midias_publicacao_ordem_idx ON midias(publicacao_id,ordem);
CREATE TABLE configuracoes_portal (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nome varchar(120) NOT NULL DEFAULT 'MOVE.ON',
  descricao varchar(300),
  caminho_logo varchar(500),
  caminho_favicon varchar(500),
  atualizado_por uuid REFERENCES administradores(id) ON DELETE SET NULL,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE eventos_acesso (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo tipo_evento NOT NULL,
  publicacao_id uuid REFERENCES publicacoes(id) ON DELETE SET NULL,
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  identificador_visitante_hash char(64) NOT NULL,
  endereco_ip_hash char(64),
  agente_usuario varchar(500),
  referencia varchar(1000),
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  ocorrido_em timestamptz NOT NULL DEFAULT now(),
  e_robo boolean NOT NULL DEFAULT false,
  e_administrador boolean NOT NULL DEFAULT false
);
CREATE INDEX eventos_data_tipo_idx ON eventos_acesso(ocorrido_em DESC,tipo) WHERE e_robo=false AND e_administrador=false;
CREATE INDEX eventos_publicacao_data_idx ON eventos_acesso(publicacao_id,ocorrido_em DESC) WHERE e_robo=false AND e_administrador=false;
CREATE TABLE termos_busca (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  termo varchar(200) NOT NULL,
  identificador_visitante_hash char(64) NOT NULL,
  quantidade_resultados integer NOT NULL DEFAULT 0 CHECK (quantidade_resultados >= 0),
  pesquisado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX termos_busca_data_idx ON termos_busca(pesquisado_em DESC);
CREATE TABLE inscricoes_newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL UNIQUE,
  confirmada boolean NOT NULL DEFAULT false,
  token_confirmacao_hash char(64),
  inscrito_em timestamptz NOT NULL DEFAULT now(),
  cancelado_em timestamptz
);
INSERT INTO configuracoes_portal (id,nome,descricao,caminho_logo,caminho_favicon)
VALUES (1,'MOVE.ON','Conteúdo que move','/logo.png','/favicon.svg');
COMMIT;
