export type NivelUsuario = 'Iniciante' | 'Explorador' | 'Vigilante Ambiental';
export declare const LIMITE_NIVEL_EXPLORADOR = 6;
export declare const LIMITE_NIVEL_VIGILANTE_AMBIENTAL = 12;
export declare function calcularNivelUsuario(totalPosts: number): NivelUsuario;
