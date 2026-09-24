import { Usuario } from './usuario';
export type StatusSolicitacaoSelo = 'enviada' | 'em_analise' | 'auditoria_agendada' | 'aguardando_informacoes' | 'aprovada' | 'reprovada' | 'cancelada';
export declare const ROTULO_STATUS_SOLICITACAO: Record<StatusSolicitacaoSelo, string>;
/** Status em que a solicitação ainda está em andamento (empresa não pode abrir outra). */
export declare const STATUS_SOLICITACAO_ABERTOS: StatusSolicitacaoSelo[];
export declare function solicitacaoEstaAberta(status: StatusSolicitacaoSelo): boolean;
export type MetodoPagamentoSelo = 'cartao' | 'pix' | 'boleto';
export declare const ROTULO_METODO_PAGAMENTO: Record<MetodoPagamentoSelo, string>;
export type TipoDocumentoSelo = 'certificacao_ambiental' | 'licenca' | 'contrato' | 'comprovacao_metas' | 'outro';
/** Tipos apenas orientativos — não é uma lista jurídica definitiva. */
export declare const ROTULO_TIPO_DOCUMENTO: Record<TipoDocumentoSelo, string>;
export declare const MIMES_DOCUMENTO_PERMITIDOS: string[];
export declare const EXTENSOES_DOCUMENTO_PERMITIDAS: string[];
/** PROPOSTA de limite (10 MB). Precisa ficar igual ao limite do bucket quando ele for criado. */
export declare const TAMANHO_MAX_DOCUMENTO_BYTES: number;
/** Quantidade mínima de documentos para enviar a solicitação (a lista exata por tipo ainda não foi definida). */
export declare const MIN_DOCUMENTOS_SOLICITACAO = 1;
export interface ArquivoDocumentoSelo {
    tipo: TipoDocumentoSelo;
    nomeArquivo: string;
    mimeType: string;
    tamanhoBytes: number;
}
export interface DadosEmpresaSolicitacao {
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
    informacoesAdicionais?: string;
}
export interface MetaSustentabilidade {
    categoria?: string;
    descricao: string;
    meta?: string;
    prazo?: string;
    indicador?: string;
    observacao?: string;
}
export interface DadosAuditoriaSolicitacao {
    /** Formato AAAA-MM-DD. */
    dataAuditoria: string;
    localAuditoria: string;
    metas: MetaSustentabilidade[];
}
export interface DadosPlanoPagamento {
    /** Identificador/nome do plano. A lista de planos ainda não existe no projeto. */
    plano: string;
    metodoPagamento: MetodoPagamentoSelo;
}
export interface DadosSolicitacaoSelo {
    empresa: DadosEmpresaSolicitacao;
    documentos: ArquivoDocumentoSelo[];
    auditoria: DadosAuditoriaSolicitacao;
    planoPagamento: DadosPlanoPagamento;
}
export interface ErroValidacaoSolicitacao {
    campo: string;
    mensagem: string;
}
/** Só contas empresariais (empresa ou empresa_selo) acessam a área "Solicitar Selo". */
export declare function podeAcessarSolicitacaoSelo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean;
export declare const UFS_BRASIL: string[];
export declare function apenasDigitos(valor: string): string;
export declare function validarCNPJ(cnpj: string): boolean;
export declare function formatarCNPJ(cnpj: string): string;
export declare function validarDadosEmpresa(dados: DadosEmpresaSolicitacao): ErroValidacaoSolicitacao[];
/** Valida um único arquivo (tipo, extensão e tamanho). */
export declare function validarArquivoDocumento(arquivo: ArquivoDocumentoSelo): ErroValidacaoSolicitacao[];
export declare function validarDocumentos(documentos: ArquivoDocumentoSelo[]): ErroValidacaoSolicitacao[];
export declare function validarAuditoria(dados: DadosAuditoriaSolicitacao): ErroValidacaoSolicitacao[];
export declare function validarPlanoPagamento(dados: DadosPlanoPagamento): ErroValidacaoSolicitacao[];
/** Validação completa (usada antes do envio). Retorna lista vazia se estiver tudo certo. */
export declare function validarSolicitacaoSelo(dados: DadosSolicitacaoSelo): ErroValidacaoSolicitacao[];
