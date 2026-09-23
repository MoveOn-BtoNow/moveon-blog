import ExcelJS from "exceljs";
import { existsSync } from "node:fs";
import path from "node:path";

export type InscritoNewsletterExportacao = {
  email: string;
  inscritoEm: Date;
  canceladoEm: Date | null;
};

type EscopoExportacao = "todos" | "recentes";

const VERMELHO = "FE3000";
const PRETO = "111111";
const CINZA = "666666";
const CINZA_CLARO = "F3F4F6";
const BRANCO = "FFFFFF";

export async function gerarPlanilhaNewsletter(
  inscritos: InscritoNewsletterExportacao[],
  escopo: EscopoExportacao,
): Promise<Buffer> {
  const pasta = new ExcelJS.Workbook();
  pasta.creator = "MOVE.ON";
  pasta.company = "MOVE.ON";
  pasta.subject = "Inscritos da newsletter";
  pasta.title = "Lista de inscritos da newsletter MOVE.ON";
  pasta.created = new Date();
  pasta.modified = new Date();

  const planilha = pasta.addWorksheet("Inscritos", {
    views: [{ state: "frozen", ySplit: 8, showGridLines: false }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.35, right: 0.35, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
    properties: { defaultRowHeight: 21 },
  });
  planilha.columns = [
    { key: "numero", width: 9 },
    { key: "email", width: 45 },
    { key: "status", width: 16 },
    { key: "inscritoEm", width: 24 },
    { key: "canceladoEm", width: 24 },
  ];

  planilha.mergeCells("B1:E2");
  const titulo = planilha.getCell("B1");
  titulo.value = "INSCRITOS DA NEWSLETTER";
  titulo.font = { name: "Montserrat", size: 22, bold: true, color: { argb: BRANCO } };
  titulo.alignment = { vertical: "middle", horizontal: "left" };
  planilha.getRows(1, 2)?.forEach((linha) => {
    linha.height = 31;
    linha.eachCell({ includeEmpty: true }, (celula) => {
      celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PRETO } };
    });
  });

  const logo = path.join(process.cwd(), "public", "logo.png");
  if (existsSync(logo)) {
    const imagem = pasta.addImage({ filename: logo, extension: "png" });
    planilha.addImage(imagem, { tl: { col: 0.15, row: 0.18 }, ext: { width: 105, height: 48 } });
  } else {
    planilha.mergeCells("A1:A2");
    const marca = planilha.getCell("A1");
    marca.value = "MOVE.ON";
    marca.font = { name: "Montserrat", size: 15, bold: true, color: { argb: VERMELHO } };
    marca.alignment = { vertical: "middle", horizontal: "center" };
  }

  planilha.mergeCells("A3:E3");
  const subtitulo = planilha.getCell("A3");
  subtitulo.value = escopo === "recentes"
    ? "Cadastros realizados nos últimos 30 dias"
    : "Base completa de e-mails cadastrados";
  subtitulo.font = { name: "Poppins", size: 11, color: { argb: CINZA } };
  subtitulo.alignment = { vertical: "middle", horizontal: "left" };
  planilha.getRow(3).height = 25;

  planilha.mergeCells("A4:E4");
  const geradoEm = planilha.getCell("A4");
  geradoEm.value = `Gerado em ${new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo",
  }).format(new Date())}`;
  geradoEm.font = { name: "Poppins", size: 10, italic: true, color: { argb: CINZA } };

  const ativos = inscritos.filter((item) => !item.canceladoEm).length;
  const cancelados = inscritos.length - ativos;
  const resumos = [
    ["TOTAL EXPORTADO", inscritos.length],
    ["ATIVOS", ativos],
    ["CANCELADOS", cancelados],
  ] as const;
  resumos.forEach(([rotulo, valor], indice) => {
    const coluna = indice * 2 + 1;
    const celulaRotulo = planilha.getCell(6, coluna);
    celulaRotulo.value = rotulo;
    celulaRotulo.font = { name: "Poppins", size: 9, bold: true, color: { argb: CINZA } };
    const celulaValor = planilha.getCell(7, coluna);
    celulaValor.value = valor;
    celulaValor.font = { name: "Montserrat", size: 17, bold: true, color: { argb: indice === 1 ? "168447" : VERMELHO } };
  });

  const cabecalhos = ["Nº", "E-mail", "Status", "Data de inscrição", "Data de cancelamento"];
  const linhaCabecalho = planilha.getRow(8);
  linhaCabecalho.values = cabecalhos;
  linhaCabecalho.height = 30;
  linhaCabecalho.eachCell((celula) => {
    celula.font = { name: "Poppins", size: 10, bold: true, color: { argb: BRANCO } };
    celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERMELHO } };
    celula.alignment = { vertical: "middle", horizontal: "left" };
  });

  inscritos.forEach((inscrito, indice) => {
    const linha = planilha.addRow([
      indice + 1,
      inscrito.email,
      inscrito.canceladoEm ? "Cancelado" : "Ativo",
      inscrito.inscritoEm,
      inscrito.canceladoEm,
    ]);
    linha.height = 24;
    linha.eachCell({ includeEmpty: true }, (celula) => {
      celula.font = { name: "Poppins", size: 10, color: { argb: PRETO } };
      celula.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: indice % 2 === 0 ? BRANCO : CINZA_CLARO },
      };
      celula.alignment = { vertical: "middle", horizontal: "left" };
      celula.border = { bottom: { style: "hair", color: { argb: "DDDDDD" } } };
    });
    linha.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    const status = linha.getCell(3);
    status.font = {
      name: "Poppins", size: 10, bold: true,
      color: { argb: inscrito.canceladoEm ? CINZA : "168447" },
    };
    linha.getCell(4).numFmt = "dd/mm/yyyy hh:mm";
    linha.getCell(5).numFmt = "dd/mm/yyyy hh:mm";
  });

  const ultimaLinha = Math.max(8, planilha.rowCount);
  planilha.autoFilter = { from: "A8", to: `E${ultimaLinha}` };
  planilha.headerFooter.oddFooter = "&LMOVE.ON&CLista de inscritos&R Página &P de &N";
  planilha.getColumn(2).alignment = { vertical: "middle", horizontal: "left" };
  planilha.getColumn(4).alignment = { vertical: "middle", horizontal: "left" };
  planilha.getColumn(5).alignment = { vertical: "middle", horizontal: "left" };

  const arquivo = await pasta.xlsx.writeBuffer();
  return Buffer.from(arquivo);
}
