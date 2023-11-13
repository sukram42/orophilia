import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Mountain, Region, supabase } from "../supabaseClient"

export interface RegionState {
  regions: Record<string, Region>
}

const initialState: RegionState = {
    regions: {}
}

export const loadRegions = createAsyncThunk(
  "region/load",
  async () => {
    const { data } = await supabase.from("regions").select()
    return data
  },
)

export const regionSlice = createSlice({
  "name": "mountains",
  initialState,
  reducers: {
    loadit: (state) => {
      console.log("load_action")
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadRegions.fulfilled, (state, action) => {
        state.regions = action.payload?.map(el=>({[el.id]: el})).reduce((a,b)=>({...a,...b}),{})
    })
  }
})
export const getRegions = (state: RootState)=>state.region.regions

export default regionSlice.reducer