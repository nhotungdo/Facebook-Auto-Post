"use client"

import { Sparkles, ArrowRight, CheckCircle2, ListFilter, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState } from "@/components/ErrorState"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null)
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()
  const [pagesCount, setPagesCount] = useState<number | null>(null)
  const [postsCount, setPostsCount] = useState<number | null>(null)
  const [countsError, setCountsError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setEmail(data.session.user.email || "User")
      }
    })
  }, [])

  useEffect(() => {
    async function fetchCounts() {
      if (!workspaceId) return

      setCountsError(null)
      try {
        // Fetch Pages Count
        const pagesResult = await supabase
          .from("facebook_pages")
          .select("*", { count: 'exact', head: true })
          .eq("workspace_id", workspaceId)
        if (pagesResult.error) throw pagesResult.error

        const pCount = pagesResult.count
        setPagesCount(pCount || 0)

        // Fetch Posts Count this month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const postsResult = await supabase
          .from("posts")
          .select("*", { count: 'exact', head: true })
          .eq("workspace_id", workspaceId)
          .gte("created_at", startOfMonth)
        if (postsResult.error) throw postsResult.error

        const ptCount = postsResult.count
        setPostsCount(ptCount || 0)
      } catch (err) {
        console.error("Error fetching dashboard counts:", err)
        setCountsError(err instanceof Error ? err.message : "Lỗi không xác định")
      }
    }

    if (!isWorkspaceLoading && workspaceId) {
      fetchCounts()
    }
  }, [workspaceId, isWorkspaceLoading, reloadKey])

  const handleRetryCounts = () => {
    setPagesCount(null)
    setPostsCount(null)
    setReloadKey(k => k + 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-min animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Block */}
      <div className="col-span-1 md:col-span-4 lg:col-span-6 glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Chào mừng trở lại, {email ? email.split('@')[0] : "bạn"} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-base max-w-xl">
            Hôm nay bạn muốn AI giúp gì cho Fanpage của mình? Hãy để trợ lý AI tạo ra những nội dung thu hút nhất.
          </p>
        </div>
        <Link href="/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 rounded-full px-6 py-6 text-base group transition-all">
            <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-2 hover:border-primary/50 transition-colors flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardDescription>Trang Facebook</CardDescription>
          {countsError ? (
            <CardContent className="p-0">
              <ErrorState
                title="Không tải được số trang"
                message={countsError}
                onRetry={handleRetryCounts}
              />
            </CardContent>
          ) : (
            <CardTitle className="text-5xl font-light">
              {pagesCount === null ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : pagesCount}
            </CardTitle>
          )}
        </CardHeader>
        {!countsError && (
          <CardContent>
            <div className="inline-flex items-center gap-1.5 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="size-3.5" />
              <span>Đã kết nối</span>
            </div>
          </CardContent>
        )}
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-2 hover:border-primary/50 transition-colors flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardDescription>Bài viết AI (Tháng này)</CardDescription>
          {countsError ? (
            <CardContent className="p-0">
              <ErrorState
                title="Không tải được số bài viết"
                message={countsError}
                onRetry={handleRetryCounts}
              />
            </CardContent>
          ) : (
            <CardTitle className="text-5xl font-light">
              {postsCount === null ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : postsCount}
            </CardTitle>
          )}
        </CardHeader>
        {!countsError && (
          <CardContent>
            <div className="inline-flex items-center gap-1.5 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full">
              <Sparkles className="size-3.5" />
              <span>Đã tạo tự động</span>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-2 hover:border-primary/50 transition-colors flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardDescription>Trạng thái hệ thống</CardDescription>
          <CardTitle className="text-5xl font-light text-emerald-500">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="inline-flex items-center gap-1.5 text-sm bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-full">
            <ListFilter className="size-3.5" />
            <span>Hoạt động bình thường</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions / Getting Started */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 border-border/50">
        <CardHeader>
          <CardTitle>Bắt đầu nhanh</CardTitle>
          <CardDescription>Các bước để tối ưu hóa trang của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Kết nối Fanpage</p>
                <p className="text-xs text-muted-foreground mt-0.5">Thêm trang bạn muốn quản lý</p>
              </div>
            </div>
            <Link href="/pages">
              <Button variant="ghost" size="icon" className="rounded-full"><ArrowRight className="size-4" /></Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Thử nghiệm AI</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tạo bài viết đầu tiên của bạn</p>
              </div>
            </div>
            <Link href="/create">
              <Button variant="ghost" size="icon" className="rounded-full"><ArrowRight className="size-4" /></Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Schedule */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Lịch trình sắp tới</CardTitle>
          <CardDescription>Các bài viết sẽ được tự động đăng</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-t border-white/5 bg-black/5 dark:bg-white/5 m-6 mt-0 rounded-2xl p-8 min-h-[200px]">
          <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <ListFilter className="size-6 opacity-50" />
          </div>
          <p className="text-sm">Chưa có bài viết nào được lên lịch</p>
          <Link href="/create">
            <Button variant="link" className="text-primary mt-2">Lên lịch ngay</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
