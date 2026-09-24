import { ehEmpresa, Usuario } from './usuario';

// ============================================================
// SOLICITAÇÃO DE AUDITORIA / SELO EMPRESARIAL
// ------------------------------------------------------------
// Tipos e regras de validação compartilhados entre site e app.
// Este arquivo NÃO acessa o banco. Nomes de status, métodos de
// pagamento e tipos de documento abaixo são PROPOSTA de front/core:
// só viram regra de persistência depois que o banco for autorizado.
// ============================================================

// ---------- Status ----------
export type StatusSolicitacaoSelo =
  | 'enviada'
  | 'em_analise'
  | 'auditoria_agendada'
  | 'aguardando_informacoes'
  | 'aprovada'
  | 'reprovada'
  | 'cancelada';

export const ROTULO_STATUS_SOLICITACAO: Record<StatusSolicitacaoSelo, string> = {
  enviada: 'Solicitação enviada',
  em_analise: 'Em análise',
  auditoria_agendada: 'Auditoria agendada',
  aguardando_informacoes: 'Aguardando informações',
  aprovada: 'Aprovada',
  reprovada: 'Reprovada',
  cancelada: 'Cancelada',
};

/** Status em que a solicitação ainda está em andamento (empresa não pode abrir outra). */
export const STATUS_SOLICITACAO_ABERTOS: StatusSolicitacaoSelo[] = [
  'enviada',
  'em_analise',
  'auditoria_agendada',
  'aguardando_informacoes',
];

export function solicitacaoEstaAberta(status: StatusSolicitacaoSelo): boolean {
  return STATUS_SOLICITACAO_ABERTOS.includes(status);
}

// ---------- Pagamento (apenas intenção; não há gateway) ----------
export type MetodoPagamentoSelo = 'cartao' | 'pix' | 'boleto';

export const ROTULO_METODO_PAGAMENTO: Record<MetodoPagamentoSelo, string> = {
  cartao: 'Cartão',
  pix: 'Pix',
  boleto: 'Boleto',
};

// ---------- Documentos ----------
export type TipoDocumentoSelo =
  | 'certificacao_ambiental'
  | 'licenca'
  | 'contrato'
  | 'comprovacao_metas'
  | 'outro';

/** Tipos apenas orientativos — não é uma lista jurídica definitiva. */
export const ROTULO_TIPO_DOCUMENTO: Record<TipoDocumentoSelo, string> = {
  certificacao_ambiental: 'Certificação ambiental',
  licenca: 'Licença',
  contrato: 'Contrato relevante',
  comprovacao_metas: 'Comprovação de metas ambientais',
  outro: 'Outro documento',
};

export const MIMES_DOCUMENTO_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png'];
export const EXTENSOES_DOCUMENTO_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png'];

/** PROPOSTA de limite (10 MB). Precisa ficar igual ao limite do bucket quando ele for criado. */
export const TAMANHO_MAX_DOCUMENTO_BYTES = 10 * 1024 * 1024;

/** Quantidade mínima de documentos para enviar a solicitação (a lista exata por tipo ainda não foi definida). */
export const MIN_DOCUMENTOS_SOLICITACAO = 1;

export interface ArquivoDocumentoSelo {
  tipo: TipoDocumentoSelo;
  nomeArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
}

// ---------- Dados do formulário ----------
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

// ---------- Acesso ----------
/** Só contas empresariais (empresa ou empresa_selo) acessam a área "Solicitar Selo". */
export function podeAcessarSolicitacaoSelo(usuario: Pick<Usuario, 'tipo'> | null | undefined): boolean {
  return ehEmpresa(usuario);
}

// ---------- Utilitários ----------
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export function apenasDigitos(valor: string): string {
  return (valor ?? '').replace(/\D/g, '');
}

export function validarCNPJ(cnpj: string): boolean {
  const d = apenasDigitos(cnpj);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const calcularDigito = (base: string): number => {
    let peso = base.length - 7;
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base.charAt(i), 10) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcularDigito(d.substring(0, 12));
  if (d1 !== parseInt(d.charAt(12), 10)) return false;
  const d2 = calcularDigito(d.substring(0, 13));
  return d2 === parseInt(d.charAt(13), 10);
}

