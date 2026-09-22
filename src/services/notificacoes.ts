import { Notificacao, mapearNotificacao } from '../types/notificacao';

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

export function criarServicoNotificacoes(supabase: ClienteSupabaseMinimo) {
  return {
    async buscarNotificacoes(usuarioId: string, limite = 50): Promise<Notificacao[]> {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('destinatario_id', usuarioId)
        .order('criado_em', { ascending: false })
        .limit(limite);
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearNotificacao);
    },

    async contarNaoLidas(usuarioId: string): Promise<number> {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('destinatario_id', usuarioId)
        .eq('lida', false);
      if (error) throw new Error(error.message);
      return count ?? 0;
    },

    async marcarComoLida(notificacaoId: string): Promise<void> {
      const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('id', notificacaoId);
      if (error) throw new Error(error.message);
    },

    async marcarTodasComoLidas(usuarioId: string): Promise<void> {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('destinatario_id', usuarioId)
        .eq('lida', false);
      if (error) throw new Error(error.message);
    },

    async deletarNotificacao(notificacaoId: string): Promise<void> {
      const { error } = await supabase.from('notificacoes').delete().eq('id', notificacaoId);
      if (error) throw new Error(error.message);
    },

    ouvirNovasNotificacoes(usuarioId: string, aoReceber: (n: Notificacao) => void): () => void {
      const nomeCanal = `notificacoes:${usuarioId}:${Date.now()}`;
      const canal = supabase
        .channel(nomeCanal)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notificacoes',
            filter: `destinatario_id=eq.${usuarioId}`,
          },
          (payload: any) => aoReceber(mapearNotificacao(payload.new))
        )
        .subscribe();

      return () => {
        supabase.removeChannel(canal);
      };
    },
  };
}
