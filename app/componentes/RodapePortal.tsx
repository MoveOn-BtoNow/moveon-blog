export default function RodapePortal({
  logo = "/logo.png",
  descricao = "Conteúdo que move",
}: {
  logo?: string;
  descricao?: string;
}) {
  return (
    <footer className="rodape-portal">
      <div className="rodape-identidade">
        <img src={logo || "/logo.png"} alt="MOVE.ON" />
        <p>{descricao}</p>
      </div>
      <section className="rodape-parceiros-tecnologia" aria-label="Parceiros oficiais de tecnologia">
        <p>Parceiro oficial dos principais players de tecnologia do mundo.</p>
        <div>
          <img src="/SAP.png" alt="SAP" loading="lazy" />
          <img src="/AWS.png" alt="AWS" loading="lazy" />
          <img src="/Google_Cloud_vertical.png" alt="Google Cloud" loading="lazy" />
          <img src="/ASUG-Brasil.png" alt="ASUG Brasil" loading="lazy" />
        </div>
      </section>
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
    </footer>
  );
}
