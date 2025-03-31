export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string
          created_at: string
        }
        Insert: {
          name: string
          email: string
          avatar: string
          id?: string
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          avatar?: string
          id?: string
          created_at?: string
        }
      }
      // Ajoutez d'autres tables selon vos besoins
    }
  }
}