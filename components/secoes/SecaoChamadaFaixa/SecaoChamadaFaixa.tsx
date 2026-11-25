import type { BotaoChamada } from "@/interfaces/secoes";

interface SecaoChamadaFaixaProps {
  titulo: string;
  chamada: BotaoChamada;
  /** Fundo laranja sólido (classe `cta-band-solid`). */
  solida?: boolean;
  /** Mostra a grade decorativa de fundo. */
  comGrade?: boolean;
}

/** Faixa de chamada entre seções (PMO, Tax e COE SAP). */
export default function SecaoChamadaFaixa({ titulo, chamada, solida, comGrade }: SecaoChamadaFaixaProps) {
  return (
    <section className={solida ? "cta-band cta-band-solid" : "cta-band"} aria-label="Chamada para ação">
      {comGrade && <div className="grid-bg" />}
      <div className="container cta-band-inner reveal">
        <h2 className="cta-band-title">{titulo}</h2>
        <a className="btn btn-primary cta-track cta-band-btn" data-cta={chamada.cta} href={chamada.href}>
          {chamada.rotulo}
        </a>
      </div>
    </section>
  );
}
