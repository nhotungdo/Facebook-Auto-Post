"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"

// Bài đăng hiển thị trên lịch
interface CalendarPost {
  id: string
  status: string
  scheduled_at: string | null
  created_at: string
  title?: string
  goal?: string
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()
  const [posts, setPosts] = React.useState<CalendarPost[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Navigate months
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))

  // Fetch posts for the current month
  React.useEffect(() => {
    async function fetchPosts() {
      if (!workspaceId) return
      setIsLoading(true)

      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const startDate = new Date(year, month, 1).toISOString()
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("workspace_id", workspaceId)
          .gte("created_at", startDate)
          .lte("created_at", endDate)

        if (error) throw error
        setPosts(data || [])
      } catch (err) {
        console.error("Failed to fetch calendar posts:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (!isWorkspaceLoading) {
      fetchPosts()
    }
  }, [workspaceId, isWorkspaceLoading, currentMonth])

  // Get the number of days in the month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  // Array from 1 to daysInMonth, plus padding to 35 for UI grid if needed
  const days = Array.from({ length: 35 }, (_, i) => i + 1)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-[10px] py-0 px-1 border-none"><CheckCircle2 className="size-3 mr-1" /> Đã đăng</Badge>
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-[10px] py-0 px-1 border-none"><Clock className="size-3 mr-1" /> Đã lên lịch</Badge>
      case 'publishing':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[10px] py-0 px-1 border-none"><AlertCircle className="size-3 mr-1" /> Đang đăng</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] py-0 px-1 text-muted-foreground border-border/50">Bản nháp</Badge>
    }
  }

  // Format month label
  const monthLabel = currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
  const today = new Date()

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Lịch Đăng Bài
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi kế hoạch nội dung trong tháng.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="font-semibold px-4 py-2 border rounded-md min-w-32 text-center bg-card capitalize">
            {monthLabel}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm flex-1">
        <CardContent className="p-0 flex flex-col h-full relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="grid grid-cols-7 border-b border-border/50 bg-muted/20">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-fr flex-1 bg-background">
            {days.map((day) => {
              const isActualDay = day <= daysInMonth
              // Lấy post thuộc ngày hiện tại trong lịch
              const dayPosts = isActualDay ? posts.filter(p => {
                const dateToCheck = p.scheduled_at || p.created_at
                if (!dateToCheck) return false
                const d = new Date(dateToCheck)
                return d.getDate() === day
              }) : []

              const isToday = isActualDay && day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()
              
              return (
                <div 
                  key={day} 
                  className={`min-h-32 border-r border-b border-border/50 p-2 transition-colors hover:bg-muted/10 ${!isActualDay ? 'opacity-20 bg-muted/50' : 'cursor-pointer'}`}
                >
                  <div className={`text-sm font-medium mb-1 inline-flex size-6 items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                    {isActualDay ? day : ''}
                  </div>
                  
                  {isActualDay && dayPosts.map((post, idx) => (
                    <div key={idx} className="mt-1 p-2 rounded-md border border-border/50 bg-card shadow-sm space-y-1 hover:border-primary/50 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {new Date(post.scheduled_at || post.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-xs font-medium line-clamp-2 leading-tight">
                        {post.title || post.goal || 'Bài viết chưa có tiêu đề'}
                      </p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
