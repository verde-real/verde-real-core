import { RankingItem } from '../types/notificacao';
import { ClienteSupabaseMinimo } from './notificacoes';
export declare function criarServicoRanking(supabase: ClienteSupabaseMinimo): {
    buscarRanking(limite?: number): Promise<RankingItem[]>;
};
