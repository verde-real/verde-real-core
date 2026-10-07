import { usernameValido } from '../types/usuario';
import { ClienteSupabaseMinimo } from './notificacoes';

export interface Comentario {
  id: string;
  conteudo: string;
  criadoEm: string;
  autor: { id: string; nome: string; avatarUrl?: string | null };
}

/** Usuário retornado pela busca de @menção (autocomplete do campo de comentário). */
export interface UsuarioParaMencao {
  id: string;
  nome: string;
  username: string;
  avatarUrl?: string | null;
}

function mapearComentario(linha: any): Comentario {
  return {
    id: linha.id,
    conteudo: linha.conteudo,
    criadoEm: linha.criado_em,
    autor: { id: linha.autor?.id, nome: linha.autor?.nome ?? 'Usuário', avatarUrl: linha.autor?.avatar_url ?? null },
  };
}

// ============================================================
// MENÇÕES (@) — extrai @usernames de um texto de comentário.
// Reaproveita a MESMA validação de username já usada no cadastro
// (usernameValido, de types/usuario.ts) — não cria um formato novo.
// ============================================================
const REGEX_TOKEN_MENCAO = /@([a-zA-Z0-9._]{1,24})/g;

function extrairUsernamesMencionados(texto: string): string[] {
  const encontrados = new Set<string>();
  let resultado: RegExpExecArray | null;
  REGEX_TOKEN_MENCAO.lastIndex = 0;
  while ((resultado = REGEX_TOKEN_MENCAO.exec(texto)) !== null) {
    const candidato = resultado[1].toLowerCase();
    if (usernameValido(candidato)) {
      encontrados.add(candidato);
    }
  }
  return Array.from(encontrados);
}

/**
 * FAÇA 3 — notifica quem foi @mencionado num comentário.
 *
 * Reaproveita a MESMA tabela `notificacoes` já usada por curtidas/seguidores
 * (nenhuma tabela/coluna nova) e o MESMO tipo 'comentario' que já existe em
 * TipoNotificacao — por isso já aparece com o ícone de comentário no
 * sino do site e no app sem precisar de nenhuma alteração ali.
 *
 * É "best effort": se der erro aqui (ex.: alguma policy de RLS ainda não
 * liberar esse insert — ver observação no chat), o comentário em si NÃO é
 * desfeito, pois já foi salvo antes desta função ser chamada.
 */
async function notificarMencionados(
  supabase: ClienteSupabaseMinimo,
  conteudo: string,
  postId: string,
  autorId: string,
  autorLinha: any
): Promise<void> {
  if (extrairUsernamesMencionados(conteudo).length === 0) return;

  const { error } = await supabase.rpc('notificar_mencoes', {
    p_post_id: postId,
    p_conteudo: conteudo,
  });

  if (error) throw new Error(error.message);
}


export function criarServicoComentarios(supabase: ClienteSupabaseMinimo) {
  return {
    async buscarComentarios(postId: string): Promise<Comentario[]> {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*, autor:profiles!comentarios_autor_id_fkey(id, nome, avatar_url)')
        .eq('post_id', postId)
        .order('criado_em', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearComentario);
    },

    async criarComentario(postId: string, autorId: string, conteudo: string): Promise<Comentario> {
      if (!conteudo || !conteudo.trim()) throw new Error('Digite um comentário.');
      const conteudoFinal = conteudo.trim();

      const { data, error } = await supabase
        .from('comentarios')
        .insert({ post_id: postId, autor_id: autorId, conteudo: conteudoFinal })
        .select('*, autor:profiles!comentarios_autor_id_fkey(id, nome, avatar_url)')
        .single();

      if (error) throw new Error(error.message);
      const comentario = mapearComentario(data);

      // FAÇA 2 + FAÇA 3: dispara as notificações de @menção. Não deixa um
      // erro aqui derrubar a criação do comentário (que já foi concluída
      // com sucesso acima).
      try {
        await notificarMencionados(supabase, conteudoFinal, postId, autorId, data.autor);
      } catch {
        // Best effort: falha ao notificar menção não desfaz o comentário,
        // que já foi salvo com sucesso acima.
      }

      return comentario;
    },

    /**
     * FAÇA 1 — exclui um comentário, mas SOMENTE se `autorId` for
     * realmente o autor dele. A checagem de propriedade é feita na
     * própria query (.eq('autor_id', autorId)), não apenas escondendo
     * um botão no frontend — então mesmo que o app/site sofra alguma
     * adulteração, o Usuário B nunca consegue apagar comentário do A.
     */
    async excluirComentario(comentarioId: string, autorId: string): Promise<void> {
      const { error, count } = await supabase
        .from('comentarios')
        .delete({ count: 'exact' })
        .eq('id', comentarioId)
        .eq('autor_id', autorId);
      if (error) throw new Error(error.message);
      if (!count) {
        throw new Error('Não foi possível excluir este comentário. Você só pode excluir comentários que você mesmo escreveu.');
      }
    },

    /**
     * FAÇA 2 — busca de usuários para a lista de sugestão do "@".
     * Busca por PREFIXO do username (equivalente ao padrão já usado em
     * `buscarEmpresas`, em posts.ts, só que por username em vez de nome),
     * então digitar "@ju" já traz @julia.cristina, @juliana, @jucosta.
     */
    async buscarUsuariosParaMencao(termo: string, usuarioIdAtual?: string | null): Promise<UsuarioParaMencao[]> {
      // termo vazio (usuário acabou de digitar só "@") também é uma busca
      // válida: mostra uma pequena lista inicial em vez de nada, exatamente
      // como pedido na especificação.
      const busca = termo.trim().toLowerCase();

      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, username, avatar_url')
        .not('username', 'is', null)
        .ilike('username', `${busca}%`)
        .order('username', { ascending: true })
        .limit(8);
      if (error) throw new Error(error.message);

      return (data ?? [])
        .filter((linha: any) => linha.id !== usuarioIdAtual)
        .map((linha: any) => ({
          id: linha.id,
          nome: linha.nome,
          username: linha.username,
          avatarUrl: linha.avatar_url,
        }));
    },
  };
}