import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pipeline Vibe - Gestión de Leads en Tiempo Real',
  description: 'Sistema de gestión de pipeline de ventas con tablero Kanban y dashboard de métricas en tiempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
