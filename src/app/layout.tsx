import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Setterless - Gestión de Leads en Tiempo Real',
  description: 'Sistema de gestión de pipeline de ventas con tablero Kanban y dashboard de métricas en tiempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
