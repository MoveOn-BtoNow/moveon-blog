"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Estado do cabeçalho das landing pages: se a página já rolou (classe `scrolled`)
 * e se o menu mobile está aberto (classe `classeCorpo` no <body>, que trava a rolagem).
 */
export function useMenuNavegacao(limiteRolagem = 18, classeCorpo = "menu-open") {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > limiteRolagem);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, [limiteRolagem]);

  useEffect(() => {
    document.body.classList.toggle(classeCorpo, menuAberto);
    return () => document.body.classList.remove(classeCorpo);
  }, [menuAberto, classeCorpo]);

  const alternarMenu = useCallback(() => setMenuAberto((aberto) => !aberto), []);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return { rolou, menuAberto, alternarMenu, fecharMenu };
}
