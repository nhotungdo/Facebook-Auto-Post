"use client"

import { useState } from "react"
import { AlertCircle, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry: () => void | Promise<void>
  className?: string
}

/**
 * Hiển thị trạng thái lỗi của một request kèm nút thử lại (có spinner khi đang retry).
 */
export function ErrorState({
  title = "Có lỗi xảy ra",
  message = "Không thể tải dữ liệu. Vui lòng thử lại.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center ${className}`}
      role="alert"
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-5 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRetry}
        disabled={isRetrying}
        className="gap-2"
      >
        {isRetrying ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <RotateCcw className="size-4" />
        )}
        {isRetrying ? "Đang thử lại..." : "Thử lại"}
      </Button>
    </div>
  )
}
