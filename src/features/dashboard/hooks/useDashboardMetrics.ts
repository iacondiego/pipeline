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
    const totalValue = leads.reduce((sum, lead) => sum + lead.estimated_value, 0)

    const closedLeads = leads.filter((lead) => lead.stage === 'Propuesta enviada').length
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0

    return {
      totalLeads,
      totalValue,
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
      const value = stageLeads.reduce((sum, lead) => sum + lead.estimated_value, 0)
      const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0

      return {
        stage,
        count,
        value,
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
