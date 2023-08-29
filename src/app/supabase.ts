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
      mountains: {
        Row: {
          created_at: string
          height: number | null
          id: number
          lat: number | null
          lon: number | null
          name: string | null
          region: number | null
          tags: Json | null
          wikidata: string | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          region?: number | null
          tags?: Json | null
          wikidata?: string | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          region?: number | null
          tags?: Json | null
          wikidata?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mountains_region_fkey"
            columns: ["region"]
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      "points-of-interest": {
        Row: {
          id: number
          lat: number | null
          lon: number | null
          name: string | null
          tags: Json | null
          type: number | null
        }
        Insert: {
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          tags?: Json | null
          type?: number | null
        }
        Update: {
          id?: number
          lat?: number | null
          lon?: number | null
          name?: string | null
          tags?: Json | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "points-of-interest_type_fkey"
            columns: ["type"]
            referencedRelation: "points-of-interest-types"
            referencedColumns: ["id"]
          }
        ]
      }
      "points-of-interest-types": {
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
      regions: {
        Row: {
          id: number
          name: string | null
          wikidata: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          wikidata?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          wikidata?: string | null
        }
        Relationships: []
      }
      route2waypoint: {
        Row: {
          index: number
          route: number
          waypoint: number | null
        }
        Insert: {
          index: number
          route?: number
          waypoint?: number | null
        }
        Update: {
          index?: number
          route?: number
          waypoint?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "route2waypoint_route_fkey"
            columns: ["route"]
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route2waypoint_waypoint_fkey"
            columns: ["waypoint"]
            referencedRelation: "waypoints"
            referencedColumns: ["id"]
          }
        ]
      }
      routes: {
        Row: {
          hike_difficulty: number | null
          id: number
          mountain: number | null
          name: string | null
          starting_point: number | null
        }
        Insert: {
          hike_difficulty?: number | null
          id?: number
          mountain?: number | null
          name?: string | null
          starting_point?: number | null
        }
        Update: {
          hike_difficulty?: number | null
          id?: number
          mountain?: number | null
          name?: string | null
          starting_point?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_mountain_fkey"
            columns: ["mountain"]
            referencedRelation: "mountains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_starting_point_fkey"
            columns: ["starting_point"]
            referencedRelation: "points-of-interest"
            referencedColumns: ["id"]
          }
        ]
      }
      "tour-review": {
        Row: {
          created_at: string
          description: string | null
          level: number | null
          route: number | null
          tourReviewId: number
          user: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          level?: number | null
          route?: number | null
          tourReviewId?: number
          user?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          level?: number | null
          route?: number | null
          tourReviewId?: number
          user?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tour-review_level_fkey"
            columns: ["level"]
            referencedRelation: "TourTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour-review_route_fkey"
            columns: ["route"]
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour-review_user_fkey"
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
      waypoints: {
        Row: {
          id: number
          lat: number | null
          lon: number | null
        }
        Insert: {
          id?: number
          lat?: number | null
          lon?: number | null
        }
        Update: {
          id?: number
          lat?: number | null
          lon?: number | null
        }
        Relationships: []
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
