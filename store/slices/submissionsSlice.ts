import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Submission {
  id: string
  courseId: string
  learnerId: string
  learnerName: string
  file?: File
  githubUrl?: string
  submittedAt: string
  status: "pending" | "evaluated"
  rating?: number
  comment?: string
  tags?: string[]
}

interface SubmissionsState {
  submissions: Submission[]
  loading: boolean
}

const initialState: SubmissionsState = {
  submissions: [
    {
      id: "1",
      courseId: "1",
      learnerId: "learner1",
      learnerName: "John Doe",
      githubUrl: "https://github.com/johndoe/react-project",
      submittedAt: "2024-01-16",
      status: "evaluated",
      rating: 8,
      comment: "Great work! Clean code and good structure.",
      tags: ["React", "Components", "State Management"],
    },
    {
      id: "2",
      courseId: "2",
      learnerId: "learner2",
      learnerName: "Jane Smith",
      githubUrl: "https://github.com/janesmith/redux-counter",
      submittedAt: "2024-01-22",
      status: "pending",
    },
  ],
  loading: false,
}

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload)
    },
    updateSubmission: (state, action: PayloadAction<Submission>) => {
      const index = state.submissions.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.submissions[index] = action.payload
      }
    },
    evaluateSubmission: (
      state,
      action: PayloadAction<{
        id: string
        rating: number
        comment: string
        tags: string[]
      }>,
    ) => {
      const submission = state.submissions.find((s) => s.id === action.payload.id)
      if (submission) {
        submission.status = "evaluated"
        submission.rating = action.payload.rating
        submission.comment = action.payload.comment
        submission.tags = action.payload.tags
      }
    },
  },
})

export const { setLoading, addSubmission, updateSubmission, evaluateSubmission } = submissionsSlice.actions
export default submissionsSlice.reducer
