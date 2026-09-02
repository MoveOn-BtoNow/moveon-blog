import { criarAplicacao } from "./aplicacao";
import { ambiente } from "./configuracoes/ambiente";
import { encerrarConexao } from "./infraestrutura/banco/conexao";
import { servicoNewsletter } from "./modulos/newsletter/newsletter.servico";
import { configurarOpenTelemetry,encerrarOpenTelemetry } from "./infraestrutura/observabilidade/open-telemetry";
import { filaRedis } from "./infraestrutura/filas/fila-redis";
import { limparMidiasOrfas } from "./modulos/painel/limpeza-midias.servico";

const aplicacao = criarAplicacao();
void configurarOpenTelemetry().catch(erro=>console.error("Falha ao configurar OpenTelemetry:",erro));
const servidor = aplicacao.listen(ambiente.PORTA_API, ambiente.HOST_API, () => {
  console.log(
    `API MOVE.ON ativa em http://${ambiente.HOST_API}:${ambiente.PORTA_API}`,
  );
});
const temporizadorNewsletter = setInterval(
  () =>
    void servicoNewsletter.publicarAgendadas().catch((erro) =>
      console.error("Falha no ciclo da newsletter:", erro),
    ),
  60_000,
);
void servicoNewsletter.publicarAgendadas().catch((erro) =>
  console.error("Falha ao iniciar a newsletter:", erro),
);
void filaRedis
  .iniciarConsumidor(() => servicoNewsletter.processar())
  .catch((erro) => console.error("Falha ao iniciar consumidor Redis:", erro));
const executarLimpezaMidias = () =>
  void limparMidiasOrfas()
    .then((quantidade) => quantidade > 0 && console.log(`${quantidade} mídia(s) órfã(s) removida(s).`))
    .catch((erro) => console.error("Falha ao limpar mídias órfãs:", erro));
const temporizadorLimpezaMidias = setInterval(
  executarLimpezaMidias,
  ambiente.INTERVALO_LIMPEZA_MIDIAS_MINUTOS * 60_000,
);
setTimeout(executarLimpezaMidias, 30_000);

async function encerrarServidor(sinal: string): Promise<void> {
  console.log(`Encerrando API após ${sinal}...`);
  clearInterval(temporizadorNewsletter);
  clearInterval(temporizadorLimpezaMidias);
  servidor.close(async () => {
    await encerrarOpenTelemetry().catch(()=>undefined);
    await filaRedis.encerrar();
    await encerrarConexao();
    process.exit(0);
  });
}

process.on("SIGINT", () => void encerrarServidor("SIGINT"));
process.on("SIGTERM", () => void encerrarServidor("SIGTERM"));
