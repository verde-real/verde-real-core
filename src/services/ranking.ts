import { RankingItem } from '../types/notificacao';
import { ClienteSupabaseMinimo } from './notificacoes';

export function criarServicoRanking(supabase: ClienteSupabaseMinimo) {
  return {
    async buscarRanking(limite = 50): Promise<RankingItem[]> {
      const { data, error } = await supabase.from('ranking').select('*').limit(limite);
      if (error) throw new Error(error.message);
      return (data ?? []).map((linha: any) => ({
        id: linha.id,
        nome: linha.nome,
        avatarUrl: linha.avatar_url,
        totalDenuncias: linha.total_denuncias,
      }));
    },
  };
}