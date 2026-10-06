import { ClienteSupabaseMinimo } from './notificacoes';

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

export interface OpcoesServicoSeguidores {

  notificarNovoSeguidor?: boolean;
}


async function jaNotificadoPeloBanco(
  supabase: ClienteSupabaseMinimo,
  seguidorId: string,
  seguidoId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('seguidores')
      .select('id')
      .eq('seguidor_id', seguidorId)
      .eq('seguido_id', seguidoId)
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}


async function notificarNovoSeguidor(
  supabase: ClienteSupabaseMinimo,
  seguidorId: string,
  seguidoId: string
): Promise<void> {
  if (seguidorId === seguidoId) return;
  if (await jaNotificadoPeloBanco(supabase, seguidorId, seguidoId)) return;

  const { data: perfil, error: erroPerfil } = await supabase
    .from('profiles')
    .select('nome, username')
    .eq('id', seguidorId)
    .maybeSingle();
  if (erroPerfil) throw new Error(erroPerfil.message);

  const nome = perfil?.nome ?? (perfil?.username ? `@${perfil.username}` : 'Alguém');

  const { error } = await supabase.from('notificacoes').insert({
    destinatario_id: seguidoId,
    tipo: 'seguidor',
    mensagem: `${nome} começou a seguir você`,
    ator_id: seguidorId,
    lida: false,
  });
  if (error) throw new Error(error.message);
}

export function criarServicoSeguidores(supabase: ClienteSupabaseMinimo, opcoes: OpcoesServicoSeguidores = {}) {
  const { notificarNovoSeguidor: deveNotificar = true } = opcoes;

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

      // Só chega aqui se o seguimento foi confirmado (o insert acima não falhou).
      if (deveNotificar) {
        try {
          await notificarNovoSeguidor(supabase, seguidorId, empresaId);
        } catch {
          // Best effort: a falha da notificação não desfaz o seguimento.
        }
      }
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