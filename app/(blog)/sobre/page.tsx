import { redirect } from "next/navigation";

/** "Quem Somos" agora fica na página inicial do site, junto com a liderança atual. */
export default function Sobre() {
  redirect("/#quem-somos");
}
