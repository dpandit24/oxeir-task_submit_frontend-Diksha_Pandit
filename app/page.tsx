"use client"

import { useState, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "../store"
import { Button } from "@/components/ui/button"
import { AuthModal } from "../components/auth/auth-modal"
import { LearnerDashboard } from "../components/learner/learner-dashboard"
import { InstructorDashboard } from "../components/instructor/instructor-dashboard"
import { Header } from "../components/header"
import { useAppSelector, useAppDispatch } from "../hooks/redux"
import { checkAuth } from "../store/slices/authSlice"
import { BookOpen, Users, Upload, Loader2 } from "lucide-react"

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated, loading, isHydrated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // Show loading spinner while checking authentication or before hydration
  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskSubmit</h1>
            <p className="text-gray-600">
              A platform for learners to submit projects and instructors to provide feedback
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                <Upload className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">For Learners</p>
                  <p className="text-xs text-gray-600">Submit projects and receive feedback</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">For Instructors</p>
                  <p className="text-xs text-gray-600">Review submissions and provide ratings</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => setShowAuthModal(true)} className="w-full" size="lg">
                Get Started
              </Button>
              <div className="text-center text-xs text-gray-500">
                <p>Demo credentials:</p>
                <p>Learner: learner1@gmail.com / 12345678</p>
                <p>Instructor: instructor1@gmail.com / 12345678</p>
              </div>
            </div>
          </div>
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{user?.role === "learner" ? <LearnerDashboard /> : <InstructorDashboard />}</main>
    </div>
  )
}

export default function Home() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
