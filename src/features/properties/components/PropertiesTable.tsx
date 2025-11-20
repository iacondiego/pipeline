'use client';

import { Property } from '../types';

interface PropertiesTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export function PropertiesTable({ properties, onEdit, onDelete }: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="card-glass p-8 text-center">
        <p className="text-dark-400">No hay propiedades disponibles</p>
      </div>
    );
  }

  return (
    <div className="card-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-dark-700/50">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Dirección</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Tipo</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Barrio</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Estado</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Valor</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">m² Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Ambientes</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Agente</th>
              <th className="px-6 py-4 text-sm font-semibold text-dark-200">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/30">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-dark-800/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-dark-300">
                  {property.numero || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-dark-100 truncate">
                      {property.titulo_publicacion}
                    </p>
                    {property.link && (
                      <a
                        href={property.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-electric-400 hover:text-electric-300 inline-flex items-center gap-1 mt-1"
                      >
                        Ver publicación
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-dark-300 max-w-xs truncate">
                  {property.direccion_publicacion}
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">
                  {property.tipo}
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">
                  {property.barrio}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      property.estado.toLowerCase() === 'activo'
                        ? 'bg-green-500/20 text-green-400'
                        : property.estado.toLowerCase() === 'reservado'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {property.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-dark-100">
                  {property.valor_actual || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">
                  {property.m2_total || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">
                  {property.ambientes || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">
                  <div>
                    <p>{property.agente}</p>
                    {property.telefono && (
                      <a
                        href={`tel:${property.telefono}`}
                        className="text-xs text-electric-400 hover:text-electric-300"
                      >
                        {property.telefono}
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(property)}
                      className="p-2 text-dark-400 hover:text-electric-400 transition-colors"
                      title="Editar"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
                          onDelete(property.id);
                        }
                      }}
                      className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                      title="Eliminar"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
