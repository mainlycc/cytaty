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
      memes: {
        Row: {
          id: string
          image_url: string
          top_text: string | null
          bottom_text: string | null
          top_position_x: number | null
          top_position_y: number | null
          bottom_position_x: number | null
          bottom_position_y: number | null
          top_text_size: number | null
          bottom_text_size: number | null
          top_text_color: string | null
          bottom_text_color: string | null
          tags: string[] | null
          created_at: string
          is_approved: boolean
          approved_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          image_url: string
          top_text?: string | null
          bottom_text?: string | null
          top_position_x?: number | null
          top_position_y?: number | null
          bottom_position_x?: number | null
          bottom_position_y?: number | null
          top_text_size?: number | null
          bottom_text_size?: number | null
          top_text_color?: string | null
          bottom_text_color?: string | null
          tags?: string[] | null
          created_at?: string
          is_approved?: boolean
          approved_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          top_text?: string | null
          bottom_text?: string | null
          top_position_x?: number | null
          top_position_y?: number | null
          bottom_position_x?: number | null
          bottom_position_y?: number | null
          top_text_size?: number | null
          bottom_text_size?: number | null
          top_text_color?: string | null
          bottom_text_color?: string | null
          tags?: string[] | null
          created_at?: string
          is_approved?: boolean
          approved_at?: string | null
          user_id?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          label: string
          color: string | null
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          color?: string | null
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          color?: string | null
          usage_count?: number
          created_at?: string
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