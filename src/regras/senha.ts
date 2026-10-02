// ============================================================
// Regra única de senha — site e app usam a MESMA avaliação.
// ============================================================
export const SENHA_MIN_CARACTERES = 8;
export const SENHA_RECOMENDADA_CARACTERES = 12;

export interface ContextoSenha {
  nome?: string;
  email?: string;
}

export interface RequisitoSenha {
  id: 'tamanho' | 'minuscula' | 'maiuscula' | 'numero' | 'simbolo' | 'dados-pessoais' | 'comum' | 'recomendado';
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
  faltando: RequisitoSenha[]; // só os obrigatórios que faltam
}

const SENHAS_COMUNS = [
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000',
  'password', 'password1', 'qwerty123', 'qwertyui', 'abc12345', 'abcd1234',
  'senha123', 'senha1234', 'senha@123', 'mudar123', 'admin123', 'brasil123',
  'iloveyou', 'letmein1',
];

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function trechosPessoais(contexto: ContextoSenha): string[] {
  const trechos: string[] = [];
  const adicionar = (t: string) => {
    if (t.length >= 3) trechos.push(t);
  };
  if (contexto.nome) {
    normalizar(contexto.nome).split(/[^a-z0-9]+/).forEach(adicionar);
  }
  if (contexto.email) {
    const local = normalizar(contexto.email.split('@')[0]);
    local.split(/[^a-z0-9]+/).forEach(adicionar);
    adicionar(local.replace(/[^a-z0-9]/g, ''));
  }
  return trechos;
}

export function avaliarSenha(senha: string, contexto: ContextoSenha = {}): AvaliacaoSenha {
  const vazia = senha.length === 0;
  const normalizada = normalizar(senha);

  const temDadosPessoais = trechosPessoais(contexto).some((t) => normalizada.includes(t));
  const ehComum =
    SENHAS_COMUNS.includes(normalizada) ||
    normalizada.includes('verdereal') ||
    /^(.)\1+$/.test(normalizada);

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
    {
      id: 'dados-pessoais',
      texto: 'Não conter seu nome ou e-mail',
      atendido: !vazia && !temDadosPessoais,
      obrigatorio: true,
    },
    { id: 'comum', texto: 'Não ser uma senha muito comum', atendido: !vazia && !ehComum, obrigatorio: true },
    {
      id: 'recomendado',
      texto: `Recomendado: ${SENHA_RECOMENDADA_CARACTERES} ou mais caracteres`,
      atendido: senha.length >= SENHA_RECOMENDADA_CARACTERES,
      obrigatorio: false,
    },
  ];

  const faltando = requisitos.filter((r) => r.obrigatorio && !r.atendido);
  const valida = !vazia && faltando.length === 0;

  let nivel: NivelSenha = 0;
  if (!vazia) {
    if (!valida) nivel = 1;
    else nivel = senha.length >= SENHA_RECOMENDADA_CARACTERES ? 3 : 2;
  }

  const rotulos = ['', 'Fraca', 'Média', 'Forte'];
  return { requisitos, nivel, rotulo: rotulos[nivel], valida, faltando };
}

/** Mensagem única de erro, igual no site e no app. */
export function mensagemSenhaInsegura(avaliacao: AvaliacaoSenha): string {
  const itens = avaliacao.faltando.map((r) => r.texto.toLowerCase()).join(', ');
  return `Senha fraca. Falta: ${itens}.`;
}