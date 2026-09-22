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
export {
  CATEGORIAS,
  CORES_CATEGORIA,
  STATUS_LABEL,
  TIPOS_EMPRESA,
  ehCliente,
  ehEmpresa,
  rotuloConquista,
  temSeloAtivo,
  validarCadastro
};
