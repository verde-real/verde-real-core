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

// src/services/curtidas.ts
function criarServicoCurtidas(supabase) {
  return {
    async alternarCurtida(usuarioId, postId, curtidoAtualmente) {
      if (curtidoAtualmente) {
        const { error } = await supabase.from("curtidas").delete().eq("user_id", usuarioId).eq("post_id", postId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("curtidas").insert({ user_id: usuarioId, post_id: postId });
        if (error) throw new Error(error.message);
      }
    },
    async verificarCurtida(usuarioId, postId) {
      const { data, error } = await supabase.from("curtidas").select("id").eq("post_id", postId).eq("user_id", usuarioId).maybeSingle();
      if (error) return false;
      return !!data;
    }
  };
}

// src/services/comentarios.ts
function mapearComentario(linha) {
  return {
    id: linha.id,
    conteudo: linha.conteudo,
    criadoEm: linha.criado_em,
    autor: { id: linha.autor?.id, nome: linha.autor?.nome ?? "Usu\xE1rio", avatarUrl: linha.autor?.avatar_url ?? null }
  };
}
function criarServicoComentarios(supabase) {
  return {
    async buscarComentarios(postId) {
      const { data, error } = await supabase.from("comentarios").select("*, autor:profiles!comentarios_autor_id_fkey(*)").eq("post_id", postId).order("criado_em", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearComentario);
    },
    async criarComentario(postId, autorId, conteudo) {
      if (!conteudo || !conteudo.trim()) throw new Error("Digite um coment\xE1rio.");
      const { data, error } = await supabase.from("comentarios").insert({ post_id: postId, autor_id: autorId, conteudo: conteudo.trim() }).select("*, autor:profiles!comentarios_autor_id_fkey(*)").single();
      if (error) throw new Error(error.message);
      return mapearComentario(data);
    }
  };
}

// src/services/posts.ts
function mapearPost(linha, idsCurtidos) {
  return {
    id: linha.id,
    conteudo: linha.conteudo,
    categoria: linha.categoria,
    status: linha.status,
    midiaUrl: linha.midia_url,
    tipoMidia: linha.tipo_midia,
    latitude: linha.latitude,
    longitude: linha.longitude,
    criadoEm: linha.criado_em,
    autor: {
      id: linha.autor.id,
      nome: linha.autor.nome,
      email: linha.autor.email,
      tipo: linha.autor.tipo,
      avatarUrl: linha.autor.avatar_url
    },
    empresa: linha.empresa ? {
      id: linha.empresa.id,
      nome: linha.empresa.nome,
      email: linha.empresa.email,
      tipo: linha.empresa.tipo,
      avatarUrl: linha.empresa.avatar_url
    } : null,
    totalCurtidas: linha.curtidas?.[0]?.count ?? 0,
    curtidoPorMim: idsCurtidos.has(linha.id)
  };
}
var SELECT_POST = `*,
  autor:profiles!posts_autor_id_fkey(*),
  empresa:profiles!posts_empresa_id_fkey(*),
  curtidas(count)`;
function criarServicoPosts(supabase) {
  async function idsCurtidosDoUsuario(usuarioId) {
    if (!usuarioId) return /* @__PURE__ */ new Set();
    const { data } = await supabase.from("curtidas").select("post_id").eq("user_id", usuarioId);
    return new Set((data ?? []).map((c) => c.post_id));
  }
  return {
    async buscarPosts(usuarioId, categoria) {
      let query = supabase.from("posts").select(SELECT_POST).order("criado_em", { ascending: false });
      if (categoria) query = query.eq("categoria", categoria);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha) => mapearPost(linha, idsCurtidos));
    },
    async buscarPostPorId(postId, usuarioId) {
      const { data, error } = await supabase.from("posts").select(SELECT_POST).eq("id", postId).single();
      if (error || !data) return null;
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return mapearPost(data, idsCurtidos);
    },
    async criarPost(dados) {
      const { data, error } = await supabase.from("posts").insert({
        autor_id: dados.autorId,
        conteudo: dados.conteudo,
        categoria: dados.categoria,
        midia_url: dados.midiaUrl ?? null,
        tipo_midia: dados.tipoMidia ?? null,
        latitude: dados.latitude ?? null,
        longitude: dados.longitude ?? null,
        empresa_id: dados.empresaId ?? null
      }).select(SELECT_POST).single();
      if (error) throw new Error(error.message);
      return mapearPost(data, /* @__PURE__ */ new Set());
    },
    async buscarPostsPorAutor(autorId, usuarioId) {
      const { data, error } = await supabase.from("posts").select(SELECT_POST).eq("autor_id", autorId).order("criado_em", { ascending: false });
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha) => mapearPost(linha, idsCurtidos));
    },
    async buscarPostsPorEmpresa(empresaId, usuarioId) {
      const { data, error } = await supabase.from("posts").select(SELECT_POST).eq("empresa_id", empresaId).order("criado_em", { ascending: false });
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha) => mapearPost(linha, idsCurtidos));
    },
    async buscarPostsCurtidosPorMim(usuarioId) {
      const { data: curtidas, error: erroCurtidas } = await supabase.from("curtidas").select("post_id").eq("user_id", usuarioId);
      if (erroCurtidas) throw new Error(erroCurtidas.message);
      const idsPosts = (curtidas ?? []).map((c) => c.post_id);
      if (idsPosts.length === 0) return [];
      const { data, error } = await supabase.from("posts").select(SELECT_POST).in("id", idsPosts).order("criado_em", { ascending: false });
      if (error) throw new Error(error.message);
      const idsCurtidosSet = new Set(idsPosts);
      return (data ?? []).map((linha) => mapearPost(linha, idsCurtidosSet));
    },
    async buscarEmpresas(termo) {
      if (!termo.trim()) return [];
      const { data, error } = await supabase.from("profiles").select("id, nome, avatar_url").eq("tipo", "empresa").ilike("nome", `%${termo.trim()}%`).limit(8);
      if (error) throw new Error(error.message);
      return data ?? [];
    }
  };
}

