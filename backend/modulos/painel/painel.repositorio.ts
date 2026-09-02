import { conexao } from "../../infraestrutura/banco/conexao";
import { ambiente } from "../../configuracoes/ambiente";
import { randomBytes } from "node:crypto";
import type {
  DadosCategoria,
  DadosConfiguracao,
  DadosPublicacao,
  DadosParceiro,
} from "./painel.validacao";

export function criarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export class RepositorioPainel {
  async contarReferenciasMidia(caminho: string) {
    const resultado = await conexao.query(
      `SELECT (
        (SELECT count(*) FROM publicacoes WHERE imagem_capa_url=$1 OR imagem_social_url=$1 OR conteudo::text LIKE '%' || $1 || '%') +
        (SELECT count(*) FROM administradores WHERE caminho_foto=$1) +
        (SELECT count(*) FROM parceiros WHERE caminho_logo=$1) +
        (SELECT count(*) FROM configuracoes_portal WHERE caminho_logo=$1 OR caminho_favicon=$1)
      )::int quantidade`,
      [caminho],
    );
    return Number(resultado.rows[0]?.quantidade || 0);
  }

  async listarReferenciasMidias() {
    const resultado = await conexao.query(
      `SELECT caminho FROM (
         SELECT imagem_capa_url caminho FROM publicacoes
         UNION ALL SELECT imagem_social_url FROM publicacoes
         UNION ALL SELECT conteudo::text FROM publicacoes
         UNION ALL SELECT caminho_foto FROM administradores
         UNION ALL SELECT caminho_logo FROM parceiros
         UNION ALL SELECT caminho_logo FROM configuracoes_portal
         UNION ALL SELECT caminho_favicon FROM configuracoes_portal
       ) referencias WHERE caminho IS NOT NULL`,
    );
    return resultado.rows.map((item: { caminho: string }) => item.caminho);
  }
  async listarParceiros() {
    const resultado = await conexao.query('SELECT id,nome,caminho_logo "caminhoLogo",endereco_site "enderecoSite",ativo,ordem FROM parceiros ORDER BY ordem,nome');
    return resultado.rows;
  }
  async salvarParceiro(dados: DadosParceiro, id?: string) {
    const resultado = id
      ? await conexao.query('UPDATE parceiros SET nome=$1,caminho_logo=$2,endereco_site=$3,ativo=$4,ordem=$5,atualizado_em=now() WHERE id=$6 RETURNING id,nome,caminho_logo "caminhoLogo",endereco_site "enderecoSite",ativo,ordem',[dados.nome,dados.caminhoLogo,dados.enderecoSite||null,dados.ativo,dados.ordem,id])
      : await conexao.query('INSERT INTO parceiros(nome,caminho_logo,endereco_site,ativo,ordem) VALUES($1,$2,$3,$4,$5) RETURNING id,nome,caminho_logo "caminhoLogo",endereco_site "enderecoSite",ativo,ordem',[dados.nome,dados.caminhoLogo,dados.enderecoSite||null,dados.ativo,dados.ordem]);
    return resultado.rows[0] ?? null;
  }
  async obterParceiro(id: string) {
    const resultado = await conexao.query('SELECT id,caminho_logo "caminhoLogo" FROM parceiros WHERE id=$1', [id]);
    return resultado.rows[0] ?? null;
  }
  async excluirParceiro(id: string) {
    const resultado = await conexao.query('DELETE FROM parceiros WHERE id=$1 RETURNING caminho_logo "caminhoLogo"',[id]);
    return resultado.rows[0] ?? null;
  }
  async exibicaoCarrosselParceiros() {
    const resultado = await conexao.query('SELECT exibir_carrossel_parceiros "exibir" FROM configuracoes_portal WHERE id=1');
    return Boolean(resultado.rows[0]?.exibir);
  }
  async atualizarExibicaoCarrosselParceiros(exibir: boolean) {
    await conexao.query("UPDATE configuracoes_portal SET exibir_carrossel_parceiros=$1,atualizado_em=now() WHERE id=1", [exibir]);
  }
  async resumo() {
    const [metricas, serie, publicacoes] = await Promise.all([
      conexao.query(
        `SELECT (SELECT count(*) FROM eventos_acesso WHERE tipo='visualizacao' AND ocorrido_em>=date_trunc('month',now()) AND NOT e_robo AND NOT e_administrador)::int acessos_mes,(SELECT count(DISTINCT identificador_visitante_hash) FROM eventos_acesso WHERE tipo='visualizacao' AND ocorrido_em>=date_trunc('month',now()) AND NOT e_robo AND NOT e_administrador)::int leitores_unicos,(SELECT count(*) FROM publicacoes)::int publicacoes,(SELECT count(*) FROM categorias WHERE ativa)::int categorias`,
      ),
      conexao.query(
        `SELECT to_char(dia,'DD/MM') dia,count(e.id)::int acessos FROM generate_series(current_date-6,current_date,'1 day') dia LEFT JOIN eventos_acesso e ON e.ocorrido_em::date=dia::date AND e.tipo='visualizacao' AND NOT e.e_robo AND NOT e.e_administrador GROUP BY dia ORDER BY dia`,
      ),
      this.listarPublicacoes({ limite: 5 }),
    ]);
    return { metricas: metricas.rows[0], serie: serie.rows, publicacoes: publicacoes.itens };
  }
  async listarPublicacoes({
    limite = 20,
    cursor,
    busca,
  }: {
    limite?: number;
    cursor?: string;
    busca?: string;
  } = {}) {
    const quantidade = Math.min(50, Math.max(1, limite));
    const termo = busca?.trim().slice(0, 150) || null;
    let cursorCriadoEm: string | null = null;
    let cursorId: string | null = null;
    if (cursor) {
      try {
        const decodificado = JSON.parse(
          Buffer.from(cursor, "base64url").toString("utf8"),
        ) as { criadoEm?: string; id?: string };
        cursorCriadoEm = decodificado.criadoEm || null;
        cursorId = decodificado.id || null;
      } catch {
        cursorCriadoEm = null;
        cursorId = null;
      }
    }
    const r = await conexao.query(
      `SELECT p.id,p.titulo,p.slug,p.resumo,p.situacao,p.destaque,p.imagem_capa_url "imagemCapaUrl",p.publicado_em "publicadoEm",p.agendado_para "agendadoPara",p.criado_em "criadoEm",coalesce(array_agg(DISTINCT c.nome) FILTER(WHERE c.id IS NOT NULL),'{}') categorias,(SELECT count(*)::int FROM eventos_acesso e WHERE e.publicacao_id=p.id AND e.tipo='visualizacao' AND NOT e.e_robo AND NOT e.e_administrador) acessos
       FROM publicacoes p
       LEFT JOIN publicacoes_categorias pc ON pc.publicacao_id=p.id
       LEFT JOIN categorias c ON c.id=pc.categoria_id
       WHERE ($1::timestamptz IS NULL OR (p.criado_em,p.id)<($1::timestamptz,$2::uuid))
         AND ($3::text IS NULL OR p.documento_busca @@ websearch_to_tsquery('portuguese',$3))
       GROUP BY p.id
       ORDER BY p.criado_em DESC,p.id DESC
       LIMIT $4`,
      [cursorCriadoEm, cursorId, termo, quantidade + 1],
    );
    const temMais = r.rows.length > quantidade;
    const itens = r.rows.slice(0, quantidade);
    const ultimo = itens.at(-1);
    return {
      itens,
      proximoCursor:
        temMais && ultimo
          ? Buffer.from(
              JSON.stringify({ criadoEm: ultimo.criadoEm, id: ultimo.id }),
            ).toString("base64url")
          : null,
    };
  }
  async obterPublicacao(id: string) {
    const r = await conexao.query(
      `SELECT p.id,p.titulo,p.slug,p.resumo,p.conteudo,p.situacao,p.destaque,p.imagem_capa_url "imagemCapaUrl",p.imagem_social_url "imagemSocialUrl",p.texto_alternativo_capa "textoAlternativoCapa",p.agendado_para "agendadoPara",p.metatitulo,p.metadescricao,coalesce(array_agg(pc.categoria_id) FILTER(WHERE pc.categoria_id IS NOT NULL),'{}') categorias FROM publicacoes p LEFT JOIN publicacoes_categorias pc ON pc.publicacao_id=p.id WHERE p.id=$1 GROUP BY p.id`,
      [id],
    );
    return r.rows[0] ?? null;
  }
  async salvarPublicacao(d: DadosPublicacao, adminId: string, id?: string) {
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      if (d.destaque)
        await cliente.query(
          "SELECT pg_advisory_xact_lock(hashtext('moveon_publicacoes_destaque'))",
        );
      const slug = `${criarSlug(d.titulo) || "publicacao"}-${randomBytes(3).toString("hex")}`;
      let pid = id;
      if (id) {
        await cliente.query(
          `UPDATE publicacoes SET titulo=$1,resumo=$2,conteudo=$3,situacao=$4::situacao_publicacao,destaque=$5,imagem_capa_url=$6,agendado_para=CASE WHEN $4::text='agendada' THEN $7::timestamptz ELSE null::timestamptz END,publicado_em=CASE WHEN $4::text='publicada' THEN coalesce(publicado_em,now()) ELSE publicado_em END,metatitulo=$8,metadescricao=$9,imagem_social_url=$10,texto_alternativo_capa=$11,atualizado_em=now() WHERE id=$12`,
          [
            d.titulo,
            d.resumo,
            JSON.stringify({ texto: d.conteudo }),
            d.situacao,
            d.destaque,
            d.imagemCapaUrl || null,
            d.agendadoPara || null,
            d.metatitulo || null,
            d.metadescricao || null,
            d.imagemSocialUrl || d.imagemCapaUrl || null,
            d.textoAlternativoCapa || d.titulo,
            id,
          ],
        );
      } else {
        const r = await cliente.query(
          `INSERT INTO publicacoes(titulo,slug,resumo,conteudo,situacao,destaque,imagem_capa_url,agendado_para,publicado_em,metatitulo,metadescricao,administrador_id,imagem_social_url,texto_alternativo_capa) VALUES($1,$2,$3,$4,$5::situacao_publicacao,$6,$7,$8,CASE WHEN $5::text='publicada' THEN now() END,$9,$10,$11,$12,$13) RETURNING id`,
          [
            d.titulo,
            slug,
            d.resumo,
            JSON.stringify({ texto: d.conteudo }),
            d.situacao,
            d.destaque,
            d.imagemCapaUrl || null,
            d.agendadoPara || null,
            d.metatitulo || null,
            d.metadescricao || null,
            adminId,
            d.imagemSocialUrl || d.imagemCapaUrl || null,
            d.textoAlternativoCapa || d.titulo,
          ],
        );
        pid = r.rows[0].id;
      }
      await cliente.query(
        "DELETE FROM publicacoes_categorias WHERE publicacao_id=$1",
        [pid],
      );
      for (const cid of d.categorias)
        await cliente.query(
          "INSERT INTO publicacoes_categorias(publicacao_id,categoria_id) VALUES($1,$2)",
          [pid, cid],
        );
      if (d.destaque)
        await cliente.query(
          `UPDATE publicacoes
             SET destaque=false
           WHERE destaque
             AND id NOT IN (
               SELECT id
                 FROM publicacoes
                WHERE destaque
                ORDER BY atualizado_em DESC,criado_em DESC,id DESC
                LIMIT $1
             )`,
          [ambiente.LIMITE_PUBLICACOES_DESTAQUE],
        );
      await cliente.query("COMMIT");
      return pid;
    } catch (e) {
      await cliente.query("ROLLBACK");
      throw e;
    } finally {
      cliente.release();
    }
  }
  async excluirPublicacao(id: string) {
    const resultado = await conexao.query("DELETE FROM publicacoes WHERE id=$1 RETURNING id", [id]);
    return resultado.rowCount === 1;
  }
  async listarCategorias() {
    const r = await conexao.query(
      `SELECT c.id,c.nome,c.slug,c.descricao,c.ativa,count(pc.publicacao_id)::int publicacoes FROM categorias c LEFT JOIN publicacoes_categorias pc ON pc.categoria_id=c.id GROUP BY c.id ORDER BY c.nome`,
    );
    return r.rows;
  }
  async criarCategoria(d: DadosCategoria) {
    const r = await conexao.query(
      "INSERT INTO categorias(nome,slug,descricao) VALUES($1,$2,$3) RETURNING *",
      [
        d.nome,
        `${criarSlug(d.nome)}-${Date.now().toString(36)}`,
        d.descricao || null,
      ],
    );
    return r.rows[0];
  }
  async atualizarCategoria(id: string, d: DadosCategoria) {
    const r = await conexao.query(
      "UPDATE categorias SET nome=$1,descricao=$2,atualizado_em=now() WHERE id=$3 RETURNING *",
      [d.nome, d.descricao || null, id],
    );
    return r.rows[0];
  }
  async excluirCategoria(id: string) {
    await conexao.query("DELETE FROM categorias WHERE id=$1", [id]);
  }
  async metricas() {
    const [totais, ranking, serie, engajamentos, rankingReacoes] = await Promise.all([
      conexao.query(
        `SELECT count(*) FILTER(WHERE ocorrido_em::date=current_date)::int hoje,count(*) FILTER(WHERE ocorrido_em>=date_trunc('month',now()))::int mes,count(*) FILTER(WHERE ocorrido_em>=date_trunc('year',now()))::int ano,count(DISTINCT identificador_visitante_hash) FILTER(WHERE ocorrido_em>=date_trunc('month',now()))::int visitantes FROM eventos_acesso WHERE tipo='visualizacao' AND NOT e_robo AND NOT e_administrador`,
      ),
      conexao.query(
        `SELECT p.id,p.titulo,count(e.id)::int acessos FROM publicacoes p LEFT JOIN eventos_acesso e ON e.publicacao_id=p.id AND e.tipo='visualizacao' AND NOT e.e_robo AND NOT e.e_administrador GROUP BY p.id ORDER BY acessos DESC LIMIT 10`,
      ),
      conexao.query(
        `SELECT to_char(dia,'DD/MM') dia,count(e.id)::int acessos FROM generate_series(current_date-29,current_date,'1 day') dia LEFT JOIN eventos_acesso e ON e.ocorrido_em::date=dia::date AND e.tipo='visualizacao' AND NOT e.e_robo AND NOT e.e_administrador GROUP BY dia ORDER BY dia`,
      ),
      conexao.query(
        `SELECT
          count(*) FILTER(WHERE tipo='compartilhamento' AND ocorrido_em>=date_trunc('month',now()))::int compartilhamentos,
          count(*) FILTER(WHERE tipo='busca' AND ocorrido_em>=date_trunc('month',now()))::int buscas,
          count(*) FILTER(WHERE tipo='clique_categoria' AND ocorrido_em>=date_trunc('month',now()))::int "cliquesCategorias",
          count(DISTINCT publicacao_id) FILTER(WHERE tipo='visualizacao' AND ocorrido_em>=date_trunc('month',now()))::int "publicacoesAcessadas",
          round(count(*) FILTER(WHERE tipo='visualizacao' AND ocorrido_em>=current_date-29)::numeric/30,1) "mediaAcessosDia"
         FROM eventos_acesso WHERE NOT e_robo AND NOT e_administrador`,
      ),
      conexao.query(
        `SELECT p.id,p.titulo,count(r.id)::int reacoes
         FROM publicacoes p
         LEFT JOIN reacoes_publicacoes r ON r.publicacao_id=p.id
         GROUP BY p.id ORDER BY reacoes DESC,p.titulo LIMIT 10`,
      ),
    ]);
    return {
      totais: totais.rows[0],
      ranking: ranking.rows,
      serie: serie.rows,
      engajamentos: engajamentos.rows[0],
      rankingReacoes: rankingReacoes.rows,
    };
  }
  async configuracoes() {
    const r = await conexao.query(
      'SELECT nome,descricao,caminho_logo "caminhoLogo",caminho_favicon "caminhoFavicon",cor_primaria "corPrimaria",cor_fundo_claro "corFundoClaro",cor_fundo_escuro "corFundoEscuro",cor_texto_claro "corTextoClaro",cor_texto_escuro "corTextoEscuro",exibir_quem_somos "exibirQuemSomos",exibir_o_que_resolvemos "exibirOQueResolvemos",exibir_redes_sociais "exibirRedesSociais",instagram_url "instagramUrl",linkedin_url "linkedinUrl" FROM configuracoes_portal WHERE id=1',
    );
    return r.rows[0];
  }
  async atualizarConfiguracoes(d: DadosConfiguracao, adminId: string) {
    await conexao.query(
      "UPDATE configuracoes_portal SET nome=$1,descricao=$2,caminho_logo=$3,caminho_favicon=$4,cor_primaria=$5,cor_fundo_claro=$6,cor_fundo_escuro=$7,cor_texto_claro=$8,cor_texto_escuro=$9,exibir_quem_somos=$10,exibir_o_que_resolvemos=$11,exibir_redes_sociais=$12,instagram_url=$13,linkedin_url=$14,atualizado_por=$15,atualizado_em=now() WHERE id=1",
      [
        d.nome,
        d.descricao,
        d.caminhoLogo,
        d.caminhoFavicon,
        d.corPrimaria,
        d.corFundoClaro,
        d.corFundoEscuro,
        d.corTextoClaro,
        d.corTextoEscuro,
        d.exibirQuemSomos,
        d.exibirOQueResolvemos,
        d.exibirRedesSociais,
        d.instagramUrl,
        d.linkedinUrl,
        adminId,
      ],
    );
  }
  async administrador(id: string) {
    const r = await conexao.query(
      'SELECT id,nome,email,senha_hash,caminho_foto "caminhoFoto" FROM administradores WHERE id=$1',
      [id],
    );
    return r.rows[0];
  }
  async atualizarAdministrador(
    id: string,
    nome: string,
    email: string,
    caminhoFoto: string,
    senhaHash?: string,
    revogarSessoes = false,
  ) {
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      await cliente.query(
        "UPDATE administradores SET nome=$1,email=$2,caminho_foto=$3,senha_hash=coalesce($4,senha_hash),atualizado_em=now() WHERE id=$5",
        [nome, email, caminhoFoto || null, senhaHash || null, id],
      );
      if (revogarSessoes)
        await cliente.query(
          "UPDATE sessoes_administrativas SET revogada_em=now() WHERE administrador_id=$1 AND revogada_em IS NULL",
          [id],
        );
      await cliente.query("COMMIT");
    } catch (erro) {
      await cliente.query("ROLLBACK");
      throw erro;
    } finally {
      cliente.release();
    }
  }
  async removerFotoAdministrador(id: string) {
    await conexao.query(
      "UPDATE administradores SET caminho_foto=null,atualizado_em=now() WHERE id=$1",
      [id],
    );
  }
  async listarInscritos(pagina: number, limite: number) {
    const [itens, total] = await Promise.all([
      conexao.query(
        'SELECT id,email,inscrito_em "inscritoEm",cancelado_em "canceladoEm" FROM inscricoes_newsletter ORDER BY inscrito_em DESC LIMIT $1 OFFSET $2',
        [limite, (pagina - 1) * limite],
      ),
      conexao.query("SELECT count(*)::int total FROM inscricoes_newsletter"),
    ]);
    return {
      itens: itens.rows,
      total: total.rows[0].total,
      pagina,
      limite,
      paginas: Math.max(1, Math.ceil(total.rows[0].total / limite)),
    };
  }
  async removerInscrito(id: string) {
    await conexao.query("DELETE FROM inscricoes_newsletter WHERE id=$1", [id]);
  }
  async configuracaoNewsletter() {
    const r = await conexao.query(
      `SELECT newsletter_assunto "assunto",newsletter_texto "texto",
       exibir_newsletter "exibirNewsletter",email_ativo "emailAtivo",
       coalesce(smtp_host,'') "smtpHost",smtp_porta "smtpPorta",smtp_seguro "smtpSeguro",
       coalesce(smtp_usuario,'') "smtpUsuario",
       coalesce(email_remetente_nome,'') "emailRemetenteNome",
       coalesce(email_remetente_endereco,'') "emailRemetenteEndereco",
       (smtp_senha_criptografada IS NOT NULL) "smtpSenhaConfigurada",
       (email_segredo_cancelamento_criptografado IS NOT NULL) "emailSegredoConfigurado"
       FROM configuracoes_portal WHERE id=1`,
    );
    return r.rows[0];
  }
  async atualizarNewsletter(dados: {
    assunto: string;
    texto: string;
    exibirNewsletter: boolean;
    emailAtivo: boolean;
    smtpHost: string;
    smtpPorta: number;
    smtpSeguro: boolean;
    smtpUsuario: string;
    emailRemetenteNome: string;
    emailRemetenteEndereco: string;
    smtpSenhaCriptografada?: string;
    emailSegredoCriptografado?: string;
  }) {
    await conexao.query(
      `UPDATE configuracoes_portal SET newsletter_assunto=$1,newsletter_texto=$2,
       exibir_newsletter=$3,email_ativo=$4,smtp_host=$5,smtp_porta=$6,smtp_seguro=$7,
       smtp_usuario=$8,email_remetente_nome=$9,email_remetente_endereco=$10,
       smtp_senha_criptografada=coalesce($11,smtp_senha_criptografada),
       email_segredo_cancelamento_criptografado=coalesce($12,email_segredo_cancelamento_criptografado),
       atualizado_em=now() WHERE id=1`,
      [
        dados.assunto,
        dados.texto,
        dados.exibirNewsletter,
        dados.emailAtivo,
        dados.smtpHost || null,
        dados.smtpPorta,
        dados.smtpSeguro,
        dados.smtpUsuario || null,
        dados.emailRemetenteNome,
        dados.emailRemetenteEndereco,
        dados.smtpSenhaCriptografada || null,
        dados.emailSegredoCriptografado || null,
      ],
    );
  }
}
