import { ClienteSupabaseMinimo } from './notificacoes';
export interface ResultadoModeracaoPost {
    sucesso: boolean;
    mensagem: string;
}
export declare function criarServicoAdmin(supabase: ClienteSupabaseMinimo): {
    moderarPost(postId: string, acao: "aprovar" | "rejeitar", motivo?: string | null): Promise<ResultadoModeracaoPost>;
};
