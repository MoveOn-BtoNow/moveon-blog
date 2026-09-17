"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export default function RecuperarSenha() {
  const [token, setToken] = useState("");
  const [estado, setEstado] = useState<"solicitar"|"validando"|"redefinir"|"invalido">("solicitar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  useEffect(() => {
    const valor = new URLSearchParams(location.search).get("token");
    if (!valor) return;
    history.replaceState(null,"",location.pathname);
    queueMicrotask(()=>{setToken(valor);setEstado("validando");});
    fetch(`/api/autenticacao/recuperar-senha/validar?token=${encodeURIComponent(valor)}`,{cache:"no-store"})
      .then(r=>r.json()).then(d=>setEstado(d.valido?"redefinir":"invalido"))
      .catch(()=>setEstado("invalido"));
  },[]);
  async function enviar(evento: FormEvent) {
    evento.preventDefault(); setErro(""); setMensagem(""); setEnviando(true);
    try {
      if (estado==="redefinir") {
        if (senha!==confirmarSenha) { setErro("As senhas não coincidem."); return; }
        const requisitos=[senha.length>=8,/[A-Z]/.test(senha),/[a-z]/.test(senha),/[0-9]/.test(senha),/[^A-Za-z0-9\s]/.test(senha),!/\s/.test(senha)];
        if (requisitos.some(v=>!v)) {setErro("A senha precisa cumprir todos os requisitos abaixo.");return;}
      }
      const resposta=await fetch(estado==="redefinir"?"/api/autenticacao/recuperar-senha/confirmar":"/api/autenticacao/recuperar-senha",{
        method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",
        body:JSON.stringify(estado==="redefinir"?{token,senha,confirmarSenha}:{email})});
      const dados=await resposta.json();
      if (!resposta.ok) {setErro(dados.erro||"Não foi possível concluir a solicitação.");if(resposta.status===410)setEstado("invalido");return;}
      if (estado==="redefinir") {location.replace("/admin?senha=alterada");return;}
      setMensagem(dados.mensagem);
    } catch {setErro("Não foi possível conectar ao servidor. Tente novamente mais tarde.");}
    finally {setEnviando(false);}
  }
  return <main className="login-banco"><form onSubmit={enviar} aria-busy={enviando}>
    <Image src="/logo.png" alt="MOVE.ON" width={240} height={100} unoptimized/><span>SEGURANÇA ADMINISTRATIVA</span>
    <h1>{estado==="redefinir"?"Crie uma nova senha":"Recuperar acesso"}</h1>
    {estado==="invalido"?<p role="alert">Este link expirou ou já foi utilizado. Solicite uma nova recuperação.</p>:null}
    {(estado==="solicitar"||estado==="invalido")&&<label>E-mail cadastrado<div className="campo-senha"><Mail aria-hidden="true"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Digite o e-mail" autoComplete="email" required maxLength={254}/></div></label>}
    {estado==="redefinir"&&<><label>Nova senha<div className="campo-senha"><input type={mostrar?"text":"password"} value={senha} onChange={e=>setSenha(e.target.value)} autoComplete="new-password" required minLength={8} maxLength={128}/><button type="button" onClick={()=>setMostrar(!mostrar)} aria-label={mostrar?"Ocultar senha":"Mostrar senha"}>{mostrar?<EyeOff/>:<Eye/>}</button></div></label><label>Confirme a nova senha<input type={mostrar?"text":"password"} value={confirmarSenha} onChange={e=>setConfirmarSenha(e.target.value)} autoComplete="new-password" required/></label><p>Use ao menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial, sem espaços.</p></>}
    {mensagem&&<div className="sucesso-seguranca" role="status">{mensagem}</div>}{erro&&<div className="erro-api" role="alert">{erro}</div>}
    {estado!=="validando"&&<button className="salvar2" disabled={enviando}><LockKeyhole/>{enviando?" Aguarde…":estado==="redefinir"?" Confirmar nova senha":" Enviar link de recuperação"}</button>}
    <Link className="link-voltar" href="/admin">← Voltar ao login</Link>
  </form></main>;
}
