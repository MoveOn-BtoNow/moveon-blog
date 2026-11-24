/** Dados estruturados (schema.org) em JSON-LD para buscadores. */
export default function DadosEstruturados({ dados }: { dados: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />;
}
