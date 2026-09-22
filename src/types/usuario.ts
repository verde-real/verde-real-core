export type TipoUsuario = 'cliente' | 'empresa' | 'empresa_selo';

export const TIPOS_EMPRESA: TipoUsuario[] = ['empresa', 'empresa_selo'];

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  avatarUrl?: string | null;
}

export function ehEmpresa(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && (usuario.tipo === 'empresa' || usuario.tipo === 'empresa_selo');
}

export function ehCliente(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && usuario.tipo === 'cliente';
}

export function temSeloAtivo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && usuario.tipo === 'empresa_selo';
}

// ============================================================
// CADASTRO — dados centrais exigidos pra criar um usuário.
// Site e app usam essa MESMA interface e essa MESMA validação.
// ============================================================
export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipo: 'cliente' | 'empresa'; // ninguém se cadastra já como 'empresa_selo'
  aceitouTermos: boolean;
}

export interface ErroValidacao {
  campo: keyof DadosCadastro;
  mensagem: string;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN_CARACTERES = 6;

/**
 * Valida os dados de cadastro. Retorna um array vazio se estiver tudo ok,
 * ou a lista de erros encontrados (pode ter mais de um).
 * Não lança exceção — quem chama decide como exibir os erros.
 */
export function validarCadastro(dados: DadosCadastro): ErroValidacao[] {
  const erros: ErroValidacao[] = [];

  if (!dados.nome || !dados.nome.trim()) {
    erros.push({ campo: 'nome', mensagem: 'Informe seu nome.' });
  } else if (dados.nome.trim().length < 2) {
    erros.push({ campo: 'nome', mensagem: 'O nome precisa ter pelo menos 2 caracteres.' });
  }

  if (!dados.email || !dados.email.trim()) {
    erros.push({ campo: 'email', mensagem: 'Informe seu e-mail.' });
  } else if (!REGEX_EMAIL.test(dados.email.trim())) {
    erros.push({ campo: 'email', mensagem: 'Informe um e-mail válido.' });
  }

  if (!dados.senha) {
    erros.push({ campo: 'senha', mensagem: 'Informe uma senha.' });
  } else if (dados.senha.length < SENHA_MIN_CARACTERES) {
    erros.push({ campo: 'senha', mensagem: `A senha precisa ter pelo menos ${SENHA_MIN_CARACTERES} caracteres.` });
  }

  if (dados.senha !== dados.confirmarSenha) {
    erros.push({ campo: 'confirmarSenha', mensagem: 'As senhas não coincidem.' });
  }

  if (dados.tipo !== 'cliente' && dados.tipo !== 'empresa') {
    erros.push({ campo: 'tipo', mensagem: 'Selecione o tipo de conta.' });
  }

  if (!dados.aceitouTermos) {
    erros.push({ campo: 'aceitouTermos', mensagem: 'Você precisa aceitar os termos de uso.' });
  }

  return erros;
}