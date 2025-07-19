import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import coursesSlice from "./slices/coursesSlice"
import submissionsSlice from "./slices/submissionsSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    courses: coursesSlice,
    submissions: submissionsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
