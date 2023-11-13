import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import mountainSlice from "./mountainSlice"
import regionSlice from "./regionSlice"
import routesSlice from "./routesSlice"

export const store = configureStore({
  reducer: {
    mountain: mountainSlice,
    region: regionSlice,
    routes: routesSlice
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

