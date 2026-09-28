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
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Chào mừng trở lại, {email || "bạn"} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Hôm nay bạn muốn AI giúp gì cho Fanpage của mình?
          </p>
        </div>
        <Link href="/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
            <Sparkles className="size-4" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
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
              <CardTitle className="text-4xl">
                {pagesCount === null ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : pagesCount}
              </CardTitle>
            )}
          </CardHeader>
          {!countsError && (
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                Đã kết nối
              </p>
            </CardContent>
          )}
        </Card>
        
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
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
              <CardTitle className="text-4xl">
                {postsCount === null ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : postsCount}
              </CardTitle>
            )}
          </CardHeader>
          {!countsError && (
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3 text-blue-500" />
                Đã tạo tự động
              </p>
            </CardContent>
          )}
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Trạng thái hệ thống</CardDescription>
            <CardTitle className="text-4xl text-emerald-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <ListFilter className="size-3 text-muted-foreground" />
              Hoạt động bình thường
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions / Getting Started */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Bắt đầu nhanh</CardTitle>
            <CardDescription>Các bước để tối ưu hóa trang của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-md">
                  <Users className="size-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Kết nối Fanpage</p>
                  <p className="text-xs text-muted-foreground">Thêm trang bạn muốn quản lý</p>
                </div>
              </div>
              <Link href="/pages">
                <Button variant="ghost" size="sm"><ArrowRight className="size-4" /></Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-md">
                  <Sparkles className="size-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Thử nghiệm AI</p>
                  <p className="text-xs text-muted-foreground">Tạo bài viết đầu tiên của bạn</p>
                </div>
              </div>
              <Link href="/create">
                <Button variant="ghost" size="sm"><ArrowRight className="size-4" /></Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