export function formatarCNPJ(cnpj: string): string {
  const d = apenasDigitos(cnpj).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function dataHojeISO(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** Confere se a string AAAA-MM-DD é uma data real do calendário. */
function dataISOValida(valor: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return false;
  const ano = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

function vazio(valor: string | undefined | null): boolean {
  return !valor || !valor.trim();
}

// ---------- Validações por etapa ----------
export function validarDadosEmpresa(dados: DadosEmpresaSolicitacao): ErroValidacaoSolicitacao[] {
  const erros: ErroValidacaoSolicitacao[] = [];

  if (vazio(dados.cnpj)) erros.push({ campo: 'cnpj', mensagem: 'Informe o CNPJ.' });
  else if (!validarCNPJ(dados.cnpj)) erros.push({ campo: 'cnpj', mensagem: 'Informe um CNPJ válido.' });

  if (vazio(dados.razaoSocial)) erros.push({ campo: 'razaoSocial', mensagem: 'Informe a razão social.' });
  if (vazio(dados.nomeFantasia)) erros.push({ campo: 'nomeFantasia', mensagem: 'Informe o nome fantasia.' });

  if (vazio(dados.email)) erros.push({ campo: 'email', mensagem: 'Informe o e-mail empresarial.' });
  else if (!REGEX_EMAIL.test(dados.email.trim())) erros.push({ campo: 'email', mensagem: 'Informe um e-mail válido.' });

  const tel = apenasDigitos(dados.telefone);
  if (!tel) erros.push({ campo: 'telefone', mensagem: 'Informe o telefone empresarial.' });
  else if (tel.length < 10 || tel.length > 11) erros.push({ campo: 'telefone', mensagem: 'Informe um telefone válido com DDD.' });

  const cep = apenasDigitos(dados.cep);
  if (!cep) erros.push({ campo: 'cep', mensagem: 'Informe o CEP.' });
  else if (cep.length !== 8) erros.push({ campo: 'cep', mensagem: 'Informe um CEP válido.' });

  if (vazio(dados.endereco)) erros.push({ campo: 'endereco', mensagem: 'Informe o endereço.' });
  if (vazio(dados.cidade)) erros.push({ campo: 'cidade', mensagem: 'Informe a cidade.' });

  if (vazio(dados.estado)) erros.push({ campo: 'estado', mensagem: 'Informe o estado.' });
  else if (!UFS_BRASIL.includes(dados.estado.trim().toUpperCase())) erros.push({ campo: 'estado', mensagem: 'Informe uma sigla de estado válida (ex.: SP).' });

  if (vazio(dados.responsavelNome)) erros.push({ campo: 'responsavelNome', mensagem: 'Informe o responsável pela solicitação.' });
  if (vazio(dados.responsavelCargo)) erros.push({ campo: 'responsavelCargo', mensagem: 'Informe o cargo ou função do responsável.' });

  return erros;
}

/** Valida um único arquivo (tipo, extensão e tamanho). */
export function validarArquivoDocumento(arquivo: ArquivoDocumentoSelo): ErroValidacaoSolicitacao[] {
  const erros: ErroValidacaoSolicitacao[] = [];
  const extensao = (arquivo.nomeArquivo.split('.').pop() ?? '').toLowerCase();

  if (!MIMES_DOCUMENTO_PERMITIDOS.includes(arquivo.mimeType) || !EXTENSOES_DOCUMENTO_PERMITIDAS.includes(extensao)) {
    erros.push({ campo: 'documentos', mensagem: `"${arquivo.nomeArquivo}": envie apenas PDF, JPG ou PNG.` });
  }
  if (arquivo.tamanhoBytes <= 0) {
    erros.push({ campo: 'documentos', mensagem: `"${arquivo.nomeArquivo}": o arquivo está vazio.` });
  } else if (arquivo.tamanhoBytes > TAMANHO_MAX_DOCUMENTO_BYTES) {
    const limiteMb = Math.round(TAMANHO_MAX_DOCUMENTO_BYTES / (1024 * 1024));
    erros.push({ campo: 'documentos', mensagem: `"${arquivo.nomeArquivo}": o arquivo passa do limite de ${limiteMb} MB.` });
  }
  return erros;
}

export function validarDocumentos(documentos: ArquivoDocumentoSelo[]): ErroValidacaoSolicitacao[] {
  if (!documentos || documentos.length < MIN_DOCUMENTOS_SOLICITACAO) {
    return [{ campo: 'documentos', mensagem: 'Envie pelo menos um documento para a auditoria.' }];
  }
  return documentos.flatMap(validarArquivoDocumento);
}

export function validarAuditoria(dados: DadosAuditoriaSolicitacao): ErroValidacaoSolicitacao[] {
  const erros: ErroValidacaoSolicitacao[] = [];

  if (vazio(dados.dataAuditoria)) {
    erros.push({ campo: 'dataAuditoria', mensagem: 'Escolha a data da auditoria.' });
  } else if (!dataISOValida(dados.dataAuditoria)) {
    erros.push({ campo: 'dataAuditoria', mensagem: 'Data inválida.' });
  } else if (dados.dataAuditoria < dataHojeISO()) {
    erros.push({ campo: 'dataAuditoria', mensagem: 'A data da auditoria não pode ser anterior a hoje.' });
  }

  if (vazio(dados.localAuditoria)) {
    erros.push({ campo: 'localAuditoria', mensagem: 'Informe o local da auditoria.' });
  }

  const metas = dados.metas ?? [];
  if (metas.length === 0) {
    erros.push({ campo: 'metas', mensagem: 'Informe pelo menos uma meta de sustentabilidade.' });
  } else if (metas.some((m) => vazio(m.descricao))) {
    erros.push({ campo: 'metas', mensagem: 'Toda meta precisa ter uma descrição.' });
  }

  return erros;
}

export function validarPlanoPagamento(dados: DadosPlanoPagamento): ErroValidacaoSolicitacao[] {
  const erros: ErroValidacaoSolicitacao[] = [];
  if (vazio(dados.plano)) erros.push({ campo: 'plano', mensagem: 'Selecione um plano.' });
  if (!dados.metodoPagamento || !(dados.metodoPagamento in ROTULO_METODO_PAGAMENTO)) {
    erros.push({ campo: 'metodoPagamento', mensagem: 'Selecione o método de pagamento.' });
  }
  return erros;
}

/** Validação completa (usada antes do envio). Retorna lista vazia se estiver tudo certo. */
export function validarSolicitacaoSelo(dados: DadosSolicitacaoSelo): ErroValidacaoSolicitacao[] {
  return [
    ...validarDadosEmpresa(dados.empresa),
    ...validarDocumentos(dados.documentos),
    ...validarAuditoria(dados.auditoria),
    ...validarPlanoPagamento(dados.planoPagamento),
  ];
}