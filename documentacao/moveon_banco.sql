-- MOVE.ON - esquema completo e histórico executável
-- Gerado a partir das migrations 0001 a 0022.

CREATE TABLE IF NOT EXISTS controle_migrations (
  nome varchar(255) PRIMARY KEY,
  executada_em timestamptz NOT NULL DEFAULT now()
);

-- ==================================================
-- 0001_estrutura_inicial.sql
-- ==================================================
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

-- ==================================================
-- 0002_capa_publicacao.sql
-- ==================================================
ALTER TABLE publicacoes ADD COLUMN IF NOT EXISTS imagem_capa_url varchar(1000);

-- ==================================================
-- 0003_metricas_confiaveis.sql
-- ==================================================
CREATE UNIQUE INDEX IF NOT EXISTS eventos_visualizacao_unica_diaria_idx
ON eventos_acesso (publicacao_id, identificador_visitante_hash, ((ocorrido_em AT TIME ZONE 'America/Bahia')::date), tipo)
WHERE tipo = 'visualizacao' AND e_robo = false AND e_administrador = false;

-- ==================================================
-- 0004_identidade_e_perfil.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS cor_primaria varchar(7) NOT NULL DEFAULT '#fe3000',
  ADD COLUMN IF NOT EXISTS cor_fundo_claro varchar(7) NOT NULL DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS cor_fundo_escuro varchar(7) NOT NULL DEFAULT '#070707',
  ADD COLUMN IF NOT EXISTS cor_texto_claro varchar(7) NOT NULL DEFAULT '#101010',
  ADD COLUMN IF NOT EXISTS cor_texto_escuro varchar(7) NOT NULL DEFAULT '#f7f7f7';
ALTER TABLE administradores ADD COLUMN IF NOT EXISTS caminho_foto varchar(500);

-- ==================================================
-- 0005_newsletter.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS newsletter_assunto varchar(180) NOT NULL DEFAULT 'Nova publicação no {{nome_portal}}: {{titulo}}',
  ADD COLUMN IF NOT EXISTS newsletter_texto text NOT NULL DEFAULT 'Olá! Temos uma nova publicação preparada para você. Confira os destaques e continue acompanhando o conteúdo da {{nome_portal}}.';
CREATE TABLE IF NOT EXISTS envios_newsletter (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inscricao_id uuid NOT NULL REFERENCES inscricoes_newsletter(id) ON DELETE CASCADE,
  publicacao_id uuid NOT NULL REFERENCES publicacoes(id) ON DELETE CASCADE,
  situacao varchar(20) NOT NULL DEFAULT 'pendente' CHECK (situacao IN ('pendente','enviando','enviado','falhou')),
  tentativas smallint NOT NULL DEFAULT 0,
  erro varchar(1000),
  criado_em timestamptz NOT NULL DEFAULT now(), enviado_em timestamptz,
  UNIQUE(inscricao_id,publicacao_id)
);
CREATE INDEX IF NOT EXISTS envios_newsletter_pendentes_idx ON envios_newsletter(situacao,criado_em) WHERE situacao IN ('pendente','falhou');

-- ==================================================
-- 0006_seo_publicacoes.sql
-- ==================================================
ALTER TABLE publicacoes
  ADD COLUMN IF NOT EXISTS imagem_social_url varchar(1000),
  ADD COLUMN IF NOT EXISTS texto_alternativo_capa varchar(300);

UPDATE publicacoes
SET imagem_social_url = imagem_capa_url
WHERE imagem_social_url IS NULL AND imagem_capa_url IS NOT NULL;

