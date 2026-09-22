import { Notificacao } from '../types/notificacao';
/**
 * Só o pedacinho da API do supabase-js que a gente realmente usa aqui.
 * Assim o core não depende do pacote @supabase/supabase-js inteiro —
 * só precisa que quem chamar passe um objeto com essa forma (tanto o
 * client do app quanto o `window.supabase` do site têm essa forma).
 */
export interface ClienteSupabaseMinimo {
    from: (tabela: string) => any;
    channel: (nome: string) => any;
    removeChannel: (canal: any) => void;
}
export declare function criarServicoNotificacoes(supabase: ClienteSupabaseMinimo): {
    buscarNotificacoes(usuarioId: string, limite?: number): Promise<Notificacao[]>;
    contarNaoLidas(usuarioId: string): Promise<number>;
    marcarComoLida(notificacaoId: string): Promise<void>;
    marcarTodasComoLidas(usuarioId: string): Promise<void>;
    deletarNotificacao(notificacaoId: string): Promise<void>;
    ouvirNovasNotificacoes(usuarioId: string, aoReceber: (n: Notificacao) => void): () => void;
};
