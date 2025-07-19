"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { logout } from "../../store/slices/authSlice"
import { EvaluationModal } from "./evaluation-modal"
import { BookOpen, Users, Filter, Star, Github, FileText, LogOut, Loader2 } from "lucide-react"
import { fetchDashboardStats, fetchInstructorCourses, fetchFilteredSubmissions, UPLOAD_BASE_URL } from "../../utils/api"

interface DashboardStats {
  total: number
  pending: number
  evaluated: number
}

interface ApiCourse {
  _id: string
  name: string
  description: string
}

interface ApiSubmission {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  courseId: {
    _id: string
    name: string
  }
  fileUrl?: string
  githubLink?: string
  status: "pending" | "evaluated"
  submittedAt: string
  feedback?: {
    rating: number
    tags: string[]
    comment: string
    evaluatedAt: string
  }
}

export function InstructorDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  
  // State for filters
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // State for data
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, evaluated: 0 })
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([])
  
  // State for UI
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    fetchInitialData()
  }, [])

  // Fetch submissions when filters change
  useEffect(() => {
    if (!loading) {
      fetchSubmissions()
    }
  }, [selectedCourse, statusFilter])

  const fetchInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, coursesData] = await Promise.all([
        fetchDashboardStats(),
        fetchInstructorCourses()
      ])
      
      setStats(statsData)
      setCourses(coursesData)
      
      // Fetch initial submissions (no filters)
      await fetchSubmissions()
    } catch (error: any) {
      setError(error.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const data = await fetchFilteredSubmissions(
        selectedCourse !== "all" ? selectedCourse : undefined,
        statusFilter !== "all" ? statusFilter : undefined
      )
      setSubmissions(data)
    } catch (error: any) {
      setError(error.message || "Failed to fetch submissions")
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleEvaluate = (submissionId: string) => {
    setSelectedSubmission(submissionId)
    setShowEvaluationModal(true)
  }

  const handleEvaluationSuccess = () => {
    // Refetch submissions after successful evaluation
    fetchSubmissions()
  }

  const selectedSubmissionData = submissions.find(s => s._id === selectedSubmission)
  const selectedCourseData = selectedSubmissionData ? {
    _id: selectedSubmissionData.courseId._id,
    name: selectedSubmissionData.courseId.name,
    description: ""
  } : undefined

  const getCourseTitle = (courseId: string) => {
    return courses.find((c) => c._id === courseId)?.name || "Unknown Course"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchInitialData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Main Title */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluated</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.evaluated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="evaluated">Evaluated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Submissions Inbox ({submissions.length})</h2>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No submissions found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission._id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{submission.courseId.name}</CardTitle>
                      <CardDescription>
                        Submitted by {submission.userId.name} on {new Date(submission.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={submission.status === "evaluated" ? "default" : "secondary"}>
                      {submission.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Submission Details */}
                  <div className="space-y-2">
                    {submission.githubLink && (
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <a
                          href={submission.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {submission.githubLink}
                        </a>
                      </div>
                    )}

                    {submission.fileUrl && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <a
                          href={`${UPLOAD_BASE_URL}${submission.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View File
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Evaluation Details */}
                  {submission.status === "evaluated" && submission.feedback && (
                    <div className="p-3 bg-green-50 rounded-md border border-green-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Rating: {submission.feedback.rating}/10</span>
                      </div>

                      {submission.feedback.comment && (
                        <div>
                          <p className="text-sm font-medium">Comment:</p>
                          <p className="text-sm text-muted-foreground">{submission.feedback.comment}</p>
                        </div>
                      )}

                      {submission.feedback.tags && submission.feedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {submission.feedback.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handleEvaluate(submission._id)}
                    variant={submission.status === "evaluated" ? "outline" : "default"}
                    size="sm"
                  >
                    {submission.status === "evaluated" ? "Re-evaluate" : "Evaluate"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <EvaluationModal
        open={showEvaluationModal}
        onOpenChange={setShowEvaluationModal}
        submissionId={selectedSubmission}
        submission={selectedSubmissionData}
        course={selectedCourseData}
        onEvaluationSuccess={handleEvaluationSuccess}
      />
    </div>
  )
}
