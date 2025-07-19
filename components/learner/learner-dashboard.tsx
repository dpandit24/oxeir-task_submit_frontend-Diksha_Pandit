"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "../../hooks/redux"
import { fetchCoursesAsync } from "../../store/slices/coursesSlice"
import { SubmissionModal } from "./submission-modal"
import { BookOpen, Upload, Eye, Star, Loader2, FileText, Github } from "lucide-react"
import { fetchUserSubmissions } from "../../utils/api"

interface ApiSubmission {
  _id: string
  userId: string
  courseId: string
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

export function LearnerDashboard() {
  const dispatch = useAppDispatch()
  const { courses, loading: coursesLoading, error: coursesError } = useAppSelector((state) => state.courses)
  const { user } = useAppSelector((state) => state.auth)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [submissionsError, setSubmissionsError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCoursesAsync())
  }, [dispatch])

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions()
    }
  }, [user?.id])

  const fetchSubmissions = async () => {
    if (!user?.id) return
    
    setSubmissionsLoading(true)
    setSubmissionsError(null)
    try {
      const data = await fetchUserSubmissions(user.id)
      setSubmissions(data)
    } catch (error: any) {
      setSubmissionsError(error.message || "Failed to fetch submissions")
    } finally {
      setSubmissionsLoading(false)
    }
  }

  const getSubmissionForCourse = (courseId: string) => {
    return submissions.find((s) => s.courseId === courseId)
  }

  const handleSubmit = (courseId: string) => {
    setSelectedCourse(courseId)
    setShowSubmissionModal(true)
  }

  const handleSubmissionSuccess = () => {
    // Refetch submissions after successful submission
    fetchSubmissions()
  }

  if (coursesLoading || submissionsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (coursesError || submissionsError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {coursesError || submissionsError}
            </p>
            <Button onClick={() => {
              if (coursesError) dispatch(fetchCoursesAsync())
              if (submissionsError) fetchSubmissions()
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-3xl font-bold">My Projects</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses available</h3>
          <p className="text-muted-foreground">Check back later for new courses.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const submission = getSubmissionForCourse(course._id)

            return (
              <Card key={course._id} className="relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="mt-2">{course.description}</CardDescription>
                    </div>
                    {submission && (
                      <Badge variant={submission.status === "evaluated" ? "default" : "secondary"}>
                        {submission.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {submission ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Your Submission</span>
                      </div>

                      {submission.githubLink && (
                        <div className="text-sm">
                          <span className="font-medium">GitHub: </span>
                          <a
                            href={submission.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {submission.githubLink}
                          </a>
                        </div>
                      )}

                      {submission.fileUrl && (
                        <div className="text-sm">
                          <span className="font-medium">File: </span>
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            View File
                          </a>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>

                      {submission.status === "evaluated" && submission.feedback && (
                        <div className="space-y-2 p-3 bg-green-50 rounded-md border border-green-200">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">Rating: {submission.feedback.rating}/10</span>
                          </div>

                          {submission.feedback.comment && (
                            <div>
                              <p className="text-sm font-medium">Feedback:</p>
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

                      <Button variant="outline" size="sm" onClick={() => handleSubmit(course._id)} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Resubmit
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => handleSubmit(course._id)} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <SubmissionModal 
        open={showSubmissionModal} 
        onOpenChange={setShowSubmissionModal} 
        courseId={selectedCourse}
        onSubmissionSuccess={handleSubmissionSuccess}
      />
    </div>
  )
}
