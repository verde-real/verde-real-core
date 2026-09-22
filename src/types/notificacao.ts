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

export function mapearNotificacao(linha: any): Notificacao {
  return {
    id: linha.id,
    tipo: linha.tipo,
    mensagem: linha.mensagem,
    lida: linha.lida,
    postId: linha.post_id,
    empresaId: linha.empresa_id,
    atorId: linha.ator_id,
    criadoEm: linha.criado_em,
  };
}

/** Ícone Font Awesome (usado pelo site) por tipo de notificação. */
export const ICONE_FONTAWESOME_POR_TIPO: Record<TipoNotificacao, string> = {
  curtida: 'fa-heart',
  comentario: 'fa-comment',
  status_denuncia: 'fa-flag',
  selo_empresa: 'fa-award',
  seguidor: 'fa-user-plus',
};

/** Ícone Ionicons (usado pelo app) por tipo de notificação. */
export const ICONE_IONICONS_POR_TIPO: Record<TipoNotificacao, string> = {
  curtida: 'heart',
  comentario: 'chatbubble',
  status_denuncia: 'flag',
  selo_empresa: 'ribbon',
  seguidor: 'person-add',
};

export function formatarTempoRelativo(criadoEm: string): string {
  const diffMs = Date.now() - new Date(criadoEm).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  return `${dias}d`;
}

export interface RankingItem {
  id: string;
  nome: string;
  avatarUrl?: string | null;
  totalDenuncias: number;
}