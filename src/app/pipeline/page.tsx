import { KanbanBoard } from '@/features/pipeline/components/KanbanBoard'
import { Navigation } from '@/shared/components/Navigation'

export default function PipelinePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="ml-64 min-h-screen">
        <KanbanBoard />
      </main>
    </div>
  )
}
