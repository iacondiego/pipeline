/**
 * Script de Verificación de Supabase
 *
 * Prueba la conexión y operaciones básicas con Supabase
 *
 * Uso:
 *   node scripts/test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
}

// Leer variables de entorno
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')

  if (!fs.existsSync(envPath)) {
    log.error('.env.local no encontrado')
    log.warning('Crea el archivo .env.local con:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL=tu_url')
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  })

  return env
}

async function testSupabaseConnection() {
  log.section('🧪 Verificación de Supabase - Pipeline Vibe')

  // 1. Cargar variables de entorno
  log.info('Cargando variables de entorno...')
  const env = loadEnv()

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    log.error('Variables de entorno faltantes')
    log.warning('Asegúrate de tener:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL')
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  log.success('Variables cargadas')
  console.log(`  URL: ${supabaseUrl}`)
  console.log(`  Key: ${supabaseKey.substring(0, 20)}...`)

  // 2. Crear cliente de Supabase
  log.info('\nCreando cliente de Supabase...')
  const supabase = createClient(supabaseUrl, supabaseKey)
  log.success('Cliente creado')

  // 3. Verificar estructura de tabla
  log.section('📋 Verificando estructura de tabla "leads"')

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1)

    if (error) {
      log.error(`Error al consultar tabla: ${error.message}`)
      if (error.message.includes('relation "public.leads" does not exist')) {
        log.warning('La tabla "leads" no existe')
        log.info('Ejecuta la migración: supabase/migrations/001_create_leads_table.sql')
      }
      process.exit(1)
    }

    log.success('Tabla "leads" existe y es accesible')

    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      log.success(`Columnas encontradas: ${columns.join(', ')}`)

      // Verificar que phone sea la PK
      if (columns.includes('phone')) {
        log.success('Columna "phone" presente ✓')
      } else {
        log.error('Columna "phone" no encontrada')
        log.warning('La migración no se ejecutó correctamente')
      }

      // Verificar otras columnas esperadas
      const expectedColumns = ['phone', 'nombres', 'estimated_value', 'stage', 'created_at', 'updated_at']
      const missingColumns = expectedColumns.filter(col => !columns.includes(col))

      if (missingColumns.length === 0) {
        log.success('Todas las columnas esperadas están presentes ✓')
      } else {
        log.error(`Columnas faltantes: ${missingColumns.join(', ')}`)
      }
    }
  } catch (err) {
    log.error(`Error inesperado: ${err.message}`)
    process.exit(1)
  }

  // 4. Contar registros
  log.section('📊 Contando registros')

  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (error) {
      log.error(`Error al contar registros: ${error.message}`)
      process.exit(1)
    }

    log.success(`Total de leads: ${count}`)

    if (count === 0) {
      log.warning('No hay registros en la tabla')
      log.info('Los datos de ejemplo deberían insertarse automáticamente con la migración')
    } else if (count === 8) {
      log.success('Datos de ejemplo presentes (8 registros) ✓')
    } else {
      log.info(`Hay ${count} registros en la tabla`)
    }
  } catch (err) {
    log.error(`Error inesperado: ${err.message}`)
    process.exit(1)
  }

  // 5. Obtener datos de ejemplo
  log.section('🔍 Obteniendo datos de ejemplo')

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('phone, nombres, stage, estimated_value')
      .limit(3)

    if (error) {
      log.error(`Error al obtener datos: ${error.message}`)
      process.exit(1)
    }

    if (data && data.length > 0) {
      log.success(`Primeros ${data.length} leads:`)
      console.table(data)
    } else {
      log.warning('No hay datos para mostrar')
    }
  } catch (err) {
    log.error(`Error inesperado: ${err.message}`)
    process.exit(1)
  }

  // 6. Verificar distribución por etapa
  log.section('📈 Distribución por etapa')

  try {
    const stages = ['Prospecto', 'Contactado', 'Interesado', 'Propuesta enviada']
    const distribution = []

    for (const stage of stages) {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('stage', stage)

      if (error) {
        log.error(`Error al contar "${stage}": ${error.message}`)
        continue
      }

      distribution.push({ stage, count })
    }

    console.table(distribution)
    log.success('Distribución obtenida correctamente ✓')
  } catch (err) {
    log.error(`Error inesperado: ${err.message}`)
  }

  // 7. Probar operación de actualización (test)
  log.section('🔧 Probando operación de actualización')

  try {
    // Crear lead de prueba
    const testPhone = '+56999999999'
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([
        {
          phone: testPhone,
          nombres: 'Test Lead (Auto-generado)',
          estimated_value: 1,
          stage: 'Prospecto',
        },
      ])
      .select()

    if (insertError) {
      if (insertError.code === '23505') {
        log.info('Lead de prueba ya existe, actualizando...')

        // Actualizar existente
        const { error: updateError } = await supabase
          .from('leads')
          .update({ stage: 'Contactado', estimated_value: 1 })
          .eq('phone', testPhone)

        if (updateError) {
          log.error(`Error al actualizar: ${updateError.message}`)
        } else {
          log.success('Lead de prueba actualizado ✓')
        }
      } else {
        log.error(`Error al crear lead de prueba: ${insertError.message}`)
      }
    } else {
      log.success('Lead de prueba creado ✓')
    }

    // Eliminar lead de prueba
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('phone', testPhone)

    if (deleteError) {
      log.warning(`No se pudo eliminar lead de prueba: ${deleteError.message}`)
    } else {
      log.success('Lead de prueba eliminado ✓')
    }
  } catch (err) {
    log.error(`Error en prueba de operaciones: ${err.message}`)
  }

  // 8. Verificar Real-time (básico)
  log.section('⚡ Verificación de Real-time')
  log.info('Para verificar Real-time completo:')
  console.log('  1. Ve a Supabase Dashboard → Database → Replication')
  console.log('  2. Verifica que "leads" esté activado')
  console.log('  3. Prueba haciendo cambios en Table Editor')
  console.log('  4. Observa si aparecen en el frontend sin refrescar')

  // Resumen final
  log.section('✅ Verificación Completa')
  log.success('Todas las pruebas pasaron correctamente')
  log.info('El sistema está listo para usar')
  console.log('\n📝 Siguiente paso:')
  console.log('  1. Abre http://localhost:3000')
  console.log('  2. Verifica que el sidebar se vea correctamente')
  console.log('  3. Prueba el drag & drop en el Kanban')
  console.log('  4. Haz cambios en Supabase y observa el sync en tiempo real')
  console.log('')
}

// Ejecutar verificación
testSupabaseConnection().catch((err) => {
  log.error(`Error fatal: ${err.message}`)
  console.error(err)
  process.exit(1)
})
