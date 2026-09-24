"use strict";
var VerdeRealCore = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    BUCKET_DOCUMENTOS_SELO: () => BUCKET_DOCUMENTOS_SELO,
    CATEGORIAS: () => CATEGORIAS,
    CORES_CATEGORIA: () => CORES_CATEGORIA,
    EXTENSOES_DOCUMENTO_PERMITIDAS: () => EXTENSOES_DOCUMENTO_PERMITIDAS,
    ErroSolicitacaoSelo: () => ErroSolicitacaoSelo,
    ICONE_FONTAWESOME_POR_TIPO: () => ICONE_FONTAWESOME_POR_TIPO,
    ICONE_IONICONS_POR_TIPO: () => ICONE_IONICONS_POR_TIPO,
    MIMES_DOCUMENTO_PERMITIDOS: () => MIMES_DOCUMENTO_PERMITIDOS,
    MIN_DOCUMENTOS_SOLICITACAO: () => MIN_DOCUMENTOS_SOLICITACAO,
    ROTULO_METODO_PAGAMENTO: () => ROTULO_METODO_PAGAMENTO,
    ROTULO_STATUS_SOLICITACAO: () => ROTULO_STATUS_SOLICITACAO,
    ROTULO_TIPO_DOCUMENTO: () => ROTULO_TIPO_DOCUMENTO,
    STATUS_LABEL: () => STATUS_LABEL,
    STATUS_SOLICITACAO_ABERTOS: () => STATUS_SOLICITACAO_ABERTOS,
    TABELA_DOCUMENTOS_SOLICITACAO: () => TABELA_DOCUMENTOS_SOLICITACAO,
    TABELA_SOLICITACOES_SELO: () => TABELA_SOLICITACOES_SELO,
    TAMANHO_MAX_DOCUMENTO_BYTES: () => TAMANHO_MAX_DOCUMENTO_BYTES,
    TIPOS_EMPRESA: () => TIPOS_EMPRESA,
    UFS_BRASIL: () => UFS_BRASIL,
    apenasDigitos: () => apenasDigitos,
    criarServicoComentarios: () => criarServicoComentarios,
    criarServicoCurtidas: () => criarServicoCurtidas,
    criarServicoNotificacoes: () => criarServicoNotificacoes,
    criarServicoPosts: () => criarServicoPosts,
    criarServicoRanking: () => criarServicoRanking,
    criarServicoSeguidores: () => criarServicoSeguidores,
    criarServicoSolicitacaoSelo: () => criarServicoSolicitacaoSelo,
    ehCliente: () => ehCliente,
    ehEmpresa: () => ehEmpresa,
    formatarCNPJ: () => formatarCNPJ,
    formatarTempoRelativo: () => formatarTempoRelativo,
    mapearDocumentoSolicitacao: () => mapearDocumentoSolicitacao,
    mapearNotificacao: () => mapearNotificacao,
    mapearSolicitacaoSelo: () => mapearSolicitacaoSelo,
    podeAcessarSolicitacaoSelo: () => podeAcessarSolicitacaoSelo,
    rotuloConquista: () => rotuloConquista,
    solicitacaoEstaAberta: () => solicitacaoEstaAberta,
    temSeloAtivo: () => temSeloAtivo,
    validarArquivoDocumento: () => validarArquivoDocumento,
    validarAuditoria: () => validarAuditoria,
    validarCNPJ: () => validarCNPJ,
    validarCadastro: () => validarCadastro,
    validarDadosEmpresa: () => validarDadosEmpresa,
    validarDocumentos: () => validarDocumentos,
    validarPlanoPagamento: () => validarPlanoPagamento,
    validarSolicitacaoSelo: () => validarSolicitacaoSelo
  });

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

  // src/types/solicitacao-selo.ts
  var ROTULO_STATUS_SOLICITACAO = {
    enviada: "Solicita\xE7\xE3o enviada",
    em_analise: "Em an\xE1lise",
    auditoria_agendada: "Auditoria agendada",
    aguardando_informacoes: "Aguardando informa\xE7\xF5es",
    aprovada: "Aprovada",
    reprovada: "Reprovada",
    cancelada: "Cancelada"
  };
  var STATUS_SOLICITACAO_ABERTOS = [
    "enviada",
    "em_analise",
    "auditoria_agendada",
    "aguardando_informacoes"
  ];
  function solicitacaoEstaAberta(status) {
    return STATUS_SOLICITACAO_ABERTOS.includes(status);
  }
  var ROTULO_METODO_PAGAMENTO = {
    cartao: "Cart\xE3o",
    pix: "Pix",
    boleto: "Boleto"
  };
  var ROTULO_TIPO_DOCUMENTO = {
    certificacao_ambiental: "Certifica\xE7\xE3o ambiental",
    licenca: "Licen\xE7a",
    contrato: "Contrato relevante",
    comprovacao_metas: "Comprova\xE7\xE3o de metas ambientais",
    outro: "Outro documento"
  };
  var MIMES_DOCUMENTO_PERMITIDOS = ["application/pdf", "image/jpeg", "image/png"];
  var EXTENSOES_DOCUMENTO_PERMITIDAS = ["pdf", "jpg", "jpeg", "png"];
  var TAMANHO_MAX_DOCUMENTO_BYTES = 10 * 1024 * 1024;
  var MIN_DOCUMENTOS_SOLICITACAO = 1;
  function podeAcessarSolicitacaoSelo(usuario) {
    return ehEmpresa(usuario);
  }
  var REGEX_EMAIL2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var UFS_BRASIL = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ];
  function apenasDigitos(valor) {
    return (valor ?? "").replace(/\D/g, "");
  }
  function validarCNPJ(cnpj) {
    const d = apenasDigitos(cnpj);
    if (d.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(d)) return false;
    const calcularDigito = (base) => {
      let peso = base.length - 7;
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base.charAt(i), 10) * peso--;
        if (peso < 2) peso = 9;
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };
    const d1 = calcularDigito(d.substring(0, 12));
    if (d1 !== parseInt(d.charAt(12), 10)) return false;
    const d2 = calcularDigito(d.substring(0, 13));
    return d2 === parseInt(d.charAt(13), 10);
  }
  function formatarCNPJ(cnpj) {
    const d = apenasDigitos(cnpj).slice(0, 14);
    return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  function dataHojeISO() {
    const agora = /* @__PURE__ */ new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${agora.getFullYear()}-${mes}-${dia}`;
  }
  function dataISOValida(valor) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (!m) return false;
    const ano = Number(m[1]);
    const mes = Number(m[2]);
    const dia = Number(m[3]);
    const d = new Date(ano, mes - 1, dia);
    return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
  }
  function vazio(valor) {
    return !valor || !valor.trim();
  }
  function validarDadosEmpresa(dados) {
    const erros = [];
    if (vazio(dados.cnpj)) erros.push({ campo: "cnpj", mensagem: "Informe o CNPJ." });
    else if (!validarCNPJ(dados.cnpj)) erros.push({ campo: "cnpj", mensagem: "Informe um CNPJ v\xE1lido." });
    if (vazio(dados.razaoSocial)) erros.push({ campo: "razaoSocial", mensagem: "Informe a raz\xE3o social." });
    if (vazio(dados.nomeFantasia)) erros.push({ campo: "nomeFantasia", mensagem: "Informe o nome fantasia." });
    if (vazio(dados.email)) erros.push({ campo: "email", mensagem: "Informe o e-mail empresarial." });
    else if (!REGEX_EMAIL2.test(dados.email.trim())) erros.push({ campo: "email", mensagem: "Informe um e-mail v\xE1lido." });
    const tel = apenasDigitos(dados.telefone);
    if (!tel) erros.push({ campo: "telefone", mensagem: "Informe o telefone empresarial." });
    else if (tel.length < 10 || tel.length > 11) erros.push({ campo: "telefone", mensagem: "Informe um telefone v\xE1lido com DDD." });
    const cep = apenasDigitos(dados.cep);
    if (!cep) erros.push({ campo: "cep", mensagem: "Informe o CEP." });
    else if (cep.length !== 8) erros.push({ campo: "cep", mensagem: "Informe um CEP v\xE1lido." });
    if (vazio(dados.endereco)) erros.push({ campo: "endereco", mensagem: "Informe o endere\xE7o." });
    if (vazio(dados.cidade)) erros.push({ campo: "cidade", mensagem: "Informe a cidade." });
    if (vazio(dados.estado)) erros.push({ campo: "estado", mensagem: "Informe o estado." });
    else if (!UFS_BRASIL.includes(dados.estado.trim().toUpperCase())) erros.push({ campo: "estado", mensagem: "Informe uma sigla de estado v\xE1lida (ex.: SP)." });
    if (vazio(dados.responsavelNome)) erros.push({ campo: "responsavelNome", mensagem: "Informe o respons\xE1vel pela solicita\xE7\xE3o." });
    if (vazio(dados.responsavelCargo)) erros.push({ campo: "responsavelCargo", mensagem: "Informe o cargo ou fun\xE7\xE3o do respons\xE1vel." });
    return erros;
  }
  function validarArquivoDocumento(arquivo) {
    const erros = [];
    const extensao = (arquivo.nomeArquivo.split(".").pop() ?? "").toLowerCase();
    if (!MIMES_DOCUMENTO_PERMITIDOS.includes(arquivo.mimeType) || !EXTENSOES_DOCUMENTO_PERMITIDAS.includes(extensao)) {
      erros.push({ campo: "documentos", mensagem: `"${arquivo.nomeArquivo}": envie apenas PDF, JPG ou PNG.` });
    }
    if (arquivo.tamanhoBytes <= 0) {
      erros.push({ campo: "documentos", mensagem: `"${arquivo.nomeArquivo}": o arquivo est\xE1 vazio.` });
    } else if (arquivo.tamanhoBytes > TAMANHO_MAX_DOCUMENTO_BYTES) {
      const limiteMb = Math.round(TAMANHO_MAX_DOCUMENTO_BYTES / (1024 * 1024));
      erros.push({ campo: "documentos", mensagem: `"${arquivo.nomeArquivo}": o arquivo passa do limite de ${limiteMb} MB.` });
    }
    return erros;
  }
  function validarDocumentos(documentos) {
    if (!documentos || documentos.length < MIN_DOCUMENTOS_SOLICITACAO) {
      return [{ campo: "documentos", mensagem: "Envie pelo menos um documento para a auditoria." }];
    }
    return documentos.flatMap(validarArquivoDocumento);
  }
  function validarAuditoria(dados) {
    const erros = [];
    if (vazio(dados.dataAuditoria)) {
      erros.push({ campo: "dataAuditoria", mensagem: "Escolha a data da auditoria." });
    } else if (!dataISOValida(dados.dataAuditoria)) {
      erros.push({ campo: "dataAuditoria", mensagem: "Data inv\xE1lida." });
    } else if (dados.dataAuditoria < dataHojeISO()) {
      erros.push({ campo: "dataAuditoria", mensagem: "A data da auditoria n\xE3o pode ser anterior a hoje." });
    }
    if (vazio(dados.localAuditoria)) {
      erros.push({ campo: "localAuditoria", mensagem: "Informe o local da auditoria." });
    }
    const metas = dados.metas ?? [];
    if (metas.length === 0) {
      erros.push({ campo: "metas", mensagem: "Informe pelo menos uma meta de sustentabilidade." });
    } else if (metas.some((m) => vazio(m.descricao))) {
      erros.push({ campo: "metas", mensagem: "Toda meta precisa ter uma descri\xE7\xE3o." });
    }
    return erros;
  }
  function validarPlanoPagamento(dados) {
    const erros = [];
    if (vazio(dados.plano)) erros.push({ campo: "plano", mensagem: "Selecione um plano." });
    if (!dados.metodoPagamento || !(dados.metodoPagamento in ROTULO_METODO_PAGAMENTO)) {
      erros.push({ campo: "metodoPagamento", mensagem: "Selecione o m\xE9todo de pagamento." });
    }
    return erros;
  }
  function validarSolicitacaoSelo(dados) {
    return [
      ...validarDadosEmpresa(dados.empresa),
      ...validarDocumentos(dados.documentos),
      ...validarAuditoria(dados.auditoria),
      ...validarPlanoPagamento(dados.planoPagamento)
    ];
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
      async atualizarPost(postId, autorId, novoConteudo) {
        const conteudo = novoConteudo.trim();
        if (!conteudo) throw new Error("A legenda n\xE3o pode ficar vazia.");
        const { data, error } = await supabase.from("posts").update({ conteudo, status: "em_analise" }).eq("id", postId).eq("autor_id", autorId).select(SELECT_POST).single();
        if (error) throw new Error(error.message);
        if (!data) throw new Error("N\xE3o foi poss\xEDvel atualizar esta publica\xE7\xE3o.");
        const idsCurtidos = await idsCurtidosDoUsuario(autorId);
        return mapearPost(data, idsCurtidos);
      },
      async deletarPost(postId, autorId) {
        const { error } = await supabase.from("posts").delete().eq("id", postId).eq("autor_id", autorId);
        if (error) throw new Error(error.message);
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

  // src/services/solicitacao-selo.ts
  var TABELA_SOLICITACOES_SELO = "solicitacoes_selo";
  var TABELA_DOCUMENTOS_SOLICITACAO = "solicitacoes_selo_documentos";
  var BUCKET_DOCUMENTOS_SELO = "documentos-selo";
  function mapearSolicitacaoSelo(row) {
    return {
      id: row.id,
      empresaId: row.empresa_id,
      status: row.status,
      cnpj: row.cnpj,
      razaoSocial: row.razao_social,
      nomeFantasia: row.nome_fantasia,
      email: row.email,
      telefone: row.telefone,
      cep: row.cep,
      endereco: row.endereco,
      cidade: row.cidade,
      estado: row.estado,
      responsavelNome: row.responsavel_nome,
      responsavelCargo: row.responsavel_cargo,
      informacoesAdicionais: row.informacoes_adicionais ?? null,
      dataAuditoria: row.data_auditoria,
      localAuditoria: row.local_auditoria,
      metas: Array.isArray(row.metas) ? row.metas : [],
      plano: row.plano,
      metodoPagamento: row.metodo_pagamento,
      observacaoAnalise: row.observacao_analise ?? null,
      seloId: row.selo_id ?? null,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em ?? null
    };
  }
  function mapearDocumentoSolicitacao(row) {
    return {
      id: row.id,
      solicitacaoId: row.solicitacao_id,
      tipo: row.tipo,
      nomeArquivo: row.nome_arquivo,
      caminhoStorage: row.caminho_storage,
      mimeType: row.mime_type,
      tamanhoBytes: row.tamanho_bytes,
      criadoEm: row.criado_em
    };
  }
  var ErroSolicitacaoSelo = class _ErroSolicitacaoSelo extends Error {
    constructor(mensagem, erros = []) {
      super(mensagem);
      this.name = "ErroSolicitacaoSelo";
      this.erros = erros;
      Object.setPrototypeOf(this, _ErroSolicitacaoSelo.prototype);
    }
  };
  function gerarUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  function extensaoDe(nomeArquivo) {
    return (nomeArquivo.split(".").pop() ?? "").toLowerCase();
  }
  function criarServicoSolicitacaoSelo(supabase) {
    return {
      /** Solicitação mais recente da empresa (ou null). */
      async buscarSolicitacaoAtual(empresaId) {
        const { data, error } = await supabase.from(TABELA_SOLICITACOES_SELO).select("*").eq("empresa_id", empresaId).order("criado_em", { ascending: false }).limit(1);
        if (error) throw new Error(error.message);
        const row = (data ?? [])[0];
        return row ? mapearSolicitacaoSelo(row) : null;
      },
      async buscarHistorico(empresaId) {
        const { data, error } = await supabase.from(TABELA_SOLICITACOES_SELO).select("*").eq("empresa_id", empresaId).order("criado_em", { ascending: false });
        if (error) throw new Error(error.message);
        return (data ?? []).map(mapearSolicitacaoSelo);
      },
      async buscarDocumentos(solicitacaoId) {
        const { data, error } = await supabase.from(TABELA_DOCUMENTOS_SOLICITACAO).select("*").eq("solicitacao_id", solicitacaoId).order("criado_em", { ascending: true });
        if (error) throw new Error(error.message);
        return (data ?? []).map(mapearDocumentoSolicitacao);
      },
      /** Link temporário para abrir um documento (bucket privado — nunca URL pública). */
      async gerarUrlDocumento(caminhoStorage, expiraEmSegundos = 60) {
        const { data, error } = await supabase.storage.from(BUCKET_DOCUMENTOS_SELO).createSignedUrl(caminhoStorage, expiraEmSegundos);
        if (error) throw new Error(error.message);
        return data.signedUrl;
      },
      /**
       * Envia a solicitação. Ela entra como 'enviada' (em análise) — NUNCA concede selo.
       * Ordem: valida → confere regras → envia arquivos → grava a solicitação → grava os documentos.
       * O id é gerado antes para que uma falha no upload não deixe solicitação "aberta" sem documentos.
       */
      async enviarSolicitacao(usuario, dados, arquivos) {
        if (!ehEmpresa(usuario)) {
          throw new ErroSolicitacaoSelo("Apenas contas empresariais podem solicitar o selo.");
        }
        if (temSeloAtivo(usuario)) {
          throw new ErroSolicitacaoSelo('Esta empresa j\xE1 possui um selo. Consulte-o na p\xE1gina "Solicitar Selo".');
        }
        if (arquivos.length !== dados.documentos.length) {
          throw new ErroSolicitacaoSelo("Os documentos informados n\xE3o conferem com os arquivos enviados.");
        }
        const erros = validarSolicitacaoSelo(dados);
        if (erros.length > 0) {
          throw new ErroSolicitacaoSelo("Revise os campos destacados antes de enviar.", erros);
        }
        const atual = await this.buscarSolicitacaoAtual(usuario.id);
        if (atual && solicitacaoEstaAberta(atual.status)) {
          throw new ErroSolicitacaoSelo("Voc\xEA j\xE1 tem uma solicita\xE7\xE3o em andamento.");
        }
        const solicitacaoId = gerarUuid();
        const enviados = [];
        for (const arquivo of arquivos) {
          const caminho = `${usuario.id}/${solicitacaoId}/${gerarUuid()}.${extensaoDe(arquivo.nomeArquivo)}`;
          const { error: error2 } = await supabase.storage.from(BUCKET_DOCUMENTOS_SELO).upload(caminho, arquivo.corpo, { contentType: arquivo.mimeType, upsert: false });
          if (error2) throw new Error(`Falha ao enviar "${arquivo.nomeArquivo}": ${error2.message}`);
          enviados.push({ arquivo, caminho });
        }
        const { empresa, auditoria, planoPagamento } = dados;
        const { data, error } = await supabase.from(TABELA_SOLICITACOES_SELO).insert({
          id: solicitacaoId,
          empresa_id: usuario.id,
          status: "enviada",
          cnpj: apenasDigitos(empresa.cnpj),
          razao_social: empresa.razaoSocial.trim(),
          nome_fantasia: empresa.nomeFantasia.trim(),
          email: empresa.email.trim(),
          telefone: apenasDigitos(empresa.telefone),
          cep: apenasDigitos(empresa.cep),
          endereco: empresa.endereco.trim(),
          cidade: empresa.cidade.trim(),
          estado: empresa.estado.trim().toUpperCase(),
          responsavel_nome: empresa.responsavelNome.trim(),
          responsavel_cargo: empresa.responsavelCargo.trim(),
          informacoes_adicionais: empresa.informacoesAdicionais?.trim() || null,
          data_auditoria: auditoria.dataAuditoria,
          local_auditoria: auditoria.localAuditoria.trim(),
          metas: auditoria.metas,
          plano: planoPagamento.plano.trim(),
          metodo_pagamento: planoPagamento.metodoPagamento
        }).select("*").single();
        if (error) throw new Error(error.message);
        const linhasDocumentos = enviados.map(({ arquivo, caminho }) => ({
          solicitacao_id: solicitacaoId,
          tipo: arquivo.tipo,
          nome_arquivo: arquivo.nomeArquivo,
          caminho_storage: caminho,
          mime_type: arquivo.mimeType,
          tamanho_bytes: arquivo.tamanhoBytes
        }));
        const { error: erroDocs } = await supabase.from(TABELA_DOCUMENTOS_SOLICITACAO).insert(linhasDocumentos);
        if (erroDocs) throw new Error(erroDocs.message);
        return mapearSolicitacaoSelo(data);
      }
    };
  }
  return __toCommonJS(index_exports);
})();
