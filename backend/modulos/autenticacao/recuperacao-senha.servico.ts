import { hash } from "bcryptjs";
import nodemailer from "nodemailer";
import { conexao } from "../../infraestrutura/banco/conexao";
import { ambiente } from "../../configuracoes/ambiente";
import { gerarHashSha256, gerarTokenSeguro } from "../../compartilhado/seguranca/criptografia";
import { obterConfiguracaoEmail } from "../newsletter/newsletter.servico";

const mensagemGenerica = `Se o e-mail estiver cadastrado, enviaremos um link de recuperação. Confira também a caixa de spam. Para solicitar novamente, aguarde pelo menos ${ambiente.RECUPERACAO_INTERVALO_MINUTOS} minutos.`;
const hashChave = (valor: string) => gerarHashSha256(valor.toLowerCase().trim());

type Limite = {tipo:"origem"|"identidade";hash:string;intervalo:number;maximo:number};
type EstadoLimite = {tentativas:number;janelaInicio:Date;proximoEnvioEm:Date;agora:Date};

async function reservarLimites(ip:string,email:string):Promise<{aguardeSegundos:number;motivo?:string}> {
  const limites:Limite[]=[
    {tipo:"origem",hash:hashChave(ip),intervalo:1,maximo:ambiente.RECUPERACAO_MAX_POR_IP_HORA},
    {tipo:"identidade",hash:hashChave(email),intervalo:ambiente.RECUPERACAO_INTERVALO_MINUTOS,maximo:12},
  ];
  const cliente=await conexao.connect();
  try {
    await cliente.query("BEGIN");
    const estados:EstadoLimite[]=[];
    for(const limite of limites) {
      await cliente.query(
        `INSERT INTO limites_recuperacao_senha(tipo,chave_hash,tentativas,janela_inicio,proximo_envio_em)
         VALUES($1,$2,0,now(),now()) ON CONFLICT(tipo,chave_hash) DO NOTHING`,
        [limite.tipo,limite.hash]);
      const consulta=await cliente.query<EstadoLimite>(
        `SELECT tentativas,janela_inicio "janelaInicio",proximo_envio_em "proximoEnvioEm",now() "agora"
         FROM limites_recuperacao_senha WHERE tipo=$1 AND chave_hash=$2 FOR UPDATE`,
        [limite.tipo,limite.hash]);
      estados.push(consulta.rows[0]);
    }
    const agora=estados[0].agora.getTime();
    const esperas=estados.map((estado,indice)=>{
      const inicio=estado.janelaInicio.getTime();
      const janelaVigente=inicio+3_600_000>agora;
      const fimJanela=janelaVigente && Number(estado.tentativas)>=limites[indice].maximo?inicio+3_600_000:agora;
      return Math.max(0,Math.ceil((Math.max(estado.proximoEnvioEm.getTime(),fimJanela)-agora)/1000));
    });
    const aguardeSegundos=Math.max(...esperas);
    if(aguardeSegundos>0) {
      await cliente.query("ROLLBACK");
      return {aguardeSegundos,motivo:esperas[0]>0?"origem":"identidade"};
    }
    for(let indice=0;indice<limites.length;indice++) {
      const limite=limites[indice],estado=estados[indice];
      const reiniciar=estado.janelaInicio.getTime()+3_600_000<=agora;
      await cliente.query(
        `UPDATE limites_recuperacao_senha SET tentativas=$3,
         janela_inicio=CASE WHEN $4::boolean THEN now() ELSE janela_inicio END,
         proximo_envio_em=now()+($5::int*interval '1 minute')
         WHERE tipo=$1 AND chave_hash=$2`,
        [limite.tipo,limite.hash,reiniciar?1:Number(estado.tentativas)+1,reiniciar,limite.intervalo]);
    }
    await cliente.query("COMMIT");
    return {aguardeSegundos:0};
  } catch(erro) {await cliente.query("ROLLBACK");throw erro;}
  finally {cliente.release();}
}

