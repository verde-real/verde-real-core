import { Categoria, Post } from '../types/post';
import { ClienteSupabaseMinimo } from './notificacoes';
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
export declare function criarServicoPosts(supabase: ClienteSupabaseMinimo): {
    buscarPosts(usuarioId: string | null, categoria?: string | null): Promise<Post[]>;
    buscarPostPorId(postId: string, usuarioId: string | null): Promise<Post | null>;
    criarPost(dados: DadosCriarPost): Promise<Post>;
    buscarPostsPorAutor(autorId: string, usuarioId: string | null): Promise<Post[]>;
    buscarPostsPorEmpresa(empresaId: string, usuarioId: string | null): Promise<Post[]>;
    buscarPostsCurtidosPorMim(usuarioId: string): Promise<Post[]>;
    buscarEmpresas(termo: string): Promise<any>;
};
