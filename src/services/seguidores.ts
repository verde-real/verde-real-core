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

function mapearPerfilSeguido(linha: any): PerfilSeguido | null {
  const perfil = linha?.empresa;
  if (!perfil) return null;
  return {
    id: perfil.id,
    nome: perfil.nome,
    username: perfil.username ?? null,
    avatarUrl: perfil.avatar_url ?? null,
    tipo: perfil.tipo,
  };
}

export function criarServicoSeguidores(supabase: ClienteSupabaseMinimo) {
  return {
    async estaSeguindo(seguidorId: string, empresaId: string): Promise<boolean> {
      const { data, error } = await supabase
        .from('seguidores_empresa')
        .select('id')
        .eq('seguidor_id', seguidorId)
        .eq('empresa_id', empresaId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return !!data;
    },

    async seguirEmpresa(seguidorId: string, empresaId: string): Promise<void> {
      const { error } = await supabase.from('seguidores_empresa').insert({ seguidor_id: seguidorId, empresa_id: empresaId });
      if (error) throw new Error(error.message);
    },

    async deixarDeSeguir(seguidorId: string, empresaId: string): Promise<void> {
      const { error } = await supabase
        .from('seguidores_empresa')
        .delete()
        .eq('seguidor_id', seguidorId)
        .eq('empresa_id', empresaId);
      if (error) throw new Error(error.message);
    },

    async contarSeguidores(empresaId: string): Promise<number> {
      const { count, error } = await supabase
        .from('seguidores_empresa')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId);
      if (error) throw new Error(error.message);
      return count ?? 0;
    },

    async contarSeguindo(seguidorId: string): Promise<number> {
      const { count, error } = await supabase
        .from('seguidores_empresa')
        .select('*', { count: 'exact', head: true })
        .eq('seguidor_id', seguidorId);
      if (error) throw new Error(error.message);
      return count ?? 0;
    },

    /**
     * Lista (perfil básico) de quem `seguidorId` está seguindo.
     * Mesma tabela `seguidores_empresa` — nenhuma tabela nova.
     * Ordenação alfabética feita aqui, pois a tabela não tem coluna de data confiável.
     */
    async buscarSeguindo(seguidorId: string): Promise<PerfilSeguido[]> {
      const { data, error } = await supabase
        .from('seguidores_empresa')
        .select('empresa:profiles!seguidores_empresa_empresa_id_fkey(id, nome, username, avatar_url, tipo)')
        .eq('seguidor_id', seguidorId);
      if (error) throw new Error(error.message);

      return (data ?? [])
        .map(mapearPerfilSeguido)
        .filter((p: PerfilSeguido | null): p is PerfilSeguido => p !== null)
        .sort((a: PerfilSeguido, b: PerfilSeguido) => a.nome.localeCompare(b.nome));
    },
  };
}