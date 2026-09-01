import os, sys, re, json, textwrap
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / '.dependencias'))
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'documentacao'/'saida'/'Documentacao_Tecnica_MOVEON.docx'
CAP=ROOT/'documentacao'/'capturas'; DIA=ROOT/'documentacao'/'diagramas'
RED='FE3000'; BLACK='141414'; GRAY='5B5B5B'; LIGHT='F4F5F7'; LINE='D9DCE1'; WHITE='FFFFFF'

def font(size=26,bold=False):
    for n in ['C:/Windows/Fonts/arial.ttf','C:/Windows/Fonts/calibri.ttf']:
        try:return ImageFont.truetype(n,size)
        except:pass
    return ImageFont.load_default()

def wrap(draw,text,width,f):
    words=text.split(); lines=[]; line=''
    for w in words:
        test=(line+' '+w).strip()
        if draw.textbbox((0,0),test,font=f)[2] <= width: line=test
        else: lines.append(line); line=w
    if line: lines.append(line)
    return lines

def box(draw,xy,title,stereo,items,fill='#FFFFFF'):
    x,y,w,h=xy; draw.rounded_rectangle((x,y,x+w,y+h),16,fill=fill,outline='#FE3000',width=3)
    draw.text((x+14,y+10),stereo,font=font(17),fill='#FE3000')
    draw.text((x+14,y+34),title,font=font(22),fill='#111111')
    yy=y+66
    for item in items:
        for line in wrap(draw,'• '+item,w-28,font(15)):
            draw.text((x+14,yy),line,font=font(15),fill='#333333'); yy+=19

