"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ArrowLeft, Check } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"

interface AvailablePage {
  id: string
  name: string
  access_token: string
  followers_count: number
  picture_url?: string
}

export default function SelectFacebookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlWorkspaceId = searchParams.get('workspace_id')
  
  const [pages, setPages] = useState<AvailablePage[]>([])
  const [loading, setLoading] = useState(true)
  const [userToken, setUserToken] = useState<string>("")
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const { workspaceId: hookWorkspaceId } = useWorkspace()
  const workspaceId = urlWorkspaceId || hookWorkspaceId

  useEffect(() => {
    // Extract token from hash: #token=...
    const hash = window.location.hash
    let token = ""
    if (hash && hash.startsWith('#token=')) {
      token = hash.substring(7)
      setUserToken(token)
      // Remove hash from URL for security
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    if (!token) {
      alert("Không tìm thấy Access Token từ Meta. Vui lòng thử lại.")
      router.push('/pages')
      return
    }

    const fetchPages = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error("Not logged in")

        const res = await fetch(`http://localhost:8000/api/v1/facebook/available-pages?token=${token}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        
        if (res.ok) {
          const data = await res.json()
          setPages(data)
        } else {
          console.error("Failed to fetch pages", await res.text())
        }
      } catch (error) {
        console.error("Failed to fetch pages", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [router])

  const handleConnect = async () => {
    if (!selectedPageId || !workspaceId || !userToken) return
    
    setIsConnecting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const res = await fetch('http://localhost:8000/api/v1/facebook/connect-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          page_id: selectedPageId,
          workspace_id: workspaceId,
          user_access_token: userToken
        })
      })

      if (!res.ok) {
        throw new Error("Failed to connect page")
      }

      // Quay về trang quản lý
      router.push('/pages')
      
    } catch (error) {
      alert("Lỗi khi kết nối trang. Vui lòng kiểm tra console.")
      console.error(error)
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/pages')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chọn Fanpage</h1>
          <p className="text-muted-foreground mt-1">
            Chọn Fanpage bạn muốn kết nối vào SocialPilot AI.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Đang tải danh sách Fanpage từ Meta...</p>
        </div>
      ) : pages.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Facebook className="size-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg">Không tìm thấy Fanpage nào</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Tài khoản Facebook của bạn chưa tạo hoặc quản lý Fanpage nào. Hoặc bạn chưa cấp quyền đủ.
            </p>
            <Button onClick={() => router.push('/pages')} variant="outline">Quay lại</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map(page => (
              <Card 
                key={page.id} 
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedPageId === page.id 
                    ? "ring-2 ring-blue-600 bg-blue-500/5 border-blue-500/50" 
                    : "bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
                }`}
                onClick={() => setSelectedPageId(page.id)}
              >
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {page.picture_url ? (
                      <img src={page.picture_url} alt={page.name} className="w-full h-full object-cover" />
                    ) : (
                      <Facebook className="w-full h-full p-2 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-base line-clamp-2 leading-tight">{page.name}</CardTitle>
                    <CardDescription>{page.followers_count.toLocaleString()} followers</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 flex justify-end">
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPageId === page.id 
                      ? "border-blue-600 bg-blue-600 text-white" 
                      : "border-muted-foreground/30 text-transparent"
                  }`}>
                    <Check className="size-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleConnect} 
              disabled={!selectedPageId || isConnecting} 
              className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
            >
              {isConnecting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {isConnecting ? "Đang kết nối..." : "Lưu Trang đã chọn"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
