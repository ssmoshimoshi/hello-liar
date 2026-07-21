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
          resonate_count: number
          illustrated: boolean
          illustration_url: string | null
          illustration_created_at: string | null
          created_at: string
          updated_at: string
          total_shares: number
          instagram_shares: number
        }
        Insert: {
          id?: string
          content_id: string
          content_en: string
          doubt_count?: number
          resonate_count?: number
          illustrated?: boolean
          illustration_url?: string | null
          illustration_created_at?: string | null
          created_at?: string
          updated_at?: string
          total_shares?: number
          instagram_shares?: number
        }
        Update: {
          id?: string
          content_id?: string
          content_en?: string
          doubt_count?: number
          resonate_count?: number
          illustrated?: boolean
          illustration_url?: string | null
          illustration_created_at?: string | null
          created_at?: string
          updated_at?: string
          total_shares?: number
          instagram_shares?: number
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
      increment_resonate: {
        Args: {
          lie_id: string
        }
        Returns: undefined
      }
      mark_illustrated: {
        Args: {
          lie_id: string
          img_url: string
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
