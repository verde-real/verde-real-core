import { ClienteSupabaseMinimo } from './notificacoes';
import { Usuario, ehEmpresa, temSeloAtivo } from '../types/usuario';
import {
  ArquivoDocumentoSelo,
  DadosSolicitacaoSelo,
  ErroValidacaoSolicitacao,
  MetaSustentabilidade,
  MetodoPagamentoSelo,
  StatusSolicitacaoSelo,
  TipoDocumentoSelo,
  apenasDigitos,
  solicitacaoEstaAberta,
  validarSolicitacaoSelo,
} from '../types/solicitacao-selo';

// ============================================================
// SERVIÇO DE SOLICITAÇÃO DE AUDITORIA / SELO EMPRESARIAL
// ------------------------------------------------------------
// ATENÇÃO — PROPOSTA AINDA NÃO PERSISTIDA:
// os nomes de tabelas, colunas e bucket abaixo são a PROPOSTA
// enviada para autorização. Nada disso existe no banco até o SQL
// ser revisado e aprovado. Antes disso, as chamadas retornarão
// erro do Supabase (tabela/bucket inexistente), o que é esperado.
// ============================================================
export const TABELA_SOLICITACOES_SELO = 'solicitacoes_selo';
export const TABELA_DOCUMENTOS_SOLICITACAO = 'solicitacoes_selo_documentos';
export const BUCKET_DOCUMENTOS_SELO = 'documentos-selo';

/** O client precisa expor storage (o client do app e o window.supabase do site expõem). */
export interface ClienteSupabaseSolicitacao extends ClienteSupabaseMinimo {
  storage: { from: (bucket: string) => any };
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

export function mapearSolicitacaoSelo(row: any): SolicitacaoSelo {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    status: row.status,
    cnpj: row.cnpj,
    razaoSocial: row.razao_social,
    nomeFantasia: row.nome_fantasia,
    email: row.email,
    telefone: row.telefone,
    cep: row.cep,
    endereco: row.endereco,
    cidade: row.cidade,
    estado: row.estado,
    responsavelNome: row.responsavel_nome,
    responsavelCargo: row.responsavel_cargo,
    informacoesAdicionais: row.informacoes_adicionais ?? null,
    dataAuditoria: row.data_auditoria,
    localAuditoria: row.local_auditoria,
    metas: Array.isArray(row.metas) ? row.metas : [],
    plano: row.plano,
    metodoPagamento: row.metodo_pagamento,
    observacaoAnalise: row.observacao_analise ?? null,
    seloId: row.selo_id ?? null,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em ?? null,
  };
}

export function mapearDocumentoSolicitacao(row: any): DocumentoSolicitacao {
  return {
    id: row.id,
    solicitacaoId: row.solicitacao_id,
    tipo: row.tipo,
    nomeArquivo: row.nome_arquivo,
    caminhoStorage: row.caminho_storage,
    mimeType: row.mime_type,
    tamanhoBytes: row.tamanho_bytes,
    criadoEm: row.criado_em,
  };
}

/** Erro de validação com a lista de campos para a UI mostrar mensagens. */
export class ErroSolicitacaoSelo extends Error {
  erros: ErroValidacaoSolicitacao[];
  constructor(mensagem: string, erros: ErroValidacaoSolicitacao[] = []) {
    super(mensagem);
    this.name = 'ErroSolicitacaoSelo';
    this.erros = erros;
    Object.setPrototypeOf(this, ErroSolicitacaoSelo.prototype);
  }
}

// uuid v4 simples (o RN/Hermes não tem crypto.randomUUID garantido). Serve só como identificador.
function gerarUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function extensaoDe(nomeArquivo: string): string {
  return (nomeArquivo.split('.').pop() ?? '').toLowerCase();
}

