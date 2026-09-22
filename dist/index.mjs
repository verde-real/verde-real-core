// src/types/usuario.ts
var TIPOS_EMPRESA = ["empresa", "empresa_selo"];
function ehEmpresa(usuario) {
  return !!usuario && (usuario.tipo === "empresa" || usuario.tipo === "empresa_selo");
}
function ehCliente(usuario) {
  return !!usuario && usuario.tipo === "cliente";
}
function temSeloAtivo(usuario) {
  return !!usuario && usuario.tipo === "empresa_selo";
}
var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var SENHA_MIN_CARACTERES = 6;
function validarCadastro(dados) {
  const erros = [];
  if (!dados.nome || !dados.nome.trim()) {
    erros.push({ campo: "nome", mensagem: "Informe seu nome." });
  } else if (dados.nome.trim().length < 2) {
    erros.push({ campo: "nome", mensagem: "O nome precisa ter pelo menos 2 caracteres." });
  }
  if (!dados.email || !dados.email.trim()) {
    erros.push({ campo: "email", mensagem: "Informe seu e-mail." });
  } else if (!REGEX_EMAIL.test(dados.email.trim())) {
    erros.push({ campo: "email", mensagem: "Informe um e-mail v\xE1lido." });
  }
  if (!dados.senha) {
    erros.push({ campo: "senha", mensagem: "Informe uma senha." });
  } else if (dados.senha.length < SENHA_MIN_CARACTERES) {
    erros.push({ campo: "senha", mensagem: `A senha precisa ter pelo menos ${SENHA_MIN_CARACTERES} caracteres.` });
  }
  if (dados.senha !== dados.confirmarSenha) {
    erros.push({ campo: "confirmarSenha", mensagem: "As senhas n\xE3o coincidem." });
  }
  if (dados.tipo !== "cliente" && dados.tipo !== "empresa") {
    erros.push({ campo: "tipo", mensagem: "Selecione o tipo de conta." });
  }
  if (!dados.aceitouTermos) {
    erros.push({ campo: "aceitouTermos", mensagem: "Voc\xEA precisa aceitar os termos de uso." });
  }
  return erros;
}

// src/types/post.ts
var CATEGORIAS = [
  "Desmatamento",
  "Polui\xE7\xE3o",
  "Queimada",
  "Descarte Irregular",
  "\xC1gua",
  "Fauna",
  "Outro"
];
var CORES_CATEGORIA = {
  Desmatamento: "#8D6E4E",
  Polui\u00E7\u00E3o: "#6B7280",
  Queimada: "#E4572E",
  "Descarte Irregular": "#C9963B",
  \u00C1gua: "#2E86AB",
  Fauna: "#A64AC9",
  Outro: "#2F6B4F"
};
var STATUS_LABEL = {
  recebida: "Recebida",
  em_analise: "Em an\xE1lise",
  resolvida: "Resolvida",
  rejeitada: "Rejeitada"
};
function rotuloConquista(totalDenuncias) {
  if (totalDenuncias >= 10) return "Guardi\xE3o Verde \u{1F333}";
  if (totalDenuncias >= 3) return "Vigilante Ambiental \u{1F33F}";
  return "Iniciante \u{1F331}";
}

// src/types/notificacao.ts
function mapearNotificacao(linha) {
  return {
    id: linha.id,
    tipo: linha.tipo,
    mensagem: linha.mensagem,
    lida: linha.lida,
    postId: linha.post_id,
    empresaId: linha.empresa_id,
    atorId: linha.ator_id,
    criadoEm: linha.criado_em
  };
}
var ICONE_FONTAWESOME_POR_TIPO = {
  curtida: "fa-heart",
  comentario: "fa-comment",
  status_denuncia: "fa-flag",
  selo_empresa: "fa-award",
  seguidor: "fa-user-plus"
};
var ICONE_IONICONS_POR_TIPO = {
  curtida: "heart",
  comentario: "chatbubble",
  status_denuncia: "flag",
  selo_empresa: "ribbon",
  seguidor: "person-add"
};
function formatarTempoRelativo(criadoEm) {
  const diffMs = Date.now() - new Date(criadoEm).getTime();
  const minutos = Math.floor(diffMs / 6e4);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  return `${dias}d`;
}

// src/services/notificacoes.ts
function criarServicoNotificacoes(supabase) {
  return {
    async buscarNotificacoes(usuarioId, limite = 50) {
      const { data, error } = await supabase.from("notificacoes").select("*").eq("destinatario_id", usuarioId).order("criado_em", { ascending: false }).limit(limite);
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearNotificacao);
    },
    async contarNaoLidas(usuarioId) {
      const { count, error } = await supabase.from("notificacoes").select("*", { count: "exact", head: true }).eq("destinatario_id", usuarioId).eq("lida", false);
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    async marcarComoLida(notificacaoId) {
      const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("id", notificacaoId);
      if (error) throw new Error(error.message);
    },
    async marcarTodasComoLidas(usuarioId) {
      const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("destinatario_id", usuarioId).eq("lida", false);
      if (error) throw new Error(error.message);
    },
    async deletarNotificacao(notificacaoId) {
      const { error } = await supabase.from("notificacoes").delete().eq("id", notificacaoId);
      if (error) throw new Error(error.message);
    },
    ouvirNovasNotificacoes(usuarioId, aoReceber) {
      const nomeCanal = `notificacoes:${usuarioId}:${Date.now()}`;
      const canal = supabase.channel(nomeCanal).on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificacoes",
          filter: `destinatario_id=eq.${usuarioId}`
        },
        (payload) => aoReceber(mapearNotificacao(payload.new))
      ).subscribe();
      return () => {
        supabase.removeChannel(canal);
      };
    }
  };
}
export {
  CATEGORIAS,
  CORES_CATEGORIA,
  ICONE_FONTAWESOME_POR_TIPO,
  ICONE_IONICONS_POR_TIPO,
  STATUS_LABEL,
  TIPOS_EMPRESA,
  criarServicoNotificacoes,
  ehCliente,
  ehEmpresa,
  formatarTempoRelativo,
  mapearNotificacao,
  rotuloConquista,
  temSeloAtivo,
  validarCadastro
};
