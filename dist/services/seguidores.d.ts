import { ClienteSupabaseMinimo } from './notificacoes';
export interface PerfilSeguido {
    id: string;
    nome: string;
    username: string | null;
    avatarUrl: string | null;
    tipo: string;
}
export interface OpcoesServicoSeguidores {
    notificarNovoSeguidor?: boolean;
}
export declare function criarServicoSeguidores(supabase: ClienteSupabaseMinimo, opcoes?: OpcoesServicoSeguidores): {
    estaSeguindo(seguidorId: string, empresaId: string): Promise<boolean>;
    seguirEmpresa(seguidorId: string, empresaId: string): Promise<void>;
    deixarDeSeguir(seguidorId: string, empresaId: string): Promise<void>;
    contarSeguidores(empresaId: string): Promise<number>;
    contarSeguindo(seguidorId: string): Promise<number>;
    buscarSeguindo(seguidorId: string): Promise<PerfilSeguido[]>;
};
