import { supabase } from '@/shared/lib/supabase'
import { Lead, PipelineStage } from '../types'

export const leadService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      throw error
    }

    return data || []
  },

  async updateStage(phone: string, stage: PipelineStage): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({ stage })
      .eq('phone', phone)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead stage:', error)
      throw error
    }

    return data
  },

  async create(lead: Omit<Lead, 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      throw error
    }

    return data
  },

  async delete(phone: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('phone', phone)

    if (error) {
      console.error('Error deleting lead:', error)
      throw error
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToChanges(callback: (payload: any) => void) {
    console.log('🔌 Creating Supabase subscription...')

    const subscription = supabase
      .channel('leads-changes')
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          console.log('📨 Supabase payload received:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
      })

    return subscription
  },
}
