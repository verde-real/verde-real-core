import { ClienteSupabaseMinimo } from './notificacoes';

export function criarServicoCurtidas(supabase: ClienteSupabaseMinimo) {
  return {
    async alternarCurtida(usuarioId: string, postId: string, curtidoAtualmente: boolean): Promise<void> {
      if (curtidoAtualmente) {
        const { error } = await supabase
          .from('curtidas')
          .delete()
          .eq('user_id', usuarioId)
          .eq('post_id', postId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('curtidas').insert({ user_id: usuarioId, post_id: postId });
        if (error) throw new Error(error.message);
      }
    },

    async verificarCurtida(usuarioId: string, postId: string): Promise<boolean> {
      const { data, error } = await supabase
        .from('curtidas')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', usuarioId)
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
  };
}