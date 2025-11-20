import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { Navigation } from '@/shared/components/Navigation'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navigation />
      <main className="ml-64 min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <DashboardView />
        </div>
      </main>
    </div>
  )
}
