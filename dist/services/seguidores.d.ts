import { ClienteSupabaseMinimo } from './notificacoes';
export declare function criarServicoSeguidores(supabase: ClienteSupabaseMinimo): {
    estaSeguindo(seguidorId: string, empresaId: string): Promise<boolean>;
    seguirEmpresa(seguidorId: string, empresaId: string): Promise<void>;
    deixarDeSeguir(seguidorId: string, empresaId: string): Promise<void>;
    contarSeguidores(empresaId: string): Promise<number>;
    contarSeguindo(seguidorId: string): Promise<number>;
};
