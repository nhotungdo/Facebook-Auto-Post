/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { Sparkles, CalendarIcon, Save, Loader2, Send, ImageIcon, X, Lightbulb, RefreshCcw, SmilePlus, ChevronDown, ChevronUp } from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import { toast } from "sonner"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { SocialPreview } from "@/components/SocialPreview"
import { supabase } from "@/lib/supabase"
import { useWorkspace } from "@/hooks/useWorkspace"
import { API_URL } from "@/lib/api"

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
  const [media, setMedia] = React.useState<File[]>([])
  
  const [scheduledAt, setScheduledAt] = React.useState("")
  const [isScheduling, setIsScheduling] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isRewriting, setIsRewriting] = React.useState(false)
  const [rewriteVariants, setRewriteVariants] = React.useState<string[]>([])
  const [showRewriteDialog, setShowRewriteDialog] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  
  const [targetAudience, setTargetAudience] = React.useState("")
  const [keywords, setKeywords] = React.useState("")
  const [length, setLength] = React.useState("medium")
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [isSavingDraft, setIsSavingDraft] = React.useState(false)
  
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()

  const uploadMediaFiles = async (): Promise<string[]> => {
    if (media.length === 0) return []
    const urls: string[] = []
    
    for (const file of media) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${workspaceId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('post_media')
        .upload(filePath, file)

      if (uploadError) {
        console.error("Lỗi upload:", uploadError)
        throw new Error(`Lỗi tải lên file ${file.name}`)
      }

      const { data } = supabase.storage
        .from('post_media')
        .getPublicUrl(filePath)
      
      urls.push(data.publicUrl)
    }
    
    return urls
  }

  React.useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        // Cập nhật tên người dùng để hiển thị preview
        setUserName(user.user_metadata?.full_name || user.user_metadata?.name || "Người dùng Facebook")

        const { data, error } = await supabase
          .from('facebook_pages')
          .select('id, page_id, page_name')
          .eq('user_id', user.id)
        
        if (error) throw error

        if (data) {
          const formattedPages = data.map(p => ({ id: p.id, name: p.page_name, page_id: p.page_id }))
          setPages(formattedPages)
          if (formattedPages.length > 0) {
            setSelectedPage(formattedPages[0].id)
          }
        }
      } catch (err) {
        console.error("Failed to fetch pages", err)
      }
    }
    
    fetchPages()
  }, [])

  const handleGenerate = async () => {
    if (!goal || !selectedPage) {
      toast.error("Vui lòng nhập mục tiêu và chọn trang!")
      return
    }

    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const res = await fetch(`${API_URL}/api/v1/posts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          goal: goal,
          tone: tone,
          page_id: selectedPage,
          workspace_id: workspaceId,
          target_audience: targetAudience,
          keywords: keywords,
          length: length
        })
      })

      if (!res.ok) throw new Error("Failed to generate")
      const data = await res.json()
      
      if (data.data.content) {
        setContent(data.data.content)
      }
      
      if (data.data.suggested_media && data.data.suggested_media.length > 0) {
        try {
          const imageUrl = data.data.suggested_media[0]
          const imageRes = await fetch(imageUrl)
          const blob = await imageRes.blob()
          const file = new File([blob], "ai-generated-image.jpg", { type: "image/jpeg" })
          setMedia([file])
          toast.success("Đã tìm & đính kèm ảnh minh họa từ AIVisualAgent!")
        } catch (e) {
          console.error("Lỗi khi tải ảnh tự động", e)
        }
      }
      
      if (data.status === "warning") {
        toast.warning(`Bài viết chưa đạt chuẩn 100%: ${data.data.status_message}`, {
          duration: 6000,
        })
      } else {
        toast.success("Tạo bài viết thành công (Đã qua kiểm duyệt AI)!")
      }
    } catch (error: any) {
      console.error("Lỗi API Tạo bài:", error.message || error)
      toast.error(error.message === "Failed to fetch" ? "Không thể kết nối tới máy chủ AI (Backend đang tắt)." : "Lỗi khi sinh nội dung.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRewrite = async () => {
    if (!content) {
      toast.error("Không có nội dung để viết lại!")
      return
    }
    if (!selectedPage) {
      toast.error("Vui lòng chọn trang Facebook!")
      return
    }

    setIsRewriting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const res = await fetch(`${API_URL}/api/v1/ai/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          original_content: content,
          tone: tone,
          num_variants: 3
        })
      })

      if (!res.ok) throw new Error("Failed to rewrite")
      const data = await res.json()
      if (data.status === "success" && data.variants && data.variants.length > 0) {
        setRewriteVariants(data.variants)
        setShowRewriteDialog(true)
      } else {
        toast.error("Không có phiên bản nào được tạo.")
      }
    } catch (error: any) {
      console.error("Lỗi API Viết lại:", error.message || error)
      toast.error(error.message === "Failed to fetch" ? "Không thể kết nối tới máy chủ AI (Backend đang tắt)." : "Lỗi khi viết lại nội dung.")
    } finally {
      setIsRewriting(false)
    }
  }

  const handlePublish = async () => {
    if (!content || !selectedPage || !workspaceId) return
    setIsPublishing(true)
    const toastId = toast.loading("Đang xử lý đăng bài...")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const urls = await uploadMediaFiles()

      const res = await fetch(`${API_URL}/api/v1/posts/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          page_id: selectedPage,
          content: content,
          media_urls: urls
        })
      })

      const data = await res.json()
      if (res.ok && data.status === "published") {
        toast.success("Đăng bài thành công lên Facebook!", { id: toastId })
        setContent("")
        setMedia([])
      } else {
        toast.error(`Lỗi: ${data.error || "Không thể đăng bài"}`, { id: toastId })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message === "Failed to fetch" ? "Không thể kết nối tới máy chủ API." : (error.message || "Lỗi kết nối khi đăng bài."), { id: toastId })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSchedule = async () => {
    if (!content || !selectedPage || !scheduledAt || !workspaceId) {
      toast.error("Vui lòng chọn ngày giờ lên lịch!")
      return
    }
    
    const scheduledTime = new Date(scheduledAt).getTime()
    if (scheduledTime <= Date.now()) {
      toast.error("Thời gian lên lịch phải ở tương lai!")
      return
    }

    setIsScheduling(true)
    const toastId = toast.loading("Đang lên lịch bài viết...")
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not logged in")

      const urls = await uploadMediaFiles()
      const isoScheduledAt = new Date(scheduledAt).toISOString()

      const res = await fetch(`${API_URL}/api/v1/posts/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          page_id: selectedPage,
          content: content,
          scheduled_at: isoScheduledAt,
          media_urls: urls
        })
      })

      const data = await res.json()
      if (res.ok && data.status === "scheduled") {
        toast.success("Đã lưu bài viết vào lịch thành công!", { id: toastId })
        setContent("")
        setScheduledAt("")
        setMedia([])
      } else {
        toast.error(`Lỗi: ${data.error || "Không thể lên lịch"}`, { id: toastId })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message === "Failed to fetch" ? "Không thể kết nối tới máy chủ API." : (error.message || "Lỗi kết nối khi lên lịch bài."), { id: toastId })
    } finally {
      setIsScheduling(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content) {
      toast.error("Vui lòng nhập nội dung trước khi lưu nháp.")
      return
    }
    if (!selectedPage || !workspaceId) {
      toast.error("Vui lòng chọn trang Facebook!")
      return
    }

    setIsSavingDraft(true)
    const toastId = toast.loading("Đang lưu nháp...")
    try {
      const urls = await uploadMediaFiles()

      const { error } = await supabase.from('posts').insert({
        workspace_id: workspaceId,
        page_id: selectedPage,
        content: content,
        status: 'draft',
        media_urls: urls
      })

      if (error) throw error

      toast.success("Đã lưu nháp bài viết thành công!", { id: toastId })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Lỗi khi lưu nháp.", { id: toastId })
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setMedia(prev => [...prev, ...filesArray])
    }
  }
  
  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index))
  }

  const getSelectedPageName = () => {
    const page = pages.find(p => p.id === selectedPage)
    return page ? page.name : (userName || "Người dùng Facebook")
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tạo bài viết với AI
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Mô tả mục tiêu, chọn hình ảnh và để Trợ lý AI sáng tạo nội dung hoàn hảo cho khách hàng của bạn.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 flex-1 items-start">
        {/* Editor Column */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Trình tạo nội dung AI
              </CardTitle>
              <CardDescription>Mô tả mục tiêu của bạn, AI sẽ lo phần còn lại.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                <Label htmlFor="goal" className="text-base font-semibold">Bạn muốn đạt được điều gì?</Label>
                <div className="flex gap-2">
                  <Input 
                    id="goal" 
                    placeholder="Ví dụ: Bán 100 áo thun trong tháng này với giảm giá 20%" 
                    className="flex-1"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <Button onClick={handleGenerate} disabled={isGenerating || pages.length === 0 || isWorkspaceLoading} className="gap-2 shrink-0">
                    {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    Tạo bài
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1"><Lightbulb className="size-3"/> Gợi ý:</span>
                  {["Bài tương tác Minigame", "Thông báo Khuyến mãi 50%", "Chia sẻ kiến thức"].map(prompt => (
                    <Button 
                      key={prompt} 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs h-7 px-2"
                      onClick={() => setGoal(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                  <Label className="font-semibold">Giọng văn</Label>
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
                <div className="space-y-2 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                  <Label className="font-semibold">Trang Facebook</Label>
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

              <div className="space-y-3 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Label className="text-base font-semibold cursor-pointer">Tùy chỉnh AI Nâng cao</Label>
                  {showAdvanced ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </div>
                
                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 mt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Khách hàng mục tiêu</Label>
                      <Input 
                        placeholder="VD: Học sinh, Mẹ bỉm sữa..." 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Từ khóa bắt buộc</Label>
                      <Input 
                        placeholder="VD: Khuyến mãi, Freeship..." 
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Độ dài bài viết</Label>
                      <Select value={length} onValueChange={(val) => setLength(val || "")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn độ dài" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Ngắn (Dưới 100 từ)</SelectItem>
                          <SelectItem value="medium">Trung bình (100 - 300 từ)</SelectItem>
                          <SelectItem value="long">Dài (Trên 300 từ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Nội dung bài viết</Label>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRewrite} 
                      disabled={isRewriting || !content || isWorkspaceLoading}
                      className="h-7 text-xs px-2.5 gap-1.5"
                    >
                      {isRewriting ? <Loader2 className="size-3 animate-spin" /> : <RefreshCcw className="size-3" />}
                      Viết lại bằng AI
                    </Button>
                    <span className="text-xs text-muted-foreground">{content.length} ký tự</span>
                  </div>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Nội dung do AI tạo sẽ xuất hiện tại đây..." 
                    className="min-h-[200px] resize-none pb-12"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="absolute bottom-3 left-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-full hover:bg-muted"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <SmilePlus className="size-4 text-muted-foreground" />
                    </Button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-xl overflow-hidden border border-border">
                        <EmojiPicker 
                          onEmojiClick={(emojiData) => {
                            setContent(prev => prev + emojiData.emoji)
                            setShowEmojiPicker(false)
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/10">
                <Label className="text-base font-semibold">Đính kèm Hình ảnh / Video</Label>
                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center bg-background/50 hover:bg-background/80 transition-colors cursor-pointer" onClick={() => document.getElementById('media-upload')?.click()}>
                  <ImageIcon className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Kéo thả hoặc click để chọn ảnh/video</p>
                  <p className="text-xs text-muted-foreground mt-1">Hỗ trợ JPG, PNG, MP4 (Tối đa 10MB)</p>
                  <input id="media-upload" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                </div>
                {media.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {media.map((file, i) => (
                      <div key={i} className="relative size-20 shrink-0 rounded-md overflow-hidden group border border-border">
                        {file.type.startsWith('image/') ? (
                           <img src={URL.createObjectURL(file)} alt="" className="object-cover w-full h-full" />
                        ) : (
                           <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs">Video</div>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); removeMedia(i) }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden sticky top-6 flex flex-col h-fit">
            <CardHeader className="bg-black/5 dark:bg-white/5 border-b border-white/10 pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Facebook className="size-4 text-blue-500" />
                Xem trước trên Facebook
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SocialPreview 
                content={content} 
                pageName={getSelectedPageName()} 
                mediaUrl={media.length > 0 ? URL.createObjectURL(media[0]) : undefined}
              />
            </CardContent>
            <CardFooter className="bg-black/5 dark:bg-white/5 border-t border-white/10 flex-col gap-3 p-5">
              <div className="flex w-full items-center gap-2">
                <Input 
                  type="datetime-local" 
                  className="flex-1 text-sm" 
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tmr = new Date()
                    tmr.setDate(tmr.getDate() + 1)
                    tmr.setHours(19, 0, 0, 0)
                    const tzoffset = tmr.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(tmr.getTime() - tzoffset)).toISOString().slice(0, 16);
                    setScheduledAt(localISOTime)
                    toast.success("AI đã gợi ý khung giờ vàng (19:00) để đạt tương tác cao nhất!")
                  }}
                  className="px-2 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  title="AI Gợi ý giờ vàng"
                >
                  <Sparkles className="size-4 text-purple-600" />
                </Button>
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
                <Button variant="outline" className="flex-1 text-xs px-2" onClick={handleSaveDraft} disabled={isSavingDraft || isWorkspaceLoading}>
                  {isSavingDraft ? <Loader2 className="size-3 mr-1 animate-spin" /> : <Save className="size-3 mr-1" />} 
                  Lưu nháp
                </Button>
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

      <Dialog open={showRewriteDialog} onOpenChange={setShowRewriteDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI đã viết lại nội dung của bạn</DialogTitle>
            <DialogDescription>Chọn một phiên bản ưng ý nhất để thay thế nội dung cũ.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {rewriteVariants.map((variant, index) => (
              <div key={index} className="relative p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group">
                <p className="text-sm whitespace-pre-wrap pr-24">{variant}</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" onClick={() => {
                    setContent(variant)
                    setShowRewriteDialog(false)
                    toast.success("Đã áp dụng nội dung mới!")
                  }}>
                    Dùng bản này
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRewriteDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
