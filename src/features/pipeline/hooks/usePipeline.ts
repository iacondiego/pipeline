import { useEffect, useState, useCallback, useRef } from 'react'
import { leadService } from '../services/leadService'
import { Lead, PipelineStage, StageColumn, PIPELINE_STAGES } from '../types'

export function usePipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<ReturnType<typeof leadService.subscribeToChanges> | null>(null)

  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await leadService.getAll()
      setLeads(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar leads')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  // Setup real-time subscription (separate effect, runs only once)
  useEffect(() => {
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
      } else if (payload.eventType === 'UPDATE') {
        console.log('🔄 UPDATE event:', payload.new)
        setLeads((prev) => {
          const updatedLeads = prev.map((lead) =>
            lead.phone === payload.new.phone ? (payload.new as Lead) : lead
          )
          console.log('✅ Updated lead:', payload.new.phone)
          return updatedLeads
        })
      } else if (payload.eventType === 'DELETE' && payload?.old?.phone) {
        console.log('🗑️ DELETE event:', payload.old)
        setLeads((prev) => {
          const filteredLeads = prev.filter((lead) => lead.phone !== payload.old.phone)
          console.log('✅ Deleted lead, remaining:', filteredLeads.length)
          return filteredLeads
        })
      }
    })

    subscriptionRef.current = subscription

    return () => {
      console.log('🔌 Unsubscribing from real-time...')
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, []) // Empty dependency array - run once on mount

  const updateLeadStage = useCallback(async (phone: string, stage: PipelineStage) => {
    // Optimistic update: actualizar UI inmediatamente
    const previousLeads = [...leads]

    setLeads((prev) =>
      prev.map((lead) =>
        lead.phone === phone ? { ...lead, stage } : lead
      )
    )

    try {
      await leadService.updateStage(phone, stage)
      console.log('✅ Lead stage updated successfully:', phone, '→', stage)
    } catch (err) {
      // Revertir en caso de error
      console.error('❌ Error updating lead, reverting...', err)
      setLeads(previousLeads)
      setError(err instanceof Error ? err.message : 'Error al actualizar lead')
      throw err
    }
  }, [leads])

  const getStageColumns = useCallback((): StageColumn[] => {
    return PIPELINE_STAGES.map((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage)

      // Contar tipos de propiedad en esta etapa
      const propertyTypes: Record<string, number> = {}
      stageLeads.forEach((lead) => {
        const property = lead.interes_propiedad
        propertyTypes[property] = (propertyTypes[property] || 0) + 1
      })

      return {
        id: stage,
        title: stage,
        leads: stageLeads,
        count: stageLeads.length,
        propertyTypes,
      }
    })
  }, [leads])

  return {
    leads,
    isLoading,
    error,
    updateLeadStage,
    getStageColumns,
    refresh: loadLeads,
  }
}
