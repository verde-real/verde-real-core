export type TipoUsuario = 'cliente' | 'empresa' | 'empresa_selo' | 'admin';
export declare const TIPOS_EMPRESA: TipoUsuario[];
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    tipo: TipoUsuario;
    avatarUrl?: string | null;
    username?: string | null;
}
export declare const REGEX_USERNAME: RegExp;
export declare function usernameValido(username: string | null | undefined): boolean;
export declare function precisaEscolherUsername(usuario: Pick<Usuario, 'username'> | null | undefined): boolean;
export declare function ehEmpresa(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare function ehAdmin(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare function ehCliente(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare function temSeloAtivo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export interface DadosCadastro {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    tipo: 'cliente' | 'empresa';
    aceitouTermos: boolean;
}
export interface ErroValidacao {
    campo: keyof DadosCadastro;
    mensagem: string;
}
/**
 * Valida os dados de cadastro. Retorna um array vazio se estiver tudo ok,
 * ou a lista de erros encontrados (pode ter mais de um).
 * Não lança exceção — quem chama decide como exibir os erros.
 */
export declare function validarCadastro(dados: DadosCadastro): ErroValidacao[];
