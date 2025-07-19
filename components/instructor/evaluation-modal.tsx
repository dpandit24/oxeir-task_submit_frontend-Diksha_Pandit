"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { X, Plus, Github, FileText } from "lucide-react"
import { UPLOAD_BASE_URL, evaluateSubmission } from "../../utils/api"

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

interface ApiCourse {
  _id: string
  name: string
  description: string
}

interface EvaluationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submissionId: string | null
  submission?: ApiSubmission
  course?: ApiCourse
  onEvaluationSuccess?: () => void
}

export function EvaluationModal({ 
  open, 
  onOpenChange, 
  submissionId, 
  submission, 
  course,
  onEvaluationSuccess 
}: EvaluationModalProps) {
  const [rating, setRating] = useState([7])
  const [comment, setComment] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (submission && open) {
      if (submission.feedback) {
        setRating([submission.feedback.rating])
        setComment(submission.feedback.comment)
        setTags(submission.feedback.tags)
      } else {
        setRating([7])
        setComment("")
        setTags([])
      }
    }
  }, [submission, open])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submissionId) return

    setLoading(true)
    try {
      await evaluateSubmission(submissionId, {
        rating: rating[0],
        comment: comment.trim(),
        tags,
      })
      
      if (onEvaluationSuccess) {
        onEvaluationSuccess()
      }
      onOpenChange(false)
    } catch (error: any) {
      console.error('Evaluation failed:', error)
      // You could add a toast notification here for better UX
      alert(error.message || 'Evaluation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (!submission || !course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Evaluate Submission</DialogTitle>
        </DialogHeader>

        {/* Submission Info */}
        <div className="space-y-3 p-4 bg-muted rounded-md">
          <div>
            <h3 className="font-medium">{course.name}</h3>
            <p className="text-sm text-muted-foreground">
              Submitted by {submission.userId.name} on {new Date(submission.submittedAt).toLocaleDateString()}
            </p>
          </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label>Rating: {rating[0]}/10</Label>
            <Slider value={rating} onValueChange={setRating} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor (1)</span>
              <span>Average (5)</span>
              <span>Excellent (10)</span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Feedback Comment</Label>
            <Textarea
              id="comment"
              placeholder="Provide detailed feedback on the submission..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Skill Tags</Label>

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill tag (e.g., React, JavaScript)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {["React", "JavaScript", "CSS", "HTML", "Redux", "Node.js", "API Integration", "Responsive Design"].map(
                  (suggestedTag) =>
                    !tags.includes(suggestedTag) && (
                      <Button
                        key={suggestedTag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTags([...tags, suggestedTag])}
                        className="text-xs"
                      >
                        + {suggestedTag}
                      </Button>
                    ),
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save Evaluation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
