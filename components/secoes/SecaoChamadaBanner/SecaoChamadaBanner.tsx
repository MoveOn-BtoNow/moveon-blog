import type { BotaoChamada, FundoSecao } from "@/interfaces/secoes";

interface SecaoChamadaBannerProps {
  titulo: string;
  chamada: BotaoChamada;
  fundo?: FundoSecao;
}

/** Faixa de chamada com título e botão (bloco `.cta-banner`). */
export default function SecaoChamadaBanner({ titulo, chamada, fundo }: SecaoChamadaBannerProps) {
  return (
    <section className={fundo ? `section ${fundo}` : "section"}>
      <div className="container">
        <div className="cta-banner">
          <h2>{titulo}</h2>
          <a href={chamada.href} className="btn btn-primary">
            {chamada.rotulo}
          </a>
        </div>
      </div>
    </section>
  );
}
