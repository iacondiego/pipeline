import { useMemo } from 'react'
import { usePipeline } from '@/features/pipeline/hooks/usePipeline'
import { PIPELINE_STAGES } from '@/features/pipeline/types'
import { DashboardMetrics, StageMetric } from '../types'

export function useDashboardMetrics() {
  const { leads, isLoading, error } = usePipeline()

  const metrics = useMemo<DashboardMetrics>(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const leadsLast7Days = leads.filter(
      (lead) => new Date(lead.created_at) >= sevenDaysAgo
    ).length

    const leadsLast30Days = leads.filter(
      (lead) => new Date(lead.created_at) >= thirtyDaysAgo
    ).length

    const totalLeads = leads.length

    const closedLeads = leads.filter((lead) => lead.stage === 'Venta ganada').length
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0

    return {
      totalLeads,
      leadsLast7Days,
      leadsLast30Days,
      conversionRate,
    }
  }, [leads])

  const stageMetrics = useMemo<StageMetric[]>(() => {
    const totalLeads = leads.length

    return PIPELINE_STAGES.map((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage)
      const count = stageLeads.length
      const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0

      return {
        stage,
        count,
        percentage,
      }
    })
  }, [leads])

  return {
    metrics,
    stageMetrics,
    isLoading,
    error,
  }
}
