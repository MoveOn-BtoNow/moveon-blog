import os, sys, re, json, textwrap
from pathlib import Path
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
SQL_OUT=ROOT/'documentacao'/'moveon_banco.sql'
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
    box(d,(1420,120,320,250),'PostgreSQL','<<Entidade>>',['20 tabelas','GIN Full-Text Search','Índices e integridade'],'#FFF8F6')
    arrow(d,(420,245),(520,245),'HTTP/JSON');arrow(d,(880,245),(980,245),'chama');arrow(d,(1340,245),(1420,245),'SQL')
    box(d,(300,520,380,230),'Armazenamento local','<<Infraestrutura>>',['capas WebP','social JPEG 1200×630','perfis WebP 512×512'])
    box(d,(820,520,380,230),'SMTP','<<Infraestrutura>>',['Nodemailer','fila persistente','cancelamento assinado'])
    box(d,(1320,520,380,230),'SEO e compartilhamento','<<Fronteira>>',['Open Graph/Twitter','JSON-LD BlogPosting','sitemap e robots'])
    arrow(d,(760,370),(500,520));arrow(d,(1120,370),(1010,520));arrow(d,(700,370),(1510,520))
    im.save(DIA/'arquitetura.png')

    im=Image.new('RGB',(2200,1500),'white');d=ImageDraw.Draw(im);d.text((50,25),'Diagrama de classes — visão completa por responsabilidade',font=font(34),fill='#111111')
    ui=[('Portal','busca, feed, filtros, newsletter'),('Login','credenciais e sessão'),('Painel','navegação administrativa'),('Editor','publicação e prévia'),('Compartilhamento','redes e métricas')]
    ctr=[('ControladorAutenticacao','entrar, sessão e bloqueio progressivo'),('ServicoAutenticacao','autenticar, obter, encerrar'),('LimitadorLogin','IP + identidade no PostgreSQL'),('ControladorPainel','CRUD, uploads e limpeza'),('ServicoNewsletter','Redis, SMTP e retentativas'),('ControladorContato','mensagens, resposta e SSE'),('RepositorioPortal','feed, FTS, eventos e reações'),('RepositorioIntegracoes','S3, GA4, LGPD e OTLP')]
    ent=[('Administrador','identidade e credenciais'),('SessaoAdministrativa','token e expiração'),('Publicacao','conteúdo, estado e SEO'),('Categoria','taxonomia e busca'),('Midia','arquivo associado'),('EventoAcesso','métrica confiável'),('InscricaoNewsletter','assinante'),('EnvioNewsletter','fila de entrega'),('ConfiguracaoPortal','identidade e integrações'),('MensagemContato','caixa de mensagens'),('ConsentimentoPrivacidade','decisão LGPD'),('BloqueioAutenticacao','bloqueio progressivo')]
    for i,(n,x) in enumerate(ui): box(d,(40+i*420,100,380,150),n,'<<Fronteira>>',[x],'#FFF8F6')
    for i,(n,x) in enumerate(ctr): box(d,(40+(i%4)*540,360+(i//4)*210,500,170),n,'<<Controle>>',[x],'#F7F8FA')
    for i,(n,x) in enumerate(ent): box(d,(40+(i%4)*540,850+(i//4)*200,500,155),n,'<<Entidade>>',[x],'#FFFDF8')
    for x in [230,650,1070,1490,1910]: arrow(d,(x,250),(x if x<2100 else 2000,360))
    arrow(d,(290,740),(290,850),'persiste');arrow(d,(830,740),(830,850),'persiste');arrow(d,(1370,740),(1370,850),'consulta');arrow(d,(1910,740),(1910,850),'persiste')
    im.save(DIA/'classes.png')

    # O modelo ER é mantido como artefato de arquitetura independente em
    # diagramas/modelo-ER.png. Ele não é sobrescrito pelo gerador.

    im=Image.new('RGB',(1800,950),'white');d=ImageDraw.Draw(im);d.text((50,25),'Casos de uso principais',font=font(36),fill='#111111')
    d.ellipse((60,350,280,570),fill='#FFF8F6',outline='#FE3000',width=4);d.text((103,430),'Leitor',font=font(30),fill='#111111')
    d.ellipse((1510,350,1740,570),fill='#FFF8F6',outline='#FE3000',width=4);d.text((1540,420),'Adminis-',font=font(25),fill='#111111');d.text((1545,455),'trador',font=font(25),fill='#111111')
    reader=['Consultar portal','Pesquisar e filtrar','Ler/reagir/compartilhar','Assinar/cancelar newsletter','Enviar contato','Gerir consentimento']
    admin=['Autenticar-se','Gerenciar conteúdo','Gerenciar parceiros','Tratar contatos','Configurar integrações','Editar textos legais','Gerir perfil e segurança']
    for i,t in enumerate(reader):
        y=100+i*125;d.ellipse((470,y,900,y+75),fill='white',outline='#777',width=2);d.text((520,y+22),t,font=font(20),fill='#222');arrow(d,(280,460),(470,y+38))
    for i,t in enumerate(admin):
        y=60+i*115;d.ellipse((960,y,1400,y+72),fill='white',outline='#777',width=2);d.text((1000,y+20),t,font=font(19),fill='#222');arrow(d,(1510,460),(1400,y+36))
    im.save(DIA/'casos-uso.png')

    im=Image.new('RGB',(1900,1080),'white');d=ImageDraw.Draw(im)
    d.text((55,25),'Integrações externas — visão para operação',font=font(36),fill='#111111')
    box(d,(60,135,400,240),'Pessoa visitante','<<Fronteira>>',['abre o portal','escolhe o consentimento','visualiza imagens e vídeos'],'#FFF8F6')
    box(d,(570,135,400,240),'Portal MOVE.ON','<<Controle>>',['aplica a escolha de privacidade','carrega a tag somente se permitido','entrega mídia privada com cache'],'#FFF8F6')
    box(d,(1080,80,360,210),'Google Analytics 4','<<Serviço externo>>',['recebe page_view autorizado','usa ID G-...','relatório em tempo real'],'#F7F8FA')
    box(d,(1080,340,360,210),'AWS S3 privado','<<Infraestrutura>>',['IAM Role na EC2','imagens e vídeos','sem chave no código'],'#F7F8FA')
    box(d,(1080,600,360,210),'Collector OTLP/HTTP','<<Observabilidade>>',['endpoint /v1/logs','lotes de logs','headers protegidos'],'#F7F8FA')
    box(d,(570,690,400,210),'PostgreSQL','<<Entidade>>',['configurações','URLs e metadados','segredos criptografados'],'#FFFDF8')
    arrow(d,(460,255),(570,255),'HTTPS');arrow(d,(970,210),(1080,185),'consentido');arrow(d,(970,290),(1080,445),'IAM Role');arrow(d,(970,345),(1080,705),'OTLP');arrow(d,(770,375),(770,690),'configuração')
    d.text((65,920),'Ideia central: o painel liga e configura cada serviço separadamente; o backend valida, protege segredos e testa a conexão.',font=font(22),fill='#333333')
    im.save(DIA/'integracoes.png')

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
def codeblock(doc,text):
    p=doc.add_paragraph()
    p.paragraph_format.space_before=Pt(4);p.paragraph_format.space_after=Pt(8)
    p.paragraph_format.left_indent=Inches(.18);p.paragraph_format.right_indent=Inches(.18)
    shd=OxmlElement('w:shd');shd.set(qn('w:fill'),'F4F5F7');p._p.get_or_add_pPr().append(shd)
    for i,line in enumerate(text.strip().splitlines()):
        if i:p.add_run().add_break()
        r=p.add_run(line);r.font.name='Consolas';r._element.get_or_add_rPr().rFonts.set(qn('w:ascii'),'Consolas');r.font.size=Pt(8);r.font.color.rgb=RGBColor(35,35,35)
    return p
def section_intro(doc,objective,contents):
    table=add_table(doc,['Objetivo desta seção','O que será apresentado'],[(objective,contents)],[3400,5960],8.5)
    for cell in table.rows[1].cells:set_cell_shading(cell,'FFF8F6')

def figure_guide(doc,rows):
    add_table(doc,['Elemento visual','Interpretação funcional'],rows,[2500,6860],8)

ENV=[
('NODE_ENV','Modo de execução: development, test ou production. Controla comportamento seguro e otimizações.'),('FUSO_HORARIO','Fuso operacional do portal, datas, métricas e PostgreSQL.'),('NOME_PORTAL','Nome institucional usado em interface, SEO e e-mails.'),('DESCRICAO_PORTAL','Descrição padrão do portal e metadados.'),('URL_PUBLICA_PORTAL','Origem canônica absoluta para SEO, compartilhamento e links da newsletter.'),('CAMINHO_LOGO','Logo padrão pública.'),('CAMINHO_FAVICON','Ícone padrão do navegador.'),('CAMINHO_IMAGEM_SOCIAL','Imagem social padrão quando a publicação não possui capa.'),('HOST_API','Interface de rede em que a API escuta.'),('PORTA_API','Porta HTTP da API Express.'),('URL_INTERNA_API','Endereço utilizado pelo frontend/proxy para alcançar a API.'),('ORIGENS_PERMITIDAS','Lista CORS de origens autorizadas.'),('LIMITE_CORPO_JSON','Limite do corpo JSON contra abuso de memória.'),('PASTA_UPLOADS','Diretório persistente de arquivos enviados.'),('MAX_IMAGEM_CAPA_MB','Limite de upload de imagem; o formato real ainda é validado e recomprimido.'),('MAX_VIDEO_MB','Limite de upload de vídeo antes do envio ao S3.'),('LIMPEZA_MIDIAS_ORFAS_HORAS','Carência antes de remover upload abandonado e não referenciado.'),('INTERVALO_LIMPEZA_MIDIAS_MINUTOS','Periodicidade da reconciliação de mídias locais/S3.'),('LIMITE_PUBLICACOES_DESTAQUE','Quantidade máxima de publicações mantidas em destaque.'),('EMAIL_ATIVO','Liga/desliga o processamento real dos envios.'),('SMTP_HOST','Servidor SMTP.'),('SMTP_PORTA','Porta SMTP.'),('SMTP_SEGURO','Ativa conexão TLS direta quando aplicável.'),('SMTP_USUARIO','Usuário SMTP; segredo.'),('SMTP_SENHA','Senha SMTP; segredo.'),('EMAIL_REMETENTE_NOME','Nome visível do remetente.'),('EMAIL_REMETENTE_ENDERECO','Endereço From dos e-mails.'),('EMAIL_SEGREDO_CANCELAMENTO','Segredo HMAC dos links de cancelamento.'),('MAX_CADASTROS_NEWSLETTER_POR_IP','Máximo de inscrições tentadas por origem na janela.'),('JANELA_NEWSLETTER_MINUTOS','Janela do limitador da newsletter.'),('NOME_COOKIE_VISITANTE','Cookie anônimo usado para reação e consentimento.'),('DURACAO_COOKIE_VISITANTE_DIAS','Validade da identidade anônima do visitante.'),('MAX_REACOES_POR_IP_HORA','Limite de alterações de reação por origem.'),('MAX_MENSAGENS_CONTATO_POR_IP_HORA','Limite de mensagens de contato por origem.'),('POSTGRES_IMAGEM','Tag da imagem Docker do PostgreSQL.'),('POSTGRES_CONTAINER','Nome do container.'),('POSTGRES_HOST','Interface publicada pelo Docker.'),('POSTGRES_PORTA','Porta exposta no host.'),('POSTGRES_PORTA_INTERNA','Porta interna do PostgreSQL.'),('POSTGRES_BANCO','Nome do banco.'),('POSTGRES_USUARIO','Usuário do banco; segredo operacional.'),('POSTGRES_SENHA','Senha do banco; segredo.'),('DATABASE_URL','String de conexão completa usada pela aplicação; segredo.'),('BANCO_MAX_CONEXOES','Tamanho máximo do pool.'),('BANCO_TEMPO_OCIOSO_MS','Tempo para liberar conexão ociosa.'),('BANCO_TEMPO_CONEXAO_MS','Timeout para abrir conexão.'),('REDIS_ATIVO','Habilita a fila Redis; há fallback persistente controlado.'),('REDIS_IMAGEM','Imagem Docker do Redis.'),('REDIS_CONTAINER','Nome isolado do container Redis.'),('REDIS_HOST','Interface local publicada para o Redis.'),('REDIS_PORTA','Porta do Redis no host.'),('REDIS_SENHA','Senha do Redis; segredo.'),('REDIS_URL','Conexão completa usada pelo backend; segredo.'),('REDIS_PREFIXO','Namespace das chaves e filas MOVE.ON.'),('NOME_COOKIE_SESSAO','Nome do cookie administrativo.'),('DURACAO_SESSAO_DIAS','Validade máxima da sessão.'),('COOKIE_SAMESITE','Política SameSite contra CSRF.'),('COOKIE_SEGURO','Exige HTTPS para envio do cookie em produção.'),('MAX_TENTATIVAS_LOGIN','Falhas necessárias para iniciar cada nível de bloqueio.'),('MAX_LOGINS_SIMULTANEOS_POR_IP','Limita verificações bcrypt concorrentes por origem.'),('JANELA_TENTATIVAS_MINUTOS','Janela de agrupamento de falhas.'),('BLOQUEIO_LOGIN_INICIAL_SEGUNDOS','Bloqueio inicial autoritativo aplicado pelo backend.'),('BLOQUEIO_LOGIN_MAX_DIAS','Teto do bloqueio progressivo persistido no PostgreSQL.'),('CUSTO_HASH_SENHA','Custo bcrypt.'),('ADMIN_NOME','Nome do administrador criado/atualizado pela semente.'),('ADMIN_EMAIL','E-mail inicial do administrador.'),('ADMIN_SENHA','Senha inicial; deve ser rotacionada.'),('CATEGORIAS_INICIAIS','Categorias inseridas pela semente.')]

TABLES={
'controle_migrations':[('nome','varchar(255), PK','Nome do arquivo aplicado'),('executada_em','timestamptz','Auditoria da execução')],
'administradores':[('id','uuid, PK','Identificador'),('nome','varchar(120)','Nome'),('email','varchar(254), UNIQUE','Login'),('senha_hash','varchar(255)','Hash bcrypt'),('ativo','boolean','Habilitação'),('ultimo_acesso_em','timestamptz','Último login'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('caminho_foto','varchar(500)','Foto WebP')],
'sessoes_administrativas':[('id','uuid, PK','Sessão'),('administrador_id','uuid, FK','Administrador'),('token_hash','char(64), UNIQUE','SHA-256 do token'),('endereco_ip_hash','char(64)','IP anonimizado'),('agente_usuario','varchar(500)','Cliente'),('expira_em','timestamptz','Expiração'),('revogada_em','timestamptz','Revogação'),('criada_em','timestamptz','Criação')],
'categorias':[('id','uuid, PK','Categoria'),('nome','varchar(80)','Nome'),('slug','varchar(100), UNIQUE','URL'),('descricao','varchar(300)','Descrição'),('ativa','boolean','Visibilidade'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('documento_busca','tsvector gerado','FTS português')],
'publicacoes':[('id','uuid, PK','Publicação'),('titulo','varchar(180)','Título'),('slug','varchar(200), UNIQUE','URL + hash curto'),('resumo','varchar(500)','Resumo'),('conteudo','jsonb','HTML higienizado'),('situacao','enum','rascunho/agendada/publicada/arquivada'),('destaque','boolean','Destaque'),('metatitulo','varchar(180)','SEO'),('metadescricao','varchar(320)','SEO'),('publicado_em','timestamptz','Publicação'),('agendado_para','timestamptz','Agendamento'),('administrador_id','uuid, FK','Responsável'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração'),('imagem_capa_url','varchar(1000)','Capa WebP/link'),('imagem_social_url','varchar(1000)','JPEG 1200×630'),('texto_alternativo_capa','varchar(300)','Acessibilidade/SEO'),('documento_busca','tsvector gerado','FTS ponderado')],
'publicacoes_categorias':[('publicacao_id','uuid, PK/FK','Publicação'),('categoria_id','uuid, PK/FK','Categoria')],
'midias':[('id','uuid, PK','Mídia'),('publicacao_id','uuid, FK','Publicação opcional'),('tipo','enum','imagem/vídeo/arquivo'),('nome_original','varchar(255)','Nome recebido'),('nome_armazenado','varchar(255), UNIQUE','Nome seguro'),('tipo_mime','varchar(100)','MIME'),('tamanho_bytes','bigint','Até 50 MiB'),('largura','integer','Pixels'),('altura','integer','Pixels'),('texto_alternativo','varchar(300)','Acessibilidade'),('ordem','integer','Ordenação'),('capa','boolean','Indica capa'),('criado_em','timestamptz','Criação')],
'configuracoes_portal':[
('id','smallint, PK=1','Registro único'),('nome','varchar(120)','Nome'),('descricao','varchar(300)','Descrição'),('caminho_logo','varchar(500)','Logo'),('caminho_favicon','varchar(500)','Favicon'),('atualizado_por','uuid, FK','Administrador'),('atualizado_em','timestamptz','Alteração'),('cor_primaria','varchar(7)','Cor principal'),('cor_fundo_claro','varchar(7)','Fundo claro'),('cor_fundo_escuro','varchar(7)','Fundo escuro'),('cor_texto_claro','varchar(7)','Texto claro'),('cor_texto_escuro','varchar(7)','Texto escuro'),('newsletter_assunto','varchar(180)','Assunto do modelo'),('newsletter_texto','text','Corpo do modelo'),('exibir_carrossel_parceiros','boolean','Carrossel de parceiros'),('exibir_quem_somos','boolean','Menu institucional'),('exibir_o_que_resolvemos','boolean','Menu de soluções'),('exibir_newsletter','boolean','Seção newsletter'),('exibir_redes_sociais','boolean','Botões sociais'),('instagram_url','varchar(1000)','Instagram'),('linkedin_url','varchar(1000)','LinkedIn'),('email_ativo','boolean','Envio SMTP'),('smtp_host','varchar(255)','Servidor SMTP'),('smtp_porta','integer','Porta SMTP'),('smtp_seguro','boolean','TLS direto'),('smtp_usuario','varchar(500)','Usuário SMTP'),('smtp_senha_criptografada','text','Senha cifrada'),('email_remetente_nome','varchar(180)','Nome do remetente'),('email_remetente_endereco','varchar(254)','Endereço remetente'),('email_segredo_cancelamento_criptografado','text','Segredo HMAC cifrado'),('exibir_contato','boolean','Página de contato'),('exibir_formulario_contato','boolean','Formulário público'),('contato_email','varchar(254)','E-mail institucional'),('contato_telefone','varchar(40)','Telefone'),('contato_whatsapp','varchar(40)','WhatsApp'),('contato_endereco','varchar(500)','Endereço'),('contato_horario','varchar(300)','Horário'),('encaminhar_contato_email','boolean','Encaminhamento SMTP'),('recaptcha_ativo','boolean','Proteção reCAPTCHA'),('recaptcha_chave_site','varchar(500)','Chave pública'),('recaptcha_chave_secreta_criptografada','text','Chave secreta cifrada'),('recaptcha_pontuacao_minima','numeric(3,2)','Limiar do reCAPTCHA'),('armazenamento_modo','varchar(10)','local ou s3'),('s3_endpoint','varchar(500)','Endpoint compatível'),('s3_regiao','varchar(100)','Região'),('s3_bucket','varchar(255)','Bucket'),('s3_autenticacao','varchar(20)','IAM Role ou chaves'),('s3_chave_acesso_criptografada','text','Access Key cifrada'),('s3_chave_secreta_criptografada','text','Secret Key cifrada'),('s3_url_publica','varchar(500)','URL/CDN'),('s3_forcar_path_style','boolean','Compatibilidade path-style'),('analytics_ativo','boolean','Ativa GA4'),('analytics_id_medicao','varchar(30)','ID de medição'),('consentimento_ativo','boolean','Banner de consentimento'),('politica_dados_texto','text','Resumo jurídico'),('permitir_analytics','boolean','Categoria análise'),('permitir_preferencias','boolean','Categoria preferências'),('permitir_marketing','boolean','Categoria marketing'),('otel_ativo','boolean','Exportação OTLP'),('otel_endpoint','varchar(500)','Endpoint /v1/logs'),('otel_cabecalhos_criptografados','text','Cabeçalhos cifrados'),('otel_nome_servico','varchar(120)','service.name'),('otel_nivel_minimo','varchar(10)','Nível mínimo'),('consentimento_titulo','varchar(180)','Título do banner'),('consentimento_texto_html','text','Texto rico do banner'),('politica_privacidade_html','text','Documento LGPD'),('termos_uso_html','text','Termos'),('conteudos_legais_atualizados_em','timestamptz','Versão dos textos'),('politica_privacidade_titulo','varchar(180)','Título privacidade'),('politica_privacidade_subtitulo','varchar(500)','Subtítulo privacidade'),('termos_uso_titulo','varchar(180)','Título termos'),('termos_uso_subtitulo','varchar(500)','Subtítulo termos')],
'eventos_acesso':[('id','bigint identity, PK','Evento'),('tipo','enum','visualização/compartilhamento/busca/categoria'),('publicacao_id','uuid, FK','Publicação'),('categoria_id','uuid, FK','Categoria'),('identificador_visitante_hash','char(64)','Visitante anonimizado'),('endereco_ip_hash','char(64)','IP anonimizado'),('agente_usuario','varchar(500)','Cliente'),('referencia','varchar(1000)','Contexto'),('dados','jsonb','Extensão'),('ocorrido_em','timestamptz','Horário'),('e_robo','boolean','Filtra robôs'),('e_administrador','boolean','Filtra equipe')],
'termos_busca':[('id','bigint identity, PK','Busca'),('termo','varchar(200)','Texto'),('identificador_visitante_hash','char(64)','Visitante'),('quantidade_resultados','integer','Resultados'),('pesquisado_em','timestamptz','Horário')],
'inscricoes_newsletter':[('id','uuid, PK','Inscrição'),('email','varchar(254), UNIQUE','Destinatário'),('confirmada','boolean','Estado'),('token_confirmacao_hash','char(64)','Confirmação'),('inscrito_em','timestamptz','Cadastro'),('cancelado_em','timestamptz','Opt-out')],
'envios_newsletter':[('id','bigint identity, PK','Envio'),('inscricao_id','uuid, FK','Inscrito'),('publicacao_id','uuid, FK','Publicação'),('situacao','varchar(20)','pendente/enviando/enviado/falhou'),('tentativas','smallint','Retentativas'),('erro','varchar(1000)','Falha'),('criado_em','timestamptz','Fila'),('enviado_em','timestamptz','Entrega')],
'parceiros':[('id','uuid, PK','Parceiro'),('nome','varchar(160)','Nome'),('caminho_logo','varchar(1000)','Logo'),('endereco_site','varchar(1000)','Site'),('ativo','boolean','Visibilidade'),('ordem','integer','Ordem'),('criado_em','timestamptz','Criação'),('atualizado_em','timestamptz','Alteração')],
'reacoes_publicacoes':[('id','bigint identity, PK','Reação'),('publicacao_id','uuid, FK','Publicação'),('identificador_visitante_hash','char(64)','Visitante'),('endereco_ip_hash','char(64)','Origem'),('agente_usuario','varchar(500)','Cliente'),('criado_em','timestamptz','Criação')],
'tentativas_reacoes_publicacoes':[('id','bigint identity, PK','Tentativa'),('endereco_ip_hash','char(64)','Origem'),('criado_em','timestamptz','Momento')],
'tentativas_autenticacao':[('id','bigint identity, PK','Auditoria'),('origem_hash','char(64)','Origem'),('identidade_hash','char(64)','Conta normalizada'),('sucesso','boolean','Resultado'),('ocorrido_em','timestamptz','Momento')],
'bloqueios_autenticacao':[('tipo','varchar(12), PK','origem/identidade'),('chave_hash','char(64), PK','Identificador protegido'),('falhas_acumuladas','integer','Falhas no nível'),('nivel_bloqueio','integer','Escalonamento'),('bloqueado_ate','timestamptz','Prazo autoritativo'),('ultima_falha_em','timestamptz','Última falha'),('atualizado_em','timestamptz','Alteração')],
'mensagens_contato':[('id','uuid, PK','Mensagem'),('nome','varchar(120)','Remetente'),('email','varchar(254)','E-mail'),('empresa','varchar(160)','Empresa'),('cargo','varchar(120)','Cargo'),('cliente_sap','varchar(10)','sim/não/não sei'),('assunto','varchar(180)','Assunto'),('mensagem','text','Conteúdo'),('situacao','varchar(12)','nova/lida/respondida/arquivada'),('ip_hash','char(64)','Origem'),('conteudo_hash','char(64)','Antiduplicação'),('agente_usuario','varchar(500)','Cliente'),('pontuacao_recaptcha','numeric(4,3)','Avaliação'),('criado_em','timestamptz','Recebimento'),('lido_em','timestamptz','Leitura'),('respondido_em','timestamptz','Resposta'),('arquivado_em','timestamptz','Arquivo'),('resposta','text','Resposta enviada'),('respondido_por','uuid, FK','Administrador'),('busca','tsvector gerado','FTS')],
'tentativas_contato':[('id','bigserial, PK','Tentativa'),('ip_hash','char(64)','Origem'),('aceito','boolean','Resultado'),('motivo','varchar(60)','Decisão'),('criado_em','timestamptz','Momento')],
'consentimentos_privacidade':[('id','bigserial, PK','Consentimento'),('visitante_hash','char(64)','Visitante'),('versao_politica','char(64)','Versão jurídica'),('analytics','boolean','Análise'),('preferencias','boolean','Preferências'),('marketing','boolean','Marketing'),('ip_hash','char(64)','Origem'),('agente_usuario','varchar(500)','Cliente'),('criado_em','timestamptz','Registro')],}

FUNCTIONS=[
('criarAplicacao','Monta Express, Helmet, CORS, validação de origem, JSON, estáticos, rotas e erros.'),('executarMigrations','Cria controle_migrations e aplica SQL pendente em ordem.'),('executarSemente','Insere/atualiza administrador, categorias e configuração inicial.'),('gerarTokenSeguro / gerarHashSha256','Cria tokens e identificadores protegidos.'),('higienizarConteudoHtml','Remove HTML perigoso e aplica regras seguras a links e mídia.'),('lerCookie / criarCookieSessao / criarCookieVisitante','Manipula cookies HttpOnly/Secure/SameSite.'),('exigirAutenticacao','Autoriza rotas administrativas por sessão persistida.'),('LimitadorLogin.consultar/registrarFalha','Mantém bloqueio progressivo transacional por origem e identidade.'),('armazenarCapa','Gera WebP editorial e JPEG social 1200×630.'),('armazenarFotoPerfil / armazenarLogo','Recomprime imagens e gera nomes UUID.'),('armazenarImagemConteudo / armazenarVideo','Salva mídia editorial local/S3 após validar magic bytes.'),('limparMidiasOrfas','Remove objetos não referenciados após carência, sem apagar arquivos compartilhados.'),('enviarObjeto / entregarObjeto / excluirObjeto','Opera S3 com IAM Role/chaves e rota privada.'),('criarSlug','Normaliza título e acrescenta hash aleatório curto.'),('generateMetadata','Gera canonical, Open Graph, Twitter e metadados do artigo.'),('sitemap / robots','Expõe descoberta e regras de indexação.'),('RepositorioPortal.listarPublicacoes','Executa FTS, categoria e paginação por cursor.'),('alternarReacao','Registra gostei único com proteção contra abuso.'),('eventosContato','Entrega notificações administrativas por SSE.'),('api','Cliente HTTP unificado, cookies e erros por campo.'),('EditorPublicacaoCompleto','CKEditor: links, cores, fontes, código, imagens e vídeos.'),('InscricaoNewsletter','Cadastro público com honeypot e limite.'),('Compartilhamento','WhatsApp, Instagram, LinkedIn, Facebook, X, Telegram, e-mail e Web Share.'),('configurarOpenTelemetry','Inicializa exportação OTLP em lote quando habilitada.'),('testarOpenTelemetry','Envia registro real ao Collector e retorna diagnóstico.')]

CLASSES=[
('ControladorAutenticacao','<<Controle>>','Login, consulta/logout, Retry-After e erros não enumeráveis.'),('ServicoAutenticacao','<<Controle>>','bcrypt uniforme, token, recuperação e encerramento.'),('RepositorioAutenticacao','<<Controle>>','SQL de administradores e sessões.'),('LimitadorLogin','<<Controle>>','Bloqueio progressivo persistente por origem e identidade.'),('ControladorPainel','<<Controle>>','CRUD, uploads, perfil, métricas, newsletter e parceiros.'),('RepositorioPainel','<<Controle>>','Transações, FTS administrativo e referências de mídia.'),('ControladorContato','<<Controle>>','Recebimento, consulta, estado, resposta e exclusão.'),('ServicoContato','<<Controle>>','Antiduplicação, limite, reCAPTCHA e SMTP.'),('RepositorioContato','<<Controle>>','Configuração, cursor e FTS das mensagens.'),('RepositorioPortal','<<Controle>>','Feed, cursor, FTS, artigo, eventos, reações e inscrição.'),('RepositorioIntegracoes','<<Controle>>','Storage, GA4, consentimento, legais e OTLP.'),('ControladorIntegracoes','<<Controle>>','Validação independente, segredos e testes.'),('ArmazenamentoObjetos','<<Controle>>','AWS S3, IAM Role/chaves, entrega e exclusão.'),('LimpezaMidiasServico','<<Controle>>','Reconcilia referências e objetos órfãos.'),('FilaRedis','<<Controle>>','Fila assíncrona e coordenação com fallback.'),('ExportadorOpenTelemetry','<<Controle>>','Agrupa logs e envia OTLP/HTTP.'),('ServicoNewsletter','<<Controle>>','Agenda, enfileira, envia e retenta e-mails.'),('Portal/Sobre/Solucoes/Contato','<<Fronteira>>','Páginas públicas responsivas e temáticas.'),('Login','<<Fronteira>>','Formulário acessível com contagem de bloqueio.'),('Painel','<<Fronteira>>','Shell e navegação administrativa.'),('PainelIntegracoes','<<Fronteira>>','Storage, GA4 e OTLP independentes.'),('PainelConteudoLegal','<<Fronteira>>','CKEditor para consentimento, privacidade e termos.'),('EditorPublicacaoCompleto','<<Fronteira>>','Conteúdo visual e mídia redimensionável.'),('Compartilhamento','<<Fronteira>>','Redes sociais, reação, topo e retorno.')]

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

def toc(doc):
    p=doc.add_paragraph();p.add_run('Sumário').bold=True;p.runs[0].font.size=Pt(18);p.runs[0].font.color.rgb=RGBColor.from_string(RED)
    para(doc,'1. Visão geral\n2. Arquitetura e decisões técnicas\n3. Casos de uso\n4. Diagrama e catálogo de classes\n5. Modelagem completa do banco\n6. Interface e funcionalidades\n7. Segurança e integrações\n8. Variáveis de ambiente\n9. Estrutura do projeto\n10. Rotas e contratos HTTP\n11. Catálogo de classes e funções\n12. Operação, implantação e manutenção\n13. Matriz de rastreabilidade\n14. Glossário\n15. SQL completo e histórico de migrations')

def gerar_sql_completo():
    partes=["-- MOVE.ON - esquema completo e histórico executável", "-- Gerado a partir das migrations 0001 a 0022.", "", "CREATE TABLE IF NOT EXISTS controle_migrations (", "  nome varchar(255) PRIMARY KEY,", "  executada_em timestamptz NOT NULL DEFAULT now()", ");", ""]
    for arquivo in sorted((ROOT/'migrations').glob('*.sql')):
        partes.extend([f"-- ==================================================", f"-- {arquivo.name}", f"-- ==================================================", arquivo.read_text(encoding='utf-8').strip(), ""])
    conteudo='\n'.join(partes).strip()+"\n"
    SQL_OUT.write_text(conteudo,encoding='utf-8')
    return conteudo

def build():
    gerar_sql_completo();make_diagrams();doc=Document();configure(doc)
    p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_before=Pt(72)
    p.add_run('DOCUMENTAÇÃO TÉCNICA').bold=True;p.runs[0].font.name='Arial';p.runs[0].font.size=Pt(14);p.runs[0].font.color.rgb=RGBColor.from_string(RED)
    p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;r=p.add_run('Portal de Conteúdo / Blog MOVE.ON');r.bold=True;r.font.name='Arial';r.font.size=Pt(30);r.font.color.rgb=RGBColor.from_string(BLACK)
    p=doc.add_paragraph('Arquitetura, requisitos, casos de uso, classes, banco de dados, segurança, operação e manutenção');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    if (ROOT/'public'/'logo.png').exists():add_picture(doc,ROOT/'public'/'logo.png',Inches(2.2),'Logotipo institucional MOVE.ON em vermelho.');doc.paragraphs[-1].alignment=WD_ALIGN_PARAGRAPH.CENTER
    p=doc.add_paragraph('\nVersão do documento: 2.0\nData de referência: 5 de setembro de 2026\nBase documental: código-fonte e schema efetivamente implementados');p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    pagebreak(doc);toc(doc);pagebreak(doc)

    add_heading(doc,'Controle e orientação do documento',1)
    section_intro(doc,'Estabelecer a finalidade, o público e os limites desta especificação.','Controle de versão, leitores esperados, fontes de verdade e convenções gráficas.')
    add_table(doc,['Item','Definição'],[
      ('Documento','Especificação Técnica do Portal de Conteúdo / Blog MOVE.ON'),
      ('Versão','2.0 — evolução integral do portal, segurança, integrações e dados'),
      ('Data de referência','5 de setembro de 2026'),
      ('Estado descrito','Implementação existente no repositório, migrations 0001 a 0022'),
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
    bullets(doc,['Páginas institucionais Quem Somos, O que resolvemos, Contato, Política de Privacidade e Termos de Uso.','Carrossel de parceiros administrável e desativável.','Caixa de contato com FTS, cursor, estados, resposta, arquivamento, exclusão, notificação SSE e encaminhamento SMTP.','Reações de gostei protegidas por visitante e limite de origem.','Storage local ou S3 com IAM Role/chaves, entrega privada, otimização e limpeza automática de órfãos.','Google Analytics 4 condicionado ao consentimento e logs OpenTelemetry via OTLP/HTTP.','Redis para fila assíncrona, PostgreSQL como fonte de verdade e proxy Caddy/NGINX escolhido sem invadir outras aplicações.'])
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
    add_picture(doc,DIA/'modelo-ER.png',Inches(6.5),'Modelo entidade-relacionamento completo e atualizado do PostgreSQL MOVE.ON.');caption(doc,'Figura 4 — Modelo ER oficial atualizado, incluindo entidades, atributos, chaves e relacionamentos.')
    figure_guide(doc,[
      ('administradores','Raiz do domínio administrativo; vincula sessões, publicações e alterações de configuração.'),
      ('publicacoes e categorias','Núcleo editorial ligado em N:N por publicacoes_categorias.'),
      ('eventos_acesso e termos_busca','Telemetria funcional e anonimizada para métricas e análise.'),
      ('inscricoes/envios_newsletter','Cadastro e fila persistente com rastreamento de tentativas.'),
      ('midias','Catálogo previsto para arquivos associados a publicações.'),
      ('controle_migrations','Registro técnico que impede reaplicação de alterações de schema.'),
      ('contato, reações e consentimentos','Entidades de relacionamento público, engajamento, LGPD e prevenção de abuso.'),
      ('bloqueios_autenticacao','Estado persistente do bloqueio progressivo por origem e identidade; não depende do navegador.')
    ])
    para(doc,'O banco utiliza UUID para entidades expostas, identity bigint para eventos/filas, timestamptz para consistência temporal, JSONB para conteúdo extensível, enums para estados fechados, FKs com políticas explícitas e índices parciais para caminhos críticos.')
    for name,cols in TABLES.items():
        add_heading(doc,f'5.{list(TABLES).index(name)+1} {name}',2)
        add_table(doc,['Coluna','Tipo/restrição','Finalidade'],cols,[2300,2500,4560],8)
    add_heading(doc,f'5.{len(TABLES)+1} Relacionamentos, índices, integridade e retenção',2)
    add_table(doc,['Origem','Destino','Cardinalidade','Política de exclusão'],[
      ('administradores','sessoes_administrativas','1:N','CASCADE'),('administradores','publicacoes','1:N','RESTRICT'),('administradores','configuracoes_portal','1:0..1','SET NULL'),('administradores','mensagens_contato','1:N respostas','SET NULL'),('publicacoes','publicacoes_categorias','1:N','CASCADE'),('categorias','publicacoes_categorias','1:N','RESTRICT'),('publicacoes','midias','1:N','CASCADE'),('publicacoes','eventos_acesso','1:N','SET NULL'),('categorias','eventos_acesso','1:N','SET NULL'),('publicacoes','envios_newsletter','1:N','CASCADE'),('inscricoes_newsletter','envios_newsletter','1:N','CASCADE'),('publicacoes','reacoes_publicacoes','1:N','CASCADE')
    ],[2500,3000,1700,2160],7.7)
    bullets(doc,['GIN em publicacoes.documento_busca, categorias.documento_busca e mensagens_contato.busca.','Índices por cursor em feed e mensagens evitam OFFSET crescente.','Unicidade diária impede visualizações duplicadas nas métricas.','Reação única combina publicação e visitante anônimo.','Bloqueios de autenticação possuem chave composta tipo + hash e índice de expiração.','Tabelas de tentativas sustentam auditoria e proteção contra abuso.','As URLs de mídia são referências; binários permanecem no storage local ou S3.'])

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
      ('Força bruta','Estado PostgreSQL por origem e identidade, limiar, concorrência e bcrypt.','Bloqueio progressivo de 60 s até o teto configurado em dias; cookies não o removem.'),
      ('Upload malicioso','Limite de bytes, magic bytes, recompressão e nome UUID.','Arquivo original não é servido diretamente.'),
      ('Falso positivo em métricas','Detecção de robô/admin e unicidade diária.','Indicadores refletem audiência pública válida.'),
      ('Sessão antiga após senha nova','Revogação global na mesma transação da senha.','Todos os dispositivos precisam autenticar novamente.')
    ],[1800,4800,2760],7.7)
    add_heading(doc,'7.2 Limites e recomendações de produção',2);bullets(doc,['COOKIE_SEGURO=true atrás de HTTPS.','Rotacionar ADMIN_SENHA, POSTGRES_SENHA, SMTP_SENHA e EMAIL_SEGREDO_CANCELAMENTO.','Persistir uploads em volume/backups ou armazenamento de objetos em escala horizontal.','Aplicar reverse proxy com TLS, compressão, rate limiting distribuído e CDN.','Monitorar fila, pool, latência, erros e espaço em disco.'])

    add_heading(doc,'7.3 Manual completo das integrações externas',2)
    section_intro(doc,'Explicar, em linguagem acessível, como armazenamento, medição de audiência e observabilidade se conectam ao portal.','Conceitos, decisões, configuração no dashboard, exemplos seguros, testes, mensagens de erro e procedimentos de recuperação.')
    para(doc,'As integrações ficam em Dashboard > Integrações. Cada serviço possui o próprio botão Salvar. Essa separação é intencional: salvar o armazenamento não altera o Google Analytics, e salvar o Analytics não altera o OpenTelemetry. Para uma pessoa não técnica, a melhor analogia é imaginar três tomadas independentes: uma guarda arquivos, outra mede visitas autorizadas e a terceira envia registros técnicos para a equipe de operação.')
    add_picture(doc,DIA/'integracoes.png',Inches(6.5),'Fluxo das integrações externas do MOVE.ON entre visitante, portal, Google Analytics, AWS S3, PostgreSQL e Collector OpenTelemetry.');caption(doc,'Figura 8 — Como as integrações externas se relacionam sem compartilhar responsabilidades ou segredos.')
    figure_guide(doc,[
      ('Pessoa visitante','Acessa o conteúdo, escolhe preferências de privacidade e recebe mídias públicas do portal.'),
      ('Portal MOVE.ON','Aplica regras, valida configurações e impede que o navegador receba credenciais administrativas.'),
      ('Google Analytics 4','Recebe somente eventos autorizados pela escolha de análise e desempenho.'),
      ('AWS S3 privado','Guarda imagens e vídeos; a IAM Role autoriza a EC2, não o navegador do visitante.'),
      ('Collector OTLP/HTTP','Recebe logs técnicos em lote para observabilidade interna.'),
      ('PostgreSQL','Guarda configurações, metadados e versões criptografadas de segredos; não guarda os arquivos S3.')
    ])

    add_heading(doc,'7.3.1 Armazenamento: local ou AWS S3',3)
    para(doc,'Armazenamento é o local físico ou lógico onde ficam imagens e vídeos. O PostgreSQL guarda informações como título, URL e relacionamento com a publicação, mas não deve receber o conteúdo binário de arquivos grandes. O MOVE.ON oferece dois modos para permitir uma implantação simples em uma única VPS e uma implantação escalável em nuvem.')
    add_table(doc,['Modo','Quando usar','Vantagem principal','Responsabilidade operacional'],[
      ('Storage local','Ambiente pequeno, homologação ou VPS única.','Configuração simples e sem serviço externo.','Fazer backup da pasta uploads e garantir espaço em disco.'),
      ('AWS S3 / compatível','Produção, grande volume, vídeos, múltiplas instâncias ou CDN.','Escala, durabilidade e separação entre aplicação e mídia.','Configurar bucket, acesso IAM, retenção, custo e entrega pública controlada.')
    ],[1700,2500,2400,2760],7.6)
    para(doc,'Escolher S3 no painel não move automaticamente arquivos locais antigos. A migration 0021 converte URLs diretas do bucket privado para a rota segura do portal quando a configuração já contém o bucket, mas uma migração entre provedores deve sempre ser planejada e conferida antes de apagar a origem.')

    add_heading(doc,'7.3.2 Campos do S3 explicados sem jargão',3)
    add_table(doc,['Campo','O que significa','Exemplo ou orientação'],[
      ('Modo','Escolhe se novos arquivos ficam na própria VPS ou em armazenamento de objetos.','AWS S3 / compatível para produção em EC2.'),
      ('Endpoint S3','Endereço alternativo usado por MinIO, Cloudflare R2 ou outro provedor compatível.','Na AWS oficial, deixar vazio.'),
      ('Região','Localidade AWS onde o bucket foi criado.','us-east-1, sa-east-1 etc. Deve ser exatamente a região do bucket.'),
      ('Bucket','Nome único do recipiente de arquivos. Não é o texto de exemplo do campo.','moveon-portal-media-prod.'),
      ('URL pública/CDN','Endereço opcional de CloudFront ou CDN usado pelos navegadores.','Deixar vazio enquanto o bucket privado for servido pelo backend.'),
      ('Autenticação','Forma como o backend prova à AWS que possui permissão.','IAM Role na EC2 ou Access Key + Secret Key.'),
      ('Forçar path-style','Formato antigo/compatível em que o bucket aparece no caminho da URL.','Desativado na AWS S3; ativar apenas se o provedor exigir.')
    ],[1900,4000,3460],7.7)

    add_heading(doc,'7.3.3 Modo recomendado: EC2 com IAM Role',3)
    para(doc,'IAM Role é uma identidade temporária entregue pela AWS à máquina EC2. Ela elimina a necessidade de copiar Access Key e Secret Key para o painel ou para o arquivo .env. O SDK renova as credenciais temporárias automaticamente. Isso reduz o risco de vazamento e facilita a revogação centralizada.')
    para(doc,'No dashboard, preencher assim: Modo = AWS S3 / compatível; Endpoint = vazio; Região = região real do bucket; Bucket = nome exato; URL pública/CDN = vazio enquanto não houver CDN; Autenticação = IAM Role / credenciais automáticas; Forçar path-style = desligado.')
    para(doc,'A função vinculada à EC2 precisa confiar no serviço ec2.amazonaws.com e possuir somente as permissões necessárias. Exemplo de política; substitua NOME-DO-BUCKET pelo nome real:')
    codeblock(doc,'''
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::NOME-DO-BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::NOME-DO-BUCKET/*"
    }
  ]
}''')
    para(doc,'Passo a passo na AWS: 1) abrir IAM e criar ou escolher uma Role para EC2; 2) anexar a política limitada ao bucket; 3) abrir EC2, selecionar a instância, usar Ações > Segurança > Modificar função do IAM; 4) escolher a Role; 5) aguardar a propagação; 6) reiniciar o serviço MOVE.ON; 7) testar um upload.')
    para(doc,'Verificação na VPS usando IMDSv2. O primeiro comando obtém um token temporário da própria EC2; o segundo deve mostrar o nome da Role associada:')
    codeblock(doc,'''
TOKEN=$(curl -fsS -X PUT \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" \
  http://169.254.169.254/latest/api/token)

curl -fsS \
  -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/''')
    para(doc,'Se aparecer “Could not load credentials from any providers”, o código tentou a cadeia padrão corretamente, mas a EC2 não forneceu uma identidade utilizável. Verifique se a Role está associada à instância certa, se a relação de confiança permite EC2, se o acesso ao serviço de metadados está habilitado e se a política cobre o bucket correto. Não resolva colocando chaves em código ou Git.')

    add_heading(doc,'7.3.4 Modo alternativo: Access Key e Secret Key',3)
    para(doc,'Esse modo existe para provedores compatíveis, servidores fora da AWS ou situações em que IAM Role não está disponível. O par deve pertencer a uma identidade dedicada, com permissão mínima e rotação periódica. Ao escolher o modo manual, clicar em Alterar credenciais e segredos, informar o par completo e salvar. Os valores são criptografados antes de ir ao PostgreSQL e não retornam ao navegador em consultas futuras.')
    bullets(doc,['Nunca usar a Access Key de uma conta root da AWS.','Nunca incluir chaves no README, em capturas, logs, commits ou mensagens de suporte.','Se houver suspeita de vazamento, desativar a chave na AWS, criar outra e atualizar o painel.','Ao mudar para IAM Role, o backend remove as chaves manuais anteriormente armazenadas.'])

    add_heading(doc,'7.3.5 Por que a URL direta do S3 pode mostrar 403',3)
    para(doc,'Uma URL como https://bucket.s3.amazonaws.com/capas/arquivo.webp pode existir e ainda responder 403 Forbidden. Isso não significa necessariamente que o caminho está errado. Significa que o navegador do visitante não possui a IAM Role da EC2. A IAM Role autoriza o backend, não torna o bucket público.')
    para(doc,'Quando URL pública/CDN fica vazia, o MOVE.ON grava e entrega novas mídias pela rota /api/portal/midias/:pasta/:arquivo. O backend valida a pasta e o nome, usa a IAM Role para ler o objeto e transmite o conteúdo com cache. Vídeos aceitam requisições Range, permitindo reprodução progressiva. A migration 0021 transforma URLs S3 antigas em URLs dessa rota segura.')
    codeblock(doc,'''
URL direta privada — pode responder 403:
https://bucket.s3.amazonaws.com/capas/arquivo.webp

URL entregue pelo portal:
https://portal.exemplo.com/api/portal/midias/capas/arquivo.webp''')
    para(doc,'Para tráfego elevado, a evolução recomendada é CloudFront ou outra CDN diante do bucket. Nesse cenário, configurar a distribuição com acesso privado à origem e informar o domínio da CDN em URL pública/CDN. Assim os visitantes recebem mídia pela borda, sem abrir escrita ou listagem pública no bucket e sem consumir a banda da EC2 para cada imagem.')

    add_heading(doc,'7.3.6 Ciclo de vida e prevenção de arquivos órfãos',3)
    para(doc,'Arquivo órfão é uma imagem ou vídeo que continua ocupando armazenamento depois que nenhuma publicação o utiliza. O MOVE.ON identifica capas, imagens sociais, imagens inseridas pelo CKEditor e vídeos gerenciados. Ao editar, mídias removidas do conteúdo são comparadas com a versão anterior. Ao excluir uma publicação, os arquivos são removidos antes do registro PostgreSQL.')
    bullets(doc,['Capas são convertidas para WebP e geram JPEG social 1200 × 630.','Imagens internas usam upload exclusivo e são convertidas para WebP, sem criar capa social desnecessária.','Vídeos S3 mantêm formato validado MP4, WebM ou MOV.','A exclusão aceita URLs antigas diretas do S3, URLs da CDN configurada e URLs da rota privada do portal.','Se o S3 estiver indisponível durante a exclusão, a publicação permanece no banco para uma nova tentativa; isso evita informar sucesso enquanto o arquivo permanece órfão.'])

    add_heading(doc,'7.3.7 Checklist de teste do armazenamento',3)
    bullets(doc,['Salvar apenas o card Armazenamento e confirmar a mensagem de sucesso.','Enviar uma capa e verificar se existem objetos nas pastas capas e sociais.','Inserir uma imagem no conteúdo e verificar a pasta conteudos.','Enviar um vídeo e verificar a pasta videos.','Abrir a prévia, o dashboard e a publicação pública; nenhuma imagem deve aparecer quebrada.','Abrir a rota /api/portal/midias/... e confirmar HTTP 200; para vídeo, confirmar HTTP 206 ao usar Range.','Editar a publicação, remover uma mídia e verificar sua exclusão.','Excluir uma publicação de teste e confirmar que capa, social, imagens internas e vídeos foram removidos.'])

    add_heading(doc,'7.3.8 Google Analytics 4: finalidade e privacidade',3)
    para(doc,'Google Analytics 4, ou GA4, ajuda a responder perguntas como quantas pessoas visitaram o portal, quais páginas foram vistas e como a navegação evolui. Ele não substitui as métricas internas do MOVE.ON: o painel próprio usa eventos controlados no PostgreSQL; o GA4 é uma visão externa complementar.')
    para(doc,'Por LGPD e pela política adotada, a tag não é carregada antes da autorização quando a gestão de consentimento está ativa. Isso significa que uma visita recusada não aparecerá no GA4. É um comportamento correto, não uma falha. O visitante pode aceitar tudo permitido, recusar opcionais ou personalizar Análise e desempenho, Preferências e Marketing.')
    add_table(doc,['Campo','Como configurar','Efeito'],[
      ('Habilitar Analytics','Ativar somente depois de criar o fluxo de dados Web no GA4.','Permite carregar a tag quando houver consentimento válido.'),
      ('ID de medição','Informar o código iniciado por G-, por exemplo G-ABCDEFGHIJ.','Identifica para qual propriedade os eventos serão enviados.'),
      ('Exibir gestão de consentimento','Manter ativo para apresentar escolhas ao visitante.','A tag permanece bloqueada até a decisão.'),
      ('Análise e desempenho','Ativar para oferecer a escolha de medição.','Autoriza page_view quando o visitante aceitar.'),
      ('Preferências','Ativar apenas se houver recursos opcionais que memorizem escolhas.','Registra a preferência declarada.'),
      ('Marketing','Ativar somente com finalidade jurídica e operacional definida.','Não deve ser habilitado apenas para “ter mais dados”.')
    ],[2000,4400,2960],7.7)
    para(doc,'Passo a passo: 1) no Google Analytics, criar ou escolher uma propriedade GA4; 2) criar um fluxo de dados Web para o domínio oficial; 3) copiar o ID G-...; 4) no dashboard, habilitar Analytics, colar o ID, habilitar gestão de consentimento e Análise e desempenho; 5) clicar em Salvar Google Analytics; 6) abrir o portal em janela anônima, sem bloqueador de anúncios; 7) aceitar os permitidos; 8) navegar por páginas; 9) conferir o relatório em tempo real.')
    para(doc,'A versão do consentimento inclui o estado do Analytics, o ID de medição e as permissões. Assim, ao ativar ou trocar a configuração, uma decisão antiga não é reutilizada silenciosamente. Após consentimento, o portal carrega gtag.js e envia page_view inicial e novas visualizações quando a URL muda.')
    codeblock(doc,'''
Verificações na aba Network do navegador:
https://www.googletagmanager.com/gtag/js?id=G-...
https://www.google-analytics.com/g/collect?...''')
    para(doc,'Se o GA4 mostrar “Nenhum dado foi recebido”, conferir: ID sem erro de digitação; Analytics e Análise habilitados; consentimento aceito; teste em janela anônima; bloqueador de anúncios desativado; DNS/firewall permitindo Google; chamadas gtag/js e g/collect na aba Network. Relatórios consolidados podem demorar; para teste funcional, usar a visão em tempo real.')

    add_heading(doc,'7.3.9 OpenTelemetry explicado para quem não é técnico',3)
    para(doc,'OpenTelemetry é um padrão aberto para enviar sinais de operação. Nesta versão, o MOVE.ON exporta logs do backend: registros estruturados sobre requisições, status HTTP, duração e eventos relevantes. O Collector é um serviço da equipe de infraestrutura que recebe esses registros e pode encaminhá-los para ferramentas como Grafana, Loki, Elastic, Datadog ou outra plataforma compatível.')
    para(doc,'A integração usa OTLP sobre HTTP. OTLP é o formato comum do OpenTelemetry; HTTP é o transporte. Para logs, o endereço deve terminar em /v1/logs. A porta convencional de OTLP/HTTP é 4318. A porta 4317 normalmente representa OTLP/gRPC e não deve ser usada neste campo.')
    add_table(doc,['Campo','Explicação simples','Exemplo'],[
      ('Habilitar exportação','Liga o envio em lote. Se desligado, a API continua funcionando sem exportar.','Ativo em produção quando houver Collector.'),
      ('Endpoint OTLP','Endereço completo que recebe logs HTTP.','https://collector.exemplo.com:4318/v1/logs'),
      ('Nome do serviço','Etiqueta para localizar os logs do portal entre vários sistemas.','moveon-portal'),
      ('Nível mínimo','Define a menor importância enviada.','Info em produção; Debug temporariamente em diagnóstico.'),
      ('Cabeçalhos OTLP','Informações extras exigidas pelo Collector, como autenticação ou tenant.','Authorization: Bearer TOKEN')
    ],[1900,4300,3160],7.7)
    add_heading(doc,'7.3.10 Níveis de log',3)
    add_table(doc,['Nível','Significado','Uso recomendado'],[
      ('Debug','Detalhe fino para investigação. Pode gerar grande volume.','Ativar por período curto durante diagnóstico.'),
      ('Info','Operação normal: requisições concluídas e eventos de configuração.','Padrão recomendado para produção.'),
      ('Warning','Situação inesperada que não interrompeu completamente o serviço.','Monitorar tendência e corrigir causas recorrentes.'),
      ('Error','Falha grave ou resposta HTTP 5xx.','Gerar alerta e investigação prioritária.')
    ],[1500,4500,3360],8)
    para(doc,'O filtro funciona por ordem de gravidade. Se o mínimo for Warning, logs Debug e Info não são enviados. Se o mínimo for Debug, todos os níveis são enviados, aumentando volume, custo e ruído.')

    add_heading(doc,'7.3.11 Cabeçalhos OTLP e proteção de segredos',3)
    para(doc,'Cada cabeçalho deve ocupar uma linha no formato Nome: valor. O painel bloqueia edição por padrão; clicar em Alterar cabeçalhos protegidos antes de modificar. Valores são criptografados no PostgreSQL e a API administrativa retorna apenas a indicação de que existem cabeçalhos configurados.')
    codeblock(doc,'''
Authorization: Bearer SEU_TOKEN
X-Scope-OrgID: moveon''')
    para(doc,'Cabeçalhos vazios, malformados ou perigosos, como Host, Content-Length, Connection, Transfer-Encoding e Cookie, são recusados. Não copie tokens para documentação, prints ou chamados. Para trocar um token, gere outro no sistema de observabilidade, salve no painel e revogue o anterior.')

    add_heading(doc,'7.3.12 Como salvar e testar OpenTelemetry',3)
    para(doc,'Ao clicar em Salvar OpenTelemetry com a exportação ativa, o backend persiste a configuração, reinicializa o provedor e realiza uma entrega OTLP real. O teste envia um log informativo chamado opentelemetry_conexao_verificada, com o atributo moveon.verificacao=true. Somente uma resposta HTTP 2xx é considerada sucesso.')
    para(doc,'O botão Testar conexão OTLP repete a prova sem alterar campos. Ele mostra o status HTTP e a duração, por exemplo: “Log entregue com sucesso (HTTP 200, 84 ms)”. Procure o registro no destino filtrando service.name=moveon-portal e o corpo opentelemetry_conexao_verificada.')
    codeblock(doc,'''
Endpoint correto:
https://collector.exemplo.com:4318/v1/logs

Mensagem esperada no painel:
Configuração salva e entrega OTLP confirmada.''')
    para(doc,'Os logs normais são processados em lote para reduzir consumo de rede e CPU. Desabilitar a exportação encerra o provedor de forma controlada. Se o Collector ficar indisponível depois da configuração, a API continua atendendo usuários; a observabilidade não deve derrubar o portal.')

    add_heading(doc,'7.3.13 Diagnóstico do OpenTelemetry',3)
    add_table(doc,['Sintoma','Causa provável','Como corrigir'],[
      ('Endpoint deve terminar com /v1/logs','Foi usada a raiz do Collector ou endpoint gRPC.','Usar a URL OTLP/HTTP completa, geralmente porta 4318 + /v1/logs.'),
      ('HTTP 401 ou 403','Token ausente, inválido ou sem permissão.','Revisar Authorization e permissões no Collector.'),
      ('HTTP 404','Caminho incorreto ou receiver OTLP HTTP desativado.','Ativar receiver otlp/http e conferir /v1/logs.'),
      ('HTTP 429','Collector ou destino aplicou limite de ingestão.','Reduzir Debug, revisar capacidade e políticas de lote.'),
      ('HTTP 5xx','Collector recebeu a chamada, mas falhou internamente.','Consultar logs do Collector e do backend de observabilidade.'),
      ('Timeout após 10 segundos','Rede, DNS, firewall, proxy ou Collector indisponível.','Testar conectividade a partir da VPS e liberar saída/entrada necessárias.'),
      ('Teste funciona, mas não encontro o log','Pipeline posterior filtrou, transformou ou enviou a outro tenant.','Buscar por service.name, corpo do teste e X-Scope-OrgID; revisar exporters do Collector.')
    ],[2200,3300,3860],7.5)
    para(doc,'Exemplo mínimo de Collector para receber OTLP/HTTP e escrever no próprio console. É apenas uma referência de laboratório; em produção, a equipe interna deve configurar autenticação, TLS, filas e o exporter corporativo:')
    codeblock(doc,'''
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

exporters:
  debug:
    verbosity: detailed

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug]''')
    add_heading(doc,'7.3.14 Checklist operacional das integrações',3)
    add_table(doc,['Integração','Antes de ativar','Prova de funcionamento','Plano de recuperação'],[
      ('S3','Bucket, região, IAM Role/política e estratégia de entrega.','Upload, HTTP 200 pela rota do portal, edição e exclusão testadas.','Voltar temporariamente ao local para novos uploads sem apagar o bucket; corrigir IAM.'),
      ('Google Analytics','Propriedade, fluxo Web, ID G-..., texto jurídico e consentimento.','Aceitar em janela anônima e observar gtag/js, g/collect e tempo real.','Desabilitar Analytics; o portal continua e as métricas internas permanecem.'),
      ('OpenTelemetry','Collector OTLP/HTTP, /v1/logs, TLS, token, tenant e retenção.','Botão de teste retorna HTTP 2xx e log aparece pelo service.name.','Desabilitar exportação; investigar Collector sem interromper o portal.')
    ],[1700,2900,2900,1860],7.4)

    add_heading(doc,'8. Variáveis de ambiente',1)
    section_intro(doc,'Centralizar configuração mutável e separar segredos do código.','Catálogo completo, finalidade, impacto operacional e cuidados de produção.')
    para(doc,'As configurações operacionais de inicialização ficam em .env. O arquivo .env.example documenta chaves sem expor valores reais. Segredos nunca devem ser incluídos em logs, commits ou documentação compartilhada. As integrações que o administrador altera pelo Dashboard — Storage, Google Analytics e OpenTelemetry — ficam no PostgreSQL; valores realmente secretos, como chaves manuais do S3 e cabeçalhos OTLP, são armazenados criptografados e nunca retornam em texto aberto ao navegador. Quando o S3 usa IAM Role, não existe Access Key ou Secret Key no .env: a própria EC2 fornece credenciais temporárias e rotativas à aplicação.')
    add_table(doc,['Variável','Finalidade e importância'],ENV,[2750,6610],8)

    add_heading(doc,'9. Estrutura do projeto',1)
    section_intro(doc,'Orientar desenvolvedores sobre onde localizar e alterar cada responsabilidade.','Pastas, módulos, fluxo de execução e fronteiras de manutenção.')
    structure=[('app/','Rotas e fronteiras React/Vinext; portal, admin, artigo, SEO, robots e sitemap.'),('backend/configuracoes/','Validação central do ambiente.'),('backend/compartilhado/','Cookies, autenticação obrigatória, erros, criptografia e sanitização.'),('backend/infraestrutura/banco/','Pool, migrations e semente.'),('backend/infraestrutura/observabilidade/','Logs estruturados e exportação OpenTelemetry por OTLP/HTTP.'),('backend/modulos/autenticacao/','Login, sessão, limite e persistência.'),('backend/modulos/integracoes/','Configuração independente de Storage, GA4, consentimento e OpenTelemetry.'),('backend/modulos/painel/','CRUD, métricas, configurações, uploads e administrador.'),('backend/modulos/portal/','Feed, FTS, artigos, eventos, mídia privada e inscrições.'),('backend/modulos/newsletter/','Fila, SMTP e cancelamento.'),('backend/modulos/saude/','Health check.'),('migrations/','Evolução incremental do PostgreSQL.'),('scripts/','Instalação, migration e seed.'),('uploads/','Arquivos gerenciados por tipo no modo local.'),('public/','Logo, favicon e imagem social padrão.'),('documentacao/','Artefatos, diagramas, capturas e documento final.')]
    add_table(doc,['Caminho','Responsabilidade'],structure,[3000,6360],8)
    add_heading(doc,'9.1 Fluxo de execução',2);bullets(doc,['npm run dev inicia portal e API simultaneamente.','A API abre pool PostgreSQL e worker periódico da newsletter.','Vite encaminha /api e /uploads para a API no desenvolvimento.','Docker Compose mantém PostgreSQL em volume nomeado.','migrar.ts aplica somente migrations ainda não registradas.','semear.ts atualiza dados iniciais de forma repetível.'])

    add_heading(doc,'10. Rotas e contratos HTTP',1)
    section_intro(doc,'Catalogar a superfície da API e seus requisitos de acesso.','Métodos, caminhos, autenticação, finalidade, respostas e regras transversais.')
    endpoints=[('GET','/api/saude','Público','Saúde e banco'),('POST','/api/autenticacao/entrar','Público','Cria sessão ou devolve bloqueio progressivo'),('GET','/api/autenticacao/sessao','Cookie','Consulta sessão'),('POST','/api/autenticacao/sair','Cookie','Revoga sessão'),('GET','/api/portal/inicial','Público','Configuração, categorias, parceiros e lote'),('GET','/api/portal/publicacoes','Público','FTS/categoria/cursor'),('GET','/api/portal/publicacoes/:slug','Público','Artigo publicado'),('GET','/api/portal/midias/:pasta/:arquivo','Público controlado','Entrega objeto privado do S3'),('GET/POST','/api/portal/reacoes/:publicacaoId','Público protegido','Consulta/alterna gostei'),('GET','/api/portal/contato/configuracao','Público','Configuração pública de contato'),('POST','/api/portal/contato/mensagens','Público protegido','Envia contato validado'),('GET','/api/portal/privacidade/configuracao','Público','Preferências e texto de consentimento'),('POST','/api/portal/privacidade/consentimento','Público','Registra escolha do visitante'),('POST','/api/portal/eventos','Público','Métrica validada'),('POST','/api/portal/newsletter','Público limitado','Inscrição'),('GET','/api/portal/newsletter/cancelar','Token','Cancelamento'),('GET/POST/PUT/DELETE','/api/painel/publicacoes','Admin','CRUD e cursor'),('GET/POST/PUT/DELETE','/api/painel/categorias','Admin','CRUD'),('GET/POST/PUT/DELETE','/api/painel/parceiros','Admin','CRUD e exibição'),('POST','/api/painel/uploads/capas','Admin','Capa + imagem social'),('POST','/api/painel/uploads/imagens-conteudo','Admin','Imagem do editor'),('POST','/api/painel/uploads/videos','Admin','Vídeo S3'),('POST','/api/painel/uploads/logos','Admin','Logo otimizada'),('POST','/api/painel/uploads/perfil','Admin','Perfil otimizado'),('GET','/api/painel/metricas','Admin','Métricas'),('GET/PUT','/api/painel/configuracoes','Admin','Identidade e navegação'),('GET/PUT','/api/painel/administrador','Admin','Perfil, e-mail e senha'),('GET/DELETE','/api/painel/newsletter','Admin','Inscritos'),('GET/PUT','/api/painel/newsletter-modelo','Admin','Modelo e SMTP'),('GET/PUT','/api/painel/contato/configuracao','Admin','Configuração de contato'),('GET/PATCH/DELETE','/api/painel/contato/mensagens/:id','Admin','Caixa de mensagens'),('POST','/api/painel/contato/mensagens/:id/responder','Admin','Resposta SMTP'),('GET','/api/painel/contato/eventos','Admin/SSE','Notificação em tempo real'),('GET','/api/painel/integracoes','Admin','Consulta sem revelar segredos'),('PUT','/api/painel/integracoes/armazenamento','Admin','Salva Storage'),('PUT','/api/painel/integracoes/analytics','Admin','Salva GA4'),('PUT','/api/painel/integracoes/opentelemetry','Admin','Salva OpenTelemetry'),('POST','/api/painel/integracoes/opentelemetry/testar','Admin','Teste real OTLP'),('GET/PUT','/api/painel/conteudos-legais/*','Admin','Consentimento, privacidade e termos')]
    add_table(doc,['Método','Rota','Acesso','Finalidade'],endpoints,[1350,3700,1300,3010],7.5)
    add_heading(doc,'10.1 Regras transversais dos contratos',2)
    bullets(doc,['Todas as rotas administrativas passam por exigirAutenticacao.','Corpos JSON respeitam LIMITE_CORPO_JSON e validação estrita.','Uploads usam multipart, um arquivo por requisição e limite configurado.','Erros retornam mensagem pública sem detalhes internos ou credenciais.','Listagens públicas usam limite máximo e cursor; newsletter administrativa usa paginação.','Conteúdo público recebe cabeçalhos de cache coerentes; sessão e busca dinâmica usam no-store.'])

    add_heading(doc,'11. Catálogo de classes e funções',1);para(doc,'Esta seção relaciona os elementos executáveis relevantes. Métodos CRUD individuais aparecem nas classes de controle e repositório; funções de interface aparecem como fronteiras.')
    section_intro(doc,'Permitir localizar rapidamente a regra responsável por cada comportamento.','Funções compartilhadas, classes backend, componentes frontend e efeitos colaterais.')
    add_table(doc,['Função/módulo','Descrição'],FUNCTIONS,[3100,6260],8)
    detailed=[('RepositorioPainel','CRUD editorial, parceiros, categorias, métricas, identidade, administrador, newsletter e verificação de referências de mídia.'),('ControladorPainel','Validação, sanitização, upload, exclusão segura, destaque limitado, perfil/e-mail/senha e fila.'),('LimpezaMidiasServico','Compara objetos locais/S3 com referências PostgreSQL e remove somente órfãos UUID após carência configurada.'),('RepositorioIntegracoes','Storage, GA4, consentimento, textos legais e OpenTelemetry; segredos permanecem cifrados.'),('ControladorIntegracoes','Formulários independentes, validação por campo, consentimento público e teste OTLP.'),('ArmazenamentoObjetos','Put/Get/Head/List/Delete S3, IAM Role/chaves, rota privada, cache e normalização de chave.'),('ExportadorOpenTelemetry','Lotes OTLP/HTTP, nível mínimo, flush, timeout, reinicialização e diagnóstico.'),('RepositorioPortal','Inicial, feed FTS/cursor, artigo, métricas, reações e newsletter.'),('Repositorio/Servico/ControladorContato','Configuração, antiduplicação, reCAPTCHA, FTS, cursor, estados, SSE, resposta e encaminhamento SMTP.'),('LimitadorLogin','Bloqueio transacional por origem e identidade: 60 s, 5 min, 15 min, 1 h, 6 h, 1 dia, 3 dias e teto configurável.'),('RepositorioAutenticacao','Conta ativa, sessão, token hash, expiração, revogação e último acesso.'),('ServicoAutenticacao','bcrypt real/fictício, token seguro e ciclo de sessão.'),('ServicoNewsletter','Agendamento, Redis, fila PostgreSQL, SMTP, retentativas e cancelamento HMAC.'),('Fronteiras React','Portal, Sobre, Soluções, Contato, Artigo, páginas legais, Login, Painel, CKEditor, integrações, parceiros, caixa de contato e métricas.')]
    add_table(doc,['Classe/grupo','Métodos e comportamento'],detailed,[2600,6760],8)

    add_heading(doc,'12. Operação, testes e manutenção',1)
    section_intro(doc,'Definir como preparar, validar, executar e evoluir a aplicação com segurança.','Comandos, backup, observabilidade, testes, implantação e critérios de evolução.')
    bullets(doc,['Desenvolvimento: npm run dev.','Banco: npm run banco:subir; npm run banco:migrar; npm run banco:semear.','Validação: npm run tipos e npm run build.','Produção: configurar .env, HTTPS/reverse proxy, banco/volume e executar start:producao.','Backup: volume PostgreSQL, uploads e .env em cofre separado.','Observabilidade recomendada: logs estruturados, métricas de pool, HTTP, fila e disco.'])
    add_heading(doc,'12.1 Estratégia de testes recomendada',2);bullets(doc,['Unitários: slug, tokens HMAC, sanitização, validações Zod e limitador.','Integração: repositories em PostgreSQL descartável; transações e constraints.','API: autenticação, autorização, CRUD, FTS, cursor, upload e newsletter.','E2E: portal→artigo→voltar; dashboard→publicar; troca de senha→sessões revogadas.','Carga: feed, artigo e FTS com dados representativos; observar p95/p99.','Segurança: XSS, upload polyglot, CSRF, sessão, brute force e dependências.'])
    add_heading(doc,'12.2 Implantação idempotente e proxy',2);para(doc,'O instalador preserva .env e segredos, reaplica somente migrations pendentes, evita reinstalar dependências sem mudança, sobe PostgreSQL/Redis com restart unless-stopped, instala moveon.service com Restart=always e valida saúde local. Em VPS sem proxy, a preferência é NGINX com Certbot. Se Caddy já controla 80/443, o instalador usa um bloco isolado para não derrubar outros sites. Uma migração total Caddy→NGINX exige inventário de todos os domínios e não é executada de forma destrutiva pelo portal.')
    add_heading(doc,'12.3 Evolução arquitetural',2);para(doc,'S3 e Redis já estão disponíveis. Próximos passos orientados por métricas incluem CDN para mídia/HTML, múltiplas réplicas stateless da API, rate limit distribuído e réplica de leitura PostgreSQL. GraphQL ou webhooks só devem entrar com caso de uso medido; SSE já é usado de forma restrita para notificações administrativas de contato.')

    add_heading(doc,'13. Matriz de rastreabilidade',1)
    section_intro(doc,'Relacionar necessidades do produto às decisões e arquivos que as implementam.','Necessidade, mecanismo técnico e localização de referência.')
    trace=[('Busca precisa','tsvector + GIN + websearch_to_tsquery','0007 / portal / contato'),('Escala do feed','cursor + limite + IntersectionObserver','RepositorioPortal / Portal'),('SEO','slug, metadata, JSON-LD, sitemap, robots','0006 / app/publicacao'),('Métricas reais','hashes, filtros e unicidade diária','0003 / eventos_acesso'),('Segurança de sessão','token hash, cookie, revogação e bloqueio progressivo','autenticacao / 0013 / 0022'),('Mídia leve','Sharp, WebP/JPEG, S3 e limpeza de órfãos','armazenamento / limpeza-midias'),('Storage escalável','S3, IAM Role, mídia privada e referências','integracoes / 0020 / 0021'),('Analytics com privacidade','GA4 somente após consentimento','ConsentimentoDados / 0015'),('Observabilidade','OTLP/HTTP em lote, níveis e teste real','observabilidade / integracoes'),('Newsletter','Redis, PostgreSQL, SMTP e HMAC','0005 / fila-redis / newsletter'),('Contato','reCAPTCHA, FTS, cursor, SSE e SMTP','0014 / modulo contato'),('Configuração','env validado e configuração persistida','ambiente / configuracoes_portal')]
    add_table(doc,['Necessidade','Mecanismo','Implementação'],trace,[2200,4100,3060],8)

    add_heading(doc,'14. Glossário',1)
    section_intro(doc,'Uniformizar o vocabulário usado no código e neste manual.','Termos de busca, desempenho, sessão, SEO e segurança.')
    terms=[('FTS','Full-Text Search; indexação linguística de documentos.'),('GIN','Índice invertido do PostgreSQL adequado a tsvector.'),('Cursor','Marcador opaco do último item para paginação.'),('SSR','Renderização no servidor; importante para SEO e crawlers sociais.'),('Open Graph','Metadados usados em prévias de links.'),('JSON-LD','Dados estruturados serializados em JSON.'),('HMAC','Assinatura autenticada usada no cancelamento da newsletter.'),('HttpOnly','Cookie inacessível ao JavaScript.'),('SameSite','Restrição de envio de cookie entre sites.'),('LCP','Largest Contentful Paint; métrica de carregamento visual.'),('S3','Serviço de armazenamento de objetos; guarda arquivos fora do disco da aplicação.'),('Bucket','Contêiner lógico do S3, semelhante a uma pasta principal com políticas próprias.'),('IAM Role','Identidade atribuída à EC2 que fornece credenciais temporárias sem senha fixa no código.'),('CDN','Rede que aproxima cópias de arquivos dos visitantes e reduz latência e tráfego na aplicação.'),('GA4','Google Analytics 4; serviço de métricas de navegação.'),('Consentimento','Escolha registrada do visitante sobre categorias de tratamento e medição.'),('OpenTelemetry','Padrão aberto para produzir e transportar logs, métricas e rastros.'),('OTLP','Protocolo do OpenTelemetry usado para enviar telemetria.'),('Collector','Serviço intermediário que recebe OTLP e encaminha para a plataforma de observabilidade.'),('IMDSv2','Serviço seguro de metadados da EC2 usado pelo SDK para obter a IAM Role.')]
    add_table(doc,['Termo','Definição'],terms,[1800,7560],8)
    add_heading(doc,'15. SQL completo e histórico de migrations',1)
    section_intro(doc,'Disponibilizar uma referência executável e auditável de todo o schema.','Tabela de controle e conteúdo integral das migrations 0001 a 0022, na ordem aplicada pelo backend.')
    para(doc,'O arquivo documentacao/moveon_banco.sql é gerado da mesma fonte usada pela aplicação. Em uma instalação normal, utilize npm run banco:migrar; não execute trechos isolados manualmente em produção. O conteúdo abaixo é reproduzido integralmente para auditoria, recuperação e entendimento dos tipos, tabelas, índices, constraints, dados iniciais e relacionamentos.')
    codeblock(doc,'CREATE TABLE IF NOT EXISTS controle_migrations (\n  nome varchar(255) PRIMARY KEY,\n  executada_em timestamptz NOT NULL DEFAULT now()\n);')
    for indice, arquivo in enumerate(sorted((ROOT/'migrations').glob('*.sql')), start=1):
        add_heading(doc,f'15.{indice} {arquivo.name}',2)
        codeblock(doc,arquivo.read_text(encoding='utf-8').strip())
    para(doc,'Fim da documentação. Este documento descreve o estado implementado na data de referência. Qualquer alteração de schema, rota, variável ou fluxo deve atualizar simultaneamente migrations, .env.example, README e esta documentação.')
    OUT.parent.mkdir(parents=True,exist_ok=True);doc.save(OUT);print(OUT)

if __name__=='__main__':build()
