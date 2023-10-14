import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Mountains, supabase } from "../supabaseClient"

export interface MountainState {
  mountains: Record<string,Mountains>
  filteredMountains: string[]
}

const initialState: MountainState = {
  mountains: {},
  filteredMountains: []
}

export const loadMountains = createAsyncThunk(
  "mountain/load",
  async (amount: number) => {
    const { data } = await supabase.from("mountains").select()
    // The value we return becomes the `fulfilled` action payload
    return data
  },
)

export enum MountainFilterTypes{
  HIKE_DIFFICULTY,
  UUIA_DIFFICULTY,
  REGION,
  MIN_HEIGHT
}

export interface MountainFilter{
  type: MountainFilterTypes,
  value: string
}

export const filterMountain = createAsyncThunk(
  "mountain/filter",
  async (filters: MountainFilter[]) =>{
    let routeFilter = supabase.from("routes").select("mountain")

    for(const filter of filters){
      
      switch(filter.type){
        case MountainFilterTypes.HIKE_DIFFICULTY:
          routeFilter = routeFilter.eq("hike_difficulty", filter.value)
          break;
      }
    }
    const { data } = await routeFilter
    return data?.map(e=>e.mountain)
  }
)

export const mountainSlice = createSlice({
  "name": "mountains",
  initialState,
  reducers: {
    loadit: (state)=>{
      console.log("load_action")
    }
  },
  extraReducers: (builder)=> {
    builder.addCase(filterMountain.fulfilled, (state, action)=>{
      console.log("Payload", action.payload)
      
    })
    builder.addCase(loadMountains.fulfilled, (state, action)=>{
      let mountainsAsRecord = (action.payload as Array<Mountains>)
        // Map ID to object
        .map((m, idx)=>({[m.id]: {...m}}))
        // Reduce to new Record
        .reduce((a,b)=>({...a,...b}), {})
      
      // combine with old state
      state.mountains = {
        ...state.mountains,
        ...mountainsAsRecord
      }
    })
  }
})

export const { loadit } = mountainSlice.actions;

export const getMountains = (state: RootState) => Object.values(state.mountain.mountains)

export default mountainSlice.reducer