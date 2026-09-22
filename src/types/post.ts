import { Usuario } from './usuario';

export type Categoria =
  | 'Desmatamento'
  | 'Poluição'
  | 'Queimada'
  | 'Descarte Irregular'
  | 'Água'
  | 'Fauna'
  | 'Outro';

export const CATEGORIAS: Categoria[] = [
  'Desmatamento',
  'Poluição',
  'Queimada',
  'Descarte Irregular',
  'Água',
  'Fauna',
  'Outro',
];

export const CORES_CATEGORIA: Record<Categoria, string> = {
  Desmatamento: '#8D6E4E',
  Poluição: '#6B7280',
  Queimada: '#E4572E',
  'Descarte Irregular': '#C9963B',
  Água: '#2E86AB',
  Fauna: '#A64AC9',
  Outro: '#2F6B4F',
};

export type StatusDenuncia = 'recebida' | 'em_analise' | 'resolvida' | 'rejeitada';

export const STATUS_LABEL: Record<StatusDenuncia, string> = {
  recebida: 'Recebida',
  em_analise: 'Em análise',
  resolvida: 'Resolvida',
  rejeitada: 'Rejeitada',
};

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

export function rotuloConquista(totalDenuncias: number): string {
  if (totalDenuncias >= 10) return 'Guardião Verde 🌳';
  if (totalDenuncias >= 3) return 'Vigilante Ambiental 🌿';
  return 'Iniciante 🌱';
}