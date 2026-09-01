import { conexao } from "../../infraestrutura/banco/conexao";

export type DadosEventoPortal = {
  tipo: "visualizacao" | "compartilhamento" | "busca" | "clique_categoria";
  publicacaoId?: string;
  categoriaId?: string;
  referencia?: string;
};

export class RepositorioPortal {
  async inicial() {
    const [configuracoes, categorias, publicacoes, destaques, parceiros] = await Promise.all([
      conexao.query(
        'SELECT nome,descricao,caminho_logo "caminhoLogo",caminho_favicon "caminhoFavicon",cor_primaria "corPrimaria",cor_fundo_claro "corFundoClaro",cor_fundo_escuro "corFundoEscuro",cor_texto_claro "corTextoClaro",cor_texto_escuro "corTextoEscuro",exibir_carrossel_parceiros "exibirCarrosselParceiros",exibir_quem_somos "exibirQuemSomos",exibir_o_que_resolvemos "exibirOQueResolvemos",exibir_contato "exibirContato",exibir_newsletter "exibirNewsletter",exibir_redes_sociais "exibirRedesSociais",instagram_url "instagramUrl",linkedin_url "linkedinUrl" FROM configuracoes_portal WHERE id=1',
      ),
      conexao.query(
        "SELECT id,nome,slug FROM categorias WHERE ativa ORDER BY nome",
      ),
      this.listarPublicacoes({ limite: 12 }),
      conexao.query(
        `SELECT p.id,p.titulo,p.slug,p.resumo,p.destaque,
         p.imagem_capa_url "imagemCapaUrl",p.imagem_social_url "imagemSocialUrl",
         p.texto_alternativo_capa "textoAlternativoCapa",p.metatitulo,p.metadescricao,
         p.publicado_em "publicadoEm",p.atualizado_em "atualizadoEm",
         coalesce(json_agg(DISTINCT jsonb_build_object('id',c.id,'nome',c.nome,'slug',c.slug))
           FILTER(WHERE c.id IS NOT NULL),'[]') categorias
         FROM publicacoes p
         LEFT JOIN publicacoes_categorias pc ON pc.publicacao_id=p.id
         LEFT JOIN categorias c ON c.id=pc.categoria_id
         WHERE p.situacao='publicada' AND p.publicado_em<=now() AND p.destaque
         GROUP BY p.id
         ORDER BY p.atualizado_em DESC`,
      ),
      conexao.query('SELECT id,nome,caminho_logo "caminhoLogo",endereco_site "enderecoSite" FROM parceiros WHERE ativo ORDER BY ordem,nome'),
    ]);
    return {
      configuracoes: configuracoes.rows[0],
      categorias: categorias.rows,
      publicacoes: publicacoes.itens,
      destaques: destaques.rows,
      parceiros: configuracoes.rows[0]?.exibirCarrosselParceiros
        ? parceiros.rows
        : [],
      proximoCursor: publicacoes.proximoCursor,
    };
  }
  async listarPublicacoes({
    limite = 12,
    cursor,
    busca,
    categoria,
  }: {
    limite?: number;
    cursor?: string;
    busca?: string;
    categoria?: string;
  }) {
    const dataCursor = cursor
      ? new Date(Buffer.from(cursor, "base64url").toString("utf8"))
      : null;
    const termo = busca?.trim().slice(0, 150) || null;
    const slugCategoria = categoria?.trim().slice(0, 120) || null;
    const quantidade = Math.min(30, Math.max(1, limite));
    const r = await conexao.query(
      `SELECT p.id,p.titulo,p.slug,p.resumo,p.destaque,p.imagem_capa_url "imagemCapaUrl",p.imagem_social_url "imagemSocialUrl",p.texto_alternativo_capa "textoAlternativoCapa",p.metatitulo,p.metadescricao,p.publicado_em "publicadoEm",p.atualizado_em "atualizadoEm",
       coalesce(json_agg(DISTINCT jsonb_build_object('id',c.id,'nome',c.nome,'slug',c.slug)) FILTER(WHERE c.id IS NOT NULL),'[]') categorias
       FROM publicacoes p
       LEFT JOIN publicacoes_categorias pc ON pc.publicacao_id=p.id
       LEFT JOIN categorias c ON c.id=pc.categoria_id
       WHERE p.situacao='publicada' AND p.publicado_em<=now()
       AND ($1::timestamptz IS NULL OR p.publicado_em<$1)
       AND ($2::text IS NULL OR p.documento_busca @@ websearch_to_tsquery('portuguese',$2)
         OR EXISTS(SELECT 1 FROM publicacoes_categorias pcb JOIN categorias cb ON cb.id=pcb.categoria_id WHERE pcb.publicacao_id=p.id AND cb.documento_busca @@ websearch_to_tsquery('portuguese',$2)))
       AND ($3::text IS NULL OR EXISTS(SELECT 1 FROM publicacoes_categorias pcf JOIN categorias cf ON cf.id=pcf.categoria_id WHERE pcf.publicacao_id=p.id AND cf.slug=$3))
       GROUP BY p.id
       ORDER BY p.publicado_em DESC
       LIMIT $4`,
      [
        dataCursor && !Number.isNaN(dataCursor.getTime()) ? dataCursor : null,
        termo,
        slugCategoria,
        quantidade + 1,
      ],
    );
    const temMais = r.rows.length > quantidade;
    const itens = r.rows.slice(0, quantidade);
    return {
      itens,
      proximoCursor:
        temMais && itens.length
          ? Buffer.from(
              new Date(itens.at(-1).publicadoEm).toISOString(),
            ).toString("base64url")
          : null,
    };
  }
  async obterPublicacaoPorSlug(slug: string) {
    const r = await conexao.query(
      `SELECT p.id,p.titulo,p.slug,p.resumo,p.conteudo,p.imagem_capa_url "imagemCapaUrl",p.imagem_social_url "imagemSocialUrl",p.texto_alternativo_capa "textoAlternativoCapa",p.metatitulo,p.metadescricao,p.publicado_em "publicadoEm",p.atualizado_em "atualizadoEm",
       json_build_object('nome',cp.nome,'descricao',cp.descricao,'caminhoLogo',cp.caminho_logo,'caminhoFavicon',cp.caminho_favicon,'exibirQuemSomos',cp.exibir_quem_somos,'exibirOQueResolvemos',cp.exibir_o_que_resolvemos,'exibirContato',cp.exibir_contato,'exibirNewsletter',cp.exibir_newsletter,'exibirRedesSociais',cp.exibir_redes_sociais,'instagramUrl',cp.instagram_url,'linkedinUrl',cp.linkedin_url,'atualizadoEm',cp.atualizado_em) configuracoes,
       coalesce(json_agg(json_build_object('id',c.id,'nome',c.nome,'slug',c.slug)) FILTER(WHERE c.id IS NOT NULL),'[]') categorias
       FROM publicacoes p
       CROSS JOIN configuracoes_portal cp
       LEFT JOIN publicacoes_categorias pc ON pc.publicacao_id=p.id
       LEFT JOIN categorias c ON c.id=pc.categoria_id
       WHERE p.slug=$1 AND p.situacao='publicada' AND p.publicado_em<=now()
       GROUP BY p.id,cp.id`,
      [slug],
    );
    return r.rows[0] ?? null;
  }
  async registrarEvento(
    dados: DadosEventoPortal,
    visitante: string,
    ip: string,
    agente: string,
    eRobo: boolean,
    eAdministrador: boolean,
  ) {
    await conexao.query(
      `INSERT INTO eventos_acesso(tipo,publicacao_id,categoria_id,identificador_visitante_hash,endereco_ip_hash,agente_usuario,referencia,e_robo,e_administrador) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
      [
        dados.tipo,
        dados.publicacaoId ?? null,
        dados.categoriaId ?? null,
        visitante,
        ip,
        agente.slice(0, 500),
        dados.referencia ?? null,
        eRobo,
        eAdministrador,
      ],
    );
  }
  async newsletter(email: string) {
    await conexao.query(
      "INSERT INTO inscricoes_newsletter(email) VALUES($1) ON CONFLICT(email) DO UPDATE SET cancelado_em=null",
      [email.toLowerCase()],
    );
  }
  async newsletterDisponivel() {
    const resultado = await conexao.query(
      "SELECT exibir_newsletter FROM configuracoes_portal WHERE id=1",
    );
    return Boolean(resultado.rows[0]?.exibir_newsletter);
  }
  async obterReacoes(publicacaoId: string, visitanteHash: string) {
    const resultado = await conexao.query(
      `SELECT count(*)::int quantidade,
       bool_or(identificador_visitante_hash=$2) "curtiu"
       FROM reacoes_publicacoes WHERE publicacao_id=$1`,
      [publicacaoId, visitanteHash],
    );
    return {
      quantidade: resultado.rows[0]?.quantidade ?? 0,
      curtiu: Boolean(resultado.rows[0]?.curtiu),
    };
  }
  async alternarReacao(
    publicacaoId: string,
    visitanteHash: string,
    ipHash: string,
    agente: string,
    maximoPorHora: number,
  ) {
    const cliente = await conexao.connect();
    try {
      await cliente.query("BEGIN");
      await cliente.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
        ipHash,
      ]);
      const limite = await cliente.query(
        `SELECT count(*)::int quantidade FROM tentativas_reacoes_publicacoes
         WHERE endereco_ip_hash=$1 AND criado_em>=now()-interval '1 hour'`,
        [ipHash],
      );
      if (Number(limite.rows[0]?.quantidade) >= maximoPorHora) {
        await cliente.query("ROLLBACK");
        return { limitado: true as const };
      }
      const publicada = await cliente.query(
        "SELECT 1 FROM publicacoes WHERE id=$1 AND situacao='publicada' AND publicado_em<=now()",
        [publicacaoId],
      );
      if (!publicada.rowCount) {
        await cliente.query("ROLLBACK");
        return { inexistente: true as const };
      }
      await cliente.query(
        "INSERT INTO tentativas_reacoes_publicacoes(endereco_ip_hash) VALUES($1)",
        [ipHash],
      );
      const removida = await cliente.query(
        `DELETE FROM reacoes_publicacoes
         WHERE publicacao_id=$1 AND identificador_visitante_hash=$2 RETURNING id`,
        [publicacaoId, visitanteHash],
      );
      const curtiu = !removida.rowCount;
      if (curtiu)
        await cliente.query(
          `INSERT INTO reacoes_publicacoes(publicacao_id,identificador_visitante_hash,endereco_ip_hash,agente_usuario)
           VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
          [publicacaoId, visitanteHash, ipHash, agente.slice(0, 500)],
        );
      const total = await cliente.query(
        "SELECT count(*)::int quantidade FROM reacoes_publicacoes WHERE publicacao_id=$1",
        [publicacaoId],
      );
      await cliente.query("COMMIT");
      return {
        limitado: false as const,
        curtiu,
        quantidade: total.rows[0]?.quantidade ?? 0,
      };
    } catch (erro) {
      await cliente.query("ROLLBACK");
      throw erro;
    } finally {
      cliente.release();
    }
  }
}
