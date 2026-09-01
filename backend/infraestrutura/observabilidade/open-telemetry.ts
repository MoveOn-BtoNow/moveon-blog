import { SeverityNumber, type Logger } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { RepositorioIntegracoes } from "../../modulos/integracoes/integracoes.repositorio";
let provedor: LoggerProvider | null = null;
let logger: Logger | null = null;
let nivelMinimo: keyof typeof severidades = "info";
const severidades = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
};
function cabecalhos(valor: string) {
  return Object.fromEntries(
    valor
      .split(/\r?\n/)
      .map((linha) => {
        const indice = linha.indexOf(":");
        return indice < 1
          ? ["", ""]
          : [linha.slice(0, indice).trim(), linha.slice(indice + 1).trim()];
      })
      .filter(([k, v]) => k && v),
  );
}
export async function configurarOpenTelemetry() {
  if (provedor) await provedor.shutdown().catch(() => undefined);
  provedor = null;
  logger = null;
  const d = await new RepositorioIntegracoes().obter(true);
  if (!d.otelAtivo || !d.otelEndpoint) return;
  nivelMinimo = (
    ["debug", "info", "warn", "error"].includes(String(d.otelNivelMinimo))
      ? d.otelNivelMinimo
      : "info"
  ) as keyof typeof severidades;
  const exporter = new OTLPLogExporter({
    url: String(d.otelEndpoint),
    headers: cabecalhos(String(d.otelCabecalhos || "")),
  });
  provedor = new LoggerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: String(d.otelNomeServico),
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  });
  logger = provedor.getLogger("moveon-backend");
}
export function registrarLog(
  nivel: keyof typeof severidades,
  mensagem: string,
  atributos: Record<string, string | number | boolean> = {},
) {
  if (!logger) return;
  if (severidades[nivel] < severidades[nivelMinimo]) return;
  logger.emit({
    severityNumber: severidades[nivel],
    severityText: nivel.toUpperCase(),
    body: mensagem,
    attributes: atributos,
  });
}
export async function encerrarOpenTelemetry() {
  await provedor?.shutdown();
}
