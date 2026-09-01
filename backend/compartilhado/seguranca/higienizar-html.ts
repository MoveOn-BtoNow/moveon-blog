import sanitizeHtml from "sanitize-html";

export function higienizarConteudoHtml(conteudo: string): string {
  return sanitizeHtml(conteudo, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "figure",
      "figcaption",
      "pre",
      "code",
      "hr",
      "div",
      "span",
      "iframe",
      "video",
      "source",
      "font",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "caption",
      "oembed",
      "mark",
      "sub",
      "sup",
      "label",
      "input",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      iframe: [
        "src",
        "title",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "loading",
      ],
      video: ["src", "controls", "preload", "poster", "width", "height"],
      source: ["src", "type"],
      font: ["color", "face", "size"],
      oembed: ["url"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
      ol: ["start", "reversed"],
      li: ["value"],
      input: ["type", "checked", "disabled"],
      div: ["data-oembed-url"],
      "*": ["class", "data-alinhamento", "data-largura-video", "style"],
    },
    allowedClasses: {
      code: ["language-*"],
      "*": [
        "alinha-esquerda",
        "alinha-centro",
        "alinha-direita",
        "midia-conteudo",
        "midia-redimensionavel",
        "video-conteudo",
        "image",
        "image_resized",
        "media_resized",
        "image-style-align-left",
        "image-style-align-center",
        "image-style-align-right",
        "image-style-side",
        "media",
        "table",
        "todo-list",
        "todo-list__label",
        "todo-list__label__description",
      ],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right|justify)$/],
        color: [
          /^#[0-9a-f]{3,8}$/i,
          /^rgba?\([0-9 ,.%]+\)$/i,
          /^hsla?\([0-9 ,.%+-]+\)$/i,
          /^transparent$/i,
        ],
        "background-color": [
          /^#[0-9a-f]{3,8}$/i,
          /^rgba?\([0-9 ,.%]+\)$/i,
          /^hsla?\([0-9 ,.%+-]+\)$/i,
          /^transparent$/i,
        ],
        "font-family": [
          /^[a-z0-9 ,'"-]{1,160}$/i,
        ],
        "font-size": [/^(12|14|16|18|20|24|28|32|36|42|48)px$/],
        width: [
          /^([1-9][0-9]{0,3}|10000)px$/,
          /^(100(?:\.0+)?|[0-9]{1,2}(?:\.[0-9]+)?)%$/,
        ],
        "max-width": [/^100%$/],
        height: [/^([1-9][0-9]{0,3}|10000)px$/],
        float: [/^(left|right)$/],
        "list-style-type": [
          /^(disc|circle|square|decimal|decimal-leading-zero|lower-alpha|upper-alpha|lower-roman|upper-roman|none)$/i,
        ],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"], iframe: ["https"], video:["https"], source:["https"] },
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
      "www.dailymotion.com",
      "open.spotify.com",
    ],
    transformTags: {
      a: (nomeTag, atributos) => {
        const externos = /^https?:\/\//i.test(atributos.href ?? "");
        const seguros = { ...atributos };
        if (externos) {
          seguros.target = "_blank";
          seguros.rel = "noopener noreferrer";
        } else {
          delete seguros.target;
          delete seguros.rel;
        }
        return { tagName: nomeTag, attribs: seguros };
      },
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
        decoding: "async",
      }),
      iframe: sanitizeHtml.simpleTransform("iframe", { loading: "lazy" }),
      video: sanitizeHtml.simpleTransform("video", { controls: "", preload: "metadata" }),
    },
    exclusiveFilter: (quadro) => {
      if (quadro.tag === "img")
        return !(/^(https?:\/\/|\/uploads\/)/i.test(quadro.attribs.src ?? ""));
      if (quadro.tag === "iframe")
        return !/^https:\/\//i.test(quadro.attribs.src ?? "");
      if (["video","source"].includes(quadro.tag))
        return !/^https:\/\//i.test(quadro.attribs.src ?? "");
      return false;
    },
  }).trim();
}
