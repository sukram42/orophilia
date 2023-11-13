import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Mountain, supabase } from "../supabaseClient"

export interface MountainState {
  mountains: Record<string, Mountain>
  filteredMountains: string[]
}

const initialState: MountainState = {
  mountains: {},
  filteredMountains: []
}

export const loadMountains = createAsyncThunk(
  "mountain/load",
  async (amount: number) => {
    const { data } = await supabase.from("all_mountain_by_routes").select().limit(5000)
    // The value we return becomes the `fulfilled` action payload
    return data
  },
)
export const loadMountainsById = createAsyncThunk(
  "mountain/loadByIds",
  async (ids?: number[]) => {
    if (!ids) {
      const { data } = await supabase.from("all_mountain_by_routes").select().limit(100)
      return data
    }

    const { data } = await supabase.from("all_mountain_by_routes").select().in("mountain_id", ids)
    return data
  },
)

export enum MountainFilterTypes {
  HIKE_DIFFICULTY,
  UUIA_DIFFICULTY,
  REGION,
  MIN_HEIGHT,
  MAX_NORTH, 
  MAX_SOUTH,
  MAX_WEST, 
  MAX_EAST
}

export interface MountainFilter {
  type: MountainFilterTypes,
  value: string
}

export const filterMountain = createAsyncThunk(
  "mountain/filterMountain",
  async ({ filters }: { filters: MountainFilter[] }, thunkAPI) => {
    let routeFilter = supabase.from("routes").select("mountain")
    if (filters.length == 0) return []

    for (const filter of filters) {
      switch (filter.type) {
        case MountainFilterTypes.HIKE_DIFFICULTY:
          routeFilter = routeFilter.eq("hike_difficulty", filter.value)
          break;
        case MountainFilterTypes.MAX_EAST:
          routeFilter = routeFilter.lte("lon",filter.value)
          break;
        case MountainFilterTypes.MAX_WEST:
          routeFilter = routeFilter.gte("lon", filter.value)
        case MountainFilterTypes.MAX_NORTH:
          routeFilter = routeFilter.lte("lat", filter.value)
        case MountainFilterTypes.MAX_SOUTH:
          routeFilter = routeFilter.gte("lat", filter.value)
      }
    }
    const { data } = await routeFilter
    const ids = data?.map(e => e.mountain)
    thunkAPI.dispatch(loadMountainsById(ids))
    return ids
  }
)

export const getMoutainsInArea = createAsyncThunk(
  "mountain/getMountainsInArea",
  async ({ north, east, south, west }: { north: number, east: number, south: number, west: number }, thunkAPI) => {
    let { data } = await supabase.from("mountains")
      .select("*")
      .gte("lon", west)
      .lte("lon", east)
      .gte("lat", south)
      .lte("lat", north)
    return data
  }
)

export const mountainSlice = createSlice({
  "name": "mountains",
  initialState,
  reducers: {
    loadit: (state) => {
      console.log("load_action")
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMoutainsInArea.fulfilled, (state, action) => {
      let mountainsAsRecord = (action.payload as Array<Mountain>)
        // Map ID to object
        .map((m, idx) => ({ [m.mountain_id]: { ...m } }))
        // Reduce to new Record
        .reduce((a, b) => ({ ...a, ...b }), {})

      // combine with old state
      state.mountains = {
        ...state.mountains,
        ...mountainsAsRecord
      }

    }),
      builder.addCase(filterMountain.fulfilled, (state, action) => {
        state.filteredMountains = action.payload
      })
    builder.addCase(loadMountainsById.fulfilled, (state, action) => {
      let mountainsAsRecord = (action.payload as Array<Mountain>)
        // Map ID to object
        .map((m, idx) => ({ [m.mountain_id]: { ...m } }))
        // Reduce to new Record
        .reduce((a, b) => ({ ...a, ...b }), {})

      // combine with old state
      state.mountains = {
        ...state.mountains,
        ...mountainsAsRecord
      }
    })
  }
})

export const { loadit } = mountainSlice.actions;

export const getMountains = (state: RootState) => state.mountain.mountains;
const getFilteredMountainIds = (state: RootState) => state.mountain.filteredMountains;

export const getFilteredMountains = createSelector([getMountains, getFilteredMountainIds], (mountains, ids) => {
  if (ids.length == 0) return Object.values(mountains)

  let deduplicated_ids = [...new Set(ids)]

  return deduplicated_ids
    .map((mtId) => {
      return mountains[mtId]
    })
    .filter(m => m)
    .sort((a, b) => a.mountain_id - b.mountain_id)
})

export default mountainSlice.reducer