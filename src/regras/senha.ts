// ============================================================
// Regra única de senha — site e app usam a MESMA avaliação.
// ============================================================
export const SENHA_MIN_CARACTERES = 8;

/** Mantido só por compatibilidade com quem já chama avaliarSenha(senha, { nome, email }). Hoje é ignorado. */
export interface ContextoSenha {
  nome?: string;
  email?: string;
}

export interface RequisitoSenha {
  id: 'tamanho' | 'minuscula' | 'maiuscula' | 'numero' | 'simbolo';
  texto: string;
  atendido: boolean;
  obrigatorio: boolean;
}

// 0 = vazia, 1 = fraca, 2 = média, 3 = forte
export type NivelSenha = 0 | 1 | 2 | 3;

export interface AvaliacaoSenha {
  requisitos: RequisitoSenha[];
  nivel: NivelSenha;
  rotulo: string;
  valida: boolean;
  faltando: RequisitoSenha[]; // requisitos que ainda não foram atendidos
}

export function avaliarSenha(senha: string, _contexto: ContextoSenha = {}): AvaliacaoSenha {
  const vazia = senha.length === 0;

  const requisitos: RequisitoSenha[] = [
    {
      id: 'tamanho',
      texto: `Pelo menos ${SENHA_MIN_CARACTERES} caracteres`,
      atendido: senha.length >= SENHA_MIN_CARACTERES,
      obrigatorio: true,
    },
    { id: 'minuscula', texto: 'Uma letra minúscula', atendido: /[a-zß-öø-ÿ]/.test(senha), obrigatorio: true },
    { id: 'maiuscula', texto: 'Uma letra maiúscula', atendido: /[A-ZÀ-ÖØ-Þ]/.test(senha), obrigatorio: true },
    { id: 'numero', texto: 'Um número', atendido: /[0-9]/.test(senha), obrigatorio: true },
    {
      id: 'simbolo',
      texto: 'Um símbolo (ex.: ! @ # $ %)',
      atendido: /[^A-Za-z0-9À-ÿ\s]/.test(senha),
      obrigatorio: true,
    },
  ];

  const faltando = requisitos.filter((r) => !r.atendido);
  const valida = !vazia && faltando.length === 0;

  // Nível pelas MESMAS condições (5 itens):
  //   0 = vazia | 1 (vermelho) = até 2 atendidos | 2 (amarelo) = 3 ou 4 | 3 (verde) = todos
  const atendidos = requisitos.length - faltando.length;
  let nivel: NivelSenha = 0;
  if (!vazia) {
    if (valida) nivel = 3;
    else if (atendidos >= 3) nivel = 2;
    else nivel = 1;
  }

  const rotulos = ['', 'Fraca', 'Média', 'Forte'];
  return { requisitos, nivel, rotulo: rotulos[nivel], valida, faltando };
}

/** Mensagem única de erro, igual no site e no app. */
export function mensagemSenhaInsegura(avaliacao: AvaliacaoSenha): string {
  const itens = avaliacao.faltando.map((r) => r.texto.toLowerCase()).join(', ');
  return `Senha fraca. Falta: ${itens}.`;
}