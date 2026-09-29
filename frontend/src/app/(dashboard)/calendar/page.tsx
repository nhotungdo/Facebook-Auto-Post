"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Loader2, Sparkles, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { API_URL } from "@/lib/api"
import { toast } from "sonner"

// Bài đăng hiển thị trên lịch
interface CalendarPost {
  id: string
  status: string
  scheduled_at: string | null
  created_at: string
  content?: string
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [posts, setPosts] = React.useState<CalendarPost[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // AI Strategy states
  const [showStrategyDialog, setShowStrategyDialog] = React.useState(false)
  const [niche, setNiche] = React.useState("")
  const [audience, setAudience] = React.useState("")
  const [isGeneratingStrategy, setIsGeneratingStrategy] = React.useState(false)
  const [strategyResult, setStrategyResult] = React.useState<any>(null)

  const handleGenerateStrategy = async () => {
    if (!niche || !audience) {
      toast.error("Vui lòng nhập ngành hàng và đối tượng!")
      return
    }
    setIsGeneratingStrategy(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`${API_URL}/api/v1/ai/strategy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ niche, target_audience: audience, posts_per_week: 5 })
      })
      const data = await res.json()
      if (res.ok && data.status === "success") {
        setStrategyResult(data.data)
        toast.success("Lập chiến lược thành công!")
      } else {
        toast.error("Không thể tạo chiến lược")
      }
    } catch (e: any) {
      toast.error("Lỗi khi kết nối đến AI")
    } finally {
      setIsGeneratingStrategy(false)
    }
  }

  // Navigate months
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))

  // Fetch posts for the current month
  React.useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)

      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const startDate = new Date(year, month, 1).toISOString()
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("facebook_posts")
          .select("*")
          .eq("user_id", user.id)
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

    fetchPosts()
  }, [currentMonth])

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
          <Button variant="default" className="mr-4 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowStrategyDialog(true)}>
            <Sparkles className="size-4 mr-2" />
            AI Strategy
          </Button>
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
                        {post.content || 'Bài viết chưa có nội dung'}
                      </p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Lập Kế Hoạch Nội Dung Tự Động
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin trang của bạn để AI đề xuất các chủ đề và lịch trình đăng bài tối ưu.
            </DialogDescription>
          </DialogHeader>

          {!strategyResult ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lĩnh vực / Ngành hàng</Label>
                <Input placeholder="VD: Thời trang nữ, Quán cà phê..." value={niche} onChange={e => setNiche(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Khách hàng mục tiêu</Label>
                <Input placeholder="VD: Nhân viên văn phòng, 20-30 tuổi..." value={audience} onChange={e => setAudience(e.target.value)} />
              </div>
              <Button onClick={handleGenerateStrategy} disabled={isGeneratingStrategy} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isGeneratingStrategy ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Sparkles className="size-4 mr-2" />}
                Lên Chiến Lược Ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Lightbulb className="size-5 text-yellow-500" />
                  Các chủ đề chính (Content Pillars)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strategyResult.pillars?.map((pillar: string, i: number) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {pillar}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="size-5 text-blue-500" />
                  Lịch trình đề xuất
                </h3>
                <div className="space-y-3">
                  {strategyResult.calendar?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card items-start hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-lg min-w-16">
                        <span className="font-bold text-sm text-foreground">{item.day}</span>
                        <span className="text-xs text-muted-foreground font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-sm text-foreground">{item.topic}</p>
                        <p className="text-xs text-muted-foreground">Mục tiêu: <span className="font-medium">{item.goal}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {strategyResult && (
              <Button variant="outline" onClick={() => setStrategyResult(null)}>Làm lại</Button>
            )}
            <Button variant="default" onClick={() => setShowStrategyDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
