import { ClienteSupabaseMinimo } from './notificacoes';
import { Usuario } from '../types/usuario';
import { ArquivoDocumentoSelo, DadosSolicitacaoSelo, ErroValidacaoSolicitacao, MetaSustentabilidade, MetodoPagamentoSelo, StatusSolicitacaoSelo, TipoDocumentoSelo } from '../types/solicitacao-selo';
export declare const TABELA_SOLICITACOES_SELO = "solicitacoes_selo";
export declare const TABELA_DOCUMENTOS_SOLICITACAO = "solicitacoes_selo_documentos";
export declare const BUCKET_DOCUMENTOS_SELO = "documentos-selo";
/** O client precisa expor storage (o client do app e o window.supabase do site expõem). */
export interface ClienteSupabaseSolicitacao extends ClienteSupabaseMinimo {
    storage: {
        from: (bucket: string) => any;
    };
}
/** Arquivo pronto para enviar: metadados + conteúdo (File/Blob no site, ArrayBuffer/Blob no app). */
export interface ArquivoParaEnvio extends ArquivoDocumentoSelo {
    corpo: any;
}
export interface DocumentoSolicitacao {
    id: string;
    solicitacaoId: string;
    tipo: TipoDocumentoSelo;
    nomeArquivo: string;
    caminhoStorage: string;
    mimeType: string;
    tamanhoBytes: number;
    criadoEm: string;
}
export interface SolicitacaoSelo {
    id: string;
    empresaId: string;
    status: StatusSolicitacaoSelo;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    email: string;
    telefone: string;
    cep: string;
    endereco: string;
    cidade: string;
    estado: string;
    responsavelNome: string;
    responsavelCargo: string;
    informacoesAdicionais: string | null;
    dataAuditoria: string;
    localAuditoria: string;
    metas: MetaSustentabilidade[];
    plano: string;
    metodoPagamento: MetodoPagamentoSelo;
    observacaoAnalise: string | null;
    seloId: string | null;
    criadoEm: string;
    atualizadoEm: string | null;
}
export declare function mapearSolicitacaoSelo(row: any): SolicitacaoSelo;
export declare function mapearDocumentoSolicitacao(row: any): DocumentoSolicitacao;
/** Erro de validação com a lista de campos para a UI mostrar mensagens. */
export declare class ErroSolicitacaoSelo extends Error {
    erros: ErroValidacaoSolicitacao[];
    constructor(mensagem: string, erros?: ErroValidacaoSolicitacao[]);
}
export declare function criarServicoSolicitacaoSelo(supabase: ClienteSupabaseSolicitacao): {
    /** Solicitação mais recente da empresa (ou null). */
    buscarSolicitacaoAtual(empresaId: string): Promise<SolicitacaoSelo | null>;
    buscarHistorico(empresaId: string): Promise<SolicitacaoSelo[]>;
    buscarDocumentos(solicitacaoId: string): Promise<DocumentoSolicitacao[]>;
    /** Link temporário para abrir um documento (bucket privado — nunca URL pública). */
    gerarUrlDocumento(caminhoStorage: string, expiraEmSegundos?: number): Promise<string>;
    /**
     * Envia a solicitação. Ela entra como 'enviada' (em análise) — NUNCA concede selo.
     * Ordem: valida → confere regras → envia arquivos → grava a solicitação → grava os documentos.
     * O id é gerado antes para que uma falha no upload não deixe solicitação "aberta" sem documentos.
     */
    enviarSolicitacao(usuario: Pick<Usuario, 'id' | 'tipo'>, dados: DadosSolicitacaoSelo, arquivos: ArquivoParaEnvio[]): Promise<SolicitacaoSelo>;
};
