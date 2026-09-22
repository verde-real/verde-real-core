export type TipoNotificacao = 'curtida' | 'comentario' | 'status_denuncia' | 'selo_empresa' | 'seguidor';
export interface Notificacao {
    id: string;
    tipo: TipoNotificacao;
    mensagem: string;
    lida: boolean;
    postId?: string | null;
    empresaId?: string | null;
    atorId?: string | null;
    criadoEm: string;
}
export declare function mapearNotificacao(linha: any): Notificacao;
/** Ícone Font Awesome (usado pelo site) por tipo de notificação. */
export declare const ICONE_FONTAWESOME_POR_TIPO: Record<TipoNotificacao, string>;
/** Ícone Ionicons (usado pelo app) por tipo de notificação. */
export declare const ICONE_IONICONS_POR_TIPO: Record<TipoNotificacao, string>;
export declare function formatarTempoRelativo(criadoEm: string): string;
export interface RankingItem {
    id: string;
    nome: string;
    avatarUrl?: string | null;
    totalDenuncias: number;
}
