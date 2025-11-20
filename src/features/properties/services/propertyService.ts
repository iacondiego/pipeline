import { supabase } from '@/shared/lib/supabase';
import { Property, PropertyFormData, PropertyFilters } from '../types';

export const propertyService = {
  async getAll(filters?: PropertyFilters): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.estado) {
      query = query.eq('estado', filters.estado);
    }

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }

    if (filters?.barrio) {
      query = query.eq('barrio', filters.barrio);
    }

    if (filters?.agente) {
      query = query.eq('agente', filters.agente);
    }

    if (filters?.search) {
      query = query.or(
        `propiedad.ilike.%${filters.search}%,titulo_publicacion.ilike.%${filters.search}%,direccion_publicacion.ilike.%${filters.search}%,barrio.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }

    return data || [];
  },

  async getById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      throw new Error('Failed to fetch property');
    }

    return data;
  },

  async create(property: PropertyFormData): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }

    return data;
  },

  async update(id: string, property: Partial<PropertyFormData>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      throw new Error('Failed to delete property');
    }
  },

  subscribeToChanges(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
        },
        callback
      )
      .subscribe();

    return subscription;
  },
};
