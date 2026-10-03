export declare const SENHA_MIN_CARACTERES = 8;
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
export type NivelSenha = 0 | 1 | 2 | 3;
export interface AvaliacaoSenha {
    requisitos: RequisitoSenha[];
    nivel: NivelSenha;
    rotulo: string;
    valida: boolean;
    faltando: RequisitoSenha[];
}
export declare function avaliarSenha(senha: string, _contexto?: ContextoSenha): AvaliacaoSenha;
/** Mensagem única de erro, igual no site e no app. */
export declare function mensagemSenhaInsegura(avaliacao: AvaliacaoSenha): string;
