import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Mountain, supabase } from "../supabaseClient"
import { isDepsOptimizerEnabled } from "vite"

export interface MountainState {
  mountains: Record<string, Mountain>
  // Ids of mountains after filtering
  filteredMountains: string[]
  filters: Record<string, any>
}

const initialState: MountainState = {
  mountains: {},
  filters: {},
  filteredMountains: [],
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
  async (ids?: string[]) => {

    if (ids === undefined) {
      const { data } = await supabase.from("all_mountain_by_routes").select().limit(500)
      return data
    }

    const { data } = await supabase.from("all_mountain_by_routes").select().in("mountain_id", ids)
    return data
  },
)

export enum MountainFilterTypes {
  MOUNTAIN_NAME,
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
  value: any
}

export const filterRoutes = createAsyncThunk(
  "mountain/filterRoutes",
  async (mountainFilter, thunkAPI) => {
    // Add filter 
    let filters = thunkAPI.getState().mountain.filters

    if (Object.keys(filters).length == 0) {
      thunkAPI.dispatch(loadMountainsById())
    }

    // Route filters
    let routeFilter = supabase.from("mountain_routes").select("mountain_id")
    for (const fil of Object.keys(filters)) {
      switch (Number(fil)) {
        case MountainFilterTypes.HIKE_DIFFICULTY:
          routeFilter = routeFilter.in("hike_difficulty", filters[fil])
          break;
        case MountainFilterTypes.MOUNTAIN_NAME:
          routeFilter = routeFilter.ilike("mountain_name", "%" + filters[fil] + "%")
          break;

        case MountainFilterTypes.MAX_EAST:
          routeFilter = routeFilter.lte("lon", filters[fil])
          break;

        case MountainFilterTypes.MAX_WEST:
          routeFilter = routeFilter.gte("lon", filters[fil])
          break;

        case MountainFilterTypes.MAX_NORTH:
          routeFilter = routeFilter.lte("lat", filters[fil])
          break;

        case MountainFilterTypes.MAX_SOUTH:
          routeFilter = routeFilter.gte("lat", filters[fil])
          break;
      }
    }
    const { data } = await routeFilter
    const ids = data?.map(e => e.mountain_id)

    thunkAPI.dispatch(loadMountainsById(Object.keys(filters).length === 0 ? undefined : ids))
    return ids
  }
)


export const getMountainsInArea = createAsyncThunk(
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
    addFilter: (state, action: { payload: MountainFilter }) => {
      state.filters[action.payload.type] = action.payload.value
    },
    removeAllFilter: (state) => {
      state.filters = {}
    },
    removeFilter: (state, action: { payload: MountainFilterTypes }) => {
      let filters = { ...state.filters }
      delete filters[action.payload]
      state.filters = { ...filters }

    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMountainsInArea.fulfilled, (state, action) => {
      let mountainsAsRecord = (action.payload as Array<Mountain>)
        // Map ID to object
        .map((m, idx) => ({ [m.mountain_id]: { ...m } }))
        // Reduce to new Record
        .reduce((a, b) => ({ ...a, ...b }), {})

      // combine with old state
      state.mountains = {
        ...mountainsAsRecord,
        ...state.mountains
      }
    }),
      builder.addCase(filterRoutes.fulfilled, (state, action) => {
        state.filteredMountains = action.payload // [...new Set(action.payload)]
      }),

      builder.addCase(loadMountainsById.fulfilled, (state, action) => {
        let mountainsAsRecord = (action.payload as Array<Mountain>)
          // Map ID to object
          .map((m, idx) => ({ [m.mountain_id]: { ...m } }))
          // Reduce to new Record
          .reduce((a, b) => ({ ...a, ...b }), {})
        // combine with old state
        state.mountains = {
          // ...state.mountains,
          ...mountainsAsRecord
        }
      })
  }
})

export const { addFilter, removeAllFilter, removeFilter } = mountainSlice.actions;

export const getMountains = (state: RootState) => state.mountain.mountains;
export const getFilters = (state: RootState) => state.mountain.filters;
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