"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Loader2, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"


interface Page {
  id: string
  page_id: string
  page_name: string
  picture_url: string
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPages = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('facebook_pages')
        .select('*')
        .eq('user_id', user.id)
        
      if (error) throw error
      setPages(data || [])
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách trang:", err)
      setError("Không thể tải danh sách trang từ Database.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleSyncFacebook = async () => {
    setSyncing(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session || !session.provider_token) {
        setError("Không tìm thấy Access Token của Facebook. Vui lòng đăng xuất và đăng nhập lại bằng Facebook để cấp quyền.")
        setSyncing(false)
        return
      }

      // Gọi Graph API để lấy danh sách Page
      const res = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${session.provider_token}&fields=id,name,picture`)
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error.message || "Lỗi từ Facebook API")
      }

      const fbPages = data.data || []
      
      if (fbPages.length === 0) {
        setError("Không tìm thấy Fanpage nào do bạn làm Quản trị viên.")
        setSyncing(false)
        return
      }

      // Lưu vào Database
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id

      if (!userId) throw new Error("Vui lòng đăng nhập lại.")

      const upsertData = fbPages.map((p: any) => ({
        user_id: userId,
        page_id: p.id,
        page_name: p.name,
        access_token: p.access_token,
        picture_url: p.picture?.data?.url || null
      }))

      const { error: dbError } = await supabase
        .from('facebook_pages')
        .upsert(upsertData, { onConflict: 'user_id,page_id' })

      if (dbError) throw dbError

      await fetchPages()
      
    } catch (err: any) {
      console.error("Lỗi đồng bộ:", err)
      setError(err.message || "Đã xảy ra lỗi khi đồng bộ với Facebook.")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facebook Pages</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các Fanpage đã kết nối để tự động đăng bài.
          </p>
        </div>

        <Button 
          onClick={handleSyncFacebook} 
          disabled={syncing}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Đồng bộ từ Facebook
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold mb-1">Lỗi</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
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
                  Hãy đồng bộ để hệ thống tự động tải danh sách Fanpage bạn đang quản lý.
                </p>
                <Button onClick={handleSyncFacebook} disabled={syncing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Đồng bộ ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          pages.map(page => (
            <Card key={page.id} className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  {page.picture_url ? (
                    <img src={page.picture_url} alt={page.page_name} className="size-10 rounded-full object-cover border" />
                  ) : (
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center"><Facebook className="size-5" /></div>
                  )}
                  <CardTitle className="text-lg font-semibold">{page.page_name}</CardTitle>
                </div>
                <Facebook className="size-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mt-2 truncate">ID: {page.page_id}</p>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                  <CheckCircle2 className="size-4" />
                  Sẵn sàng tự động đăng
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
