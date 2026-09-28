import { ClienteSupabaseMinimo } from './notificacoes';
/**
 * Perfil básico de quem está sendo seguido — usado na lista "Seguindo".
 */
export interface PerfilSeguido {
    id: string;
    nome: string;
    username: string | null;
    avatarUrl: string | null;
    tipo: string;
}
export declare function criarServicoSeguidores(supabase: ClienteSupabaseMinimo): {
    estaSeguindo(seguidorId: string, empresaId: string): Promise<boolean>;
    seguirEmpresa(seguidorId: string, empresaId: string): Promise<void>;
    deixarDeSeguir(seguidorId: string, empresaId: string): Promise<void>;
    contarSeguidores(empresaId: string): Promise<number>;
    contarSeguindo(seguidorId: string): Promise<number>;
    /**
     * Lista (perfil básico) de quem `seguidorId` está seguindo.
     * Mesma tabela `seguidores_empresa` — nenhuma tabela nova.
     * Ordenação alfabética feita aqui, pois a tabela não tem coluna de data confiável.
     */
    buscarSeguindo(seguidorId: string): Promise<PerfilSeguido[]>;
};
