// API configuration and utilities
export const API_BASE_URL = "http://localhost:5000/api"
export const UPLOAD_BASE_URL = "http://localhost:5000"

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/register`,
  COURSES: `${API_BASE_URL}/course`,
  PROJECT_SUBMIT: `${API_BASE_URL}/project/submit`,
  PROJECT_EVALUATION: `${API_BASE_URL}/project/evaluation`,
  PROJECT_DASHBOARD: `${API_BASE_URL}/project/dashboard`,
  PROJECT_SUBMISSIONS: `${API_BASE_URL}/project/submissions`,
  PROJECT_EVALUATE: `${API_BASE_URL}/project/evaluate`,
  // Add other endpoints as needed
}

// Helper function to make authenticated requests
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  let token = null
  
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem("token")
  }

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  // Handle token expiration
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
      window.location.reload() // Redirect to login
    }
  }

  return response
}

// API functions
export const fetchCourses = async () => {
  const response = await makeAuthenticatedRequest(API_ENDPOINTS.COURSES)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }
  
  return response.json()
}

export const fetchUserSubmissions = async (userId: string) => {
  const response = await makeAuthenticatedRequest(`${API_ENDPOINTS.PROJECT_EVALUATION}/${userId}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch submissions: ${response.statusText}`)
  }
  
  return response.json()
}

export const fetchDashboardStats = async () => {
  const response = await makeAuthenticatedRequest(API_ENDPOINTS.PROJECT_DASHBOARD)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`)
  }
  
  return response.json()
}

export const fetchInstructorCourses = async () => {
  const response = await makeAuthenticatedRequest(API_ENDPOINTS.COURSES)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }
  
  return response.json()
}

export const fetchFilteredSubmissions = async (courseId?: string, status?: string) => {
  const params = new URLSearchParams()
  if (courseId && courseId !== 'all') params.append('courseId', courseId)
  if (status && status !== 'all') params.append('status', status)
  
  const url = params.toString() ? `${API_ENDPOINTS.PROJECT_SUBMISSIONS}?${params.toString()}` : API_ENDPOINTS.PROJECT_SUBMISSIONS
  const response = await makeAuthenticatedRequest(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch submissions: ${response.statusText}`)
  }
  
  return response.json()
}

export const evaluateSubmission = async (submissionId: string, evaluationData: {
  rating: number
  tags: string[]
  comment: string
}) => {
  const response = await makeAuthenticatedRequest(API_ENDPOINTS.PROJECT_EVALUATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      submissionId,
      ...evaluationData,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Failed to evaluate submission: ${response.statusText}`)
  }
  
  return response.json()
}

// Error message helper
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return "An unexpected error occurred"
}
