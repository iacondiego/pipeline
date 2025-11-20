import { PipelineStage } from '@/features/pipeline/types'

export interface DashboardMetrics {
  totalLeads: number
  leadsLast7Days: number
  leadsLast30Days: number
  conversionRate: number
}

export interface StageMetric {
  stage: PipelineStage
  count: number
  percentage: number
}

export interface TimeSeriesData {
  date: string
  count: number
}
