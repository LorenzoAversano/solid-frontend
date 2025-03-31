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
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar?: string | null
          created_at?: string
        }
      }
      // Vous pouvez ajouter d'autres tables ici si nécessaire
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}