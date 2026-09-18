"use client";

import { useEffect, useState } from "react";
import { MailCheck, Send, ShieldCheck } from "lucide-react";

type Configuracao = {
  emailAtivo:boolean; smtpHost:string; smtpPorta:number; smtpSeguro:boolean;
  smtpUsuario:string; smtpSenha:string; smtpSenhaConfigurada:boolean;
  emailRemetenteNome:string; emailRemetenteEndereco:string;
  emailSegredoCancelamento:string; emailSegredoConfigurado:boolean;
};

async function requisitar<T>(caminho:string,opcoes:RequestInit={}):Promise<T> {
  const resposta=await fetch(`/api/painel/servidor-email${caminho}`,{
    credentials:"include",cache:"no-store",...opcoes,
    headers:{"Content-Type":"application/json",...opcoes.headers},
  });
  const dados=await resposta.json().catch(()=>({}));
  if (!resposta.ok) {
    const campos=dados.detalhes?.fieldErrors as Record<string,string[]>|undefined;
    const primeiro=campos&&Object.entries(campos).find(([,mensagens])=>mensagens.length);
    throw new Error(primeiro?`${primeiro[0]}: ${primeiro[1][0]}`:dados.erro||"Não foi possível concluir a operação.");
  }
  return dados as T;
}

