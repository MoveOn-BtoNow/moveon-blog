export default function RodapePortal({
  logo = "/logo.png",
}: {
  logo?: string;
}) {
  return (
    <footer className="rodape-portal">
      <div className="rodape-identidade">
        <img src={logo || "/logo.png"} alt="MOVE.ON" />
      </div>
      <nav className="rodape-menu" aria-label="Menu institucional">
        <strong>Menu</strong>
        <a href="/">Início</a>
        <a href="/#publicacoes">Publicações</a>
        <a href="/sobre">Quem Somos</a>
        <a href="/solucoes">O que resolvemos</a>
        <a href="/contato">Contato</a>
      </nav>
      <div className="rodape-dados">
        <div>
          <strong>CNPJ</strong>
          <span>43.247.308/0001-49</span>
        </div>
        <div>
          <strong>Contato</strong>
          <a href="mailto:contato@moveon.consulting">
            contato@moveon.consulting
          </a>
        </div>
        <nav className="rodape-legal" aria-label="Documentos legais">
          <a href="/termos">Termos de Uso</a>
          <a href="/politica-de-privacidade">Política de Privacidade</a>
        </nav>
      </div>
      <div className="rodape-base">
        <span>© {new Date().getFullYear()} MOVE.ON. Todos os direitos reservados.</span>
        <span>CNPJ 43.247.308/0001-49</span>
      </div>
    </footer>
  );
}
