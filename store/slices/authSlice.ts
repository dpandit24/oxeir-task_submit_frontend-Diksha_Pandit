import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  role: "learner" | "instructor"
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignupCredentials {
  email: string
  password: string
  name: string
  role: "learner" | "instructor"
}

interface AuthResponse {
  token: string
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isHydrated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isHydrated: false,
}

// Async thunk for login
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed")
      }

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token)
      }

      return data
    } catch (error) {
      return rejectWithValue("Network error. Please try again.")
    }
  },
)

// Async thunk for signup
export const signupUser = createAsyncThunk<AuthResponse, SignupCredentials, { rejectValue: string }>(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Signup failed")
      }

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.token)
      }

      return data
    } catch (error) {
      return rejectWithValue("Network error. Please try again.")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token")
      }
    },
    clearError: (state) => {
      state.error = null
    },
    // For checking if user is still authenticated on app load
    checkAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token")
        if (token) {
          state.token = token
          state.isAuthenticated = true
        }
      }
      state.isHydrated = true
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed"
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
    // Signup cases
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Signup failed"
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { logout, clearError, checkAuth } = authSlice.actions
export default authSlice.reducer
