import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { ambiente } from "../../configuracoes/ambiente";
import {
  excluirObjetoPorChave,
  listarObjetosGerenciados,
  usarS3,
} from "../integracoes/armazenamento-objetos";
import { obterRaizUploads } from "./armazenamento-capas";
import { RepositorioPainel } from "./painel.repositorio";

const padraoChave = /(?:^|\/)(capas|sociais|conteudos|videos|perfis)\/([a-f0-9-]+\.(?:webp|jpg|mp4|webm|mov))/gi;
const pastas = ["capas", "sociais", "conteudos", "videos", "perfis"] as const;

function chavesReferenciadas(valores: string[]) {
  const chaves = new Set<string>();
  for (const valor of valores) {
    padraoChave.lastIndex = 0;
    for (const item of valor.matchAll(padraoChave))
      chaves.add(`${item[1].toLowerCase()}/${item[2].toLowerCase()}`);
  }
  return chaves;
}

export async function limparMidiasOrfas() {
  const referencias = chavesReferenciadas(
    await new RepositorioPainel().listarReferenciasMidias(),
  );
  const limite = Date.now() - ambiente.LIMPEZA_MIDIAS_ORFAS_HORAS * 3_600_000;
  let removidas = 0;

  if (await usarS3()) {
    for (const objeto of await listarObjetosGerenciados()) {
      if (
        objeto.alteradoEm.getTime() < limite &&
        !referencias.has(objeto.chave.toLowerCase()) &&
        /^(capas|sociais|conteudos|videos|perfis)\/[a-f0-9-]+\.(webp|jpg|mp4|webm|mov)$/i.test(objeto.chave)
      ) {
        await excluirObjetoPorChave(objeto.chave);
        removidas++;
      }
    }
  } else {
    const raiz = obterRaizUploads();
    for (const pasta of pastas) {
      const diretorio = path.join(raiz, pasta);
      const arquivos = await readdir(diretorio).catch(() => [] as string[]);
      for (const arquivo of arquivos) {
        const chave = `${pasta}/${arquivo}`;
        if (!/^[a-f0-9-]+\.(webp|jpg|mp4|webm|mov)$/i.test(arquivo) || referencias.has(chave.toLowerCase()))
          continue;
        const destino = path.join(diretorio, arquivo);
        if ((await stat(destino)).mtimeMs < limite) {
          await unlink(destino);
          removidas++;
        }
      }
    }
  }
  return removidas;
}
