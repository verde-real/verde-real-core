import { ClienteSupabaseMinimo } from './notificacoes';
export interface ResultadoModeracaoPost {
    sucesso: boolean;
    mensagem: string;
}
export declare function criarServicoAdmin(supabase: ClienteSupabaseMinimo): {
    moderarPost(postId: string, decisao: "aprovado" | "rejeitado", motivo?: string | null): Promise<ResultadoModeracaoPost>;
};
