"use client";

import { memo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  AccessibilityHelp,
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ButtonView,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  Highlight,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  MediaEmbedResize,
  MediaEmbedToolbar,
  Paragraph,
  PasteFromOffice,
  Plugin,
  RemoveFormat,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  WordCount,
  type Editor,
  type FileLoader,
  type UploadAdapter,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import traducoesPortuguesBrasil from "ckeditor5/translations/pt-br.js";

class AdaptadorUploadMoveOn implements UploadAdapter {
  constructor(private readonly carregador: FileLoader) {}

  async upload(): Promise<Record<string, string>> {
    const arquivo = await this.carregador.file;
    if (!arquivo) throw new Error("Nenhuma imagem foi selecionada.");
    const dados = new FormData();
    dados.append("imagem", arquivo);
    const resposta = await fetch("/api/painel/uploads/capas", {
      method: "POST",
      credentials: "include",
      body: dados,
    });
    const corpo = (await resposta.json().catch(() => ({}))) as {
      caminho?: string;
      erro?: string;
    };
    if (!resposta.ok || !corpo.caminho)
      throw new Error(corpo.erro || "Não foi possível enviar a imagem.");
    return {
      default: new URL(corpo.caminho, window.location.origin).toString(),
    };
  }

  abort() {}
}

function integrarUpload(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (carregador) =>
    new AdaptadorUploadMoveOn(carregador);
}

class RemoverCorDeFundo extends Plugin {
  static get pluginName() {
    return "RemoverCorDeFundo" as const;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("removerCorDeFundo", (localidade) => {
      const botao = new ButtonView(localidade);
      botao.set({
        label: "Fundo transparente",
        withText: true,
        tooltip: "Remover somente a cor de fundo do texto selecionado",
      });
      botao.on("execute", () => {
        editor.execute("fontBackgroundColor", { value: undefined });
        editor.editing.view.focus();
      });
      return botao;
    });
  }
}

class LimparFormatacaoVisivel extends Plugin {
  static get pluginName() {
    return "LimparFormatacaoVisivel" as const;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("limparFormatacaoVisivel", (localidade) => {
      const botao = new ButtonView(localidade);
      botao.set({
        label: "Remover formatação",
        icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.8 2.3a2 2 0 0 1 2.8 0l2.1 2.1a2 2 0 0 1 0 2.8l-8.1 8.1a2 2 0 0 1-1.4.6H5.6a2 2 0 0 1-1.4-.6l-1.9-1.9a2 2 0 0 1 0-2.8l10.5-8.3Zm-6.9 11.6h2.3l3.2-3.2-3.7-3.7-4 4a.5.5 0 0 0 0 .7l1.9 1.9a.5.5 0 0 0 .3.3ZM10 5.6l3.7 3.7 2.6-2.6a.5.5 0 0 0 0-.7l-2.1-2.1a.5.5 0 0 0-.7 0L10 5.6ZM3 17h14v1.5H3V17Z"/></svg>',
        tooltip: "Remover todas as formatações do texto selecionado",
      });
      botao.on("execute", () => {
        editor.execute("removeFormat");
        editor.editing.view.focus();
      });
      return botao;
    });
  }
}

class RedimensionamentoVideo extends Plugin {
  static get pluginName() {
    return "RedimensionamentoVideo" as const;
  }

  init() {
    const editor = this.editor;
    editor.model.schema.extend("media", {
      allowAttributes: ["larguraVideo"],
    });
    editor.conversion.for("downcast").attributeToAttribute({
      model: { name: "media", key: "larguraVideo" },
      view: "data-largura-video",
    });
    editor.conversion.for("upcast").attributeToAttribute({
      view: "data-largura-video",
      model: "larguraVideo",
    });

    for (const largura of [25, 50, 75, 100]) {
      const nome = `larguraVideo${largura}`;
      editor.ui.componentFactory.add(nome, (localidade) => {
        const botao = new ButtonView(localidade);
        const atualizarDisponibilidade = () => {
          const elemento = editor.model.document.selection.getSelectedElement();
          botao.isEnabled = Boolean(elemento?.is("element", "media"));
          botao.isOn = elemento?.getAttribute("larguraVideo") === String(largura);
        };
        botao.set({
          label: `Vídeo ${largura}%`,
          withText: true,
          tooltip: `Ajustar o vídeo para ${largura}% da largura do conteúdo`,
        });
        botao.on("execute", () => {
          const elemento = editor.model.document.selection.getSelectedElement();
          if (!elemento?.is("element", "media")) return;
          editor.model.change((escritor) =>
            escritor.setAttribute("larguraVideo", String(largura), elemento),
          );
          editor.editing.view.focus();
        });
        this.listenTo(
          editor.model.document.selection,
          "change",
          atualizarDisponibilidade,
        );
        atualizarDisponibilidade();
        return botao;
      });
    }
  }
}

function normalizarCaminhosDeUploads(html: string) {
  const documento = new DOMParser().parseFromString(html, "text/html");
  documento.querySelectorAll<HTMLImageElement>("img[src]").forEach((imagem) => {
    try {
      const url = new URL(imagem.src);
      if (
        url.origin === window.location.origin &&
        url.pathname.startsWith("/uploads/")
      )
        imagem.setAttribute("src", `${url.pathname}${url.search}`);
    } catch {
      // O backend removerá qualquer endereço inválido durante a sanitização.
    }
  });
  documento.querySelectorAll<HTMLElement>("figure.media").forEach((figura) => {
    const larguraAnterior = figura.getAttribute("data-largura-video");
    if (larguraAnterior && /^([1-9][0-9]?|100)$/.test(larguraAnterior)) {
      figura.classList.add("media_resized");
      figura.style.width = `${larguraAnterior}%`;
      figura.removeAttribute("data-largura-video");
    }
    const recipiente = figura.querySelector<HTMLElement>("div");
    if (!recipiente || recipiente.hasAttribute("data-oembed-url")) return;
    const iframe = recipiente.querySelector<HTMLIFrameElement>("iframe[src]");
    if (iframe?.src) recipiente.setAttribute("data-oembed-url", iframe.src);
  });
  return documento.body.innerHTML;
}

const configuracao = {
  licenseKey: "GPL" as const,
  language: "pt-br",
  translations: [traducoesPortuguesBrasil],
  plugins: [
    AccessibilityHelp,
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Fullscreen,
    Heading,
    Highlight,
    HorizontalLine,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    LimparFormatacaoVisivel,
    MediaEmbed,
    MediaEmbedResize,
    MediaEmbedToolbar,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    RemoverCorDeFundo,
    RedimensionamentoVideo,
    SelectAll,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersEssentials,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo,
    WordCount,
  ],
  extraPlugins: [integrarUpload],
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      "undo", "redo", "|", "heading", "|", "fontFamily", "fontSize",
      "fontColor", "fontBackgroundColor", "removerCorDeFundo", "highlight", "limparFormatacaoVisivel", "|", "bold", "italic",
      "underline", "strikethrough", "subscript", "superscript", "code", "|",
      "alignment", "outdent", "indent", "|", "bulletedList", "numberedList",
      "todoList", "blockQuote", "codeBlock", "horizontalLine", "|", "link",
      "insertImage", "mediaEmbed", "insertTable", "specialCharacters", "|",
      "findAndReplace", "showBlocks", "sourceEditing", "fullscreen",
      "accessibilityHelp",
    ],
  },
  fontFamily: { supportAllValues: true },
  fontSize: {
    options: [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48],
    supportAllValues: true,
  },
  image: {
    toolbar: [
      "imageTextAlternative", "toggleImageCaption", "|", "imageStyle:inline",
      "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight",
      "imageStyle:block", "imageStyle:side", "|", "resizeImage", "linkImage",
    ],
    resizeOptions: [
      { name: "resizeImage:original", value: null, label: "Tamanho original" },
      { name: "resizeImage:25", value: "25", label: "25%" },
      { name: "resizeImage:50", value: "50", label: "50%" },
      { name: "resizeImage:75", value: "75", label: "75%" },
    ],
    resizeUnit: "%" as const,
  },
  table: {
    contentToolbar: [
      "tableColumn", "tableRow", "mergeTableCells", "tableProperties",
      "tableCellProperties", "toggleTableCaption",
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
    decorators: {
      abrirNovaAba: {
        mode: "manual" as const,
        label: "Abrir em nova aba",
        attributes: { target: "_blank", rel: "noopener noreferrer" },
      },
    },
  },
  mediaEmbed: {
    previewsInData: true,
    toolbar: ["resizeMediaEmbed"],
    resizeUnit: "%" as const,
    resizeOptions: [
      { name: "resizeMediaEmbed:original", value: null, icon: "original", label: "Largura original" },
      { name: "resizeMediaEmbed:25", value: "25", icon: "small", label: "25%" },
      { name: "resizeMediaEmbed:50", value: "50", icon: "medium", label: "50%" },
      { name: "resizeMediaEmbed:75", value: "75", icon: "large", label: "75%" },
      { name: "resizeMediaEmbed:custom", value: "custom", icon: "custom", label: "Largura personalizada" },
    ],
  },
  placeholder: "Comece a escrever sua publicação aqui…",
};

function EditorPublicacaoCompletoBase({
  valor,
  aoAlterar,
}: {
  valor: string;
  aoAlterar: (html: string) => void;
}) {
  return (
    <div className="editor-ckeditor-moveon">
      <CKEditor
        editor={ClassicEditor}
        config={configuracao}
        data={normalizarCaminhosDeUploads(valor)}
        onChange={(_evento, editor) =>
          aoAlterar(normalizarCaminhosDeUploads(editor.getData()))
        }
        onError={(erro, detalhes) => {
          console.error("Falha no editor de publicação", erro, detalhes);
        }}
      />
    </div>
  );
}

export const EditorPublicacaoCompleto = memo(
  EditorPublicacaoCompletoBase,
  () => true,
);
