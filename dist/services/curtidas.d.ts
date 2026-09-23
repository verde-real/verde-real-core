import { ClienteSupabaseMinimo } from './notificacoes';
export declare function criarServicoCurtidas(supabase: ClienteSupabaseMinimo): {
    alternarCurtida(usuarioId: string, postId: string, curtidoAtualmente: boolean): Promise<void>;
    verificarCurtida(usuarioId: string, postId: string): Promise<boolean>;
};
