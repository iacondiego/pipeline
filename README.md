# 🚀 Pipeline Vibe

**Sistema de gestión de pipeline de ventas con tablero Kanban, dashboard de métricas y sincronización en tiempo real.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Características Principales

### 📊 Pipeline Kanban Interactivo
- Visualiza tus leads en un tablero estilo Kanban
- **Drag & Drop** para mover leads entre etapas
- Cada columna muestra cantidad y valor total
- Animaciones fluidas y diseño moderno

### 📈 Dashboard de Métricas
- **Total de leads** en el pipeline
- **Valor total** del pipeline en CLP
- Leads creados últimos **7 y 30 días**
- **Tasa de conversión** automática
- **Gráficos interactivos** (torta y barras)
- Tabla detallada por etapa

### ⚡ Sincronización Real-time
- Cambios **instantáneos** en todos los dispositivos
- Actualización automática sin refrescar
- Integración perfecta con **N8N**
- Ver cambios mientras trabajas en N8N

### 🎨 Diseño Profesional
- Tema oscuro moderno (#0a0a12)
- Colores **azul eléctrico** (#00a0ff)
- Efectos glass morphism
- Responsive (mobile & desktop)

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript |
| **Base de Datos** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Subscriptions |
| **Styling** | Tailwind CSS |
| **Drag & Drop** | @dnd-kit |
| **Gráficos** | Recharts |
| **Validación** | Zod |
| **Deploy** | Vercel Ready |

## 🎯 ¿Para Quién es Este Proyecto?

- **Equipos de Ventas** que necesitan visualizar su pipeline
- **Freelancers** que gestionan múltiples clientes potenciales
- **Agencias** que rastrean propuestas y proyectos
- **Developers** que quieren integrar CRM con automatizaciones (N8N)
- **Cualquiera** que necesite un sistema simple de gestión de leads

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

Crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Verificar Base de Datos

**¡La tabla ya está creada!** Ve a tu dashboard de Supabase → Table Editor y verifica que existe la tabla `leads` con 8 registros.

### 4. Habilitar Real-time

En Supabase: Database → Replication → Activa `leads` ✅

### 5. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Documentación Completa

- **[SETUP.md](./SETUP.md)** - Guía completa de instalación y configuración
- **[N8N_INTEGRATION.md](./N8N_INTEGRATION.md)** - Integración con N8N y automatizaciones

## 🔗 Integración con N8N

Pipeline Vibe está **100% integrado con N8N**. Esto significa que puedes:

- ✅ Crear leads desde formularios web automáticamente
- ✅ Actualizar etapas basándote en acciones (email respondido, etc.)
- ✅ Conectar con tu CRM existente
- ✅ Automatizar seguimientos
- ✅ **Ver todos los cambios en tiempo real en el frontend**

### Ejemplo Rápido

```bash
# Crear un lead desde N8N (HTTP Request)
POST https://tu-proyecto.supabase.co/rest/v1/leads
Headers:
  apikey: tu_anon_key
  Authorization: Bearer tu_anon_key
  Content-Type: application/json
  Prefer: return=representation

Body:
{
  "name": "Lead desde N8N",
  "estimated_value": 25000,
  "stage": "Prospecto"
}
```

👉 **El lead aparecerá instantáneamente en el frontend**

Lee más en [N8N_INTEGRATION.md](./N8N_INTEGRATION.md)

## 📊 Etapas del Pipeline

1. **Prospecto** - Lead inicial, sin contacto
2. **Contactado** - Ya hiciste el primer contacto
3. **Interesado** - Mostró interés en la propuesta
4. **Propuesta enviada** - Propuesta formal enviada

Arrastra las tarjetas entre columnas para actualizar el estado. Los cambios se guardan automáticamente.

## 🎨 Screenshots

### Pipeline Kanban
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│  Prospecto  │ │ Contactado  │ │ Interesado  │ │  Propuesta   │
│             │ │             │ │             │ │   enviada    │
│  2 leads    │ │  2 leads    │ │  2 leads    │ │   2 leads    │
│  $40,000    │ │  $58,000    │ │  $32,000    │ │   $70,000    │
└─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘
```

### Dashboard
- 📊 Métricas principales (4 tarjetas)
- 🥧 Gráfico de distribución (Pie Chart)
- 📊 Gráfico de valores (Bar Chart)
- 📋 Tabla detallada

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor desarrollo (auto-port 3000-3006)
npm run build        # Build producción
npm run start        # Servidor producción

# Quality
npm run lint         # ESLint
npm run lint:fix     # Fix automático
npm run typecheck    # TypeScript check
npm run test         # Jest tests
```

## 🏗️ Arquitectura

### Feature-First

```
src/
├── app/                    # Next.js Routes
│   ├── pipeline/          # Ruta Kanban
│   └── dashboard/         # Ruta Dashboard
│
├── features/              # Features por funcionalidad
│   ├── pipeline/         # Todo del Pipeline
│   │   ├── components/   # Kanban, Columnas, Cards
│   │   ├── hooks/        # usePipeline (real-time)
│   │   ├── services/     # leadService (Supabase)
│   │   └── types/        # Types de Lead
│   │
│   └── dashboard/        # Todo del Dashboard
│       ├── components/   # Métricas, Gráficos
│       ├── hooks/        # useDashboardMetrics
│       └── types/        # Types de métricas
│
└── shared/               # Compartido
    ├── components/       # Navigation
    ├── lib/             # supabase.ts
    └── types/           # Types globales
```

Esta arquitectura **Feature-First** fue diseñada específicamente para **desarrollo asistido por IA**, permitiendo localizar todo el código relacionado en un mismo lugar.

## 🗄️ Base de Datos

### Tabla: `leads`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único (auto) |
| `name` | VARCHAR(255) | Nombre del lead |
| `estimated_value` | DECIMAL(10,2) | Valor estimado |
| `stage` | VARCHAR(50) | Etapa actual |
| `created_at` | TIMESTAMPTZ | Fecha creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Features de la tabla:**
- ✅ Índices optimizados
- ✅ Trigger para `updated_at`
- ✅ RLS habilitado
- ✅ Real-time activado

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"
→ Crea `.env.local` con tus credenciales

### Los cambios no se ven en tiempo real
→ Activa Real-time en Supabase (Database → Replication)

### Puerto ocupado
→ El script auto-detecta puertos 3000-3006

### Build falla
→ Ejecuta `npm run typecheck` primero

Más soluciones en [SETUP.md](./SETUP.md)

## 📦 Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Configura las variables de entorno en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 Roadmap

- [ ] Modal de detalles de lead
- [ ] Crear leads desde el frontend
- [ ] Filtros y búsqueda
- [ ] Autenticación de usuarios
- [ ] Asignación de leads a usuarios
- [ ] Historial de cambios
- [ ] Notificaciones
- [ ] Export CSV/Excel
- [ ] Webhooks para eventos
- [ ] API REST documentada

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [dnd-kit](https://dndkit.com/) - Drag & Drop
- [Recharts](https://recharts.org/) - Gráficos

## 📞 Soporte

¿Necesitas ayuda?

- 📖 Lee [SETUP.md](./SETUP.md)
- 🔗 Consulta [N8N_INTEGRATION.md](./N8N_INTEGRATION.md)
- 🐛 Reporta bugs en Issues
- 💬 Haz preguntas en Discussions

---

**Hecho con ❤️ usando Next.js 16 + Claude Code**

[⬆ Volver arriba](#-pipeline-vibe)
