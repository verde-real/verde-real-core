import { ClienteSupabaseMinimo } from './notificacoes';
export interface Comentario {
    id: string;
    conteudo: string;
    criadoEm: string;
    autor: {
        id: string;
        nome: string;
        avatarUrl?: string | null;
    };
}
/** Usuário retornado pela busca de @menção (autocomplete do campo de comentário). */
export interface UsuarioParaMencao {
    id: string;
    nome: string;
    username: string;
    avatarUrl?: string | null;
}
export declare function criarServicoComentarios(supabase: ClienteSupabaseMinimo): {
    buscarComentarios(postId: string): Promise<Comentario[]>;
    criarComentario(postId: string, autorId: string, conteudo: string): Promise<Comentario>;
    /**
     * FAÇA 1 — exclui um comentário, mas SOMENTE se `autorId` for
     * realmente o autor dele. A checagem de propriedade é feita na
     * própria query (.eq('autor_id', autorId)), não apenas escondendo
     * um botão no frontend — então mesmo que o app/site sofra alguma
     * adulteração, o Usuário B nunca consegue apagar comentário do A.
     */
    excluirComentario(comentarioId: string, autorId: string): Promise<void>;
    /**
     * FAÇA 2 — busca de usuários para a lista de sugestão do "@".
     * Busca por PREFIXO do username (equivalente ao padrão já usado em
     * `buscarEmpresas`, em posts.ts, só que por username em vez de nome),
     * então digitar "@ju" já traz @julia.cristina, @juliana, @jucosta.
     */
    buscarUsuariosParaMencao(termo: string, usuarioIdAtual?: string | null): Promise<UsuarioParaMencao[]>;
};
