import { Usuario } from './usuario';
export type Categoria = 'Desmatamento' | 'Poluição' | 'Queimada' | 'Descarte Irregular' | 'Água' | 'Fauna' | 'Outro';
export declare const CATEGORIAS: Categoria[];
export declare const CORES_CATEGORIA: Record<Categoria, string>;
export type StatusDenuncia = 'recebida' | 'em_analise' | 'resolvida' | 'rejeitada';
export declare const STATUS_LABEL: Record<StatusDenuncia, string>;
export interface Post {
    id: string;
    conteudo: string;
    categoria: Categoria;
    status: StatusDenuncia;
    midiaUrl?: string | null;
    tipoMidia?: 'imagem' | 'video' | null;
    latitude?: number | null;
    longitude?: number | null;
    criadoEm: string;
    autor: Usuario;
    empresa?: Usuario | null;
    totalCurtidas: number;
    curtidoPorMim: boolean;
}
export declare function rotuloConquista(totalDenuncias: number): string;
