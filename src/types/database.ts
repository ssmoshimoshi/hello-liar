export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lies: {
        Row: {
          id: string
          content_id: string
          content_en: string
          doubt_count: number
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content_en: string
          doubt_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content_en?: string
          doubt_count?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_doubt: {
        Args: {
          lie_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
