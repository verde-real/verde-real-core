export type TipoNotificacao = 'curtida' | 'comentario' | 'status_denuncia' | 'selo_empresa';
export interface Notificacao {
    id: string;
    tipo: TipoNotificacao;
    mensagem: string;
    lida: boolean;
    postId?: string | null;
    empresaId?: string | null;
    criadoEm: string;
}
export interface RankingItem {
    id: string;
    nome: string;
    avatarUrl?: string | null;
    totalDenuncias: number;
}
