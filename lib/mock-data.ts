/**
 * Dados mockados para desenvolvimento
 * Usar enquanto as queries do Supabase não estiverem prontas
 */

export const mockKPIs = {
  usuarios: { total: 1234, change: 12 },
  buscas: { total: 456, change: 23 },
  nps: { score: 8.5, total: 89 },
  interacoes: { total: 234, change: -5 },
}

export const mockTopicos = [
  { topico: 'Síndico x Morador', total_buscas: 145 },
  { topico: 'Vizinhos', total_buscas: 132 },
  { topico: 'Barulho', total_buscas: 98 },
  { topico: 'Pets', total_buscas: 87 },
  { topico: 'Assembleias', total_buscas: 76 },
  { topico: 'Manutenção', total_buscas: 65 },
  { topico: 'Taxas', total_buscas: 54 },
  { topico: 'Mudança', total_buscas: 43 },
  { topico: 'Estacionamento', total_buscas: 32 },
  { topico: 'Obras', total_buscas: 21 },
]

export const mockDemandas = [
  { data: '2024-01-01', atendidas: 45, nao_atendidas: 12 },
  { data: '2024-01-02', atendidas: 52, nao_atendidas: 8 },
  { data: '2024-01-03', atendidas: 48, nao_atendidas: 15 },
  { data: '2024-01-04', atendidas: 61, nao_atendidas: 9 },
  { data: '2024-01-05', atendidas: 55, nao_atendidas: 11 },
  { data: '2024-01-06', atendidas: 43, nao_atendidas: 7 },
  { data: '2024-01-07', atendidas: 38, nao_atendidas: 14 },
  { data: '2024-01-08', atendidas: 67, nao_atendidas: 6 },
  { data: '2024-01-09', atendidas: 59, nao_atendidas: 10 },
  { data: '2024-01-10', atendidas: 71, nao_atendidas: 5 },
  { data: '2024-01-11', atendidas: 64, nao_atendidas: 13 },
  { data: '2024-01-12', atendidas: 58, nao_atendidas: 8 },
  { data: '2024-01-13', atendidas: 47, nao_atendidas: 12 },
  { data: '2024-01-14', atendidas: 53, nao_atendidas: 9 },
  { data: '2024-01-15', atendidas: 69, nao_atendidas: 7 },
]

export const mockCondominios = [
  {
    condominio_id: 1,
    nome_condominio: 'Residencial Jardim das Flores',
    total_atendimentos: 234,
    nps_medio: 8.5,
    ativo: true,
  },
  {
    condominio_id: 2,
    nome_condominio: 'Condomínio Vila Verde',
    total_atendimentos: 189,
    nps_medio: 7.8,
    ativo: true,
  },
  {
    condominio_id: 3,
    nome_condominio: 'Edifício Central Tower',
    total_atendimentos: 156,
    nps_medio: 9.1,
    ativo: true,
  },
]
