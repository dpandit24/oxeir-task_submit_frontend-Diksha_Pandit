"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { addSubmission, updateSubmission } from "../../store/slices/submissionsSlice"
import type { Submission } from "../../store/slices/submissionsSlice"
import { Upload, Github, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_BASE_URL } from "../../utils/api"

interface SubmissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string | null
  onSubmissionSuccess?: () => void
}

export function SubmissionModal({ open, onOpenChange, courseId, onSubmissionSuccess }: SubmissionModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [githubUrl, setGithubUrl] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { courses } = useAppSelector((state) => state.courses)
  const { submissions } = useAppSelector((state) => state.submissions)

  const course = courses.find((c) => c._id === courseId)
  const existingSubmission = submissions.find((s) => s.courseId === courseId && s.learnerId === user?.id)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !githubUrl.trim()) {
      return
    }
    setShowConfirmation(true)
  }

  const confirmSubmission = async () => {
    if (!user || !courseId) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const formData = new FormData()
      formData.append("courseId", courseId)
      if (githubUrl.trim()) formData.append("githubLink", githubUrl.trim())
      if (file) formData.append("file", file)

      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      const response = await fetch(`${API_BASE_URL}/project/submit`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
          // Do NOT set Content-Type; browser will set to multipart/form-data
        },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || data?.message || "Submission failed")
      }

      setSuccess(true)
      // Optionally update local state or refetch submissions here
      setFile(null)
      setGithubUrl("")
      setShowConfirmation(false)
      onOpenChange(false)
      // Call the success callback to trigger refetch
      if (onSubmissionSuccess) {
        onSubmissionSuccess()
      }
    } catch (err: any) {
      setError(err.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setGithubUrl("")
    setShowConfirmation(false)
  }

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>Submission successful!</AlertDescription>
              </Alert>
            )}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Are you sure you want to submit your project for "{course?.name}"?</AlertDescription>
            </Alert>
            <div className="space-y-2">
              {file && (
                <div className="flex items-center gap-2 text-sm">
                  <Upload className="h-4 w-4" />
                  <span>File: {file.name}</span>
                </div>
              )}
              {githubUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Github className="h-4 w-4" />
                  <span>GitHub: {githubUrl}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent" disabled={loading}>
                Cancel
              </Button>
              <Button onClick={confirmSubmission} className="flex-1" disabled={loading}>
                {loading ? "Submitting..." : "Confirm Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{existingSubmission ? "Resubmit Project" : "Submit Project"}</DialogTitle>
        </DialogHeader>

        {course && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <h3 className="font-medium">{course.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Upload File (Optional)</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.zip,.rar" />
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, ZIP, RAR</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL (Optional)</Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          {!file && !githubUrl.trim() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please provide either a file upload or GitHub URL.</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!file && !githubUrl.trim()} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {existingSubmission ? "Resubmit" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
