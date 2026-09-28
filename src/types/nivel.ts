export type NivelUsuario = 'Iniciante' | 'Explorador' | 'Vigilante Ambiental';

export const LIMITE_NIVEL_EXPLORADOR = 6;

export const LIMITE_NIVEL_VIGILANTE_AMBIENTAL = 12;

export function calcularNivelUsuario(totalPosts: number): NivelUsuario {
  const total = totalPosts ?? 0;
  if (total > LIMITE_NIVEL_VIGILANTE_AMBIENTAL) return 'Vigilante Ambiental';
  if (total >= LIMITE_NIVEL_EXPLORADOR) return 'Explorador';
  return 'Iniciante';
}