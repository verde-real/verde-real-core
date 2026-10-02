export declare const SENHA_MIN_CARACTERES = 8;
export declare const SENHA_RECOMENDADA_CARACTERES = 12;
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
export type NivelSenha = 0 | 1 | 2 | 3;
export interface AvaliacaoSenha {
    requisitos: RequisitoSenha[];
    nivel: NivelSenha;
    rotulo: string;
    valida: boolean;
    faltando: RequisitoSenha[];
}
export declare function avaliarSenha(senha: string, contexto?: ContextoSenha): AvaliacaoSenha;
/** Mensagem única de erro, igual no site e no app. */
export declare function mensagemSenhaInsegura(avaliacao: AvaliacaoSenha): string;
