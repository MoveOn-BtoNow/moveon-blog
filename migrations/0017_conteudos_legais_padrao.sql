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
