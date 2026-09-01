import { conexao } from "../../infraestrutura/banco/conexao";
import {
  criptografarConfiguracao,
  descriptografarConfiguracao,
} from "../../compartilhado/seguranca/criptografia-configuracoes";

export type NovaMensagem = {
  nome: string;
  email: string;
  empresa: string;
  cargo: string;
  clienteSap: string;
  assunto: string;
  mensagem: string;
  ipHash: string;
  conteudoHash: string;
  agenteUsuario: string;
  pontuacaoRecaptcha: number | null;
};

export class RepositorioContato {
  async configuracaoPublica() {
    const { rows } =
      await conexao.query(`SELECT exibir_contato "exibirContato",exibir_formulario_contato "exibirFormulario",
      contato_email email,contato_telefone telefone,contato_whatsapp whatsapp,contato_endereco endereco,contato_horario horario,
      recaptcha_ativo "recaptchaAtivo",recaptcha_chave_site "recaptchaChaveSite" FROM configuracoes_portal WHERE id=1`);
    const d = rows[0] ?? {};
    return {
      exibirContato: Boolean(d.exibirContato),
      exibirFormulario: Boolean(d.exibirFormulario),
      email: d.email || "",
      telefone: d.telefone || "",
      whatsapp: d.whatsapp || "",
      endereco: d.endereco || "",
      horario: d.horario || "",
      recaptchaAtivo: Boolean(d.recaptchaAtivo && d.recaptchaChaveSite),
      recaptchaChaveSite: d.recaptchaChaveSite || "",
    };
  }
  async configuracaoAdministrativa() {
    const { rows } =
      await conexao.query(`SELECT exibir_contato "exibirContato",exibir_formulario_contato "exibirFormulario",
      contato_email email,contato_telefone telefone,contato_whatsapp whatsapp,contato_endereco endereco,contato_horario horario,
      encaminhar_contato_email "encaminharEmail",recaptcha_ativo "recaptchaAtivo",recaptcha_chave_site "recaptchaChaveSite",
      recaptcha_chave_secreta_criptografada "segredo",recaptcha_pontuacao_minima::float "recaptchaPontuacaoMinima" FROM configuracoes_portal WHERE id=1`);
    const d = rows[0] ?? {};
    return {
      exibirContato: Boolean(d.exibirContato),
      exibirFormulario: Boolean(d.exibirFormulario),
      encaminharEmail: Boolean(d.encaminharEmail),
      recaptchaAtivo: Boolean(d.recaptchaAtivo),
      email: d.email || "",
      telefone: d.telefone || "",
      whatsapp: d.whatsapp || "",
      endereco: d.endereco || "",
      horario: d.horario || "",
      recaptchaChaveSite: d.recaptchaChaveSite || "",
      recaptchaPontuacaoMinima: Number(d.recaptchaPontuacaoMinima ?? 0.5),
      recaptchaChaveSecreta: "",
      recaptchaSegredoConfigurado: Boolean(
        descriptografarConfiguracao(d.segredo),
      ),
    };
  }
  async salvarConfiguracao(d: Record<string, unknown>, adminId: string) {
    const atual = await this.configuracaoAdministrativa();
    const segredo = String(d.recaptchaChaveSecreta || "");
    if (
      Boolean(d.recaptchaAtivo) &&
      (!String(d.recaptchaChaveSite || "") ||
        (!segredo && !atual.recaptchaSegredoConfigurado))
    )
      throw new Error(
        "Configure as duas chaves do reCAPTCHA antes de ativá-lo.",
      );
    await conexao.query(
      `UPDATE configuracoes_portal SET exibir_contato=$1,exibir_formulario_contato=$2,contato_email=nullif($3,''),
      contato_telefone=nullif($4,''),contato_whatsapp=nullif($5,''),contato_endereco=nullif($6,''),contato_horario=nullif($7,''),
      encaminhar_contato_email=$8,recaptcha_ativo=$9,recaptcha_chave_site=nullif($10,''),
      recaptcha_chave_secreta_criptografada=CASE WHEN $11='' THEN recaptcha_chave_secreta_criptografada ELSE $12 END,
      recaptcha_pontuacao_minima=$13,atualizado_por=$14,atualizado_em=now() WHERE id=1`,
      [
        d.exibirContato,
        d.exibirFormulario,
        d.email,
        d.telefone,
        d.whatsapp,
        d.endereco,
        d.horario,
        d.encaminharEmail,
        d.recaptchaAtivo,
        d.recaptchaChaveSite,
        segredo,
        segredo ? criptografarConfiguracao(segredo) : null,
        d.recaptchaPontuacaoMinima,
        adminId,
      ],
    );
  }
  async segredoRecaptcha() {
    const { rows } = await conexao.query(
      `SELECT recaptcha_ativo ativo,recaptcha_chave_secreta_criptografada segredo,recaptcha_pontuacao_minima::float minimo FROM configuracoes_portal WHERE id=1`,
    );
    return {
      ativo: Boolean(rows[0]?.ativo),
      segredo: descriptografarConfiguracao(rows[0]?.segredo),
      minimo: Number(rows[0]?.minimo ?? 0.5),
    };
  }
  async verificarLimite(ipHash: string, maximo: number) {
    const { rows } = await conexao.query(
      `SELECT count(*)::int total FROM tentativas_contato WHERE ip_hash=$1 AND criado_em>now()-interval '1 hour'`,
      [ipHash],
    );
    return Number(rows[0]?.total || 0) < maximo;
  }
  async registrarTentativa(ipHash: string, aceito: boolean, motivo: string) {
    await conexao.query(
      `INSERT INTO tentativas_contato(ip_hash,aceito,motivo) VALUES($1,$2,$3)`,
      [ipHash, aceito, motivo],
    );
  }
  async duplicada(hash: string) {
    const { rowCount } = await conexao.query(
      `SELECT 1 FROM mensagens_contato WHERE conteudo_hash=$1 AND criado_em>now()-interval '10 minutes' LIMIT 1`,
      [hash],
    );
    return Boolean(rowCount);
  }
  async criar(d: NovaMensagem) {
    const { rows } = await conexao.query(
      `INSERT INTO mensagens_contato(nome,email,empresa,cargo,cliente_sap,assunto,mensagem,ip_hash,conteudo_hash,agente_usuario,pontuacao_recaptcha)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id,nome,assunto`,
      [
        d.nome,
        d.email,
        d.empresa,
        d.cargo,
        d.clienteSap,
        d.assunto,
        d.mensagem,
        d.ipHash,
        d.conteudoHash,
        d.agenteUsuario,
        d.pontuacaoRecaptcha,
      ],
    );
    return rows[0];
  }
  async contarNovas() {
    const { rows } = await conexao.query(
      `SELECT count(*)::int total FROM mensagens_contato WHERE situacao='nova'`,
    );
    return Number(rows[0]?.total || 0);
  }
  async listar(
    busca: string,
    situacao: string,
    cursor: string | undefined,
    limite: number,
  ) {
    let cursorData: string | undefined, cursorId: string | undefined;
    if (cursor) {
      try {
        [cursorData, cursorId] = JSON.parse(
          Buffer.from(cursor, "base64url").toString(),
        ) as [string, string];
      } catch {
        cursorData = undefined;
      }
    }
    const valores: unknown[] = [];
    const filtros: string[] = [];
    if (busca) {
      valores.push(busca);
      filtros.push(
        `busca @@ websearch_to_tsquery('portuguese',$${valores.length})`,
      );
    }
    if (situacao !== "todas") {
      valores.push(situacao);
      filtros.push(`situacao=$${valores.length}`);
    }
    if (cursorData && cursorId) {
      valores.push(cursorData, cursorId);
      filtros.push(
        `(criado_em,id)<($${valores.length - 1}::timestamptz,$${valores.length}::uuid)`,
      );
    }
    valores.push(limite + 1);
    const { rows } = await conexao.query(
      `SELECT id,nome,email,empresa,cargo,cliente_sap "clienteSap",assunto,mensagem,situacao,criado_em "criadoEm",lido_em "lidoEm",respondido_em "respondidoEm" FROM mensagens_contato ${filtros.length ? `WHERE ${filtros.join(" AND ")}` : ""} ORDER BY criado_em DESC,id DESC LIMIT $${valores.length}`,
      valores,
    );
    const temMais = rows.length > limite;
    const itens = rows.slice(0, limite);
    const ultimo = itens.at(-1);
    return {
      itens,
      proximoCursor:
        temMais && ultimo
          ? Buffer.from(JSON.stringify([ultimo.criadoEm, ultimo.id])).toString(
              "base64url",
            )
          : null,
      totalNovas: await this.contarNovas(),
    };
  }
  async obter(id: string, marcarLida = false) {
    if (marcarLida)
      await conexao.query(
        `UPDATE mensagens_contato SET situacao='lida',lido_em=now() WHERE id=$1 AND situacao='nova'`,
        [id],
      );
    const { rows } = await conexao.query(
      `SELECT id,nome,email,empresa,cargo,cliente_sap "clienteSap",assunto,mensagem,situacao,criado_em "criadoEm",lido_em "lidoEm",respondido_em "respondidoEm",resposta FROM mensagens_contato WHERE id=$1`,
      [id],
    );
    return rows[0] || null;
  }
  async situacao(id: string, situacao: string) {
    const coluna =
      situacao === "arquivada"
        ? ",arquivado_em=now()"
        : ",lido_em=coalesce(lido_em,now())";
    const { rowCount } = await conexao.query(
      `UPDATE mensagens_contato SET situacao=$2${coluna} WHERE id=$1`,
      [id, situacao],
    );
    return Boolean(rowCount);
  }
  async responder(id: string, resposta: string, adminId: string) {
    const { rowCount } = await conexao.query(
      `UPDATE mensagens_contato SET situacao='respondida',resposta=$2,respondido_em=now(),respondido_por=$3,lido_em=coalesce(lido_em,now()) WHERE id=$1`,
      [id, resposta, adminId],
    );
    return Boolean(rowCount);
  }
  async excluir(id: string) {
    const { rowCount } = await conexao.query(
      `DELETE FROM mensagens_contato WHERE id=$1`,
      [id],
    );
    return Boolean(rowCount);
  }
}