export class ServicoRecuperacaoSenha {
  async solicitar(email: string, ip: string): Promise<{mensagem:string;aguardeSegundos:number}> {
    const inicio = Date.now();
    let aguardeSegundos=0;
    try {
      const limite=await reservarLimites(ip,email);
      aguardeSegundos=limite.aguardeSegundos;
      if (aguardeSegundos) console.info("Recuperação limitada:",{motivo:limite.motivo,aguardeSegundos});
      else {
        const usuario = await conexao.query<{ id: string; nome: string; email: string }>(
          "SELECT id,nome,email FROM administradores WHERE lower(email)=lower($1) AND ativo=true LIMIT 1", [email]);
        const administrador = usuario.rows[0];
        if (administrador) {
          const configuracao = await obterConfiguracaoEmail();
          if (configuracao.ativo && configuracao.host) {
            const token = gerarTokenSeguro();
            const url = new URL("/recuperar-senha", ambiente.URL_PUBLICA_PORTAL);
            url.searchParams.set("token", token);
            const transporte = nodemailer.createTransport({host: configuracao.host, port: configuracao.porta, secure: configuracao.seguro,
              requireTLS: !configuracao.seguro, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
              auth: configuracao.usuario ? {user: configuracao.usuario, pass: configuracao.senha} : undefined});
            await conexao.query("UPDATE recuperacoes_senha SET utilizado_em=now() WHERE administrador_id=$1 AND utilizado_em IS NULL", [administrador.id]);
            const registro = await conexao.query<{ id: string }>(
              `INSERT INTO recuperacoes_senha(administrador_id,token_hash,expira_em)
               VALUES($1,$2,now()+($3::int*interval '1 minute')) RETURNING id`,
              [administrador.id, gerarHashSha256(token), ambiente.RECUPERACAO_EXPIRACAO_MINUTOS]);
            void transporte.sendMail({
                from: {name: configuracao.remetenteNome, address: configuracao.remetenteEndereco}, to: administrador.email,
                subject: "Recuperação de senha — MOVE.ON",
                text: `Olá, ${administrador.nome}.\n\nRecebemos uma solicitação para redefinir sua senha. Acesse o link em até ${ambiente.RECUPERACAO_EXPIRACAO_MINUTOS} minutos:\n${url}\n\nSe não foi você, ignore este e-mail. O link funciona apenas uma vez.`,
                html: `<div style="font:17px Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#222"><h1 style="color:#fe3000">MOVE.ON</h1><h2>Recuperação de senha</h2><p>Olá, ${administrador.nome.replace(/[&<>"']/g, "")}. Recebemos uma solicitação para redefinir sua senha.</p><p>Este link expira em ${ambiente.RECUPERACAO_EXPIRACAO_MINUTOS} minutos e funciona apenas uma vez.</p><p><a href="${url.toString().replace(/&/g, "&amp;")}" style="background:#fe3000;color:white;padding:14px 22px;border-radius:10px;display:inline-block;text-decoration:none">Criar nova senha</a></p><p>Se não foi você, ignore esta mensagem.</p></div>`,
              }).then(async (retorno) => {
                const aceito=retorno.accepted.some(destino=>
                  (typeof destino==="string"?destino:destino.address).toLowerCase()===administrador.email.toLowerCase());
                if (!aceito) {
                  await conexao.query("DELETE FROM recuperacoes_senha WHERE id=$1", [registro.rows[0].id]);
                  console.warn("Recuperação não enviada: destinatário rejeitado pelo SMTP.");
                } else console.info("Recuperação: mensagem aceita pelo servidor SMTP.");
              }).catch(async (erro: unknown) => {
                try { await conexao.query("DELETE FROM recuperacoes_senha WHERE id=$1", [registro.rows[0].id]); }
                catch (falha) { console.error("Falha ao invalidar link não enviado:", falha); }
                console.error("Falha ao enviar recuperação de senha:", erro);
              });
          } else console.warn("Recuperação não enviada: serviço de e-mail desativado ou sem servidor SMTP.");
        } else console.info("Recuperação não enviada: não há conta ativa para o endereço informado.");
      }
    } catch (erro) {
      // Resposta pública idêntica inclusive quando o provedor de e-mail falhar.
      console.error("Falha na solicitação de recuperação:", erro);
    } finally {
      const restante = 1800 - (Date.now() - inicio);
      if (restante > 0) await new Promise((resolver) => setTimeout(resolver, restante));
    }
    return {mensagem:mensagemGenerica,aguardeSegundos};
  }

  async verificar(token: string): Promise<boolean> {
    const resultado = await conexao.query(
      `SELECT 1 FROM recuperacoes_senha WHERE token_hash=$1 AND utilizado_em IS NULL AND expira_em>now() LIMIT 1`,
      [gerarHashSha256(token)]);
    return resultado.rowCount === 1;
  }

  async redefinir(token: string, senha: string): Promise<boolean> {
    // Evita trabalho bcrypt para tokens arbitrários; a transação confere tudo outra vez.
    if (!(await this.verificar(token))) return false;
    // O hash é calculado antes do bloqueio da linha para não manter uma transação aberta durante bcrypt.
    const senhaHash = await hash(senha, ambiente.CUSTO_HASH_SENHA);
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      const resultado = await cliente.query<{ id: string; administrador_id: string }>(
        `SELECT id,administrador_id FROM recuperacoes_senha WHERE token_hash=$1 FOR UPDATE`, [gerarHashSha256(token)]);
      const registro = resultado.rows[0];
      if (!registro) { await cliente.query("ROLLBACK"); return false; }
      const atualizado = await cliente.query(
        `UPDATE recuperacoes_senha SET utilizado_em=now() WHERE id=$1 AND utilizado_em IS NULL AND expira_em>now() RETURNING id`, [registro.id]);
      if (!atualizado.rowCount) { await cliente.query("ROLLBACK"); return false; }
      const administradorAtualizado = await cliente.query("UPDATE administradores SET senha_hash=$2 WHERE id=$1 AND ativo=true RETURNING id", [registro.administrador_id, senhaHash]);
      if (!administradorAtualizado.rowCount) { await cliente.query("ROLLBACK"); return false; }
      await cliente.query("UPDATE sessoes_administrativas SET revogada_em=now() WHERE administrador_id=$1 AND revogada_em IS NULL", [registro.administrador_id]);
      await cliente.query("UPDATE recuperacoes_senha SET utilizado_em=now() WHERE administrador_id=$1 AND utilizado_em IS NULL", [registro.administrador_id]);
      await cliente.query("COMMIT");
      return true;
    } catch (erro) { await cliente.query("ROLLBACK"); throw erro; }
    finally { cliente.release(); }
  }
}
