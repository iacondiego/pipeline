'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertiesTable } from '@/features/properties/components/PropertiesTable';
import { PropertyModal } from '@/features/properties/components/PropertyModal';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { Property, PropertyFilters, PropertyFormData } from '@/features/properties/types';

export default function PropertiesPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { properties, loading, error, createProperty, updateProperty, deleteProperty } =
    useProperties(filters);

  const handleCreateClick = () => {
    setSelectedProperty(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSave = async (data: PropertyFormData) => {
    if (modalMode === 'create') {
      await createProperty(data);
    } else if (selectedProperty) {
      await updateProperty(selectedProperty.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProperty(id);
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Get unique values for filters
  const estados = Array.from(new Set(properties.map((p) => p.estado))).filter(Boolean);
  const tipos = Array.from(new Set(properties.map((p) => p.tipo))).filter(Boolean);
  const barrios = Array.from(new Set(properties.map((p) => p.barrio))).filter(Boolean);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Propiedades</h1>
            <p className="text-dark-400">
              Gestiona tu cartera de propiedades
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 text-dark-100 border border-dark-700 rounded-lg hover:border-electric-500 hover:text-electric-500 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver
            </button>
            <button
              onClick={handleCreateClick}
              className="px-6 py-3 bg-electric-500 text-white rounded-lg hover:bg-electric-600 transition-all duration-200 shadow-electric flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Propiedad
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">Total</p>
                <p className="text-3xl font-bold text-dark-100">
                  {properties.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-electric-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-electric-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">Activas</p>
                <p className="text-3xl font-bold text-green-400">
                  {properties.filter((p) => p.estado.toLowerCase() === 'activo').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">Reservadas</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {properties.filter((p) => p.estado.toLowerCase() === 'reservado').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">Tipos</p>
                <p className="text-3xl font-bold text-dark-100">
                  {tipos.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Búsqueda
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar..."
                  className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-electric-500 text-white rounded-lg hover:bg-electric-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Estado
              </label>
              <select
                value={filters.estado || ''}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
              >
                <option value="">Todos</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Tipo
              </label>
              <select
                value={filters.tipo || ''}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
              >
                <option value="">Todos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Barrio
              </label>
              <select
                value={filters.barrio || ''}
                onChange={(e) => setFilters({ ...filters, barrio: e.target.value || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none"
              >
                <option value="">Todos</option>
                {barrios.map((barrio) => (
                  <option key={barrio} value={barrio}>
                    {barrio}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 text-dark-400 hover:text-dark-100 border border-dark-700 rounded-lg hover:border-dark-600 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error / Table */}
        {loading ? (
          <div className="card-glass p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-electric-500 border-t-transparent"></div>
            <p className="mt-4 text-dark-400">Cargando propiedades...</p>
          </div>
        ) : error ? (
          <div className="card-glass p-8 text-center">
            <div className="text-red-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
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
            <p className="text-dark-100 font-medium mb-2">Error al cargar propiedades</p>
            <p className="text-dark-400 text-sm">{error}</p>
          </div>
        ) : (
          <PropertiesTable
            properties={properties}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {/* Modal */}
        <PropertyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          property={selectedProperty}
          mode={modalMode}
        />
      </div>
    </div>
  );
}
