"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Link as LinkIcon, Save, Settings as SettingsIcon, BrainCircuit, Loader2 } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"
import Link from "next/link"

// Fanpage đã kết nối hiển thị trong tab Facebook
interface ConnectedPage {
  id: string
  name: string
}

export default function SettingsPage() {
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()
  
  const [pages, setPages] = React.useState<ConnectedPage[]>([])
  const [isPagesLoading, setIsPagesLoading] = React.useState(false)
  
  const [groqKey, setGroqKey] = React.useState("")
  const [model, setModel] = React.useState("llama3-70b-8192")
  const [isAiLoading, setIsAiLoading] = React.useState(false)
  const [isAiSaving, setIsAiSaving] = React.useState(false)

  React.useEffect(() => {
    async function fetchPages() {
      if (!workspaceId) return
      setIsPagesLoading(true)
      try {
        const { data, error } = await supabase
          .from("facebook_pages")
          .select("id, page_name")
          .eq("workspace_id", workspaceId)
        if (error) throw error
        setPages((data || []).map(p => ({ id: p.id, name: p.page_name })))
      } catch (err) {
        console.error("Error fetching pages:", err)
      } finally {
        setIsPagesLoading(false)
      }
    }

    async function fetchAiSettings() {
      setIsAiLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("ai_settings")
          .select("*")
          .eq("user_id", user.id)
          .single()
        
        if (data) {
          if (data.groq_api_key) setGroqKey(data.groq_api_key)
          if (data.default_model) setModel(data.default_model)
        }
      } catch (err: unknown) {
        // PG 0 rows error is fine if no settings saved yet
        const code = (err as { code?: string } | null)?.code
        if (code !== 'PGRST116') {
          console.error("Error fetching AI settings:", err)
        }
      } finally {
        setIsAiLoading(false)
      }
    }

    if (!isWorkspaceLoading) {
      fetchPages()
      fetchAiSettings()
    }
  }, [workspaceId, isWorkspaceLoading])

  const handleSaveAiSettings = async () => {
    setIsAiSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      const { error } = await supabase
        .from("ai_settings")
        .upsert({
          user_id: user.id,
          groq_api_key: groqKey,
          default_model: model,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      alert("Đã lưu cấu hình AI!")
    } catch (err) {
      console.error(err)
      alert("Lỗi khi lưu cấu hình AI.")
    } finally {
      setIsAiSaving(false)
    }
  }

  const handleDisconnect = async (pageId: string) => {
    if (!confirm("Bạn có chắc chắn muốn ngắt kết nối trang này?")) return
    try {
      const { error } = await supabase
        .from("facebook_pages")
        .delete()
        .eq("id", pageId)
      
      if (error) throw error
      setPages(pages.filter(p => p.id !== pageId))
    } catch (err) {
      console.error(err)
      alert("Lỗi khi ngắt kết nối.")
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Cài đặt
        </h1>
        <p className="text-muted-foreground mt-1">
          Cấu hình trợ lý AI, kết nối Facebook và các tùy chọn hệ thống.
        </p>
      </div>

      <Tabs defaultValue="facebook" className="w-full flex-1">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="facebook">Trang Facebook</TabsTrigger>
          <TabsTrigger value="ai">Cấu hình AI</TabsTrigger>
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
        </TabsList>
        
        {/* Facebook Pages Tab */}
        <TabsContent value="facebook" className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="size-5 text-blue-500" />
                Các trang đã kết nối
              </CardTitle>
              <CardDescription>
                Kết nối và quản lý các Trang Facebook để AI có thể tự động đăng bài.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPagesLoading || isWorkspaceLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : pages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có trang nào được kết nối.</p>
              ) : (
                pages.map(page => (
                  <div key={page.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {page.name ? page.name.substring(0, 1).toUpperCase() : "F"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base flex items-center gap-2">
                          {page.name}
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Đã kết nối</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {page.id}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      onClick={() => handleDisconnect(page.id)}
                    >
                      Ngắt kết nối
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 pt-4">
              <Link href="/pages">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <LinkIcon className="size-4" />
                  Kết nối Trang mới
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* AI Config Tab */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="size-5 text-primary" />
                Cấu hình Groq API
              </CardTitle>
              <CardDescription>
                Thiết lập API key để cấp quyền cho Trợ lý AI và Trình tạo nội dung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAiLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="groq-key">API Key của Groq</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="groq-key" 
                          type="password" 
                          placeholder="gsk_..." 
                          className="pl-9" 
                          value={groqKey} 
                          onChange={e => setGroqKey(e.target.value)} 
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Khóa của bạn được lưu trữ an toàn và không bao giờ được chia sẻ.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model mặc định</Label>
                    <Input 
                      id="model" 
                      value={model}
                      onChange={e => setModel(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 pt-4">
              <Button onClick={handleSaveAiSettings} disabled={isAiSaving || isAiLoading} className="gap-2">
                {isAiSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Lưu cài đặt AI
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="size-5 text-primary" />
                Tùy chọn chung
              </CardTitle>
              <CardDescription>
                Cài đặt hệ thống và hành vi mặc định.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Múi giờ</Label>
                <Input id="timezone" defaultValue="Asia/Ho_Chi_Minh" readOnly className="bg-muted/50 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Tất cả lịch trình đều dựa trên múi giờ này.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
