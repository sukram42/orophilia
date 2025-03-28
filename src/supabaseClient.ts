import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://ntcmlxdemillsrdjybpc.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Y21seGRlbWlsbHNyZGp5YnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIwNDA4MzAsImV4cCI6MjAwNzYxNjgzMH0.pwUMNbiFaLJPOVvPWzmD7rQIh3xm3Xme6V82J18Sl4U"

const aa = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjY2R1I2UkZCOEtwMnZ6bEEiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkyMDUxNDEzLCJpYXQiOjE2OTIwNDc4MTMsImlzcyI6Imh0dHBzOi8vbnRjbWx4ZGVtaWxsc3JkanlicGMuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFiMzdmZThkLTZiNTUtNDg4OC05NzgwLTM0YzRkMzhmMDUxOSIsImVtYWlsIjoibWFya3VzLmJvZWJlbDErdGVzdEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTY5MjA0NzgxM31dLCJzZXNzaW9uX2lkIjoiNjA5ZGY0NWYtOWQzYS00ZTE0LTgxNDEtNDM5MjU0NjI5ZTBjIn0.8EoWsgrYjVhtqdLi6eIBvlcDwC92o76WzoFTT8GI-sE"
export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
import { Database } from './app/supabase';

export type Mountain = Database['public']['Views']['mountain_by_routes']['Row']
export type Route = Database['public']['Tables']['routes']['Row']
export type WayPoint = Database['public']['Tables']['waypoints']['Row']
export type Region = Database['public']['Tables']['regions']['Row']