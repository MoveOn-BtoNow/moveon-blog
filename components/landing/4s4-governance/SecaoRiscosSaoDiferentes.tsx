export default function SecaoRiscosSaoDiferentes() {
  return (
    <section className="section dim">
      <div className="container">
        <div className="section-head">
          <span className="tag">Brownfield, Greenfield ou Híbrido</span>
          <h2>Os riscos são diferentes — e a governança também precisa ser</h2>
          <p>Hoje só o formulário pergunta qual é o seu cenário. Mas Brownfield, Greenfield e projetos híbridos carregam riscos bem distintos, e é isso que muda o foco da governança.</p>
        </div>
        <div className="risk-compare">
          <div className="risk-col">
            <h3>Brownfield</h3>
            <span className="subtitle">Evolução de um SAP que já está em produção (ex: ECC → S/4HANA)</span>
            <ul>
              <li>Dívida técnica e customizações antigas que ninguém quer tocar</li>
              <li>Migração de dados históricos com alto risco de erro</li>
              <li>Janela de corte (cutover) que pode parar a operação</li>
              <li>{"Resistência a mudar processos que \"já funcionam\""}</li>
            </ul>
            <div className="fit">Frentes mais acionadas: <b>Setup</b> e <b>Assure</b></div>
          </div>
          <div className="risk-col">
            <h3>Greenfield</h3>
            <span className="subtitle">Implementação nova, desenhada do zero</span>
            <ul>
              <li>Escopo mal definido no início, que cresce sem controle depois</li>
              <li>Redesenho de processo sem envolvimento real das áreas</li>
              <li>Requisitos pouco claros até tarde no projeto</li>
              <li>Adoção lenta — o sistema entra, mas o time não usa</li>
            </ul>
            <div className="fit">Frentes mais acionadas: <b>Setup</b> e <b>Track</b></div>
          </div>
          <div className="risk-col">
            <h3>Híbrido</h3>
            <span className="subtitle">Combina evolução de áreas já existentes com implementação nova em outras (ex: rollout multi-país, fusões e aquisições)</span>
            <ul>
              <li>Modelos de governança diferentes convivendo no mesmo projeto</li>
              <li>Dependências cruzadas entre o que já existe e o que é novo</li>
              <li>Times com maturidade e ritmo desiguais entre as frentes</li>
              <li>{"Risco de uma frente \"carregar\" a outra sem visibilidade executiva"}</li>
            </ul>
            <div className="fit">Frentes mais acionadas: <b>Setup</b>, <b>Track</b> e <b>Assure</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}
