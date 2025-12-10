'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { startOfDay, subDays, subMonths, startOfYear, endOfDay } from 'date-fns'

export type PeriodType = 'today' | '7days' | '30days' | '90days' | 'year' | 'custom'

interface DateRange {
  startDate: Date
  endDate: Date
}

/**
 * Calcula o range de datas baseado no período selecionado
 */
export function getDateRangeFromPeriod(period: PeriodType, customRange?: DateRange): DateRange {
  const now = new Date()

  switch (period) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      }
    case '7days':
      return {
        startDate: startOfDay(subDays(now, 7)),
        endDate: endOfDay(now),
      }
    case '30days':
      return {
        startDate: startOfDay(subDays(now, 30)),
        endDate: endOfDay(now),
      }
    case '90days':
      return {
        startDate: startOfDay(subDays(now, 90)),
        endDate: endOfDay(now),
      }
    case 'year':
      return {
        startDate: startOfYear(now),
        endDate: endOfDay(now),
      }
    case 'custom':
      if (!customRange) {
        throw new Error('Custom range requires startDate and endDate')
      }
      return customRange
    default:
      return {
        startDate: startOfDay(subDays(now, 30)),
        endDate: endOfDay(now),
      }
  }
}

/**
 * Busca KPIs principais do dashboard (otimizado)
 */
export async function getDashboardKPIs(period: PeriodType = '30days') {
  const supabase = await createServerSupabaseClient()
  const { startDate, endDate } = getDateRangeFromPeriod(period)

  try {
    // Executar todas as queries em paralelo para melhor performance
    const [usuariosResult, buscasResult, npsResult, interacoesResult] = await Promise.allSettled([
      supabase
        .from('vw_usuarios_unicos_periodo')
        .select('total_usuarios')
        .gte('periodo', startDate.toISOString())
        .lte('periodo', endDate.toISOString())
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('vw_buscas_paragrafos_periodo')
        .select('total_buscas')
        .gte('periodo', startDate.toISOString())
        .lte('periodo', endDate.toISOString())
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('vw_nps_geral')
        .select('nps_score, total_respostas')
        .gte('data_inicio', startDate.toISOString())
        .lte('data_fim', endDate.toISOString())
        .order('data_fim', { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('vw_interacoes_sindicos')
        .select('total_interacoes')
        .gte('periodo', startDate.toISOString())
        .lte('periodo', endDate.toISOString())
        .order('periodo', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    // Extrair dados com fallback para 0
    const usuarios = usuariosResult.status === 'fulfilled' ? usuariosResult.value.data : null
    const buscas = buscasResult.status === 'fulfilled' ? buscasResult.value.data : null
    const nps = npsResult.status === 'fulfilled' ? npsResult.value.data : null
    const interacoes = interacoesResult.status === 'fulfilled' ? interacoesResult.value.data : null

    return {
      usuarios: {
        total: usuarios?.total_usuarios || 0,
        change: 0, // TODO: Calcular comparação com período anterior
      },
      buscas: {
        total: buscas?.total_buscas || 0,
        change: 0,
      },
      nps: {
        score: nps?.nps_score || 0,
        total: nps?.total_respostas || 0,
      },
      interacoes: {
        total: interacoes?.total_interacoes || 0,
        change: 0,
      },
    }
  } catch (error) {
    console.error('Erro ao buscar KPIs do dashboard:', error)
    return {
      usuarios: { total: 0, change: 0 },
      buscas: { total: 0, change: 0 },
      nps: { score: 0, total: 0 },
      interacoes: { total: 0, change: 0 },
    }
  }
}

/**
 * Busca top 10 tópicos mais buscados (otimizado)
 */
export async function getTopTopicos(period: PeriodType = '30days') {
  const supabase = await createServerSupabaseClient()
  const { startDate, endDate } = getDateRangeFromPeriod(period)

  try {
    const { data, error } = await supabase
      .from('vw_top_topicos')
      .select('topico, total_buscas')
      .gte('periodo', startDate.toISOString())
      .lte('periodo', endDate.toISOString())
      .order('total_buscas', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Erro ao buscar top tópicos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar top tópicos:', error)
    return []
  }
}

/**
 * Busca evolução de demandas atendidas/não atendidas (otimizado)
 * Limita a 90 pontos para não sobrecarregar o gráfico
 */
export async function getDemandasTimeline(period: PeriodType = '30days') {
  const supabase = await createServerSupabaseClient()
  const { startDate, endDate } = getDateRangeFromPeriod(period)

  try {
    const { data, error } = await supabase
      .from('vw_demandas_atendimento')
      .select('data, atendidas, nao_atendidas')
      .gte('data', startDate.toISOString())
      .lte('data', endDate.toISOString())
      .order('data', { ascending: true })
      .limit(90) // Limita a 90 pontos para performance

    if (error) {
      console.error('Erro ao buscar timeline de demandas:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar timeline de demandas:', error)
    return []
  }
}

/**
 * Busca lista de condomínios com métricas resumidas (otimizado)
 * Limita a 50 condomínios e seleciona apenas campos necessários
 */
export async function getCondominiosStats(period: PeriodType = '30days') {
  const supabase = await createServerSupabaseClient()
  const { startDate, endDate } = getDateRangeFromPeriod(period)

  try {
    const { data, error } = await supabase
      .from('vw_dashboard_condominio')
      .select('condominio_id, nome_condominio, total_atendimentos, nps_medio, ativo')
      .gte('periodo_inicio', startDate.toISOString())
      .lte('periodo_fim', endDate.toISOString())
      .order('total_atendimentos', { ascending: false })
      .limit(50) // Limita a 50 condomínios para performance

    if (error) {
      console.error('Erro ao buscar stats de condomínios:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar stats de condomínios:', error)
    return []
  }
}
