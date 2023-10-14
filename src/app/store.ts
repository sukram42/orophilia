import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import mountainSlice from "./mountainSlice"

export const store = configureStore({
  reducer: {
    mountain: mountainSlice
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