// src/services/seguidores.ts
function criarServicoSeguidores(supabase) {
  return {
    async estaSeguindo(seguidorId, empresaId) {
      const { data, error } = await supabase.from("seguidores_empresa").select("id").eq("seguidor_id", seguidorId).eq("empresa_id", empresaId).maybeSingle();
      if (error) throw new Error(error.message);
      return !!data;
    },
    async seguirEmpresa(seguidorId, empresaId) {
      const { error } = await supabase.from("seguidores_empresa").insert({ seguidor_id: seguidorId, empresa_id: empresaId });
      if (error) throw new Error(error.message);
    },
    async deixarDeSeguir(seguidorId, empresaId) {
      const { error } = await supabase.from("seguidores_empresa").delete().eq("seguidor_id", seguidorId).eq("empresa_id", empresaId);
      if (error) throw new Error(error.message);
    },
    async contarSeguidores(empresaId) {
      const { count, error } = await supabase.from("seguidores_empresa").select("*", { count: "exact", head: true }).eq("empresa_id", empresaId);
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    async contarSeguindo(seguidorId) {
      const { count, error } = await supabase.from("seguidores_empresa").select("*", { count: "exact", head: true }).eq("seguidor_id", seguidorId);
      if (error) throw new Error(error.message);
      return count ?? 0;
    }
  };
}

// src/services/ranking.ts
function criarServicoRanking(supabase) {
  return {
    async buscarRanking(limite = 50) {
      const { data, error } = await supabase.from("ranking").select("*").limit(limite);
      if (error) throw new Error(error.message);
      return (data ?? []).map((linha) => ({
        id: linha.id,
        nome: linha.nome,
        avatarUrl: linha.avatar_url,
        totalDenuncias: linha.total_denuncias
      }));
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
  criarServicoComentarios,
  criarServicoCurtidas,
  criarServicoNotificacoes,
  criarServicoPosts,
  criarServicoRanking,
  criarServicoSeguidores,
  ehCliente,
  ehEmpresa,
  formatarTempoRelativo,
  mapearNotificacao,
  rotuloConquista,
  temSeloAtivo,
  validarCadastro
};
