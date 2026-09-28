"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Loader2, CheckCircle2 } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"
import { API_URL } from "@/lib/api"

interface Page {
  id: string
  name: string
  connected: boolean
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()

  const fetchPages = React.useCallback(async () => {
    if (!workspaceId) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`${API_URL}/api/v1/facebook/pages?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setPages(data)
      }
    } catch (error) {
      console.error("Failed to fetch pages", error)
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  // Fetch khi workspace sẵn sàng; gọi trong callback để tránh cascading render
  const fetchPagesRef = React.useRef(fetchPages)
  React.useEffect(() => {
    fetchPagesRef.current = fetchPages
    if (!isWorkspaceLoading) {
      void fetchPagesRef.current()
    }
  }, [fetchPages, isWorkspaceLoading])

  const handleConnectOAuth = () => {
    if (!workspaceId) {
      alert("Không tìm thấy Workspace, vui lòng thử lại sau.")
      return
    }
    // Đúng chủ đích: rời app sang backend FastAPI để bắt đầu OAuth flow với Meta,
    // nên cần full page load (router.push sẽ sai vì đây không phải route của Next).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${API_URL}/api/v1/facebook/login?workspace_id=${workspaceId}`
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facebook Pages</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các trang Facebook đã kết nối với Workspace của bạn.
          </p>
        </div>

        <Button 
          onClick={handleConnectOAuth} 
          disabled={isWorkspaceLoading || !workspaceId}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="size-4" />
          Kết nối Facebook
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading || isWorkspaceLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : pages.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Facebook className="size-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-semibold text-lg">Chưa có trang nào được kết nối</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Kết nối với Meta OAuth để hệ thống tự động tải danh sách Fanpage của bạn. An toàn và nhanh chóng.
                </p>
                <Button onClick={handleConnectOAuth} disabled={!workspaceId} className="bg-blue-600 hover:bg-blue-700 text-white">Kết nối ngay</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          pages.map(page => (
            <Card key={page.id} className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{page.name}</CardTitle>
                <Facebook className="size-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground break-all">ID: {page.id}</p>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                  <CheckCircle2 className="size-4" />
                  Đã kết nối
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
