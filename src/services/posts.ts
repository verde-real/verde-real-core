import { Categoria, Post } from '../types/post';
import { ClienteSupabaseMinimo } from './notificacoes';

function mapearPost(linha: any, idsCurtidos: Set<string>): Post {
  return {
    id: linha.id,
    conteudo: linha.conteudo,
    categoria: linha.categoria,
    status: linha.status,
    midiaUrl: linha.midia_url,
    tipoMidia: linha.tipo_midia,
    latitude: linha.latitude,
    longitude: linha.longitude,
    criadoEm: linha.criado_em,
    autor: {
      id: linha.autor.id,
      nome: linha.autor.nome,
      email: linha.autor.email,
      tipo: linha.autor.tipo,
      avatarUrl: linha.autor.avatar_url,
    },
    empresa: linha.empresa
      ? {
          id: linha.empresa.id,
          nome: linha.empresa.nome,
          email: linha.empresa.email,
          tipo: linha.empresa.tipo,
          avatarUrl: linha.empresa.avatar_url,
        }
      : null,
    totalCurtidas: linha.curtidas?.[0]?.count ?? 0,
    curtidoPorMim: idsCurtidos.has(linha.id),
  };
}

const SELECT_POST = `*,
  autor:profiles!posts_autor_id_fkey(*),
  empresa:profiles!posts_empresa_id_fkey(*),
  curtidas(count)`;

export interface DadosCriarPost {
  autorId: string;
  conteudo: string;
  categoria: Categoria | string;
  midiaUrl?: string | null;
  tipoMidia?: 'imagem' | 'video' | null;
  latitude?: number | null;
  longitude?: number | null;
  empresaId?: string | null;
}

export function criarServicoPosts(supabase: ClienteSupabaseMinimo) {
  async function idsCurtidosDoUsuario(usuarioId: string | null): Promise<Set<string>> {
    if (!usuarioId) return new Set();
    const { data } = await supabase.from('curtidas').select('post_id').eq('user_id', usuarioId);
    return new Set((data ?? []).map((c: any) => c.post_id));
  }

  return {
    async buscarPosts(usuarioId: string | null, categoria?: string | null): Promise<Post[]> {
      let query = supabase.from('posts').select(SELECT_POST).order('criado_em', { ascending: false });
      if (categoria) query = query.eq('categoria', categoria);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha: any) => mapearPost(linha, idsCurtidos));
    },

    async buscarPostPorId(postId: string, usuarioId: string | null): Promise<Post | null> {
      const { data, error } = await supabase.from('posts').select(SELECT_POST).eq('id', postId).single();
      if (error || !data) return null;
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return mapearPost(data, idsCurtidos);
    },

    async criarPost(dados: DadosCriarPost): Promise<Post> {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          autor_id: dados.autorId,
          conteudo: dados.conteudo,
          categoria: dados.categoria,
          midia_url: dados.midiaUrl ?? null,
          tipo_midia: dados.tipoMidia ?? null,
          latitude: dados.latitude ?? null,
          longitude: dados.longitude ?? null,
          empresa_id: dados.empresaId ?? null,
        })
        .select(SELECT_POST)
        .single();
      if (error) throw new Error(error.message);
      return mapearPost(data, new Set());
    },

    async atualizarPost(postId: string, autorId: string, novoConteudo: string): Promise<Post> {
      const conteudo = novoConteudo.trim();
      if (!conteudo) throw new Error('A legenda não pode ficar vazia.');

      const { data, error } = await supabase
        .from('posts')
        .update({ conteudo, status: 'em_analise' })
        .eq('id', postId)
        .eq('autor_id', autorId)
        .select(SELECT_POST)
        .single();
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Não foi possível atualizar esta publicação.');

      const idsCurtidos = await idsCurtidosDoUsuario(autorId);
      return mapearPost(data, idsCurtidos);
    },

    async deletarPost(postId: string, autorId: string): Promise<void> {
      const { error } = await supabase.from('posts').delete().eq('id', postId).eq('autor_id', autorId);
      if (error) throw new Error(error.message);
    },

    async buscarPostsPorAutor(autorId: string, usuarioId: string | null): Promise<Post[]> {
      const { data, error } = await supabase
        .from('posts')
        .select(SELECT_POST)
        .eq('autor_id', autorId)
        .order('criado_em', { ascending: false });
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha: any) => mapearPost(linha, idsCurtidos));
    },

    async buscarPostsPorEmpresa(empresaId: string, usuarioId: string | null): Promise<Post[]> {
      const { data, error } = await supabase
        .from('posts')
        .select(SELECT_POST)
        .eq('empresa_id', empresaId)
        .order('criado_em', { ascending: false });
      if (error) throw new Error(error.message);
      const idsCurtidos = await idsCurtidosDoUsuario(usuarioId);
      return (data ?? []).map((linha: any) => mapearPost(linha, idsCurtidos));
    },

    async buscarPostsCurtidosPorMim(usuarioId: string): Promise<Post[]> {
      const { data: curtidas, error: erroCurtidas } = await supabase
        .from('curtidas')
        .select('post_id')
        .eq('user_id', usuarioId);
      if (erroCurtidas) throw new Error(erroCurtidas.message);

      const idsPosts: string[] = (curtidas ?? []).map((c: any) => c.post_id);
      if (idsPosts.length === 0) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(SELECT_POST)
        .in('id', idsPosts)
        .order('criado_em', { ascending: false });
      if (error) throw new Error(error.message);

      const idsCurtidosSet = new Set(idsPosts);
      return (data ?? []).map((linha: any) => mapearPost(linha, idsCurtidosSet));
    },

    async buscarEmpresas(termo: string) {
      if (!termo.trim()) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url')
        .eq('tipo', 'empresa')
        .ilike('nome', `%${termo.trim()}%`)
        .limit(8);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  };
}