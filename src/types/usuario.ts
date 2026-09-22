export type TipoUsuario = 'cliente' | 'empresa' | 'empresa_selo';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  avatarUrl?: string | null;
}

export function ehEmpresa(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && (usuario.tipo === 'empresa' || usuario.tipo === 'empresa_selo');
}

export function ehCliente(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && usuario.tipo === 'cliente';
}

export function temSeloAtivo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return !!usuario && usuario.tipo === 'empresa_selo';
}