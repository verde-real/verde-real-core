import { ClienteSupabaseMinimo } from './notificacoes';

export interface ResultadoModeracaoPost {
  sucesso: boolean;
  mensagem: string;
}

export function criarServicoAdmin(supabase: ClienteSupabaseMinimo) {
  return {
    async moderarPost(
      postId: string,
      acao: 'aprovar' | 'rejeitar',
      motivo?: string | null,
    ): Promise<ResultadoModeracaoPost> {
      const { data, error } = await supabase.rpc('admin_moderar_post', {
        p_post_id: postId,
        p_acao: acao,
        p_motivo: motivo ?? null,
      });

      if (error) throw new Error(error.message);

      if (typeof data === 'string') {
        return {
          sucesso: true,
          mensagem: data,
        };
      }

      return {
        sucesso: true,
        mensagem: 'Post moderado com sucesso.',
      };
    },
  };
}
