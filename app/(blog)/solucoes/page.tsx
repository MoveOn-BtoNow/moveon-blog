import { redirect } from "next/navigation";

/** "O que resolvemos" agora fica na página inicial do site. */
export default function Solucoes() {
  redirect("/#problema");
}
