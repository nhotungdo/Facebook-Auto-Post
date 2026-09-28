/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2, CheckCircle2, RefreshCw, Search, Trash2, ExternalLink } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
  const [searchQuery, setSearchQuery] = useState("")

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
      toast.error("Không thể tải danh sách trang từ Database.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleSyncFacebook = async () => {
    setSyncing(true)
    const toastId = toast.loading("Đang đồng bộ trang từ Facebook...")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session || !session.provider_token) {
        toast.error("Không tìm thấy Access Token. Vui lòng đăng xuất và đăng nhập lại bằng Facebook.", { id: toastId })
        setSyncing(false)
        return
      }

      // Gọi Graph API để lấy danh sách Page
      const res = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${session.provider_token}&fields=id,name,access_token,picture`)
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error.message || "Lỗi từ Facebook API")
      }

      const fbPages = data.data || []
      
      if (fbPages.length === 0) {
        toast.error(
          "Không tìm thấy Fanpage nào. Hãy đảm bảo bạn đã cấp quyền 'pages_show_list' và là Quản trị viên của ít nhất 1 Fanpage. Thử đăng xuất và đăng nhập lại.",
          { id: toastId, duration: 6000 }
        )
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
      toast.success(`Đồng bộ thành công ${fbPages.length} trang!`, { id: toastId })
      
    } catch (err: any) {
      console.error("Lỗi đồng bộ:", err)
      toast.error(err.message || "Đã xảy ra lỗi khi đồng bộ với Facebook.", { id: toastId })
    } finally {
      setSyncing(false)
    }
  }

  const handleDeletePage = async (id: string, pageName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ngắt kết nối với trang "${pageName}" không? Hành động này sẽ không xóa trang trên Facebook, chỉ gỡ khỏi hệ thống.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('facebook_pages')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success(`Đã ngắt kết nối trang "${pageName}"`)
      setPages(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      console.error(err)
      toast.error("Không thể ngắt kết nối trang.")
    }
  }

  const filteredPages = pages.filter(p => p.page_name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      {/* Hero Header */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Quản lý Fanpage
          </h1>
          <p className="text-muted-foreground mt-2 text-base max-w-2xl">
            Đồng bộ và quản lý tất cả các trang Facebook mà bạn sở hữu. Hệ thống sẽ tự động cập nhật Token để đảm bảo bài viết luôn được đăng đúng lịch.
          </p>
        </div>
        <Button 
          onClick={handleSyncFacebook} 
          disabled={syncing}
          size="lg"
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 shrink-0"
        >
          {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Đồng bộ từ Facebook
        </Button>
      </div>

      {/* Utilities / Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm Fanpage..." 
            className="pl-9 bg-white/5 border-white/10 focus-visible:ring-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground hidden md:block">
          Hiển thị {filteredPages.length} trang
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-20 glass-card">
            <Loader2 className="size-8 animate-spin text-blue-500 mb-4" />
            <p className="text-muted-foreground">Đang tải danh sách Fanpage...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="col-span-full">
            <div className="glass-card flex flex-col items-center justify-center p-20 text-center border-dashed border-2 border-white/10">
              <div className="size-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Facebook className="size-10 text-blue-500 opacity-80" />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-foreground">Chưa có Fanpage nào</h3>
              <p className="text-muted-foreground mb-8 max-w-md text-base">
                {searchQuery 
                  ? `Không tìm thấy kết quả nào cho "${searchQuery}". Vui lòng thử từ khóa khác.`
                  : "Bạn chưa kết nối Fanpage nào. Hãy nhấn đồng bộ để hệ thống tự động tải danh sách các trang bạn đang quản lý."
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleSyncFacebook} disabled={syncing} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Đồng bộ ngay bây giờ
                </Button>
              )}
            </div>
          </div>
        ) : (
          filteredPages.map(page => (
            <div key={page.id} className="glass-card overflow-hidden group hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col">
              <div className="p-6 flex flex-col h-full relative">
                
                {/* Header Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {page.picture_url ? (
                        <img src={page.picture_url} alt={page.page_name} className="size-14 rounded-xl object-cover border border-white/10 shadow-sm" />
                      ) : (
                        <div className="size-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                          <Facebook className="size-6 text-blue-500" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" title="Đang hoạt động" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold line-clamp-1 group-hover:text-blue-500 transition-colors">{page.page_name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        ID: {page.page_id}
                      </p>
                    </div>
                  </div>
                  <Facebook className="size-5 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Status Body */}
                <div className="flex-1 mt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="size-4" />
                    Sẵn sàng đăng bài
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-8 px-2" onClick={() => window.open(`https://facebook.com/${page.page_id}`, '_blank')}>
                    <ExternalLink className="size-3 mr-1.5" /> Mở trang
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                    onClick={() => handleDeletePage(page.id, page.page_name)}
                  >
                    <Trash2 className="size-3 mr-1.5" /> Ngắt kết nối
                  </Button>
                </div>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
