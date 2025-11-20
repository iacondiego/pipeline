import { useEffect, useState, useCallback, useRef } from 'react'
import { leadService } from '../services/leadService'
import { Lead, PipelineStage, StageColumn, PIPELINE_STAGES } from '../types'

export function usePipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const leadsRef = useRef<Lead[]>([])

  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await leadService.getAll()
      setLeads(data)
      leadsRef.current = data
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar leads')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()

    console.log('🔌 Setting up real-time subscription...')

    const subscription = leadService.subscribeToChanges((payload) => {
      console.log('📡 Real-time event received:', payload)

      // Validar que el payload sea válido y tenga los datos correctos
      if (!payload?.new && !payload?.old) {
        console.log('⚠️ Invalid payload, skipping')
        return
      }

      if (payload.eventType === 'INSERT') {
        console.log('➕ INSERT event:', payload.new)
        setLeads((prev) => {
          // Evitar duplicados
          if (prev.some((lead) => lead.phone === payload.new.phone)) {
            console.log('⚠️ Duplicate INSERT, skipping')
            return prev
          }
          const newLeads = [payload.new as Lead, ...prev]
          console.log('✅ Added new lead, total:', newLeads.length)
          return newLeads
        })
        leadsRef.current = [payload.new as Lead, ...leadsRef.current]
      } else if (payload.eventType === 'UPDATE') {
        console.log('🔄 UPDATE event:', payload.new)
        setLeads((prev) => {
          const updatedLeads = prev.map((lead) =>
            lead.phone === payload.new.phone ? (payload.new as Lead) : lead
          )
          console.log('✅ Updated lead:', payload.new.phone)
          return updatedLeads
        })
        leadsRef.current = leadsRef.current.map((lead) =>
          lead.phone === payload.new.phone ? (payload.new as Lead) : lead
        )
      } else if (payload.eventType === 'DELETE' && payload?.old?.phone) {
        console.log('🗑️ DELETE event:', payload.old)
        setLeads((prev) => {
          const filteredLeads = prev.filter((lead) => lead.phone !== payload.old.phone)
          console.log('✅ Deleted lead, remaining:', filteredLeads.length)
          return filteredLeads
        })
        leadsRef.current = leadsRef.current.filter((lead) => lead.phone !== payload.old.phone)
      }
    })

    return () => {
      console.log('🔌 Unsubscribing from real-time...')
      subscription.unsubscribe()
    }
  }, [loadLeads])

  const updateLeadStage = useCallback(async (phone: string, stage: PipelineStage) => {
    try {
      await leadService.updateStage(phone, stage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar lead')
      throw err
    }
  }, [])

  const getStageColumns = useCallback((): StageColumn[] => {
    return PIPELINE_STAGES.map((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage)
      const totalValue = stageLeads.reduce((sum, lead) => sum + lead.estimated_value, 0)

      return {
        id: stage,
        title: stage,
        leads: stageLeads,
        totalValue,
        count: stageLeads.length,
      }
    })
  }, [leads])

  const getTotalValue = useCallback(() => {
    return leads.reduce((sum, lead) => sum + lead.estimated_value, 0)
  }, [leads])

  return {
    leads,
    isLoading,
    error,
    updateLeadStage,
    getStageColumns,
    getTotalValue,
    refresh: loadLeads,
  }
}
