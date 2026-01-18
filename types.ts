
export interface Cliente {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Inativo' | 'Lead';
  totalGasto: number;
  avatarUrl: string;
}

export interface Produto {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  estoque: number;
  custo: number;
  preco: number;
  fornecedor: string;
  imagemUrl: string;
  statusEstoque: 'Normal' | 'Baixo' | 'Crítico' | 'Esgotado';
  destaque?: boolean;
  descricaoLonga?: string;
}

export interface CarrinhoItem extends Produto {
  quantidade: number;
}

export interface Transacao {
  id: number;
  data: string;
  descricao: string;
  categoria?: string;
  tipo: 'Crédito' | 'Débito';
  valor: number;
}

export interface Fornecedor {
  id: number;
  nome: string;
  categoria: string;
  contato: string;
  email: string;
  telefone: string;
  performance: number; // 1-5
  status: 'Ativo' | 'Inativo' | 'Bloqueado';
  uid: string;
}

export interface Pedido {
  id: string;
  cliente: string;
  clienteAvatar: string;
  data: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Cancelado' | 'Enviado' | 'Processando';
}

export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  salario: number;
  status: 'Ativo' | 'Férias' | 'Desligado';
  admissao: string;
  avatarUrl: string;
}

export interface LojaConfig {
  nomeLoja: string;
  whatsapp: string;
  mensagemBoasVindas: string;
  bannerUrl: string;
  corPrincipal: string;
  ativo: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  funcao: 'Administrador' | 'Vendedor' | 'Gerente';
  status: 'Ativo' | 'Bloqueado';
  avatarUrl: string;
  ultimoAcesso?: string;
}

// Novo Tipo para o Tema Global do ERP
export interface ThemeConfig {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  mode: 'light' | 'dark';
}
