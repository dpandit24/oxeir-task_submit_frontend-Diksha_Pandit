"use client"

import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { logout } from "../store/slices/authSlice"
import { LogOut, User, BookOpen } from "lucide-react"

export function Header() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!isAuthenticated || !user) return null

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-lg font-semibold">TaskSubmit</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground capitalize">({user.role})</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
