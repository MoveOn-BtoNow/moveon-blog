UPDATE configuracoes_portal
SET caminho_favicon = '/favicon-32.png', atualizado_em = now()
WHERE caminho_favicon IS NULL OR caminho_favicon = '/favicon.svg';
