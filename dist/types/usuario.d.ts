export type TipoUsuario = 'cliente' | 'empresa' | 'empresa_selo';
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    tipo: TipoUsuario;
    avatarUrl?: string | null;
}
export declare function ehEmpresa(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare function ehCliente(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare function temSeloAtivo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
