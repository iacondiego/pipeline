'use client'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
  CollisionDetection
} from '@dnd-kit/core'
import { useState, useMemo, useCallback } from 'react'
import { usePipeline } from '../hooks/usePipeline'
import { Lead, PipelineStage, PIPELINE_STAGES, StageColumn } from '../types'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard } from './LeadCard'
import { SearchBar } from './SearchBar'

export function KanbanBoard() {
  const { getStageColumns, updateLeadStage, updateLeadNotes, isLoading, error } = usePipeline()
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const allColumns = getStageColumns()

  // Filtrar leads por búsqueda
  const columns = useMemo(() => {
    if (!searchQuery.trim()) {
      return allColumns
    }

    const query = searchQuery.toLowerCase()

    return allColumns.map((column): StageColumn => {
      const filteredLeads = column.leads.filter((lead) => {
        return (
          lead.nombres.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.interes_propiedad.toLowerCase().includes(query)
        )
      })

      // Recalcular propertyTypes para leads filtrados
      const propertyTypes: Record<string, number> = {}
      filteredLeads.forEach((lead) => {
        const type = lead.interes_propiedad
        propertyTypes[type] = (propertyTypes[type] || 0) + 1
      })

      return {
        ...column,
        leads: filteredLeads,
        count: filteredLeads.length,
        propertyTypes
      }
    })
  }, [allColumns, searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Estrategia simple: usar closestCenter directamente
  const customCollisionDetection: CollisionDetection = (args) => {
    // Usar closestCenter que funciona mejor para Kanban
    const collisions = closestCenter(args)

    if (collisions.length > 0) {
      console.log('🎯 Collision detected:', collisions[0].id)
    }

    return collisions
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    const lead = columns
      .flatMap((col) => col.leads)
      .find((lead) => lead.phone === active.id)
    setActiveLead(lead || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeLeadPhone = active.id as string
    const overId = over.id as string

    console.log('🔄 Drag over:', { activeLeadPhone, overId })

    // Encontrar la columna de origen
    const activeColumn = columns.find((col) =>
      col.leads.some((lead) => lead.phone === activeLeadPhone)
    )

    // Determinar si estamos sobre una columna o sobre otro lead
    const overColumn = columns.find((col) => col.id === overId)
    const overLead = columns
      .flatMap((col) => col.leads)
      .find((lead) => lead.phone === overId)

    // Si estamos sobre un lead, usar su columna; si no, usar la columna directamente
    const targetColumn = overColumn || columns.find((col) =>
      col.leads.some((lead) => lead.phone === overId)
    )

    console.log('🎯 Columns detected:', {
      activeColumn: activeColumn?.id,
      targetColumn: targetColumn?.id,
      overIsColumn: !!overColumn,
      overIsLead: !!overLead
    })

    if (activeColumn && targetColumn && activeColumn.id !== targetColumn.id) {
      // Aquí podríamos hacer un update optimista si quisiéramos
      // Por ahora solo dejamos que el usuario vea el feedback visual
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveLead(null)

    if (!over) {
      console.log('❌ No drop target')
      return
    }

    const leadPhone = active.id as string

    console.log('🎯 Drag end:', {
      leadPhone,
      overId: over.id,
      overData: over.data?.current
    })

    // Determinar la columna de destino de forma simple
    let targetStage: PipelineStage | undefined

    // Método 1: over.id es una columna (stage)
    if (PIPELINE_STAGES.includes(over.id as PipelineStage)) {
      targetStage = over.id as PipelineStage
      console.log('✅ Method 1: Dropped directly on column:', targetStage)
    }
    // Método 2: over.data tiene info de columna
    else if (over.data?.current?.type === 'column') {
      targetStage = over.data.current.stage as PipelineStage
      console.log('✅ Method 2: Dropped on column area:', targetStage)
    }
    // Método 3: over.id es un lead, buscar su columna
    else {
      const columnWithLead = columns.find(col =>
        col.leads.some(lead => lead.phone === over.id)
      )
      if (columnWithLead) {
        targetStage = columnWithLead.id
        console.log('✅ Method 3: Dropped on lead in column:', targetStage)
      }
    }

    if (!targetStage) {
      console.log('❌ Could not find target column')
      return
    }

    // Encontrar columna actual del lead
    const currentColumn = columns.find(col =>
      col.leads.some(lead => lead.phone === leadPhone)
    )

    if (!currentColumn) {
      console.log('❌ Could not find source column')
      return
    }

    // Solo actualizar si cambió de columna
    if (currentColumn.id !== targetStage) {
      console.log(`✅ Moving ${leadPhone} from ${currentColumn.id} to ${targetStage}`)
      try {
        await updateLeadStage(leadPhone, targetStage)
        console.log('✅ Updated successfully!')
      } catch (error) {
        console.error('❌ Error:', error)
      }
    } else {
      console.log('ℹ️ Same column, no update')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-dark-400">Cargando pipeline...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-900 p-6">
        <div className="text-center space-y-6 p-8 card-glass rounded-xl max-w-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar leads</h3>
            <p className="text-dark-400 mb-4">{error}</p>
          </div>

          <div className="text-left bg-dark-800/50 p-4 rounded-lg space-y-3">
            <p className="text-sm text-dark-300 font-semibold">Posibles soluciones:</p>
            <ul className="text-sm text-dark-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-electric-500 mt-1">1.</span>
                <span>
                  <strong className="text-dark-300">Variables de entorno:</strong> Verifica que
                  <code className="mx-1 px-2 py-0.5 bg-dark-700 rounded text-electric-400">NEXT_PUBLIC_SUPABASE_URL</code>
                  y
                  <code className="mx-1 px-2 py-0.5 bg-dark-700 rounded text-electric-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  estén configuradas en Vercel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-500 mt-1">2.</span>
                <span>
                  <strong className="text-dark-300">RLS en Supabase:</strong> Ve a Database → Table Editor → leads →
                  Verifica que exista una policy que permita SELECT
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-500 mt-1">3.</span>
                <span>
                  <strong className="text-dark-300">Tabla leads:</strong> Verifica que la tabla exists en Supabase
                  y tiene datos de prueba
                </span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-dark-500 pt-2">
            Abre la consola del navegador (F12) para más detalles
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-dark-900" style={{ height: 'calc(100vh - 76px)' }}>
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Barra de búsqueda */}
        <div className="px-6 pt-6 pb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por nombre, teléfono o tipo de propiedad..."
          />
        </div>

        <div className="flex-1 overflow-x-auto scrollbar-thin">
          <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="px-6 pb-6 h-full">
              <div className="flex gap-6 h-full">
                {columns.map((column) => (
                  <KanbanColumn key={column.id} column={column} onUpdateNotes={updateLeadNotes} />
                ))}
              </div>
            </div>

            <DragOverlay>
              {activeLead ? (
                <div className="rotate-3 scale-105 shadow-2xl">
                  <LeadCard lead={activeLead} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
