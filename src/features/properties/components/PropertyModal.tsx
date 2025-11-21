'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFormData } from '../types';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PropertyFormData) => Promise<void>;
  property?: Property | null;
  mode: 'create' | 'edit';
}

export function PropertyModal({
  isOpen,
  onClose,
  onSave,
  property,
  mode,
}: PropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    agente: '',
    telefono: '',
    property_id: '',
    estado: 'activo',
    propiedad: '',
    titulo_publicacion: '',
    direccion_publicacion: '',
    operacion: 'Venta',
    barrio: '',
    tipo: '',
    link: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (property && mode === 'edit') {
      setFormData({
        numero: property.numero,
        agente: property.agente,
        telefono: property.telefono,
        property_id: property.property_id,
        estado: property.estado,
        propiedad: property.propiedad,
        titulo_publicacion: property.titulo_publicacion,
        direccion_publicacion: property.direccion_publicacion,
        operacion: property.operacion,
        requisitos_alquiler: property.requisitos_alquiler,
        piso: property.piso,
        barrio: property.barrio,
        tipo: property.tipo,
        link: property.link,
        ambientes: property.ambientes,
        amenities: property.amenities,
        m2_cubiertos: property.m2_cubiertos,
        m2_semicubiertos: property.m2_semicubiertos,
        m2_descubiertos: property.m2_descubiertos,
        m2_total: property.m2_total,
        m2_ponderados: property.m2_ponderados,
        valor_m2: property.valor_m2,
        valor_actual: property.valor_actual,
        valor_anterior: property.valor_anterior,
        porcentaje_bajado: property.porcentaje_bajado,
        expensas: property.expensas,
        es_apto_credito: property.es_apto_credito,
        es_apto_profesional: property.es_apto_profesional,
        acepta_financiacion_permuta: property.acepta_financiacion_permuta,
        modalidad_visitas: property.modalidad_visitas,
      });
    } else {
      setFormData({
        agente: '',
        telefono: '',
        property_id: '',
        estado: 'activo',
        propiedad: '',
        titulo_publicacion: '',
        direccion_publicacion: '',
        operacion: 'Venta',
        barrio: '',
        tipo: '',
        link: '',
      });
    }
  }, [property, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="card-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="sticky top-0 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm p-6 border-b border-gray-200 dark:border-dark-700/50 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-gradient">
            {mode === 'create' ? 'Nueva Propiedad' : 'Editar Propiedad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Título Publicación *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo_publicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo_publicacion: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Property ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.property_id}
                  onChange={(e) =>
                    setFormData({ ...formData, property_id: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.direccion_publicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion_publicacion: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Propiedad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.propiedad}
                  onChange={(e) =>
                    setFormData({ ...formData, propiedad: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Barrio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.barrio}
                  onChange={(e) =>
                    setFormData({ ...formData, barrio: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Tipo *
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Departamento Loft">Departamento Loft</option>
                  <option value="Monoambiente">Monoambiente</option>
                  <option value="PH">PH</option>
                  <option value="Terrenos y Lotes">Terrenos y Lotes</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Local">Local</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                >
                  <option value="activo">Activo</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Operación *
                </label>
                <select
                  required
                  value={formData.operacion}
                  onChange={(e) => setFormData({ ...formData, operacion: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                >
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Alquiler Temporal">Alquiler Temporal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detalles de la Propiedad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Detalles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Ambientes
                </label>
                <input
                  type="number"
                  value={formData.ambientes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, ambientes: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Piso
                </label>
                <input
                  type="text"
                  value={formData.piso || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, piso: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Número
                </label>
                <input
                  type="number"
                  value={formData.numero || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, numero: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Superficies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Superficies (m²)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  m² Cubiertos
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.m2_cubiertos || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, m2_cubiertos: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  m² Semicubiertos
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.m2_semicubiertos || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, m2_semicubiertos: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  m² Descubiertos
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.m2_descubiertos || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, m2_descubiertos: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  m² Total
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.m2_total || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, m2_total: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Valor Actual
                </label>
                <input
                  type="text"
                  value={formData.valor_actual || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_actual: e.target.value })
                  }
                  placeholder="U$D100.000"
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Valor Anterior
                </label>
                <input
                  type="text"
                  value={formData.valor_anterior || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_anterior: e.target.value })
                  }
                  placeholder="U$D120.000"
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Expensas
                </label>
                <input
                  type="text"
                  value={formData.expensas || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expensas: e.target.value })
                  }
                  placeholder="$50.000"
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Agente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Información del Agente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Agente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.agente}
                  onChange={(e) =>
                    setFormData({ ...formData, agente: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Teléfono *
                </label>
                <input
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Otros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Otros</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Link Publicación *
                </label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Amenities
                </label>
                <textarea
                  value={formData.amenities || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  rows={3}
                  placeholder="Gimnasio, SUM, Piscina..."
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-2">
                  Modalidad de Visitas
                </label>
                <input
                  type="text"
                  value={formData.modalidad_visitas || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, modalidad_visitas: e.target.value })
                  }
                  placeholder="coordinar, llave, desarrollo"
                  className="w-full px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg text-gray-900 dark:text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-100 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-electric-500 text-white rounded-lg hover:bg-electric-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
