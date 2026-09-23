import { ClienteSupabaseMinimo } from './notificacoes';
export interface Comentario {
    id: string;
    conteudo: string;
    criadoEm: string;
    autor: {
        id: string;
        nome: string;
        avatarUrl?: string | null;
    };
}
export declare function criarServicoComentarios(supabase: ClienteSupabaseMinimo): {
    buscarComentarios(postId: string): Promise<Comentario[]>;
    criarComentario(postId: string, autorId: string, conteudo: string): Promise<Comentario>;
};