export default function PainelServidorEmail() {
  const [dados,setDados]=useState<Configuracao|null>(null);
  const [editando,setEditando]=useState(false);
  const [ocupado,setOcupado]=useState(false);
  const [testando,setTestando]=useState(false);
  const [erro,setErro]=useState("");
  const [aviso,setAviso]=useState("");
  async function carregar() {
    const atual=await requisitar<Configuracao>("");
    setDados({...atual,smtpSenha:"",emailSegredoCancelamento:""});
  }
  useEffect(()=>{void requisitar<Configuracao>("").then(atual=>setDados({...atual,smtpSenha:"",emailSegredoCancelamento:""})).catch(e=>setErro(e.message));},[]);
  function alterar<K extends keyof Configuracao>(chave:K,valor:Configuracao[K]) {
    setDados(atual=>atual?{...atual,[chave]:valor}:atual);
  }
  async function salvar() {
    if (!dados) return;
    setOcupado(true);setErro("");setAviso("");
    try {
      await requisitar("",{method:"PUT",body:JSON.stringify({
        emailAtivo:dados.emailAtivo,smtpHost:dados.smtpHost.trim(),smtpPorta:Number(dados.smtpPorta),
        smtpSeguro:dados.smtpSeguro,smtpUsuario:dados.smtpUsuario.trim(),
        smtpSenha:dados.smtpSenha||undefined,emailRemetenteNome:dados.emailRemetenteNome.trim(),
        emailRemetenteEndereco:dados.emailRemetenteEndereco.trim(),
        emailSegredoCancelamento:dados.emailSegredoCancelamento||undefined,
      })});
      await carregar();setEditando(false);
      setAviso("Configuração salva. Faça um envio de teste para verificar a conexão e as credenciais.");
    } catch(e) {setErro((e as Error).message);}
    finally {setOcupado(false);}
  }
  async function testar() {
    setTestando(true);setErro("");setAviso("");
    try {
      const resposta=await requisitar<{mensagem:string}>("/testar",{method:"POST",body:"{}"});
      setAviso(resposta.mensagem);
    } catch(e) {setErro((e as Error).message);}
    finally {setTestando(false);}
  }
  return <section className="pagina2 servidor-email-pagina">
    <div className="dash-card servidor-email-admin">
      <div className="card-head2"><div><small>CONFIGURAÇÃO PROTEGIDA</small><h2>Servidor de e-mail</h2></div>
        <button className="habilitar-servidor-email" type="button" disabled={!dados||ocupado||testando}
          onClick={()=>{if(editando){void carregar().catch(e=>setErro(e.message));}setEditando(!editando);setErro("");setAviso("");}}>
          {editando?"Cancelar edição":"Habilitar edição"}
        </button></div>
      <p>Esta configuração é usada pela recuperação de senha, newsletter e mensagens de contato. Os segredos são criptografados e não retornam ao navegador.</p>
      {!dados?<p>Carregando configuração…</p>:<div className="config-grid2">
        <label className="check-email-ativo"><span>Envio de e-mail ativo</span><input type="checkbox" checked={dados.emailAtivo} disabled={!editando} onChange={e=>alterar("emailAtivo",e.target.checked)}/></label>
        <label>SMTP_HOST<input value={dados.smtpHost} disabled={!editando} placeholder="smtp.gmail.com" onChange={e=>alterar("smtpHost",e.target.value)}/></label>
        <label>SMTP_PORTA<input type="number" min={1} max={65535} value={dados.smtpPorta} disabled={!editando} onChange={e=>alterar("smtpPorta",Number(e.target.value))}/></label>
        <label className="check-email-ativo"><span>SMTP_SEGURO (TLS direto)</span><input type="checkbox" checked={dados.smtpSeguro} disabled={!editando} onChange={e=>alterar("smtpSeguro",e.target.checked)}/></label>
        <p className="smtp-ajuda">Porta 465: TLS direto ligado. Porta 587: TLS direto desligado (STARTTLS).</p>
        <label>SMTP_USUARIO<input value={dados.smtpUsuario} disabled={!editando} autoComplete="username" placeholder="E-mail completo da conta remetente" onChange={e=>alterar("smtpUsuario",e.target.value)}/></label>
        <label>SMTP_SENHA<input type="password" value={dados.smtpSenha} disabled={!editando} autoComplete="new-password" placeholder={dados.smtpSenhaConfigurada?"Senha configurada — digite apenas para trocar":"Informe a senha de app SMTP"} onChange={e=>alterar("smtpSenha",e.target.value)}/><small>{dados.smtpSenhaConfigurada?"Senha armazenada com criptografia.":"Nenhuma senha salva no banco; verifique também o .env."}</small></label>
        <label>EMAIL_REMETENTE_NOME<input value={dados.emailRemetenteNome} disabled={!editando} onChange={e=>alterar("emailRemetenteNome",e.target.value)}/></label>
        <label>EMAIL_REMETENTE_ENDERECO<input type="email" value={dados.emailRemetenteEndereco} disabled={!editando} onChange={e=>alterar("emailRemetenteEndereco",e.target.value)}/></label>
        <label className="segredo-email">EMAIL_SEGREDO_CANCELAMENTO<input type="password" minLength={32} value={dados.emailSegredoCancelamento} disabled={!editando} autoComplete="new-password" placeholder={dados.emailSegredoConfigurado?"Segredo configurado — digite apenas para trocar":"Mínimo de 32 caracteres"} onChange={e=>alterar("emailSegredoCancelamento",e.target.value)}/><small>Assina links de cancelamento da newsletter. Trocar este segredo invalida links anteriores.</small></label>
        {editando&&<button className="salvar2" type="button" disabled={ocupado} onClick={()=>void salvar()}>{ocupado?"Salvando…":"Salvar servidor de e-mail"}</button>}
      </div>}
    </div>
    <div className="dash-card servidor-email-teste">
      <MailCheck aria-hidden="true"/><div><small>TESTE REAL</small><h2>Testar envio</h2><p>Envia uma mensagem de teste somente para o e-mail cadastrado do administrador. O teste verifica conexão, autenticação e aceitação pelo provedor; a chegada à caixa de entrada ainda depende do provedor de destino.</p><p>Limite: um teste por minuto e cinco por hora.</p></div>
      <button className="salvar2" type="button" disabled={!dados||!dados.emailAtivo||editando||testando||ocupado} onClick={()=>void testar()}><Send aria-hidden="true"/>{testando?" Testando…":" Enviar e-mail de teste"}</button>
    </div>
    {erro&&<div className="erro-api" role="alert">{erro}</div>}
    {aviso&&<div className="sucesso-seguranca" role="status"><ShieldCheck aria-hidden="true"/> {aviso}</div>}
  </section>;
}
