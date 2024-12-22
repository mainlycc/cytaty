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
      quizzes: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          questions: Json
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          questions: Json
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          questions?: Json
          user_id?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string | null
          username: string | null
          avatar: string | null
          points: number
        }
      }
    }
  }
} 