"use client";

import type { CampoFormulario, ConfiguracaoFormularioLead } from "@/interfaces/formulario-lead";
import { useFormularioLead } from "@/hooks/useFormularioLead";

function Controle({ campo }: { campo: CampoFormulario }) {
  const comuns = {
    id: campo.nome,
    name: campo.nome,
    placeholder: campo.placeholder,
    autoComplete: campo.autoComplete,
    required: campo.obrigatorio,
  };
  if (campo.tipo === "select") {
    return (
      <select {...comuns}>
        {campo.opcoes?.map((opcao) => (
          <option key={opcao.rotulo} value={opcao.valor ?? opcao.rotulo}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    );
  }
  if (campo.tipo === "textarea") return <textarea {...comuns} rows={campo.linhas} />;
  return <input {...comuns} type={campo.tipo} />;
}

/** Formulário de contato das landing pages. Envia o lead e, se falhar, abre o e-mail do visitante. */
export default function FormularioLead({ configuracao }: { configuracao: ConfiguracaoFormularioLead }) {
  const { mensagem, enviando, aoEnviar } = useFormularioLead(configuracao);
  const { botao } = configuracao;
  return (
    <form className={configuracao.classe} id="leadForm" aria-describedby="formStatus" onSubmit={aoEnviar}>
      {configuracao.campos.map((campo) => (
        <div key={campo.nome} className={campo.larguraTotal ? "field full" : "field"}>
          <label htmlFor={campo.nome}>{campo.rotulo}</label>
          <Controle campo={campo} />
        </div>
      ))}
      <p className="form-status" id="formStatus">
        {mensagem}
      </p>
      <div className={botao.divClasse}>
        <button className={botao.classe} data-cta={botao.cta} type="submit" disabled={enviando}>
          {botao.texto}
        </button>
      </div>
    </form>
  );
}
