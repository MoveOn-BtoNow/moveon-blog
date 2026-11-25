export default function SecaoContexto() {
  return (
    <section className="section dark" id="contexto">
      <div className="grid-bg" />
      <div className="container">
        <div className="centered-head">
          <h2 className="section-title reveal">A Reforma Tributária exige adequação contínua até 2033</h2>
        </div>
        <p className="context-lead reveal"><strong>Entre 2025 e 2033</strong>, sua empresa vai precisar <strong>adequar o SAP a múltiplas mudanças</strong>: CBS, IBS, novo regime de créditos, alterações no SPED, impactos em tecnologia e operações, além de ajustes contínuos no compliance fiscal. Cada uma exige <strong>configuração técnica, testes, validação fiscal e governança</strong>. E a regulamentação ainda está em construção com <strong>novos ajustes saindo a cada semestre</strong>.</p>
        <div className="pain-closer warn reveal">
          <span className="pain-closer-mark" aria-hidden="true" />
          {" "}
          <span className="pain-warn-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </span>
          <p>Adequação tributária no SAP feita às pressas custa caro: <strong>aumenta riscos, retrabalhos e horas extra do time fiscal e de TI.</strong></p>
        </div>
      </div>
    </section>
  );
}