def arrow(draw,a,b,label=''):
    draw.line((*a,*b),fill='#777777',width=3)
    import math
    ang=math.atan2(b[1]-a[1],b[0]-a[0]); s=12
    p1=(b[0]-s*math.cos(ang-.5),b[1]-s*math.sin(ang-.5));p2=(b[0]-s*math.cos(ang+.5),b[1]-s*math.sin(ang+.5))
    draw.polygon([b,p1,p2],fill='#777777')
    if label: draw.text(((a[0]+b[0])//2,(a[1]+b[1])//2-20),label,font=font(14),fill='#555555')

def make_diagrams():
    DIA.mkdir(parents=True,exist_ok=True)
    im=Image.new('RGB',(1800,1050),'white');d=ImageDraw.Draw(im)
    d.text((60,25),'MOVE.ON — Arquitetura integrada',font=font(36),fill='#111111')
    box(d,(60,120,360,250),'Portal e Dashboard','<<Fronteira>>',['React/Vinext','SSR de artigos e SEO','Editor rico e responsividade'],'#FFF8F6')
    box(d,(520,120,360,250),'API Express','<<Controle>>',['Rotas /api','Zod, CORS e Helmet','Cookies HttpOnly'],'#FFF8F6')
    box(d,(980,120,360,250),'Serviços e Repositórios','<<Controle>>',['Autenticação','Painel, portal e newsletter','Transações e consultas'],'#FFF8F6')
    box(d,(1420,120,320,250),'PostgreSQL','<<Entidade>>',['12 tabelas','GIN Full-Text Search','Índices e integridade'],'#FFF8F6')
    arrow(d,(420,245),(520,245),'HTTP/JSON');arrow(d,(880,245),(980,245),'chama');arrow(d,(1340,245),(1420,245),'SQL')
    box(d,(300,520,380,230),'Armazenamento local','<<Infraestrutura>>',['capas WebP','social JPEG 1200×630','perfis WebP 512×512'])
    box(d,(820,520,380,230),'SMTP','<<Infraestrutura>>',['Nodemailer','fila persistente','cancelamento assinado'])
    box(d,(1320,520,380,230),'SEO e compartilhamento','<<Fronteira>>',['Open Graph/Twitter','JSON-LD BlogPosting','sitemap e robots'])
    arrow(d,(760,370),(500,520));arrow(d,(1120,370),(1010,520));arrow(d,(700,370),(1510,520))
    im.save(DIA/'arquitetura.png')

    im=Image.new('RGB',(2200,1500),'white');d=ImageDraw.Draw(im);d.text((50,25),'Diagrama de classes — visão completa por responsabilidade',font=font(34),fill='#111111')
    ui=[('Portal','busca, feed, filtros, newsletter'),('Login','credenciais e sessão'),('Painel','navegação administrativa'),('Editor','publicação e prévia'),('Compartilhamento','redes e métricas')]
    ctr=[('ControladorAutenticacao','entrar, consultarSessao, sair'),('ServicoAutenticacao','autenticar, obter, encerrar'),('LimitadorLogin','bloqueio por tentativas'),('ControladorPainel','CRUD e uploads'),('ServicoNewsletter','agendar, enfileirar, enviar'),('RepositorioPortal','feed, FTS, eventos'),('RepositorioPainel','CRUD, métricas, configurações'),('RepositorioAutenticacao','administradores e sessões')]
    ent=[('Administrador','identidade e credenciais'),('SessaoAdministrativa','token e expiração'),('Publicacao','conteúdo, estado e SEO'),('Categoria','taxonomia e busca'),('Midia','arquivo associado'),('EventoAcesso','métrica confiável'),('TermoBusca','consulta registrada'),('InscricaoNewsletter','assinante'),('EnvioNewsletter','fila de entrega'),('ConfiguracaoPortal','identidade visual'),('ControleMigration','histórico de schema'),('PublicacaoCategoria','associação N:N')]
    for i,(n,x) in enumerate(ui): box(d,(40+i*420,100,380,150),n,'<<Fronteira>>',[x],'#FFF8F6')
    for i,(n,x) in enumerate(ctr): box(d,(40+(i%4)*540,360+(i//4)*210,500,170),n,'<<Controle>>',[x],'#F7F8FA')
    for i,(n,x) in enumerate(ent): box(d,(40+(i%4)*540,850+(i//4)*200,500,155),n,'<<Entidade>>',[x],'#FFFDF8')
    for x in [230,650,1070,1490,1910]: arrow(d,(x,250),(x if x<2100 else 2000,360))
    arrow(d,(290,740),(290,850),'persiste');arrow(d,(830,740),(830,850),'persiste');arrow(d,(1370,740),(1370,850),'consulta');arrow(d,(1910,740),(1910,850),'persiste')
    im.save(DIA/'classes.png')

    im=Image.new('RGB',(2100,1250),'white');d=ImageDraw.Draw(im);d.text((50,20),'Modelo entidade-relacionamento — todas as tabelas',font=font(34),fill='#111111')
    nodes={'administradores':(60,100),'sessoes_administrativas':(60,340),'publicacoes':(650,100),'publicacoes_categorias':(650,380),'categorias':(1250,100),'midias':(650,660),'eventos_acesso':(1250,380),'termos_busca':(1600,660),'configuracoes_portal':(60,660),'inscricoes_newsletter':(1250,900),'envios_newsletter':(650,900),'controle_migrations':(60,930)}
    for n,(x,y) in nodes.items(): box(d,(x,y,400,150),n,'<<Entidade>>',['PK + atributos; ver dicionário de dados'],'#FFF8F6')
    relations=[('administradores','sessoes_administrativas','1:N'),('administradores','publicacoes','1:N'),('administradores','configuracoes_portal','0:N'),('publicacoes','publicacoes_categorias','1:N'),('categorias','publicacoes_categorias','1:N'),('publicacoes','midias','1:N'),('publicacoes','eventos_acesso','0:N'),('categorias','eventos_acesso','0:N'),('inscricoes_newsletter','envios_newsletter','1:N'),('publicacoes','envios_newsletter','1:N')]
    for a,b,l in relations:
        ax,ay=nodes[a];bx,by=nodes[b];arrow(d,(ax+200,ay+150),(bx+200,by),l)
    im.save(DIA/'modelo-dados.png')

    im=Image.new('RGB',(1800,950),'white');d=ImageDraw.Draw(im);d.text((50,25),'Casos de uso principais',font=font(36),fill='#111111')
    d.ellipse((60,350,280,570),fill='#FFF8F6',outline='#FE3000',width=4);d.text((103,430),'Leitor',font=font(30),fill='#111111')
    d.ellipse((1510,350,1740,570),fill='#FFF8F6',outline='#FE3000',width=4);d.text((1540,420),'Adminis-',font=font(25),fill='#111111');d.text((1545,455),'trador',font=font(25),fill='#111111')
    reader=['Consultar portal','Pesquisar conteúdo','Filtrar categoria','Ler publicação','Compartilhar','Assinar/cancelar newsletter']
    admin=['Autenticar-se','Gerenciar publicações','Gerenciar categorias','Configurar portal','Consultar métricas','Gerenciar newsletter','Alterar perfil e senha']
    for i,t in enumerate(reader):
        y=100+i*125;d.ellipse((470,y,900,y+75),fill='white',outline='#777',width=2);d.text((520,y+22),t,font=font(20),fill='#222');arrow(d,(280,460),(470,y+38))
    for i,t in enumerate(admin):
        y=60+i*115;d.ellipse((960,y,1400,y+72),fill='white',outline='#777',width=2);d.text((1000,y+20),t,font=font(19),fill='#222');arrow(d,(1510,460),(1400,y+36))
    im.save(DIA/'casos-uso.png')

def set_cell_shading(cell,fill):
    tcPr=cell._tc.get_or_add_tcPr();shd=tcPr.find(qn('w:shd'))
    if shd is None: shd=OxmlElement('w:shd');tcPr.append(shd)
    shd.set(qn('w:fill'),fill)

def set_cell_width(cell,width):
    tcPr=cell._tc.get_or_add_tcPr();tcW=tcPr.find(qn('w:tcW'))
    if tcW is None: tcW=OxmlElement('w:tcW');tcPr.append(tcW)
    tcW.set(qn('w:w'),str(width));tcW.set(qn('w:type'),'dxa')

def add_table(doc,headers,rows,widths=None,font_size=8):
    table=doc.add_table(rows=1,cols=len(headers));table.alignment=WD_TABLE_ALIGNMENT.CENTER;table.autofit=False
    if widths is None: widths=[9360//len(headers)]*len(headers)
    tblPr=table._tbl.tblPr
    tblW=tblPr.find(qn('w:tblW'));tblW.set(qn('w:w'),'9360');tblW.set(qn('w:type'),'dxa')
    tblInd=OxmlElement('w:tblInd');tblInd.set(qn('w:w'),'120');tblInd.set(qn('w:type'),'dxa');tblPr.append(tblInd)
    grid=table._tbl.tblGrid
    for child in list(grid):grid.remove(child)
    for width in widths:
        col=OxmlElement('w:gridCol');col.set(qn('w:w'),str(width));grid.append(col)
    for i,h in enumerate(headers):
        c=table.rows[0].cells[i];c.text=h;set_cell_shading(c,RED)
        for r in c.paragraphs[0].runs:r.font.bold=True;r.font.color.rgb=RGBColor(255,255,255);r.font.size=Pt(font_size)
    for i,w in enumerate(widths):set_cell_width(table.rows[0].cells[i],w)
    for ri,row in enumerate(rows):
        cells=table.add_row().cells
        for i,v in enumerate(row):
            cells[i].text=str(v);cells[i].vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER;set_cell_width(cells[i],widths[i])
            if ri%2:set_cell_shading(cells[i],'F7F8FA')
            for p in cells[i].paragraphs:
                p.paragraph_format.space_after=Pt(2)
                for r in p.runs:r.font.name='Arial';r.font.size=Pt(font_size)
    table.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    spacer=doc.add_paragraph()
    spacer.paragraph_format.space_after=Pt(3)
    return table

def add_heading(doc,text,level=1):
    return doc.add_heading(text,level=level)
def para(doc,text,bold_prefix=None):
    p=doc.add_paragraph()
    if bold_prefix and text.startswith(bold_prefix):
        p.add_run(bold_prefix).bold=True;p.add_run(text[len(bold_prefix):])
    else:p.add_run(text)
    return p
def bullets(doc,items):
    for x in items: doc.add_paragraph(x,style='List Bullet')
def caption(doc,text):
    p=doc.add_paragraph(text);p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    for r in p.runs:r.italic=True;r.font.size=Pt(9);r.font.color.rgb=RGBColor(91,91,91)
def add_picture(doc,path,width,alt):
    """Insere imagem com descrição alternativa para leitores de tela."""
    shape=doc.add_picture(str(path),width=width)
    shape._inline.docPr.set('name',alt[:120])
    shape._inline.docPr.set('descr',alt)
    return shape
def pagebreak(doc):doc.add_page_break()
def section_intro(doc,objective,contents):
    table=add_table(doc,['Objetivo desta seção','O que será apresentado'],[(objective,contents)],[3400,5960],8.5)
    for cell in table.rows[1].cells:set_cell_shading(cell,'FFF8F6')

def figure_guide(doc,rows):
    add_table(doc,['Elemento visual','Interpretação funcional'],rows,[2500,6860],8)

ENV=[
('NODE_ENV','Modo de execução: development, test ou production. Controla comportamento seguro e otimizações.'),('FUSO_HORARIO','Fuso operacional do portal, datas, métricas e PostgreSQL.'),('NOME_PORTAL','Nome institucional usado em interface, SEO e e-mails.'),('DESCRICAO_PORTAL','Descrição padrão do portal e metadados.'),('URL_PUBLICA_PORTAL','Origem canônica absoluta para SEO, compartilhamento e links da newsletter.'),('CAMINHO_LOGO','Logo padrão pública.'),('CAMINHO_FAVICON','Ícone padrão do navegador.'),('CAMINHO_IMAGEM_SOCIAL','Imagem social padrão quando a publicação não possui capa.'),('HOST_API','Interface de rede em que a API escuta.'),('PORTA_API','Porta HTTP da API Express.'),('URL_INTERNA_API','Endereço utilizado pelo frontend/proxy para alcançar a API.'),('ORIGENS_PERMITIDAS','Lista CORS de origens autorizadas.'),('LIMITE_CORPO_JSON','Limite do corpo JSON contra abuso de memória.'),('PASTA_UPLOADS','Diretório persistente de arquivos enviados.'),('MAX_IMAGEM_CAPA_MB','Tamanho máximo em bytes convertido para MB; a resolução é otimizada pelo Sharp.'),('EMAIL_ATIVO','Liga/desliga o processamento real dos envios.'),('SMTP_HOST','Servidor SMTP.'),('SMTP_PORTA','Porta SMTP.'),('SMTP_SEGURO','Ativa conexão TLS direta quando aplicável.'),('SMTP_USUARIO','Usuário SMTP; segredo.'),('SMTP_SENHA','Senha SMTP; segredo.'),('EMAIL_REMETENTE_NOME','Nome visível do remetente.'),('EMAIL_REMETENTE_ENDERECO','Endereço From dos e-mails.'),('EMAIL_SEGREDO_CANCELAMENTO','Segredo HMAC dos links de cancelamento.'),('POSTGRES_IMAGEM','Tag da imagem Docker do PostgreSQL.'),('POSTGRES_CONTAINER','Nome do container.'),('POSTGRES_HOST','Interface publicada pelo Docker.'),('POSTGRES_PORTA','Porta exposta no host.'),('POSTGRES_PORTA_INTERNA','Porta interna do PostgreSQL.'),('POSTGRES_BANCO','Nome do banco.'),('POSTGRES_USUARIO','Usuário do banco; segredo operacional.'),('POSTGRES_SENHA','Senha do banco; segredo.'),('DATABASE_URL','String de conexão completa usada pela aplicação; segredo.'),('BANCO_MAX_CONEXOES','Tamanho máximo do pool.'),('BANCO_TEMPO_OCIOSO_MS','Tempo para liberar conexão ociosa.'),('BANCO_TEMPO_CONEXAO_MS','Timeout para abrir conexão.'),('NOME_COOKIE_SESSAO','Nome do cookie administrativo.'),('DURACAO_SESSAO_DIAS','Validade máxima da sessão.'),('COOKIE_SAMESITE','Política SameSite contra CSRF.'),('COOKIE_SEGURO','Exige HTTPS para envio do cookie em produção.'),('MAX_TENTATIVAS_LOGIN','Limiar do limitador de autenticação.'),('JANELA_TENTATIVAS_MINUTOS','Janela temporal do bloqueio de login.'),('CUSTO_HASH_SENHA','Custo bcrypt.'),('ADMIN_NOME','Nome do administrador criado/atualizado pela semente.'),('ADMIN_EMAIL','E-mail inicial do administrador.'),('ADMIN_SENHA','Senha inicial; deve ser rotacionada.'),('CATEGORIAS_INICIAIS','Categorias inseridas pela semente.')]

TABLES={
'controle_migrations':[('nome','varchar(255), PK','Nome do arquivo aplicado'),('executada_em','timestamptz','Auditoria da execução')],
'administradores':[('id','uuid, PK','Identificador'),('nome','varchar(120)','Nome'),('email','varchar(254), UNIQUE','Login'),('senha_hash','varchar(255)','Hash bcrypt'),('ativo','boolean','Habilitação'),('ultimo_acesso_em','timestamptz','Último login'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('caminho_foto','varchar(500)','Foto WebP')],
'sessoes_administrativas':[('id','uuid, PK','Sessão'),('administrador_id','uuid, FK','Administrador'),('token_hash','char(64), UNIQUE','SHA-256 do token'),('endereco_ip_hash','char(64)','IP anonimizado'),('agente_usuario','varchar(500)','Cliente'),('expira_em','timestamptz','Expiração'),('revogada_em','timestamptz','Revogação'),('criada_em','timestamptz','Criação')],
'categorias':[('id','uuid, PK','Categoria'),('nome','varchar(80)','Nome'),('slug','varchar(100), UNIQUE','URL'),('descricao','varchar(300)','Descrição'),('ativa','boolean','Visibilidade'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('documento_busca','tsvector gerado','FTS português')],
'publicacoes':[('id','uuid, PK','Publicação'),('titulo','varchar(180)','Título'),('slug','varchar(200), UNIQUE','URL + hash curto'),('resumo','varchar(500)','Resumo'),('conteudo','jsonb','HTML higienizado'),('situacao','enum','rascunho/agendada/publicada/arquivada'),('destaque','boolean','Destaque'),('metatitulo','varchar(180)','SEO'),('metadescricao','varchar(320)','SEO'),('publicado_em','timestamptz','Publicação'),('agendado_para','timestamptz','Agendamento'),('administrador_id','uuid, FK','Responsável'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('imagem_capa_url','varchar(1000)','Capa WebP/link'),('imagem_social_url','varchar(1000)','JPEG 1200×630'),('texto_alternativo_capa','varchar(300)','Acessibilidade/SEO'),('documento_busca','tsvector gerado','FTS ponderado')],
'publicacoes_categorias':[('publicacao_id','uuid, PK/FK','Publicação'),('categoria_id','uuid, PK/FK','Categoria')],
'midias':[('id','uuid, PK','Mídia'),('publicacao_id','uuid, FK','Publicação opcional'),('tipo','enum','imagem/vídeo/arquivo'),('nome_original','varchar(255)','Nome recebido'),('nome_armazenado','varchar(255), UNIQUE','Nome seguro'),('tipo_mime','varchar(100)','MIME'),('tamanho_bytes','bigint','Até 50 MiB'),('largura','integer','Pixels'),('altura','integer','Pixels'),('texto_alternativo','varchar(300)','Acessibilidade'),('ordem','integer','Ordenação'),('capa','boolean','Indica capa'),('criado_em','timestamptz','Criação')],
'configuracoes_portal':[('id','smallint, PK=1','Registro único'),('nome','varchar(120)','Nome'),('descricao','varchar(300)','Descrição'),('caminho_logo','varchar(500)','Logo'),('caminho_favicon','varchar(500)','Favicon'),('atualizado_por','uuid, FK','Administrador'),('atualizado_em','timestamptz','Alteração'),('cor_primaria','varchar(7)','Cor principal'),('cor_fundo_claro','varchar(7)','Fundo claro'),('cor_fundo_escuro','varchar(7)','Fundo escuro'),('cor_texto_claro','varchar(7)','Texto claro'),('cor_texto_escuro','varchar(7)','Texto escuro'),('newsletter_assunto','varchar(180)','Modelo do assunto'),('newsletter_texto','text','Modelo do corpo')],
'eventos_acesso':[('id','bigint identity, PK','Evento'),('tipo','enum','visualização/compartilhamento/busca/categoria'),('publicacao_id','uuid, FK','Publicação'),('categoria_id','uuid, FK','Categoria'),('identificador_visitante_hash','char(64)','Visitante anonimizado'),('endereco_ip_hash','char(64)','IP anonimizado'),('agente_usuario','varchar(500)','Cliente'),('referencia','varchar(1000)','Contexto'),('dados','jsonb','Extensão'),('ocorrido_em','timestamptz','Horário'),('e_robo','boolean','Filtra robôs'),('e_administrador','boolean','Filtra equipe')],
'termos_busca':[('id','bigint identity, PK','Busca'),('termo','varchar(200)','Texto'),('identificador_visitante_hash','char(64)','Visitante'),('quantidade_resultados','integer','Resultados'),('pesquisado_em','timestamptz','Horário')],
'inscricoes_newsletter':[('id','uuid, PK','Inscrição'),('email','varchar(254), UNIQUE','Destinatário'),('confirmada','boolean','Estado'),('token_confirmacao_hash','char(64)','Confirmação'),('inscrito_em','timestamptz','Cadastro'),('cancelado_em','timestamptz','Opt-out')],
'envios_newsletter':[('id','bigint identity, PK','Envio'),('inscricao_id','uuid, FK','Inscrito'),('publicacao_id','uuid, FK','Publicação'),('situacao','varchar(20)','pendente/enviando/enviado/falhou'),('tentativas','smallint','Retentativas'),('erro','varchar(1000)','Falha'),('criado_em','timestamptz','Fila'),('enviado_em','timestamptz','Entrega')],}

FUNCTIONS=[
('criarAplicacao','Monta Express, Helmet, CORS, JSON, arquivos estáticos, rotas e erros.'),('executarMigrations','Aplica migrations ordenadas uma única vez.'),('executarSemente','Insere/atualiza administrador, categorias e configuração inicial.'),('gerarTokenSeguro / gerarHashSha256','Cria tokens e hashes criptográficos.'),('higienizarConteudoHtml','Remove HTML perigoso e força lazy loading em mídia.'),('lerCookie / criarCookieSessao / criarCookieExpirado','Manipula sessão HttpOnly/Secure/SameSite.'),('exigirAutenticacao','Autoriza rotas administrativas consultando sessão persistida.'),('armazenarCapa','Valida formato real e gera WebP + JPEG social.'),('armazenarFotoPerfil','Valida e converte foto de alta resolução para WebP 512×512.'),('fotoPerfilExiste / excluirFotoPerfil','Evita referências órfãs e remove arquivo gerenciado.'),('criarSlug','Normaliza título e acrescenta hash aleatório curto.'),('generateMetadata','Gera canonical, Open Graph, Twitter e metadados do artigo.'),('sitemap / robots','Expõe descoberta e regras de indexação.'),('registrar','Envia eventos válidos e anonimizados.'),('api','Cliente HTTP unificado com credenciais e erros.'),('EditorRico','Edição HTML, links, cores, fontes, mídia e redimensionamento.'),('InscricaoNewsletter','Cadastro público com validação.'),('Compartilhamento','WhatsApp, Instagram, LinkedIn, Facebook, X, Telegram, e-mail e Web Share.')]

CLASSES=[
('ControladorAutenticacao','<<Controle>>','Orquestra login, consulta e logout; emite/expira cookie.'),('ServicoAutenticacao','<<Controle>>','Valida senha, cria token, recupera administrador e encerra sessão.'),('RepositorioAutenticacao','<<Controle>>','SQL de administradores e sessões.'),('LimitadorLogin','<<Controle>>','Controla falhas e bloqueio temporário por origem.'),('ControladorPainel','<<Controle>>','Valida e coordena CRUD, upload, perfil, métricas e newsletter.'),('RepositorioPainel','<<Controle>>','Transações e consultas administrativas.'),('RepositorioPortal','<<Controle>>','Feed, cursor, FTS, artigo, eventos e inscrição.'),('ServicoNewsletter','<<Controle>>','Publica agendadas, cria fila, envia e retenta e-mails.'),('Portal','<<Fronteira>>','Página pública, tema, busca e scroll infinito.'),('Login','<<Fronteira>>','Formulário administrativo acessível.'),('Painel','<<Fronteira>>','Shell e navegação do dashboard.'),('Editor','<<Fronteira>>','Formulário completo de publicação.'),('EditorRico','<<Fronteira>>','Editor visual e mídia redimensionável.'),('Compartilhamento','<<Fronteira>>','Ações de redes sociais e topo/voltar.')]

def configure(doc):
    sec=doc.sections[0];sec.page_width=Inches(8.5);sec.page_height=Inches(11);sec.top_margin=sec.bottom_margin=sec.left_margin=sec.right_margin=Inches(1)
    styles=doc.styles
    normal=styles['Normal'];normal.font.name='Arial';normal.font.size=Pt(10.5);normal.font.color.rgb=RGBColor.from_string(BLACK);normal.paragraph_format.space_after=Pt(6);normal.paragraph_format.line_spacing=1.2
    for name,size,before,after in [('Title',28,0,8),('Heading 1',17,16,8),('Heading 2',13.5,12,6),('Heading 3',11.5,9,4)]:
        s=styles[name];s.font.name='Arial';s.font.size=Pt(size);s.font.bold=True;s.font.color.rgb=RGBColor.from_string(RED if name!='Title' else BLACK);s.paragraph_format.space_before=Pt(before);s.paragraph_format.space_after=Pt(after);s.paragraph_format.keep_with_next=True
    styles['List Bullet'].font.name='Arial';styles['List Bullet'].font.size=Pt(10.5)
    header=sec.header.paragraphs[0];header.text='MOVE.ON  |  Documentação técnica';header.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    for r in header.runs:r.font.name='Arial';r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string(GRAY)
    footer=sec.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
    footer.add_run('Documento técnico • uso interno • ')
    fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');footer._p.append(fld)
    settings=doc.settings._element
    update=OxmlElement('w:updateFields');update.set(qn('w:val'),'true');settings.append(update)

def toc(doc):
    p=doc.add_paragraph();p.add_run('Sumário').bold=True;p.runs[0].font.size=Pt(18);p.runs[0].font.color.rgb=RGBColor.from_string(RED)
    fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'TOC \\o "1-3" \\h \\z \\u');p._p.addnext(fld)

def build():
    make_diagrams();doc=Document();configure(doc)
    p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_before=Pt(72)
    p.add_run('DOCUMENTAÇÃO TÉCNICA').bold=True;p.runs[0].font.name='Arial';p.runs[0].font.size=Pt(14);p.runs[0].font.color.rgb=RGBColor.from_string(RED)
    p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;r=p.add_run('Portal de Conteúdo / Blog MOVE.ON');r.bold=True;r.font.name='Arial';r.font.size=Pt(30);r.font.color.rgb=RGBColor.from_string(BLACK)
    p=doc.add_paragraph('Arquitetura, requisitos, casos de uso, classes, banco de dados, segurança, operação e manutenção');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    if (ROOT/'public'/'logo.png').exists():add_picture(doc,ROOT/'public'/'logo.png',Inches(2.2),'Logotipo institucional MOVE.ON em vermelho.');doc.paragraphs[-1].alignment=WD_ALIGN_PARAGRAPH.CENTER
    p=doc.add_paragraph('\nVersão do documento: 1.0\nData de referência: 13 de agosto de 2026\nBase documental: código-fonte e schema efetivamente implementados');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    pagebreak(doc);toc(doc);pagebreak(doc)

    add_heading(doc,'Controle e orientação do documento',1)
    section_intro(doc,'Estabelecer a finalidade, o público e os limites desta especificação.','Controle de versão, leitores esperados, fontes de verdade e convenções gráficas.')
    add_table(doc,['Item','Definição'],[
      ('Documento','Especificação Técnica do Portal de Conteúdo / Blog MOVE.ON'),
      ('Versão','1.1 — revisão estrutural e ampliação descritiva'),
      ('Data de referência','13 de agosto de 2026'),
      ('Estado descrito','Implementação existente no repositório, migrations 0001 a 0007'),
      ('Público-alvo','Desenvolvedores, arquitetos, DevOps, QA, segurança, produto e manutenção'),
      ('Fontes de verdade','Código TypeScript/React, SQL das migrations, .env.example, Docker Compose e scripts'),
      ('Tratamento de segredos','Apenas nomes e finalidades; valores reais do .env não são reproduzidos')
    ],[2500,6860],8.5)
    add_heading(doc,'Como utilizar esta documentação',2)
    bullets(doc,['Para compreender o produto: leia Visão geral, Requisitos e Interface.','Para alterar código: consulte Arquitetura, Classes e Catálogo de funções.','Para alterar persistência: consulte Modelagem do banco, índices e migrations.','Para implantar: consulte Variáveis de ambiente, Estrutura e Operação.','Para revisar riscos: consulte Segurança, limites de produção e testes recomendados.'])
    add_heading(doc,'Convenções visuais',2)
    add_table(doc,['Convenção','Significado'],[
      ('Vermelho #fe3000','Acento institucional e destaque de títulos, cabeçalhos e fronteiras.'),
      ('<<Fronteira>>','Elemento que recebe ou apresenta interação ao usuário/sistema externo.'),
      ('<<Controle>>','Elemento que coordena regras, fluxo de aplicação ou persistência.'),
      ('<<Entidade>>','Informação persistida ou objeto conceitual do domínio.'),
      ('Seta contínua','Dependência, chamada ou fluxo de dados.'),
      ('Tabela vermelha/cinza','Cabeçalho de consulta rápida e linhas alternadas para leitura.')
    ],[2500,6860],8.5)
    pagebreak(doc)

    add_heading(doc,'1. Visão geral',1)
    section_intro(doc,'Apresentar o problema, o produto e suas fronteiras.','Objetivos, escopo, atores, requisitos funcionais e atributos de qualidade.')
    para(doc,'O MOVE.ON é um portal de conteúdo responsivo com área pública, leitura individual de artigos e dashboard administrativo protegido. O produto centraliza publicação, categorização, agendamento, mídia, SEO, compartilhamento, newsletter, identidade visual, perfil administrativo e métricas confiáveis em uma única base PostgreSQL.')
    add_heading(doc,'1.1 Objetivos',2);bullets(doc,['Publicar conteúdo acessível e otimizado para busca e compartilhamento.','Oferecer administração segura sem cadastro público.','Manter métricas reais, excluindo robôs, administradores e duplicidades diárias.','Escalar a leitura por cache, índices, busca textual e paginação por cursor.','Facilitar manutenção com módulos e nomenclaturas em português do Brasil.'])
    add_heading(doc,'1.2 Escopo funcional',2);bullets(doc,['Portal inicial com destaque, feed incremental, categorias, busca e newsletter.','Página canônica por slug com conteúdo formatado, SEO e compartilhamento.','Dashboard: visão geral, publicações, editor, categorias, métricas, newsletter, aparência e administrador.','PostgreSQL, migrations, seed, Docker Compose e instalador Ubuntu.'])
    add_heading(doc,'1.3 Requisitos',2)
    add_table(doc,['ID','Requisito','Tipo'],[(f'RF{i+1:02}',x,'Funcional') for i,x in enumerate(['Listar publicações publicadas e destaques','Pesquisar por título, resumo, conteúdo e categoria','Filtrar por múltiplas categorias','Carregar feed por scroll infinito','Ler artigo em URL amigável','Compartilhar em redes sociais','Cadastrar e cancelar newsletter','Autenticar administrador','Criar, visualizar, editar, excluir, agendar e arquivar publicação','Gerenciar categorias','Configurar identidade e cores','Gerenciar perfil e revogar sessões ao trocar senha','Consultar métricas confiáveis','Editar conteúdo rico com imagens, vídeos e código'])], [850,6900,1610],8)
    para(doc,'Requisitos não funcionais: acessibilidade para baixa visão; responsividade; validação exclusiva no backend; cookies HttpOnly/Secure/SameSite; prevenção de XSS, CSRF e upload malicioso; SEO; desempenho; rastreabilidade; configuração externa por ambiente; disponibilidade compatível com implantação em VPS Ubuntu.')
    add_heading(doc,'1.4 Atores e responsabilidades',2)
    add_table(doc,['Ator','Responsabilidade','Limite de acesso'],[
      ('Leitor','Descobrir, pesquisar, filtrar, ler, compartilhar e assinar/cancelar newsletter.','Somente recursos públicos.'),
      ('Administrador','Gerir conteúdo, taxonomia, métricas, newsletter, identidade e perfil.','Rotas protegidas por sessão.'),
      ('Agendador interno','Publicar itens vencidos e iniciar processamento da fila.','Processo interno sem interface pública.'),
      ('Servidor SMTP','Receber e encaminhar mensagens profissionais.','Somente saída de e-mail configurada.'),
      ('Crawler social/busca','Consumir HTML, metadados, sitemap e robots.','Conteúdo publicado e indexável.')
    ],[1800,4200,3360],8)
    add_heading(doc,'1.5 Atributos de qualidade',2)
    add_table(doc,['Atributo','Como é atendido','Indicador esperado'],[
      ('Desempenho','FTS/GIN, cursor, lotes limitados, cache, lazy loading e mídia otimizada.','Baixo tempo de resposta e transferência proporcional ao viewport.'),
      ('Segurança','Zod, sanitização, queries parametrizadas, cookies seguros, bcrypt e upload validado.','Entrada inválida recusada pelo backend.'),
      ('Acessibilidade','Fontes e controles grandes, contraste, texto alternativo, foco e interface responsiva.','Navegação compreensível por teclado e baixa visão.'),
      ('Manutenibilidade','Módulos por domínio, nomes em português e migrations incrementais.','Mudanças localizadas e rastreáveis.'),
      ('Confiabilidade','Transações, constraints, fila persistente e métricas sem falsos positivos.','Estado consistente após falhas parciais.')
    ],[1700,5200,2460],8)

    add_heading(doc,'2. Arquitetura e decisões técnicas',1)
    section_intro(doc,'Explicar como a solução é dividida e por que as tecnologias foram escolhidas.','Camadas, comunicação, decisões REST/FTS/cursor, mídia, SEO e critérios para evolução.')
    add_picture(doc,DIA/'arquitetura.png',Inches(6.5),'Arquitetura lógica do MOVE.ON, do navegador ao frontend, API, PostgreSQL, arquivos e serviço SMTP.');caption(doc,'Figura 1 — Arquitetura lógica integrada do MOVE.ON.')
    figure_guide(doc,[
      ('Portal e Dashboard','Fronteiras React/Vinext. Exibem dados, coletam ações e nunca substituem a validação do servidor.'),
      ('API Express','Ponto central de autenticação, autorização, validação, segurança HTTP e contratos JSON.'),
      ('Serviços e Repositórios','Coordenam regras de negócio e isolam consultas/transações PostgreSQL.'),
      ('PostgreSQL','Fonte de verdade de conteúdo, sessões, configurações, métricas e newsletter.'),
      ('Armazenamento','Mantém arquivos gerenciados em diretórios separados por finalidade.'),
      ('SMTP','Integração externa usada somente pelo processador persistente da newsletter.'),
      ('SEO e compartilhamento','HTML e metadados consumidos por mecanismos de busca e redes sociais.')
    ])
    add_heading(doc,'2.1 Backend e frontend no mesmo repositório',2)
    para(doc,'A solução adota um monorepositório modular: frontend Vinext/React e API Express são processos separados em execução, mas versionados, configurados e implantados juntos. A decisão reduz sobrecarga operacional para a VPS, preserva contratos próximos, unifica scripts, migrations e variáveis, e evita duplicação de tipos e pipelines. Não é um “arquivo único”: o backend está dividido em módulos, controladores, serviços, repositórios, validações e infraestrutura. A separação física em repositórios só se justificará quando equipes, ciclos de release ou escalabilidade forem independentes.')
    add_heading(doc,'2.2 REST em vez de GraphQL',2);para(doc,'Os consumidores atuais possuem consultas previsíveis e endpoints específicos. REST com DTOs pequenos, paginação e cache é mais simples, observável e econômico. GraphQL adicionaria parser, schema, proteção de profundidade/complexidade e risco de N+1 sem ganho mensurável neste domínio. Pode ser introduzido se surgirem múltiplos clientes com composições de dados muito diferentes.')
    add_heading(doc,'2.3 Full-Text Search em vez de LIKE/ILIKE',2);para(doc,'LIKE/ILIKE tende a realizar varredura e comparação textual sem relevância linguística, especialmente com curingas iniciais. O MOVE.ON usa tsvector gerado, dicionário portuguese, pesos A/B/C, websearch_to_tsquery e índices GIN. Isso normaliza termos, considera linguagem, melhora precisão e permite localizar candidatos por índice. A consulta também pesquisa o documento das categorias. O resultado é menor CPU, menor latência e escalabilidade superior.')
    add_heading(doc,'2.4 Cursor em vez de OFFSET',2);para(doc,'A paginação pública usa cursor baseado em publicado_em. OFFSET exige descartar linhas anteriores e degrada conforme a página cresce; cursor permite continuar a partir do último registro indexado e mantém custo estável. O lote máximo de 30 impede respostas excessivas.')
    add_heading(doc,'2.5 SSE, Webhooks e tempo real',2);para(doc,'SSE não foi adotado porque leitura, busca e administração não exigem conexão permanente; mantê-la para cada visitante aumentaria sockets e memória. Webhooks serão adequados quando houver integração externa que precise receber eventos, como provedor de e-mail ou CDN. A newsletter usa fila persistente e processamento periódico, evitando dependência da requisição de publicação.')
    add_heading(doc,'2.6 Imagens, vídeo e banda',2);bullets(doc,['Capas: WebP até 1600×1000, qualidade 84, rotação por EXIF e sem ampliação.','Prévia social: JPEG progressivo 1200×630, qualidade 88.','Perfil: WebP 512×512, leitura sequencial e redução inteligente.','Conteúdo: loading=lazy e decoding=async; vídeo incorporado apenas por HTTPS e hosts permitidos.','Arquivos estáticos: cache imutável de 30 dias.','Cards fora do viewport: content-visibility para reduzir layout e pintura.'])
    add_heading(doc,'2.7 SEO',2);bullets(doc,['Slugs exclusivos com hash criptográfico curto.','Canonical por artigo, Open Graph, Twitter Card e imagem social.','JSON-LD BlogPosting, Organization e WebSite.','sitemap.xml e robots.txt; /admin e /api não indexáveis.','Título, descrição, categorias, datas, imagem, texto alternativo e idioma pt-BR.'])

    add_heading(doc,'3. Casos de uso',1)
    section_intro(doc,'Descrever objetivos observáveis dos usuários, sem misturar detalhes de implementação.','Atores, pré-condições, fluxo principal, alternativas e resultado esperado.')
    add_picture(doc,DIA/'casos-uso.png',Inches(6.5),'Diagrama dos casos de uso principais executados pelo leitor e pelo administrador.');caption(doc,'Figura 2 — Atores e casos de uso do portal.')
    figure_guide(doc,[
      ('Leitor','Ator público que consome e distribui conteúdo e controla sua inscrição.'),
      ('Administrador','Ator autenticado responsável pela operação editorial e institucional.'),
      ('Elipses centrais','Objetivos de negócio disponibilizados pelo sistema.'),
      ('Linhas de associação','Indicam quais objetivos cada ator inicia ou utiliza.')
    ])
    cases=[('UC01 Consultar portal','Leitor','API e banco disponíveis','Carregar configurações, categorias e primeiro lote; rolar para novos lotes.','Feed exibido com cursor.'),('UC02 Pesquisar','Leitor','Portal aberto','Informar termos; aguardar debounce; executar FTS; exibir resultados.','Resultados relevantes sem varredura no cliente.'),('UC03 Ler e compartilhar','Leitor','Publicação publicada','Abrir slug; registrar visualização válida; escolher rede.','Artigo e metadados sociais disponíveis.'),('UC04 Newsletter','Leitor','E-mail válido','Inscrever; receber nova publicação; cancelar por token HMAC.','Inscrição ativa ou cancelada.'),('UC05 Autenticar','Administrador','Conta ativa','Validar limite, credenciais bcrypt, criar token e cookie.','Sessão persistida.'),('UC06 Publicar','Administrador','Sessão válida','Editar; selecionar categorias/status/destaque; enviar capa; pré-visualizar; salvar.','Publicação persistida e, se publicada, newsletter enfileirada.'),('UC07 Alterar senha','Administrador','Senha atual correta','Gerar novo bcrypt; atualizar; revogar todas as sessões na mesma transação.','Todos os dispositivos deslogados.'),('UC08 Consultar métricas','Administrador','Sessão válida','Agregar eventos não robôs, não administrativos e únicos.','Painel de acessos reais.')]
    add_table(doc,['Caso','Ator','Pré-condição','Fluxo resumido','Pós-condição'],cases,[1450,1100,1650,3350,1810],7.5)

    add_heading(doc,'4. Diagrama e catálogo de classes',1)
    section_intro(doc,'Relacionar responsabilidades de software e dependências principais.','Fronteiras, controles, entidades conceituais, métodos e relacionamentos.')
    add_picture(doc,DIA/'classes.png',Inches(6.5),'Diagrama de classes agrupado por fronteiras, controles e entidades do domínio MOVE.ON.');caption(doc,'Figura 3 — Classes e componentes classificados por estereótipo.')
    figure_guide(doc,[
      ('Faixa superior — Fronteiras','Componentes React e rotas SSR que conversam com usuários ou crawlers.'),
      ('Faixa central — Controles','Controladores, serviços e repositórios que executam casos de uso.'),
      ('Faixa inferior — Entidades','Registros persistentes do domínio e associações entre eles.'),
      ('Setas verticais','Dependência da camada superior em uma responsabilidade inferior.')
    ])
    para(doc,'Classificação adotada: <<Fronteira>> representa interação com usuário ou sistema externo; <<Controle>> coordena regras, casos de uso e persistência; <<Entidade>> representa estado persistente do domínio. Repositórios foram classificados como controle de persistência, e cada tabela possui uma entidade conceitual correspondente.')
    for table in TABLES: CLASSES.append((table.title().replace('_',''),'<<Entidade>>',f'Representação conceitual da tabela {table}.'))
    add_table(doc,['Classe/componente','Classificação','Responsabilidade'],CLASSES,[2500,1450,5410],8)
    add_heading(doc,'4.1 Relacionamentos',2);bullets(doc,['Portal → RepositorioPortal por rotas públicas.','Login → ControladorAutenticacao → ServicoAutenticacao → RepositorioAutenticacao.','Painel/Editor → ControladorPainel → RepositorioPainel.','ControladorPainel → ServicoNewsletter ao publicar.','ServicoNewsletter → Nodemailer e PostgreSQL.','Administrador 1:N SessaoAdministrativa e Publicacao.','Publicacao N:N Categoria por PublicacaoCategoria.','Publicacao 1:N Midia, EventoAcesso e EnvioNewsletter.','InscricaoNewsletter 1:N EnvioNewsletter.'])

    add_heading(doc,'5. Modelagem completa do banco',1)
    section_intro(doc,'Documentar integralmente a persistência e as regras de integridade.','Entidades, colunas, tipos, chaves, cardinalidades, índices e políticas de exclusão.')
    add_picture(doc,DIA/'modelo-dados.png',Inches(6.5),'Modelo entidade-relacionamento com as doze tabelas PostgreSQL e suas cardinalidades.');caption(doc,'Figura 4 — Modelo de dados incluindo as 12 tabelas, inclusive controle_migrations.')
    figure_guide(doc,[
      ('administradores','Raiz do domínio administrativo; vincula sessões, publicações e alterações de configuração.'),
      ('publicacoes e categorias','Núcleo editorial ligado em N:N por publicacoes_categorias.'),
      ('eventos_acesso e termos_busca','Telemetria funcional e anonimizada para métricas e análise.'),
      ('inscricoes/envios_newsletter','Cadastro e fila persistente com rastreamento de tentativas.'),
      ('midias','Catálogo previsto para arquivos associados a publicações.'),
      ('controle_migrations','Registro técnico que impede reaplicação de alterações de schema.')
    ])
    para(doc,'O banco utiliza UUID para entidades expostas, identity bigint para eventos/filas, timestamptz para consistência temporal, JSONB para conteúdo extensível, enums para estados fechados, FKs com políticas explícitas e índices parciais para caminhos críticos.')
    for name,cols in TABLES.items():
        add_heading(doc,f'5.{list(TABLES).index(name)+1} {name}',2)
        add_table(doc,['Coluna','Tipo/restrição','Finalidade'],cols,[2300,2500,4560],8)
    add_heading(doc,'5.13 Índices, integridade e retenção',2);bullets(doc,['GIN em publicacoes.documento_busca e categorias.documento_busca.','Índice parcial do feed por publicado_em/id para situação publicada.','Índice único de visualização diária por publicação, visitante, data e tipo.','Índices de métricas por data/tipo e publicação/data, excluindo robôs/administradores.','Índice de sessões ativas e expiração.','Índice da fila pendente/falha da newsletter.','ON DELETE CASCADE em sessões, associações e fila; RESTRICT em publicação→administrador e categoria vinculada; SET NULL em eventos/configuração quando apropriado.'])

    add_heading(doc,'6. Interface e funcionalidades',1)
    section_intro(doc,'Explicar a experiência visual e a função de cada área apresentada.','Portal, login, dashboard, componentes, comportamento responsivo e estados visuais.')
    for img,cap in [('portal-inicial.png','Figura 5 — Portal público: cabeçalho, busca modal, tema, acesso administrativo, destaque, categorias e feed incremental.'),('login-administrativo.png','Figura 6 — Login: campos acessíveis, visualização de senha, proteção por limite de tentativas e sessão HttpOnly.'),('dashboard-inicio.png','Figura 7 — Dashboard: métricas reais, gráfico, atalhos, navegação, perfil e logout.')]:
        if (CAP/img).exists():add_picture(doc,CAP/img,Inches(6.5),cap);caption(doc,cap)
    add_heading(doc,'6.1 Portal público',2);bullets(doc,['Busca oculta em modal moderno; consulta FTS após debounce.','Tema claro/escuro com preferências visuais e fundo quadriculado.','Cards fixos, clicáveis, hover vermelho e categorias interativas.','Scroll infinito e botão de topo apenas após rolagem.','Restauração da posição ao voltar de um artigo.'])
    add_heading(doc,'6.1.1 Leitura orientada da tela pública',3)
    add_table(doc,['Elemento','Função','Comportamento visual'],[
      ('Marca','Identifica o portal e retorna ao início.','Logo no canto esquerdo com área de clique ampla.'),
      ('Navegação','Acessa início e publicações.','Links centrais; menu compacto em telas pequenas.'),
      ('Busca','Pesquisa título, resumo, conteúdo e categoria.','Ícone abre modal sobreposto, sem deslocar o cabeçalho.'),
      ('Tema','Alterna claro e escuro.','Botão circular e cores/fundo atualizados.'),
      ('Administração','Atalho para /admin.','Engrenagem à direita do botão de tema.'),
      ('Destaque','Promove conteúdo editorial prioritário.','Bloco grande com imagem, texto e CTA visível.'),
      ('Categorias','Refina o feed.','Pílulas com hover e estado ativo vermelho.'),
      ('Cards','Resume cada publicação.','Altura uniforme, ponteiro de mão e borda animada.'),
      ('Scroll infinito','Continua o feed sem paginação manual.','Sentinela solicita lotes por cursor.'),
      ('Topo','Retorna rapidamente ao início.','Botão vermelho exibido somente após rolagem.')
    ],[1700,4200,3460],7.7)
    add_heading(doc,'6.2 Dashboard',2);bullets(doc,['Editor rico: headings, listas, alinhamento, links, remoção de links, fonte, tamanho, cores, código, imagem e vídeo redimensionáveis.','Estados: rascunho, agendada, publicada e arquivada; destaque e múltiplas categorias.','Upload ou URL de capa, pré-visualização e exclusão de arquivos gerenciados.','Configuração de logo, favicon, cores, nome e descrição.','Perfil com foto otimizada; e-mail/senha protegidos pela senha atual.','Newsletter paginada, modelo editável e cancelamento automático.'])
    add_heading(doc,'6.2.1 Leitura orientada do login e dashboard',3)
    add_table(doc,['Elemento','Função','Regra relevante'],[
      ('Login','Inicia sessão administrativa.','Erro genérico, limite de tentativas e opção de revelar senha.'),
      ('Menu lateral','Organiza os módulos administrativos.','Item atual destacado; compacto em telas pequenas.'),
      ('Cabeçalho','Mostra contexto, nome, e-mail e foto.','Foto vem do estado persistido do administrador.'),
      ('Cartões de métricas','Sintetizam acessos, leitores, publicações e categorias.','Excluem robôs e administradores.'),
      ('Gráfico','Apresenta evolução de acessos válidos.','Série temporal diretamente agregada no banco.'),
      ('Ações rápidas','Reduz passos para tarefas frequentes.','Atalhos para publicação, categorias e métricas.'),
      ('Logout','Encerra somente a sessão atual.','Revoga token no banco e expira cookie.'),
      ('Troca de senha','Atualiza credencial crítica.','Revoga todas as sessões, inclusive a atual.')
    ],[1700,4200,3460],7.7)

    add_heading(doc,'7. Segurança',1)
    section_intro(doc,'Explicar controles preventivos, detectivos e de recuperação.','Entradas, sessão, senha, upload, conteúdo HTML, privacidade, HTTP e recomendações de produção.')
    bullets(doc,['Backend valida todas as entradas com Zod strict; frontend não é fonte de confiança.','HTML higienizado por allowlist; links recebem noopener noreferrer; iframes limitados a YouTube/Vimeo HTTPS.','Upload em memória com limite de bytes, magic bytes via file-type, nome UUID e recompressão Sharp.','Cookies HttpOnly, SameSite configurável, Secure em produção, Path=/ e expiração.','Tokens nunca são persistidos em claro; apenas SHA-256.','Senhas bcrypt com custo configurável; troca revoga todas as sessões atomicamente.','Helmet, CORS restrito, JSON limitado e x-powered-by desativado.','Eventos armazenam hashes de IP/visitante; robôs e administradores são marcados e excluídos das métricas.','Consultas parametrizadas evitam injeção SQL.','Segredos ficam no .env, ignorado pelo Git; documentação não deve registrar valores reais.'])
    add_heading(doc,'7.1 Matriz de ameaças e controles',2)
    add_table(doc,['Risco','Controle implementado','Resultado'],[
      ('Injeção SQL','Parâmetros posicionais do driver pg.','Entrada não é concatenada ao SQL.'),
      ('XSS persistente','sanitize-html por allowlist e iframe restrito.','Conteúdo perigoso é removido antes de persistir.'),
      ('Roubo de sessão por script','Cookie HttpOnly e token somente em hash no banco.','JavaScript não lê o cookie; vazamento do banco não expõe token em claro.'),
      ('CSRF','SameSite configurável, CORS restrito e JSON estrito.','Redução de requisições autenticadas entre origens.'),
      ('Força bruta','Limitador por endereço e bcrypt configurável.','Tentativas repetidas sofrem bloqueio temporário.'),
      ('Upload malicioso','Limite de bytes, magic bytes, recompressão e nome UUID.','Arquivo original não é servido diretamente.'),
      ('Falso positivo em métricas','Detecção de robô/admin e unicidade diária.','Indicadores refletem audiência pública válida.'),
      ('Sessão antiga após senha nova','Revogação global na mesma transação da senha.','Todos os dispositivos precisam autenticar novamente.')
    ],[1800,4800,2760],7.7)
    add_heading(doc,'7.2 Limites e recomendações de produção',2);bullets(doc,['COOKIE_SEGURO=true atrás de HTTPS.','Rotacionar ADMIN_SENHA, POSTGRES_SENHA, SMTP_SENHA e EMAIL_SEGREDO_CANCELAMENTO.','Persistir uploads em volume/backups ou armazenamento de objetos em escala horizontal.','Aplicar reverse proxy com TLS, compressão, rate limiting distribuído e CDN.','Monitorar fila, pool, latência, erros e espaço em disco.'])

    add_heading(doc,'8. Variáveis de ambiente',1)
    section_intro(doc,'Centralizar configuração mutável e separar segredos do código.','Catálogo completo, finalidade, impacto operacional e cuidados de produção.')
    para(doc,'Todas as variáveis configuráveis e sensíveis ficam em .env. O arquivo .env.example documenta chaves sem expor valores reais. Segredos nunca devem ser incluídos em logs, commits ou documentação compartilhada.')
    add_table(doc,['Variável','Finalidade e importância'],ENV,[2750,6610],8)

    add_heading(doc,'9. Estrutura do projeto',1)
    section_intro(doc,'Orientar desenvolvedores sobre onde localizar e alterar cada responsabilidade.','Pastas, módulos, fluxo de execução e fronteiras de manutenção.')
    structure=[('app/','Rotas e fronteiras React/Vinext; portal, admin, artigo, SEO, robots e sitemap.'),('backend/configuracoes/','Validação central do ambiente.'),('backend/compartilhado/','Cookies, autenticação obrigatória, erros, criptografia e sanitização.'),('backend/infraestrutura/banco/','Pool, migrations e semente.'),('backend/modulos/autenticacao/','Login, sessão, limite e persistência.'),('backend/modulos/painel/','CRUD, métricas, configurações, uploads e administrador.'),('backend/modulos/portal/','Feed, FTS, artigos, eventos e inscrições.'),('backend/modulos/newsletter/','Fila, SMTP e cancelamento.'),('backend/modulos/saude/','Health check.'),('migrations/','Evolução incremental do PostgreSQL.'),('scripts/','Instalação, migration e seed.'),('uploads/','Arquivos gerenciados por tipo.'),('public/','Logo, favicon e imagem social padrão.'),('documentacao/','Artefatos, diagramas, capturas e documento final.')]
    add_table(doc,['Caminho','Responsabilidade'],structure,[3000,6360],8)
    add_heading(doc,'9.1 Fluxo de execução',2);bullets(doc,['npm run dev inicia portal e API simultaneamente.','A API abre pool PostgreSQL e worker periódico da newsletter.','Vite encaminha /api e /uploads para a API no desenvolvimento.','Docker Compose mantém PostgreSQL em volume nomeado.','migrar.ts aplica somente migrations ainda não registradas.','semear.ts atualiza dados iniciais de forma repetível.'])

    add_heading(doc,'10. Rotas e contratos HTTP',1)
    section_intro(doc,'Catalogar a superfície da API e seus requisitos de acesso.','Métodos, caminhos, autenticação, finalidade, respostas e regras transversais.')
    endpoints=[('GET','/api/saude','Público','Saúde e banco'),('POST','/api/autenticacao/entrar','Público','Cria sessão'),('GET','/api/autenticacao/sessao','Cookie','Consulta sessão'),('POST','/api/autenticacao/sair','Cookie','Revoga sessão'),('GET','/api/portal/inicial','Público','Configuração, categorias e lote'),('GET','/api/portal/publicacoes','Público','FTS/categoria/cursor'),('GET','/api/portal/publicacoes/:slug','Público','Artigo publicado'),('POST','/api/portal/eventos','Público','Métrica validada'),('POST','/api/portal/newsletter','Público','Inscrição'),('GET','/api/portal/newsletter/cancelar','Token','Cancelamento'),('GET/POST/PUT/DELETE','/api/painel/publicacoes','Admin','CRUD'),('GET/POST/PUT/DELETE','/api/painel/categorias','Admin','CRUD'),('POST','/api/painel/uploads/capas','Admin','Capa otimizada'),('POST','/api/painel/uploads/perfil','Admin','Perfil otimizado'),('GET','/api/painel/metricas','Admin','Métricas'),('GET/PUT','/api/painel/configuracoes','Admin','Identidade'),('GET/PUT','/api/painel/administrador','Admin','Perfil/segurança'),('GET/DELETE','/api/painel/newsletter','Admin','Inscritos'),('GET/PUT','/api/painel/newsletter-modelo','Admin','Modelo')]
    add_table(doc,['Método','Rota','Acesso','Finalidade'],endpoints,[1350,3700,1300,3010],7.5)
    add_heading(doc,'10.1 Regras transversais dos contratos',2)
    bullets(doc,['Todas as rotas administrativas passam por exigirAutenticacao.','Corpos JSON respeitam LIMITE_CORPO_JSON e validação estrita.','Uploads usam multipart, um arquivo por requisição e limite configurado.','Erros retornam mensagem pública sem detalhes internos ou credenciais.','Listagens públicas usam limite máximo e cursor; newsletter administrativa usa paginação.','Conteúdo público recebe cabeçalhos de cache coerentes; sessão e busca dinâmica usam no-store.'])

    add_heading(doc,'11. Catálogo de classes e funções',1);para(doc,'Esta seção relaciona os elementos executáveis relevantes. Métodos CRUD individuais aparecem nas classes de controle e repositório; funções de interface aparecem como fronteiras.')
    section_intro(doc,'Permitir localizar rapidamente a regra responsável por cada comportamento.','Funções compartilhadas, classes backend, componentes frontend e efeitos colaterais.')
    add_table(doc,['Função/módulo','Descrição'],FUNCTIONS,[3100,6260],8)
    detailed=[('RepositorioPainel','resumo; listar/obter/salvar/excluir publicações; listar/criar/atualizar/excluir categorias; metricas; configurações; administrador; newsletter. salvarPublicacao e atualizarAdministrador usam transações.'),('ControladorPainel','enviarCapa; enviarFotoPerfil; resumo; CRUD de publicações/categorias; métricas; configurações; administrador; lista/modelo newsletter. Higieniza conteúdo e coordena arquivos/fila.'),('RepositorioPortal','inicial; listarPublicacoes com FTS/cursor; obterPublicacaoPorSlug; registrarEvento; newsletter.'),('RepositorioAutenticacao','buscar por e-mail/token; registrar acesso; criar e revogar sessão.'),('ServicoAutenticacao','autenticar; obterAdministrador; encerrarSessao.'),('ControladorAutenticacao','entrar; consultarSessao; sair.'),('ServicoNewsletter','publicarAgendadas; enfileirar; processar; tokenCancelamento; idTokenValido.'),('Fronteiras React','ModalGlobal; Login; Portal; InscricaoNewsletter; Painel; Inicio; Grafico; Publicacoes; EditorRico; Editor; Categorias; Metricas; Configuracao; DadosAdmin; PainelNewsletter; Compartilhamento.')]
    add_table(doc,['Classe/grupo','Métodos e comportamento'],detailed,[2600,6760],8)

    add_heading(doc,'12. Operação, testes e manutenção',1)
    section_intro(doc,'Definir como preparar, validar, executar e evoluir a aplicação com segurança.','Comandos, backup, observabilidade, testes, implantação e critérios de evolução.')
    bullets(doc,['Desenvolvimento: npm run dev.','Banco: npm run banco:subir; npm run banco:migrar; npm run banco:semear.','Validação: npm run tipos e npm run build.','Produção: configurar .env, HTTPS/reverse proxy, banco/volume e executar start:producao.','Backup: volume PostgreSQL, uploads e .env em cofre separado.','Observabilidade recomendada: logs estruturados, métricas de pool, HTTP, fila e disco.'])
    add_heading(doc,'12.1 Estratégia de testes recomendada',2);bullets(doc,['Unitários: slug, tokens HMAC, sanitização, validações Zod e limitador.','Integração: repositories em PostgreSQL descartável; transações e constraints.','API: autenticação, autorização, CRUD, FTS, cursor, upload e newsletter.','E2E: portal→artigo→voltar; dashboard→publicar; troca de senha→sessões revogadas.','Carga: feed, artigo e FTS com dados representativos; observar p95/p99.','Segurança: XSS, upload polyglot, CSRF, sessão, brute force e dependências.'])
    add_heading(doc,'12.2 Evolução arquitetural',2);para(doc,'Quando o volume justificar, os primeiros passos são CDN para mídia/HTML público, armazenamento de objetos, Redis para rate limit/cache/fila, múltiplas réplicas stateless da API e réplica de leitura PostgreSQL. GraphQL, SSE ou webhooks devem entrar apenas com caso de uso medido: composição variável entre clientes, atualização realmente ao vivo ou integração orientada a eventos, respectivamente.')

    add_heading(doc,'13. Matriz de rastreabilidade',1)
    section_intro(doc,'Relacionar necessidades do produto às decisões e arquivos que as implementam.','Necessidade, mecanismo técnico e localização de referência.')
    trace=[('Busca precisa','documento_busca + GIN + websearch_to_tsquery','0007 / RepositorioPortal'),('Escala do feed','cursor + limite + IntersectionObserver','RepositorioPortal / Portal'),('SEO','slug, metadata, JSON-LD, sitemap, robots','0006 / app/publicacao'),('Métricas reais','hashes, filtros e unicidade diária','0003 / eventos_acesso'),('Segurança de sessão','token hash, cookie e revogação global','autenticacao / painel'),('Mídia leve','Sharp, WebP/JPEG, lazy/async','armazenamento-capas / sanitização'),('Newsletter','inscrição, fila, SMTP e HMAC','0005 / ServicoNewsletter'),('Configuração','env validado e configuração persistida','ambiente / configuracoes_portal')]
    add_table(doc,['Necessidade','Mecanismo','Implementação'],trace,[2200,4100,3060],8)

    add_heading(doc,'14. Glossário',1)
    section_intro(doc,'Uniformizar o vocabulário usado no código e neste manual.','Termos de busca, desempenho, sessão, SEO e segurança.')
    terms=[('FTS','Full-Text Search; indexação linguística de documentos.'),('GIN','Índice invertido do PostgreSQL adequado a tsvector.'),('Cursor','Marcador opaco do último item para paginação.'),('SSR','Renderização no servidor; importante para SEO e crawlers sociais.'),('Open Graph','Metadados usados em prévias de links.'),('JSON-LD','Dados estruturados serializados em JSON.'),('HMAC','Assinatura autenticada usada no cancelamento da newsletter.'),('HttpOnly','Cookie inacessível ao JavaScript.'),('SameSite','Restrição de envio de cookie entre sites.'),('LCP','Largest Contentful Paint; métrica de carregamento visual.')]
    add_table(doc,['Termo','Definição'],terms,[1800,7560],8)
    para(doc,'Fim da documentação. Este documento descreve o estado implementado na data de referência. Qualquer alteração de schema, rota, variável ou fluxo deve atualizar simultaneamente migrations, .env.example, README e esta documentação.')
    OUT.parent.mkdir(parents=True,exist_ok=True);doc.save(OUT);print(OUT)

if __name__=='__main__':build()