-- ==================================================
-- 0007_busca_textual_e_desempenho.sql
-- ==================================================
ALTER TABLE publicacoes
  ADD COLUMN IF NOT EXISTS documento_busca tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(titulo, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(resumo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(conteudo::text, '')), 'C')
  ) STORED;

ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS documento_busca tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(nome, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(descricao, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_publicacoes_documento_busca ON publicacoes USING GIN (documento_busca);
CREATE INDEX IF NOT EXISTS idx_categorias_documento_busca ON categorias USING GIN (documento_busca);
CREATE INDEX IF NOT EXISTS idx_publicacoes_feed_publicado ON publicacoes (publicado_em DESC, id DESC) WHERE situacao = 'publicada';
CREATE INDEX IF NOT EXISTS idx_publicacoes_categorias_categoria_publicacao ON publicacoes_categorias (categoria_id, publicacao_id);
CREATE INDEX IF NOT EXISTS idx_categorias_slug_ativas ON categorias (slug) WHERE ativa;

-- ==================================================
-- 0008_parceiros.sql
-- ==================================================
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

-- ==================================================
-- 0009_exibicao_carrossel_parceiros.sql
-- ==================================================
ALTER TABLE configuracoes_portal
ADD COLUMN IF NOT EXISTS exibir_carrossel_parceiros boolean NOT NULL DEFAULT true;

-- ==================================================
-- 0010_preferencias_navegacao.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_quem_somos boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_o_que_resolvemos boolean NOT NULL DEFAULT true;

-- ==================================================
-- 0011_favicon_png_padrao.sql
-- ==================================================
UPDATE configuracoes_portal
SET caminho_favicon = '/favicon-32.png', atualizado_em = now()
WHERE caminho_favicon IS NULL OR caminho_favicon = '/favicon.svg';

-- ==================================================
-- 0012_newsletter_redes_e_reacoes.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_newsletter boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_redes_sociais boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS instagram_url varchar(1000) NOT NULL DEFAULT 'https://www.instagram.com/moveonconsulting_/',
  ADD COLUMN IF NOT EXISTS linkedin_url varchar(1000) NOT NULL DEFAULT 'https://www.linkedin.com/company/moveonbto/',
  ADD COLUMN IF NOT EXISTS email_ativo boolean,
  ADD COLUMN IF NOT EXISTS smtp_host varchar(255),
  ADD COLUMN IF NOT EXISTS smtp_porta integer CHECK (smtp_porta IS NULL OR smtp_porta BETWEEN 1 AND 65535),
  ADD COLUMN IF NOT EXISTS smtp_seguro boolean,
  ADD COLUMN IF NOT EXISTS smtp_usuario varchar(500),
  ADD COLUMN IF NOT EXISTS smtp_senha_criptografada text,
  ADD COLUMN IF NOT EXISTS email_remetente_nome varchar(180),
  ADD COLUMN IF NOT EXISTS email_remetente_endereco varchar(254),
  ADD COLUMN IF NOT EXISTS email_segredo_cancelamento_criptografado text;

CREATE TABLE IF NOT EXISTS reacoes_publicacoes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  publicacao_id uuid NOT NULL REFERENCES publicacoes(id) ON DELETE CASCADE,
  identificador_visitante_hash char(64) NOT NULL,
  endereco_ip_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (publicacao_id, identificador_visitante_hash)
);

CREATE INDEX IF NOT EXISTS reacoes_publicacoes_ranking_idx
  ON reacoes_publicacoes (publicacao_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS reacoes_publicacoes_ip_data_idx
  ON reacoes_publicacoes (endereco_ip_hash, criado_em DESC);

CREATE TABLE IF NOT EXISTS tentativas_reacoes_publicacoes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  endereco_ip_hash char(64) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tentativas_reacoes_ip_data_idx
  ON tentativas_reacoes_publicacoes (endereco_ip_hash, criado_em DESC);

-- ==================================================
-- 0013_reforco_autenticacao.sql
-- ==================================================
CREATE TABLE IF NOT EXISTS tentativas_autenticacao (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  origem_hash char(64) NOT NULL,
  identidade_hash char(64) NOT NULL,
  sucesso boolean NOT NULL DEFAULT false,
  ocorrido_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tentativas_autenticacao_origem_data_idx
  ON tentativas_autenticacao (origem_hash, ocorrido_em DESC);
CREATE INDEX IF NOT EXISTS tentativas_autenticacao_identidade_data_idx
  ON tentativas_autenticacao (identidade_hash, ocorrido_em DESC);

-- ==================================================
-- 0014_modulo_contato.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS exibir_contato boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS exibir_formulario_contato boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS contato_email varchar(254),
  ADD COLUMN IF NOT EXISTS contato_telefone varchar(40),
  ADD COLUMN IF NOT EXISTS contato_whatsapp varchar(40),
  ADD COLUMN IF NOT EXISTS contato_endereco varchar(500),
  ADD COLUMN IF NOT EXISTS contato_horario varchar(300),
  ADD COLUMN IF NOT EXISTS encaminhar_contato_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recaptcha_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recaptcha_chave_site varchar(500),
  ADD COLUMN IF NOT EXISTS recaptcha_chave_secreta_criptografada text,
  ADD COLUMN IF NOT EXISTS recaptcha_pontuacao_minima numeric(3,2) NOT NULL DEFAULT 0.50;

DO $$ BEGIN
  ALTER TABLE configuracoes_portal ADD CONSTRAINT configuracoes_recaptcha_pontuacao_ck
    CHECK (recaptcha_pontuacao_minima BETWEEN 0 AND 1);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  empresa varchar(160) NOT NULL,
  cargo varchar(120) NOT NULL,
  cliente_sap varchar(10) NOT NULL CHECK (cliente_sap IN ('sim','nao','nao_sei')),
  assunto varchar(180) NOT NULL,
  mensagem text NOT NULL CHECK (char_length(mensagem) BETWEEN 10 AND 5000),
  situacao varchar(12) NOT NULL DEFAULT 'nova' CHECK (situacao IN ('nova','lida','respondida','arquivada')),
  ip_hash char(64) NOT NULL,
  conteudo_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  pontuacao_recaptcha numeric(4,3),
  criado_em timestamptz NOT NULL DEFAULT now(),
  lido_em timestamptz,
  respondido_em timestamptz,
  arquivado_em timestamptz,
  resposta text,
  respondido_por uuid REFERENCES administradores(id) ON DELETE SET NULL,
  busca tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(nome,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(empresa,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(email,'')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(cargo,'')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(assunto,'')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(mensagem,'')), 'C')
  ) STORED
);

CREATE INDEX IF NOT EXISTS mensagens_contato_busca_gin_idx ON mensagens_contato USING gin(busca);
CREATE INDEX IF NOT EXISTS mensagens_contato_cursor_idx ON mensagens_contato(criado_em DESC,id DESC);
CREATE INDEX IF NOT EXISTS mensagens_contato_novas_idx ON mensagens_contato(criado_em DESC) WHERE situacao='nova';
CREATE INDEX IF NOT EXISTS mensagens_contato_ip_idx ON mensagens_contato(ip_hash,criado_em DESC);
CREATE INDEX IF NOT EXISTS mensagens_contato_duplicadas_idx ON mensagens_contato(conteudo_hash,criado_em DESC);

CREATE TABLE IF NOT EXISTS tentativas_contato (
  id bigserial PRIMARY KEY,
  ip_hash char(64) NOT NULL,
  aceito boolean NOT NULL,
  motivo varchar(60) NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tentativas_contato_limite_idx ON tentativas_contato(ip_hash,criado_em DESC);

-- ==================================================
-- 0015_storage_analytics_observabilidade.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS armazenamento_modo varchar(10) NOT NULL DEFAULT 'local' CHECK (armazenamento_modo IN ('local','s3')),
  ADD COLUMN IF NOT EXISTS s3_endpoint varchar(500),
  ADD COLUMN IF NOT EXISTS s3_regiao varchar(100) NOT NULL DEFAULT 'us-east-1',
  ADD COLUMN IF NOT EXISTS s3_bucket varchar(255),
  ADD COLUMN IF NOT EXISTS s3_chave_acesso_criptografada text,
  ADD COLUMN IF NOT EXISTS s3_chave_secreta_criptografada text,
  ADD COLUMN IF NOT EXISTS s3_url_publica varchar(500),
  ADD COLUMN IF NOT EXISTS s3_forcar_path_style boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analytics_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analytics_id_medicao varchar(30),
  ADD COLUMN IF NOT EXISTS consentimento_ativo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS politica_dados_texto text NOT NULL DEFAULT 'Utilizamos dados essenciais para o funcionamento e, com sua permissão, dados de análise para melhorar sua experiência.',
  ADD COLUMN IF NOT EXISTS permitir_analytics boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS permitir_preferencias boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS permitir_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS otel_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS otel_endpoint varchar(500),
  ADD COLUMN IF NOT EXISTS otel_cabecalhos_criptografados text,
  ADD COLUMN IF NOT EXISTS otel_nome_servico varchar(120) NOT NULL DEFAULT 'portal-moveon',
  ADD COLUMN IF NOT EXISTS otel_nivel_minimo varchar(10) NOT NULL DEFAULT 'info' CHECK (otel_nivel_minimo IN ('debug','info','warn','error'));

CREATE TABLE IF NOT EXISTS consentimentos_privacidade (
  id bigserial PRIMARY KEY,
  visitante_hash char(64) NOT NULL,
  versao_politica char(64) NOT NULL,
  analytics boolean NOT NULL,
  preferencias boolean NOT NULL,
  marketing boolean NOT NULL,
  ip_hash char(64) NOT NULL,
  agente_usuario varchar(500),
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS consentimentos_privacidade_visitante_idx ON consentimentos_privacidade(visitante_hash,criado_em DESC);

-- ==================================================
-- 0016_conteudos_legais_editaveis.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS consentimento_titulo varchar(180) NOT NULL DEFAULT 'Sua privacidade, sua escolha',
  ADD COLUMN IF NOT EXISTS consentimento_texto_html text,
  ADD COLUMN IF NOT EXISTS politica_privacidade_html text,
  ADD COLUMN IF NOT EXISTS termos_uso_html text,
  ADD COLUMN IF NOT EXISTS conteudos_legais_atualizados_em timestamptz;

UPDATE configuracoes_portal
SET consentimento_texto_html = '<p>' || politica_dados_texto || '</p>'
WHERE consentimento_texto_html IS NULL;

-- ==================================================
-- 0017_conteudos_legais_padrao.sql
-- ==================================================
UPDATE configuracoes_portal SET politica_privacidade_html = $html$
<h2>1. Controlador e contato</h2><p>A MOVE.ON, CNPJ 43.247.308/0001-49, é responsável pelas decisões relativas aos tratamentos descritos nesta política. Solicitações sobre privacidade podem ser enviadas para <a href="mailto:contato@moveon.consulting">contato@moveon.consulting</a>.</p>
<h2>2. Dados tratados</h2><p>Podemos tratar dados fornecidos nos formulários de contato e newsletter, dados técnicos de acesso, preferências de interface, registros de consentimento e informações indispensáveis à segurança e autenticação.</p>
<h2>3. Finalidades e bases legais</h2><p>Os dados são utilizados para atendimento, envio de conteúdos solicitados, funcionamento e segurança do portal, prevenção de fraude, métricas autorizadas e cumprimento de obrigações legais, conforme consentimento, legítimo interesse, execução de procedimentos solicitados e demais bases aplicáveis.</p>
<h2>4. Cookies, Analytics e consentimento</h2><p>Recursos essenciais podem ser utilizados para segurança, sessão e funcionamento. O Google Analytics e outras tecnologias opcionais somente são carregados conforme as escolhas registradas pelo visitante, que podem ser alteradas pelo controle de privacidade do portal.</p>
<h2>5. Compartilhamento e armazenamento</h2><p>Dados podem ser tratados por fornecedores de hospedagem, PostgreSQL, Object Storage, e-mail, observabilidade e análise estritamente para operar o serviço. Não vendemos dados pessoais.</p>
<h2>6. Retenção e segurança</h2><p>Os dados são conservados pelo período necessário às finalidades e obrigações aplicáveis. Adotamos validação no servidor, controle de acesso, criptografia de segredos, limitação de requisições, registros de auditoria e outras medidas proporcionais aos riscos.</p>
<h2>7. Direitos do titular</h2><p>Nos termos da LGPD, o titular pode solicitar confirmação, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informações sobre compartilhamento, revogação de consentimento e oposição quando cabíveis.</p>
<h2>8. Atualizações</h2><p>Esta política pode ser atualizada para refletir mudanças legais, técnicas ou operacionais. A versão vigente será disponibilizada nesta página.</p>
$html$, conteudos_legais_atualizados_em=now() WHERE politica_privacidade_html IS NULL;

UPDATE configuracoes_portal SET termos_uso_html = $html$
<h2>1. Identificação e aceitação</h2><p>Este portal é mantido pela MOVE.ON, CNPJ 43.247.308/0001-49. Ao utilizar a plataforma, você declara que leu e concorda com estes Termos e com a Política de Privacidade.</p>
<h2>2. Finalidade</h2><p>O portal disponibiliza conteúdos informativos sobre gestão, processos, tecnologia, projetos e temas relacionados. Os materiais não substituem aconselhamento profissional específico.</p>
<h2>3. Uso permitido</h2><p>É proibido acessar áreas restritas sem autorização, interferir no funcionamento, explorar vulnerabilidades, inserir códigos maliciosos, automatizar requisições abusivas ou violar direitos de terceiros.</p>
<h2>4. Propriedade intelectual</h2><p>Textos, marcas, imagens, interfaces e demais materiais pertencem à MOVE.ON ou são utilizados mediante autorização. A exploração comercial depende de autorização prévia, salvo hipóteses legalmente permitidas.</p>
<h2>5. Serviços externos</h2><p>Links e recursos de terceiros estão sujeitos aos termos e políticas dos respectivos fornecedores.</p>
<h2>6. Newsletter e contato</h2><p>Cadastros são voluntários e devem utilizar dados legítimos. Medidas de segurança e limitação podem ser aplicadas para prevenir abuso. O recebimento da newsletter pode ser cancelado pelo link disponibilizado nas mensagens.</p>
<h2>7. Disponibilidade e responsabilidade</h2><p>Manutenções e interrupções técnicas podem ocorrer. Cada usuário é responsável por suas decisões e pelo uso das informações, observados os limites da legislação brasileira.</p>
<h2>8. Contato</h2><p>Dúvidas podem ser enviadas para <a href="mailto:contato@moveon.consulting">contato@moveon.consulting</a>.</p>
$html$, conteudos_legais_atualizados_em=now() WHERE termos_uso_html IS NULL;

-- ==================================================
-- 0018_titulos_conteudos_legais.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS politica_privacidade_titulo varchar(180) NOT NULL DEFAULT 'Política de Privacidade',
  ADD COLUMN IF NOT EXISTS politica_privacidade_subtitulo varchar(500) NOT NULL DEFAULT 'Transparência sobre o tratamento de dados pessoais no Portal MOVE.ON, conforme a Lei nº 13.709/2018 (LGPD).',
  ADD COLUMN IF NOT EXISTS termos_uso_titulo varchar(180) NOT NULL DEFAULT 'Termos de Uso',
  ADD COLUMN IF NOT EXISTS termos_uso_subtitulo varchar(500) NOT NULL DEFAULT 'Condições para acesso e utilização do Portal de Conteúdo MOVE.ON.';

-- ==================================================
-- 0019_limitar_destaques_existentes.sql
-- ==================================================
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

-- ==================================================
-- 0020_autenticacao_s3_iam_role.sql
-- ==================================================
ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS s3_autenticacao varchar(20) NOT NULL DEFAULT 'chaves'
  CHECK (s3_autenticacao IN ('iam_role','chaves'));

UPDATE configuracoes_portal
SET s3_autenticacao='iam_role'
WHERE s3_chave_acesso_criptografada IS NULL
  AND s3_chave_secreta_criptografada IS NULL;

-- ==================================================
-- 0021_urls_privadas_s3.sql
-- ==================================================
DO $$
DECLARE
  bucket_atual text;
  regiao_atual text;
  base_s3 text;
  base_proxy constant text := '/api/portal/midias';
BEGIN
  SELECT s3_bucket, s3_regiao
    INTO bucket_atual, regiao_atual
    FROM configuracoes_portal
   WHERE id = 1;

  IF bucket_atual IS NULL OR bucket_atual = '' THEN
    RETURN;
  END IF;

  base_s3 := CASE
    WHEN coalesce(regiao_atual, 'us-east-1') = 'us-east-1'
      THEN 'https://' || bucket_atual || '.s3.amazonaws.com'
    ELSE 'https://' || bucket_atual || '.s3.' || regiao_atual || '.amazonaws.com'
  END;

  UPDATE publicacoes
     SET imagem_capa_url = replace(imagem_capa_url, base_s3, base_proxy)
   WHERE imagem_capa_url LIKE base_s3 || '/%';

  UPDATE publicacoes
     SET imagem_social_url = replace(imagem_social_url, base_s3, base_proxy)
   WHERE imagem_social_url LIKE base_s3 || '/%';

  UPDATE publicacoes
     SET conteudo = replace(conteudo::text, base_s3, base_proxy)::jsonb
   WHERE conteudo::text LIKE '%' || base_s3 || '/%';

  UPDATE administradores
     SET caminho_foto = replace(caminho_foto, base_s3, base_proxy)
   WHERE caminho_foto LIKE base_s3 || '/%';

  UPDATE parceiros
     SET caminho_logo = replace(caminho_logo, base_s3, base_proxy)
   WHERE caminho_logo LIKE base_s3 || '/%';

  UPDATE configuracoes_portal
     SET caminho_logo = replace(caminho_logo, base_s3, base_proxy),
         caminho_favicon = replace(caminho_favicon, base_s3, base_proxy)
   WHERE id = 1;
END $$;

-- ==================================================
-- 0022_bloqueio_progressivo_autenticacao.sql
-- ==================================================
BEGIN;
CREATE TABLE IF NOT EXISTS bloqueios_autenticacao (
  tipo varchar(12) NOT NULL CHECK (tipo IN ('origem','identidade')),
  chave_hash char(64) NOT NULL,
  falhas_acumuladas integer NOT NULL DEFAULT 0 CHECK (falhas_acumuladas >= 0),
  nivel_bloqueio integer NOT NULL DEFAULT 0 CHECK (nivel_bloqueio >= 0),
  bloqueado_ate timestamptz,
  ultima_falha_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tipo, chave_hash)
);
CREATE INDEX IF NOT EXISTS bloqueios_autenticacao_expiracao_idx
  ON bloqueios_autenticacao (bloqueado_ate) WHERE bloqueado_ate IS NOT NULL;
COMMIT;
