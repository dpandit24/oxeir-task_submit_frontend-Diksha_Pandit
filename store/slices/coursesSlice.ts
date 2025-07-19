import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchCourses } from "../../utils/api"

export interface Course {
  _id: string
  name: string
  description: string
  __v: number
}

interface CoursesState {
  courses: Course[]
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
}

// Async thunk to fetch courses
export const fetchCoursesAsync = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await fetchCourses()
      return courses
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses')
    }
  }
)

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoursesAsync.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
        state.error = null
      })
      .addCase(fetchCoursesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setLoading, setCourses, clearError } = coursesSlice.actions
export default coursesSlice.reducer
