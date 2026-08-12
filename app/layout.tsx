import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL("https://moveon.blog"),title:"MOVE.ON — Conteúdo que move",description:"Informação, ideias e histórias para quem não para de evoluir.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"MOVE.ON — Conteúdo que move",description:"Informação, ideias e histórias para quem não para de evoluir.",images:["/og.png"],locale:"pt_BR",type:"website"},twitter:{card:"summary_large_image",title:"MOVE.ON — Conteúdo que move",description:"Informação, ideias e histórias para quem não para de evoluir.",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
