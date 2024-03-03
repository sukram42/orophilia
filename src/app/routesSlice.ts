
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Mountain, Region, Route, supabase, WayPoint } from "../supabaseClient"

export interface RouteSummary{
    route: Route,
    waypoints: WayPoint[]
}

export interface RoutesState {
  // mountainID: route
  routes: Record<string, RouteSummary[]>
}

const initialState: RoutesState = {
    routes: {}
}

export const loadingRoutesByMountain= createAsyncThunk(
  "routes/loadById",
  async ( mountainId: string) => {
    console.log(mountainId)
    const { data: routes } = await supabase
        .from("routes")
        .select()
        .eq("mountain", mountainId)

    if(routes == null) return []
    const newRoutes = await Promise.all(routes.map(async route=>{
        const { data: waypoints } = await supabase
                    .from("route2waypoint")
                    .select(`waypoints (lat, lon, elevation), index, route`)
                    .eq("route", route.id)
        return {route, waypoints}
    }))
    return newRoutes
  },
)

export const regionSlice = createSlice({
  "name": "routes",
  initialState,
  reducers: {
    loadit: (state) => {
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadingRoutesByMountain.fulfilled, (state, action) => {
      if (action.payload.length > 0)
        state.routes = {...state.routes, [action.payload[0].route.mountain]: action.payload}
    })
  }
})
export const getRoutes = (state: RootState)=>state.routes.routes

export default regionSlice.reducer