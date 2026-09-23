import { ClienteSupabaseMinimo } from './notificacoes';

export interface Comentario {
  id: string;
  conteudo: string;
  criadoEm: string;
  autor: { id: string; nome: string; avatarUrl?: string | null };
}

function mapearComentario(linha: any): Comentario {
  return {
    id: linha.id,
    conteudo: linha.conteudo,
    criadoEm: linha.criado_em,
    autor: { id: linha.autor?.id, nome: linha.autor?.nome ?? 'Usuário', avatarUrl: linha.autor?.avatar_url ?? null },
  };
}

export function criarServicoComentarios(supabase: ClienteSupabaseMinimo) {
  return {
    async buscarComentarios(postId: string): Promise<Comentario[]> {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*, autor:profiles!comentarios_autor_id_fkey(*)')
        .eq('post_id', postId)
        .order('criado_em', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearComentario);
    },

    async criarComentario(postId: string, autorId: string, conteudo: string): Promise<Comentario> {
      if (!conteudo || !conteudo.trim()) throw new Error('Digite um comentário.');

      const { data, error } = await supabase
        .from('comentarios')
        .insert({ post_id: postId, autor_id: autorId, conteudo: conteudo.trim() })
        .select('*, autor:profiles!comentarios_autor_id_fkey(*)')
        .single();

      if (error) throw new Error(error.message);
      return mapearComentario(data);
    },
  };
}