export function criarServicoSolicitacaoSelo(supabase: ClienteSupabaseSolicitacao) {
  return {
    /** Solicitação mais recente da empresa (ou null). */
    async buscarSolicitacaoAtual(empresaId: string): Promise<SolicitacaoSelo | null> {
      const { data, error } = await supabase
        .from(TABELA_SOLICITACOES_SELO)
        .select('*')
        .eq('empresa_id', empresaId)
        .order('criado_em', { ascending: false })
        .limit(1);
      if (error) throw new Error(error.message);
      const row = (data ?? [])[0];
      return row ? mapearSolicitacaoSelo(row) : null;
    },

    async buscarHistorico(empresaId: string): Promise<SolicitacaoSelo[]> {
      const { data, error } = await supabase
        .from(TABELA_SOLICITACOES_SELO)
        .select('*')
        .eq('empresa_id', empresaId)
        .order('criado_em', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearSolicitacaoSelo);
    },

    async buscarDocumentos(solicitacaoId: string): Promise<DocumentoSolicitacao[]> {
      const { data, error } = await supabase
        .from(TABELA_DOCUMENTOS_SOLICITACAO)
        .select('*')
        .eq('solicitacao_id', solicitacaoId)
        .order('criado_em', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map(mapearDocumentoSolicitacao);
    },

    /** Link temporário para abrir um documento (bucket privado — nunca URL pública). */
    async gerarUrlDocumento(caminhoStorage: string, expiraEmSegundos = 60): Promise<string> {
      const { data, error } = await supabase.storage
        .from(BUCKET_DOCUMENTOS_SELO)
        .createSignedUrl(caminhoStorage, expiraEmSegundos);
      if (error) throw new Error(error.message);
      return data.signedUrl;
    },

    /**
     * Envia a solicitação. Ela entra como 'enviada' (em análise) — NUNCA concede selo.
     * Ordem: valida → confere regras → envia arquivos → grava a solicitação → grava os documentos.
     * O id é gerado antes para que uma falha no upload não deixe solicitação "aberta" sem documentos.
     */
    async enviarSolicitacao(
      usuario: Pick<Usuario, 'id' | 'tipo'>,
      dados: DadosSolicitacaoSelo,
      arquivos: ArquivoParaEnvio[]
    ): Promise<SolicitacaoSelo> {
      if (!ehEmpresa(usuario)) {
        throw new ErroSolicitacaoSelo('Apenas contas empresariais podem solicitar o selo.');
      }
      if (temSeloAtivo(usuario)) {
        throw new ErroSolicitacaoSelo('Esta empresa já possui um selo. Consulte-o na página "Solicitar Selo".');
      }
      if (arquivos.length !== dados.documentos.length) {
        throw new ErroSolicitacaoSelo('Os documentos informados não conferem com os arquivos enviados.');
      }

      const erros = validarSolicitacaoSelo(dados);
      if (erros.length > 0) {
        throw new ErroSolicitacaoSelo('Revise os campos destacados antes de enviar.', erros);
      }

      const atual = await this.buscarSolicitacaoAtual(usuario.id);
      if (atual && solicitacaoEstaAberta(atual.status)) {
        throw new ErroSolicitacaoSelo('Você já tem uma solicitação em andamento.');
      }

      const solicitacaoId = gerarUuid();
      const enviados: { arquivo: ArquivoParaEnvio; caminho: string }[] = [];

      for (const arquivo of arquivos) {
        const caminho = `${usuario.id}/${solicitacaoId}/${gerarUuid()}.${extensaoDe(arquivo.nomeArquivo)}`;
        const { error } = await supabase.storage
          .from(BUCKET_DOCUMENTOS_SELO)
          .upload(caminho, arquivo.corpo, { contentType: arquivo.mimeType, upsert: false });
        if (error) throw new Error(`Falha ao enviar "${arquivo.nomeArquivo}": ${error.message}`);
        enviados.push({ arquivo, caminho });
      }

      const { empresa, auditoria, planoPagamento } = dados;
      const { data, error } = await supabase
        .from(TABELA_SOLICITACOES_SELO)
        .insert({
          id: solicitacaoId,
          empresa_id: usuario.id,
          status: 'enviada',
          cnpj: apenasDigitos(empresa.cnpj),
          razao_social: empresa.razaoSocial.trim(),
          nome_fantasia: empresa.nomeFantasia.trim(),
          email: empresa.email.trim(),
          telefone: apenasDigitos(empresa.telefone),
          cep: apenasDigitos(empresa.cep),
          endereco: empresa.endereco.trim(),
          cidade: empresa.cidade.trim(),
          estado: empresa.estado.trim().toUpperCase(),
          responsavel_nome: empresa.responsavelNome.trim(),
          responsavel_cargo: empresa.responsavelCargo.trim(),
          informacoes_adicionais: empresa.informacoesAdicionais?.trim() || null,
          data_auditoria: auditoria.dataAuditoria,
          local_auditoria: auditoria.localAuditoria.trim(),
          metas: auditoria.metas,
          plano: planoPagamento.plano.trim(),
          metodo_pagamento: planoPagamento.metodoPagamento,
        })
        .select('*')
        .single();
      if (error) throw new Error(error.message);

      const linhasDocumentos = enviados.map(({ arquivo, caminho }) => ({
        solicitacao_id: solicitacaoId,
        tipo: arquivo.tipo,
        nome_arquivo: arquivo.nomeArquivo,
        caminho_storage: caminho,
        mime_type: arquivo.mimeType,
        tamanho_bytes: arquivo.tamanhoBytes,
      }));
      const { error: erroDocs } = await supabase.from(TABELA_DOCUMENTOS_SOLICITACAO).insert(linhasDocumentos);
      if (erroDocs) throw new Error(erroDocs.message);

      return mapearSolicitacaoSelo(data);
    },
  };
}