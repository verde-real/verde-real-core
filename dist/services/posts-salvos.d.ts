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
export declare function criarServicoPostsSalvos(supabase: ClienteSupabaseMinimo): {
    /** IDs dos posts que o usuário logado salvou (usuário é sempre auth.uid(), nunca um parâmetro). */
    idsSalvos(): Promise<Set<string>>;
    /** Alterna salvo/não-salvo. Retorna o novo estado (true = ficou salvo). */
    alternar(postId: string): Promise<boolean>;
};
