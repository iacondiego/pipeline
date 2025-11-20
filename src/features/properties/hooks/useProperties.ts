import { useState, useEffect, useCallback, useMemo } from 'react';
import { propertyService } from '../services/propertyService';
import { Property, PropertyFilters, PropertyFormData } from '../types';

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll(filters);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProperties();

    const subscription = propertyService.subscribeToChanges((payload) => {
      if (payload.eventType === 'INSERT') {
        setProperties((prev) => [payload.new as Property, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setProperties((prev) =>
          prev.map((prop) =>
            prop.id === payload.new.id ? (payload.new as Property) : prop
          )
        );
      } else if (payload.eventType === 'DELETE') {
        setProperties((prev) =>
          prev.filter((prop) => prop.id !== payload.old.id)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [filtersString, loadProperties]);

  const createProperty = async (property: PropertyFormData) => {
    try {
      const newProperty = await propertyService.create(property);
      return newProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      throw err;
    }
  };

  const updateProperty = async (id: string, property: Partial<PropertyFormData>) => {
    try {
      const updatedProperty = await propertyService.update(id, property);
      return updatedProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await propertyService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    refresh: loadProperties,
  };
}
