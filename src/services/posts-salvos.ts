import { ClienteSupabaseMinimo } from './notificacoes';

/**
 * posts_salvos — o GRANT direto da tabela pra `authenticated` foi
 * revogado de propósito na auditoria de segurança (cada usuário só
 * deveria poder ler/alterar a própria lista de salvos, e nunca com
 * um user_id arbitrário vindo do cliente). Por isso aqui só passa
 * pelas RPCs `listar_ids_posts_salvos()` e `alternar_post_salvo()`,
 * ambas SECURITY DEFINER e sempre presas a auth.uid() dentro do
 * próprio banco — nunca reabrimos SELECT/INSERT/DELETE na tabela.
 */
export function criarServicoPostsSalvos(supabase: ClienteSupabaseMinimo) {
  return {
    /** IDs dos posts que o usuário logado salvou (usuário é sempre auth.uid(), nunca um parâmetro). */
    async idsSalvos(): Promise<Set<string>> {
      // Secundário pro carregamento do feed: nunca deve derrubar o resto,
      // então engole erro aqui (mesmo padrão do idsCurtidosDoUsuario em
      // posts.ts). Quem chama é responsável por logar se quiser.
      const { data, error } = await supabase.rpc('listar_ids_posts_salvos');
      if (error) return new Set();
      return new Set((data ?? []).map((linha: any) => linha.post_id));
    },

    /** Alterna salvo/não-salvo. Retorna o novo estado (true = ficou salvo). */
    async alternar(postId: string): Promise<boolean> {
      const { data, error } = await supabase.rpc('alternar_post_salvo', { p_post_id: postId });
      if (error) throw new Error(error.message);
      return data === true;
    },
  };
}