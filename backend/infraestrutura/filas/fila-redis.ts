import { createClient, type RedisClientType } from "redis";
import { ambiente } from "../../configuracoes/ambiente";

const chaveNewsletter = `${ambiente.REDIS_PREFIXO}:fila:newsletter`;

class FilaRedis {
  private produtor: RedisClientType | null = null;
  private consumidor: RedisClientType | null = null;
  private executando = false;

  private criarCliente() {
    const cliente = createClient({
      url: ambiente.REDIS_URL,
      socket: { connectTimeout: 2_000, reconnectStrategy: false },
    });
    cliente.on("error", (erro) =>
      console.error("Redis temporariamente indisponível:", erro.message),
    );
    return cliente;
  }

  private async obterProdutor() {
    if (!this.produtor) this.produtor = this.criarCliente();
    if (!this.produtor.isOpen) await this.produtor.connect();
    return this.produtor;
  }

  async sinalizarNewsletter(publicacaoId: string): Promise<boolean> {
    if (!ambiente.REDIS_ATIVO) return false;
    try {
      const cliente = await this.obterProdutor();
      await cliente.lPush(chaveNewsletter, publicacaoId);
      return true;
    } catch (erro) {
      console.error("Fila Redis indisponível; usando processamento local:", erro);
      if (this.produtor?.isOpen) this.produtor.destroy();
      this.produtor = null;
      return false;
    }
  }

  async iniciarConsumidor(processar: () => Promise<void>): Promise<void> {
    if (!ambiente.REDIS_ATIVO || this.executando) return;
    this.executando = true;
    this.consumidor = this.criarCliente();

    try {
      await this.consumidor.connect();
      while (this.executando && this.consumidor.isOpen) {
        const item = await this.consumidor.brPop(chaveNewsletter, 5);
        if (item) await processar();
      }
    } catch (erro) {
      if (this.executando)
        console.error("Consumidor Redis interrompido; o ciclo periódico assumirá a fila:", erro);
    }
  }

  async encerrar(): Promise<void> {
    this.executando = false;
    await Promise.allSettled(
      [this.produtor, this.consumidor]
        .filter((cliente): cliente is RedisClientType => Boolean(cliente?.isOpen))
        .map((cliente) => cliente.close()),
    );
  }
}

export const filaRedis = new FilaRedis();
