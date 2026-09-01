interface RegistroLimite {
  quantidade: number;
  expiraEm: number;
}

export interface ResultadoLimite {
  permitido: boolean;
  tentativasRestantes: number;
  segundosParaTentarNovamente: number;
}

/**
 * Limitador local de janela fixa, indicado para uma única instância da API.
 * Em múltiplas instâncias, deve usar Redis ou armazenamento compartilhado.
 */
export class LimitadorRequisicoes {
  private readonly registros = new Map<string, RegistroLimite>();

  constructor(
    private readonly maximo: number,
    private readonly janelaMs: number,
  ) {}

  consumir(chave: string): ResultadoLimite {
    const agora = Date.now();
    const anterior = this.registros.get(chave);
    const registro =
      !anterior || anterior.expiraEm <= agora
        ? { quantidade: 0, expiraEm: agora + this.janelaMs }
        : anterior;

    if (registro.quantidade >= this.maximo) {
      return {
        permitido: false,
        tentativasRestantes: 0,
        segundosParaTentarNovamente: Math.max(1, Math.ceil((registro.expiraEm - agora) / 1_000)),
      };
    }

    registro.quantidade += 1;
    this.registros.set(chave, registro);
    this.removerExpiradosSeNecessario(agora);
    return {
      permitido: true,
      tentativasRestantes: Math.max(0, this.maximo - registro.quantidade),
      segundosParaTentarNovamente: Math.max(1, Math.ceil((registro.expiraEm - agora) / 1_000)),
    };
  }

  private removerExpiradosSeNecessario(agora: number): void {
    if (this.registros.size < 10_000) return;
    for (const [chave, registro] of this.registros) {
      if (registro.expiraEm <= agora) this.registros.delete(chave);
    }
  }
}
