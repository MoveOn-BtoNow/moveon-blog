ALTER TABLE configuracoes_portal
  ADD COLUMN IF NOT EXISTS s3_autenticacao varchar(20) NOT NULL DEFAULT 'chaves'
  CHECK (s3_autenticacao IN ('iam_role','chaves'));

UPDATE configuracoes_portal
SET s3_autenticacao='iam_role'
WHERE s3_chave_acesso_criptografada IS NULL
  AND s3_chave_secreta_criptografada IS NULL;
