"use client";
import { ArrowLeft, Home } from "lucide-react";
export default function PaginaNaoEncontrada() {
  return (
    <main className="pagina-404">
      <img src="/logo.png" alt="MOVE.ON" />
      <span>ERRO 404</span>
      <h1>Esta página não existe.</h1>
      <p>
        O endereço pode estar incorreto ou o conteúdo pode ter sido removido.
        Você pode voltar ao portal e continuar navegando.
      </p>
      <div>
        <button onClick={() => history.back()}>
          <ArrowLeft /> Voltar
        </button>
        <a href="/">
          <Home /> Ir para o portal
        </a>
      </div>
    </main>
  );
}
