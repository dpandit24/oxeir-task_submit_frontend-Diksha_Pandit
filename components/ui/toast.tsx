"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn("fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg", {
        "bg-background border-border": variant === "default",
        "bg-destructive text-destructive-foreground border-destructive": variant === "destructive",
        "bg-green-600 text-white border-green-600": variant === "success",
      })}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
