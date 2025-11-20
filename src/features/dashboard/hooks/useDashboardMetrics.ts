import { useMemo } from 'react'
import { usePipeline } from '@/features/pipeline/hooks/usePipeline'
import { DashboardMetrics, PropertyMetric } from '../types'

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

  const propertyMetrics = useMemo<PropertyMetric[]>(() => {
    const totalLeads = leads.length

    // Agrupar por tipo de propiedad
    const propertyGroups = leads.reduce((acc, lead) => {
      const propertyType = lead.interes_propiedad || 'Sin especificar'
      if (!acc[propertyType]) {
        acc[propertyType] = []
      }
      acc[propertyType].push(lead)
      return acc
    }, {} as Record<string, typeof leads>)

    return Object.entries(propertyGroups)
      .map(([propertyType, propertyLeads]) => {
        const count = propertyLeads.length
        const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0

        return {
          propertyType,
          count,
          percentage,
        }
      })
      .sort((a, b) => b.count - a.count) // Ordenar por cantidad descendente
  }, [leads])

  return {
    metrics,
    propertyMetrics,
    isLoading,
    error,
  }
}
