"use client"

import * as React from "react"
import { Sparkles, CalendarIcon, Image as ImageIcon, Save, Loader2, Send } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SocialPreview } from "@/components/SocialPreview"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"

interface Page {
  id: string
  name: string
}

export default function CreatePost() {
  const [content, setContent] = React.useState("")
  const [goal, setGoal] = React.useState("")
  const [tone, setTone] = React.useState("professional")
  const [selectedPage, setSelectedPage] = React.useState("")
  
  const [pages, setPages] = React.useState<Page[]>([])
  
  const [scheduledAt, setScheduledAt] = React.useState("")
  const [isScheduling, setIsScheduling] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()

  React.useEffect(() => {
    const fetchPages = async () => {
      if (!workspaceId) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      try {
        const res = await fetch(`http://localhost:8000/api/v1/facebook/pages?workspace_id=${workspaceId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setPages(data)
          if (data.length > 0) {
            setSelectedPage(data[0].id)
          }
        }
      } catch (err) {
        console.error("Failed to fetch pages", err)
      }
    }
    
    if (!isWorkspaceLoading) {
      fetchPages()
    }
  }, [workspaceId, isWorkspaceLoading])

  const handleGenerate = async () => {
    if (!goal || !selectedPage) {
      alert("Vui lòng nhập mục tiêu và chọn trang!")
      return
    }

    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const res = await fetch('http://localhost:8000/api/v1/posts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          goal: goal,
          tone: tone,
          page_id: selectedPage,
          workspace_id: workspaceId // Add workspace_id if backend needs it, usually good practice
        })
      })

      if (!res.ok) throw new Error("Failed to generate")
      const data = await res.json()
      setContent(data.data.content)
    } catch (error) {
      console.error(error)
      alert("Lỗi khi sinh nội dung.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!content || !selectedPage || !workspaceId) return
    setIsPublishing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const res = await fetch('http://localhost:8000/api/v1/posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          page_id: selectedPage,
          content: content,
        })
      })

      const data = await res.json()
      if (res.ok && data.status === "published") {
        alert("Đăng bài thành công lên Facebook!")
        setContent("")
      } else {
        alert(`Lỗi: ${data.error || "Không thể đăng bài"}`)
      }
    } catch (error) {
      console.error(error)
      alert("Lỗi kết nối khi đăng bài.")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSchedule = async () => {
    if (!content || !selectedPage || !scheduledAt || !workspaceId) {
      alert("Vui lòng chọn ngày giờ lên lịch!")
      return
    }
    
    // Ensure scheduledAt is in the future
    const scheduledTime = new Date(scheduledAt).getTime()
    if (scheduledTime <= Date.now()) {
      alert("Thời gian lên lịch phải ở tương lai!")
      return
    }

    setIsScheduling(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      // Convert local datetime-local string to ISO format for backend
      const isoScheduledAt = new Date(scheduledAt).toISOString()

      const res = await fetch('http://localhost:8000/api/v1/posts/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          page_id: selectedPage,
          content: content,
          scheduled_at: isoScheduledAt
        })
      })

      const data = await res.json()
      if (res.ok && data.status === "scheduled") {
        alert("Đã lưu bài viết vào lịch thành công!")
        setContent("")
        setScheduledAt("")
      } else {
        alert(`Lỗi: ${data.error || "Không thể lên lịch"}`)
      }
    } catch (error) {
      console.error(error)
      alert("Lỗi kết nối khi lên lịch bài.")
    } finally {
      setIsScheduling(false)
    }
  }

  const getSelectedPageName = () => {
    const page = pages.find(p => p.id === selectedPage)
    return page ? page.name : "Your Page"
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Tạo bài viết với AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Để Trợ lý AI sáng tạo nội dung hoàn hảo cho khách hàng của bạn.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 flex-1">
        {/* Editor Column */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Trình tạo nội dung AI
              </CardTitle>
              <CardDescription>Mô tả mục tiêu của bạn, AI sẽ lo phần còn lại.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Bạn muốn đạt được điều gì?</Label>
                <div className="flex gap-2">
                  <Input 
                    id="goal" 
                    placeholder="Ví dụ: Bán 100 áo thun trong tháng này với giảm giá 20%" 
                    className="flex-1"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <Button onClick={handleGenerate} disabled={isGenerating || pages.length === 0 || isWorkspaceLoading} className="gap-2">
                    {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    Tạo bài
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giọng văn</Label>
                  <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giọng văn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                      <SelectItem value="humorous">Hài hước</SelectItem>
                      <SelectItem value="genz">Gen Z</SelectItem>
                      <SelectItem value="luxurious">Sang trọng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trang Facebook</Label>
                  <Select value={selectedPage} onValueChange={(val) => val && setSelectedPage(val)} disabled={pages.length === 0 || isWorkspaceLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={isWorkspaceLoading ? "Đang tải..." : pages.length === 0 ? "Chưa có trang nào" : "Chọn trang"} />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label>Nội dung bài viết</Label>
                <Textarea 
                  placeholder="Nội dung do AI tạo sẽ xuất hiện tại đây..." 
                  className="min-h-[200px] resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden sticky top-6">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Facebook className="size-4 text-blue-500" />
                Xem trước trên Facebook
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SocialPreview content={content} pageName={getSelectedPageName()} />
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 flex-col gap-3 p-4">
              <div className="flex w-full items-center gap-2">
                <Input 
                  type="datetime-local" 
                  className="flex-1 text-sm" 
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
                <Button 
                  onClick={handleSchedule}
                  disabled={isScheduling || !content || !selectedPage || !scheduledAt || isWorkspaceLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isScheduling ? <Loader2 className="size-4 animate-spin mr-1" /> : <CalendarIcon className="size-4 mr-1" />}
                  Lên lịch
                </Button>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <Button variant="outline" className="flex-1 text-xs px-2"><Save className="size-3 mr-1" /> Lưu nháp</Button>
                <Button 
                  onClick={handlePublish}
                  disabled={isPublishing || !content || !selectedPage || isWorkspaceLoading}
                  className="flex-1 text-xs px-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPublishing ? <Loader2 className="size-3 mr-1 animate-spin" /> : <Send className="size-3 mr-1" />} 
                  Đăng ngay
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
