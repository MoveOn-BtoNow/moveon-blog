# Portal MOVE.ON

Portal de conteúdo com interface pública, dashboard autenticado, PostgreSQL, métricas reais e upload seguro de imagens.

## Instalação automática no Ubuntu Server

Na raiz do projeto, execute:

```bash
chmod +x scripts/instalar.sh
./scripts/instalar.sh https://blog.seudominio.com.br
```

Sem argumento, o instalador pergunta o domínio e sugere o valor já salvo em `.env`.

O instalador configura Docker, Node.js 22, dependências bloqueadas pelo `package-lock.json`, `.env`, senhas aleatórias, PostgreSQL, Redis, migrations, seeders, testes, build, Caddy e HTTPS automático. Ele é idempotente: preserva o `.env` e seus segredos, cria backup antes de ajustes, reaplica somente migrations pendentes, evita reinstalar dependências inalteradas e repara serviços e configurações gerenciadas pelo projeto.

O Caddy é o único proxy configurado pelo instalador. Em uma VPS com as portas 80/443 livres, ele é instalado e habilitado automaticamente. Se o Caddy já estiver ativo, o instalador acrescenta somente um bloco MOVE.ON delimitado ao Caddyfile existente e preserva os demais domínios. Se outro serviço ocupar 80/443, a instalação é interrompida sem parar nem alterar esse serviço.

No Caddy, `/api` e `/uploads` são encaminhados para o backend em `127.0.0.1:3001`; as demais rotas seguem para o portal em `127.0.0.1:3000`. A instalação só conclui depois de validar portal e API através do HTTPS do próprio domínio.

PostgreSQL e Redis utilizam `restart: unless-stopped`. Portal e API são instalados como `moveon.service`, habilitado no boot e configurado com `Restart=always`. O Caddy também é habilitado no boot e gerencia automaticamente a emissão e a renovação do certificado. Assim, a plataforma volta a operar após reinicialização ou falha inesperada.

Gerenciamento e logs do serviço:

```bash
sudo systemctl status moveon
sudo systemctl restart moveon
sudo systemctl stop moveon
sudo systemctl start moveon
sudo journalctl -u moveon -f
sudo systemctl is-enabled moveon
```

## Instalação local

Requisitos: Node.js 22+, Docker e Docker Compose.

```bash
cp .env.example .env
npm install
npm run banco:preparar
npm run dev
```

- Portal: `http://localhost:3000`
- Administração: `http://localhost:3000/admin`
- API: `http://127.0.0.1:3001`
- PostgreSQL: database `moveon`, schema `public`, porta `5434`
- Redis: somente em `127.0.0.1:6380`, protegido por senha

## Comandos

- `npm run dev`: portal e API em desenvolvimento.
- `npm run start:producao`: portal e API compilados.
- `npm run verificar`: tipos e build.
- `npm run banco:preparar`: sobe PostgreSQL, aplica migrations e seeder.
- `npm run banco:migrar`: aplica somente migrations pendentes.
- `npm run banco:semear`: atualiza administrador, categorias e configurações iniciais.
- `npm run banco:parar`: encerra os containers.

## Variáveis e segurança

Todas as configurações mutáveis e segredos ficam no `.env`, que não deve ser versionado. Em produção, use HTTPS e defina `COOKIE_SEGURO=true`. Senhas usam bcrypt; sessões usam cookie HttpOnly e token com hash; entradas são validadas no backend; HTML é higienizado; imagens são verificadas pelo conteúdo real, formato e tamanho. Métricas descartam robôs, administradores e visualizações diárias duplicadas.

`LIMITE_PUBLICACOES_DESTAQUE` define quantas publicações podem permanecer simultaneamente no carrossel principal. Ao atingir o limite, o backend remove automaticamente do destaque as publicações mais antigas.

Uploads são armazenados em `uploads/capas` e `uploads/perfis`; faça backup dessas pastas junto ao volume PostgreSQL `moveon_dados`.

## Storage, Analytics e observabilidade

Em **Dashboard > Integrações**, o portal oferece duas alternativas:

- **Storage local:** imagens permanecem em `uploads/`. É simples para uma VPS, mas exige backup do disco e sincronização própria ao escalar.
- **Object Storage S3:** imagens otimizadas e vídeos ficam no bucket; o PostgreSQL mantém somente URLs e metadados. É a opção recomendada para produção, CDN, grande volume de mídia e múltiplas instâncias. Funciona com AWS S3 e provedores compatíveis por endpoint e `path-style` configuráveis.

Credenciais S3 e cabeçalhos OTLP são criptografados e nunca retornam ao navegador. Use uma identidade IAM exclusiva com acesso apenas ao bucket do portal. A troca de modo afeta novos uploads; arquivos existentes devem ser migrados de forma controlada antes da remoção do storage anterior.

O Google Analytics 4 usa o ID `G-...` configurado no painel. Com consentimento ativo, a tag não é baixada antes da autorização. O visitante pode aceitar, recusar ou escolher análise, preferências e marketing; a versão da política e a decisão são registradas de forma minimizada.

O backend inclui o SDK OpenTelemetry e exportador OTLP/HTTP de logs. Configure endpoint `/v1/logs`, nome do serviço, nível mínimo e cabeçalhos. O envio é feito em lote e pode ser reconfigurado pelo dashboard sem instalar pacotes arbitrários em tempo de execução.

## Newsletter e SMTP

Configure no `.env` ou em **Dashboard → Servidor de e-mail**: `EMAIL_ATIVO`, `SMTP_HOST`, `SMTP_PORTA`, `SMTP_SEGURO`, `SMTP_USUARIO`, `SMTP_SENHA`, `EMAIL_REMETENTE_NOME`, `EMAIL_REMETENTE_ENDERECO` e `EMAIL_SEGREDO_CANCELAMENTO`. O valor salvo pelo dashboard prevalece; senhas e segredos ficam criptografados e não são retornados ao navegador. Para SMTP com TLS direto use, por exemplo, porta 465 e `SMTP_SEGURO=true`; para STARTTLS na porta 587 use `SMTP_SEGURO=false`. O dashboard oferece **Enviar e-mail de teste**, que envia somente para o administrador autenticado, com limite de um teste por minuto e cinco por hora. A aceitação pelo SMTP não garante entrega na caixa de entrada: confira também spam e políticas do provedor. A página **Newsletter** trata apenas de assunto/texto, exibição e inscritos; cada mensagem contém cancelamento assinado. Publicações novas ou agendadas geram uma fila persistente, com até três tentativas de envio.

O PostgreSQL mantém o estado durável de cada envio e o Redis acorda o consumidor assíncrono imediatamente. Se Redis estiver indisponível, o ciclo periódico processa a fila persistente sem perder mensagens. Essa composição permite múltiplas instâncias e evita manter requisições de publicação abertas durante o envio de e-mails.
