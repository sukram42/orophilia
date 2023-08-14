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
      Mountains: {
        Row: {
          created_at: string
          height: number | null
          id: number
          name: string | null
          region: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: number
          name?: string | null
          region?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: number
          name?: string | null
          region?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Mountains_region_fkey"
            columns: ["region"]
            referencedRelation: "Region"
            referencedColumns: ["id"]
          }
        ]
      }
      Region: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Routes: {
        Row: {
          id: number
          mountain: number | null
        }
        Insert: {
          id?: number
          mountain?: number | null
        }
        Update: {
          id?: number
          mountain?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Routes_mountain_fkey"
            columns: ["mountain"]
            referencedRelation: "Mountains"
            referencedColumns: ["id"]
          }
        ]
      }
      TourReview: {
        Row: {
          created_at: string
          description: string | null
          id: number
          level: number | null
          route: number | null
          user: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          level?: number | null
          route?: number | null
          user?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          level?: number | null
          route?: number | null
          user?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "TourReview_level_fkey"
            columns: ["level"]
            referencedRelation: "TourTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TourReview_route_fkey"
            columns: ["route"]
            referencedRelation: "Routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TourReview_user_fkey"
            columns: ["user"]
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      TourTypes: {
        Row: {
          description: string | null
          id: number
          name: string | null
          scale: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          scale?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          scale?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "TourTypes_scale_fkey"
            columns: ["scale"]
            referencedRelation: "TourTypes"
            referencedColumns: ["id"]
          }
        ]
      }
      Users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
          useritem: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          useritem?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          useritem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_useritem_fkey"
            columns: ["useritem"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
