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
          lat: number | null
          lon: number | null
          mountain_id: number
          mountain_name: string | null
          region: number | null
          tags: Json | null
          wikidata: string | null
          wikiimage_url: string | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          lat?: number | null
          lon?: number | null
          mountain_id?: number
          mountain_name?: string | null
          region?: number | null
          tags?: Json | null
          wikidata?: string | null
          wikiimage_url?: string | null
        }
        Update: {
          created_at?: string
          height?: number | null
          lat?: number | null
          lon?: number | null
          mountain_name?: number
          name?: string | null
          region?: number | null
          tags?: Json | null
          wikidata?: string | null
          wikiimage_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mountains_region_fkey"
            columns: ["region"]
            isOneToOne: false
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
            isOneToOne: false
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
          index: number | null
          route: string | null
          waypoint: string | null
        }
        Insert: {
          index?: number | null
          route?: string | null
          waypoint?: string | null
        }
        Update: {
          index?: number | null
          route?: string | null
          waypoint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route2waypoint_route_fkey"
            columns: ["route"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route2waypoint_waypoint_fkey"
            columns: ["waypoint"]
            isOneToOne: false
            referencedRelation: "waypoints"
            referencedColumns: ["id"]
          }
        ]
      }
      routes: {
        Row: {
          generated: boolean | null
          hike_difficulty: number | null
          id: string
          is_via_ferrata: boolean | null
          length: number | null
          mountain: number | null
          name: string | null
          route_id: string | null
          starting_point: number | null
          uiaa_difficulty: number | null
          via: string[] | null
          via_ferrata_difficulty: number | null
        }
        Insert: {
          generated?: boolean | null
          hike_difficulty?: number | null
          id: string
          is_via_ferrata?: boolean | null
          length?: number | null
          mountain?: number | null
          name?: string | null
          route_id?: string | null
          starting_point?: number | null
          uiaa_difficulty?: number | null
          via?: string[] | null
          via_ferrata_difficulty?: number | null
        }
        Update: {
          generated?: boolean | null
          hike_difficulty?: number | null
          id?: string
          is_via_ferrata?: boolean | null
          length?: number | null
          mountain?: number | null
          name?: string | null
          route_id?: string | null
          starting_point?: number | null
          uiaa_difficulty?: number | null
          via?: string[] | null
          via_ferrata_difficulty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_mountain_fkey"
            columns: ["mountain"]
            isOneToOne: false
            referencedRelation: "all_mountain_by_routes"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "routes_mountain_fkey"
            columns: ["mountain"]
            isOneToOne: false
            referencedRelation: "mountain_by_routes"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "routes_mountain_fkey"
            columns: ["mountain"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "routes_starting_point_fkey"
            columns: ["starting_point"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "TourTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour-review_user_fkey"
            columns: ["user"]
            isOneToOne: false
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
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      waypoints: {
        Row: {
          elevation: number | null
          hike_difficulty: number | null
          id: string
          is_via_ferrata: boolean | null
          lat: number | null
          lon: number | null
        }
        Insert: {
          elevation?: number | null
          hike_difficulty?: number | null
          id: string
          is_via_ferrata?: boolean | null
          lat?: number | null
          lon?: number | null
        }
        Update: {
          elevation?: number | null
          hike_difficulty?: number | null
          id?: string
          is_via_ferrata?: boolean | null
          lat?: number | null
          lon?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      all_mountain_by_routes: {
        Row: {
          created_at: string | null
          height: number | null
          lat: number | null
          lon: number | null
          max_hike_difficulty: number | null
          max_length: number | null
          max_uiaa: number | null
          min_hike_difficulty: number | null
          min_length: number | null
          min_uiaa: number | null
          mountain_id: number | null
          mountain_name: string | null
          n_routes: number | null
          region: number | null
          tags: Json | null
          via_ferratas: number | null
          wikidata: string | null
          wikiimage_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mountains_region_fkey"
            columns: ["region"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      mountain_by_routes: {
        Row: {
          created_at: string | null
          height: number | null
          lat: number | null
          lon: number | null
          max_hike_difficulty: number | null
          max_length: number | null
          max_uiaa: number | null
          min_hike_difficulty: number | null
          min_length: number | null
          min_uiaa: number | null
          mountain_id: number | null
          mountain_name: string | null
          n_routes: number | null
          region: number | null
          tags: Json | null
          via_ferratas: number | null
          wikidata: string | null
          wikiimage_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mountains_region_fkey"
            columns: ["region"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
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
