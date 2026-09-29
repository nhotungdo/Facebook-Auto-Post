"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isToday } from "date-fns"
import { 
  ChevronLeft, ChevronRight, Plus, Search, Filter, Sparkles, 
  CheckCircle2, Clock, AlertCircle, X, Image as ImageIcon, FileText, 
  Video, Link2, Calendar as CalendarIcon, XCircle, LayoutGrid, List as ListIcon, CalendarDays, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { API_URL } from "@/lib/api"
import { toast } from "sonner"
import { useWorkspace } from "@/hooks/useWorkspace"
import { 
  DndContext, DragOverlay, closestCenter, PointerSensor, 
  useSensor, useSensors, DragEndEvent, useDraggable, useDroppable 
} from '@dnd-kit/core'

// --- TYPES ---
interface Post {
  id: string
  content: string
  media_urls?: string[]
  status: 'published' | 'scheduled' | 'publishing' | 'draft' | 'failed'
  scheduled_at: string
  created_at?: string
  page_id?: string
}

// --- DRAG & DROP COMPONENTS ---
function DraggablePost({ post, onClick }: { post: Post, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
    data: post
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative rounded-xl bg-[#141118] border border-white/5 p-3 cursor-grab hover:border-[#806C8E]/50 transition-colors shadow-sm
        ${isDragging ? 'opacity-50 scale-105 shadow-[#806C8E]/20 shadow-xl' : ''}`}
      onClick={(e) => {
        // Prevent drag click interference if needed, but normally handled by dnd-kit
        onClick()
      }}
    >
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="w-full h-24 mb-2 rounded-lg bg-black/50 overflow-hidden border border-white/5">
          <img src={post.media_urls[0]} alt="" className="w-full h-full object-cover opacity-80" />
        </div>
      )}
      
      <div className="flex items-center gap-1 mb-1.5">
        <div className="size-2 rounded-full" style={{
          backgroundColor: 
            post.status === 'published' ? '#4ADE80' : 
            post.status === 'scheduled' ? '#806C8E' : 
            post.status === 'failed' ? '#F87171' : '#FBBF24'
        }} />
        <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">
          {post.status}
        </span>
      </div>
      
      <p className="text-sm font-medium text-[#F5F2F7] line-clamp-2 leading-snug">
        {post.content || "Bài viết không có nội dung..."}
      </p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
          <Clock className="size-3 text-[#A895B8]" />
          <span className="text-xs text-[#A895B8] font-medium">
            {format(new Date(post.scheduled_at), 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  )
}

function DroppableColumn({ date, children }: { date: Date, children: React.ReactNode }) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const { isOver, setNodeRef } = useDroppable({
    id: dateStr,
    data: { date: dateStr }
  })

  return (
    <div 
      ref={setNodeRef} 
      className={`flex-1 flex flex-col gap-3 p-2 transition-colors min-h-[500px] border-r border-white/5 last:border-r-0
        ${isOver ? 'bg-[#806C8E]/10' : ''}`}
    >
      {children}
    </div>
  )
}


export default function CommandCenter() {
  const router = useRouter()
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace()
  const [currentWeek, setCurrentWeek] = React.useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [posts, setPosts] = React.useState<Post[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null)
  const [showSidePanel, setShowSidePanel] = React.useState(false)
  
  // AI Scheduler State
  const [showAIModal, setShowAIModal] = React.useState(false)
  const [aiNiche, setAiNiche] = React.useState("")
  const [aiAudience, setAiAudience] = React.useState("")
  const [aiPostsCount, setAiPostsCount] = React.useState("5")
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false)
  const [aiStrategy, setAiStrategy] = React.useState<any>(null)

  // Stats
  const stats = React.useMemo(() => {
    return {
      scheduled: posts.filter(p => p.status === 'scheduled').length,
      today: posts.filter(p => isSameDay(new Date(p.scheduled_at), new Date())).length,
      draft: posts.filter(p => p.status === 'draft').length,
      failed: posts.filter(p => p.status === 'failed').length
    }
  }, [posts])

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activation to distinguish from clicks
      },
    })
  )

  const fetchPosts = async () => {
    if (!workspaceId) return
    setIsLoading(true)
    try {
      const startDate = currentWeek.toISOString()
      const endDate = addDays(currentWeek, 7).toISOString()

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("workspace_id", workspaceId)
        .gte("scheduled_at", startDate)
        .lt("scheduled_at", endDate)

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      setPosts(data || [])
    } catch (err) {
      console.error("Fetch posts error:", err)
      toast.error("Không thể tải bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!isWorkspaceLoading && workspaceId) {
      fetchPosts()
    }
  }, [currentWeek, workspaceId, isWorkspaceLoading])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const postId = active.id as string
    const newDateStr = over.id as string
    const post = posts.find(p => p.id === postId)
    
    if (post) {
      const oldDate = new Date(post.scheduled_at)
      const newDate = new Date(newDateStr)
      // Keep original time, only change date
      newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds())
      
      const newScheduledAt = newDate.toISOString()
      
      // Optimistic UI update
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, scheduled_at: newScheduledAt } : p))
      toast.success(`Đã thay đổi lịch đăng bài sang ${format(newDate, 'dd/MM')}`)

      // API Call
      try {
        await supabase.from('posts').update({ scheduled_at: newScheduledAt }).eq('id', postId)
      } catch (e) {
        toast.error("Lỗi khi lưu vị trí mới")
        fetchPosts() // Revert
      }
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error
      setPosts(prev => prev.filter(p => p.id !== id))
      setShowSidePanel(false)
      toast.success("Đã xóa bài viết")
    } catch(e) {
      toast.error("Không thể xóa bài viết")
    }
  }

  const handleGenerateStrategy = async () => {
    if (!aiNiche || !aiAudience) {
      toast.error("Vui lòng nhập đủ thông tin")
      return
    }
    setIsGeneratingAI(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const res = await fetch(`${API_URL}/api/v1/ai/strategy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          niche: aiNiche,
          target_audience: aiAudience,
          posts_per_week: parseInt(aiPostsCount) || 5
        })
      })
      if (!res.ok) throw new Error("API Lỗi")
      const data = await res.json()
      setAiStrategy(data.data)
      toast.success("AI đã tạo xong lịch trình!")
    } catch(e) {
      toast.error("Lỗi khi tạo lịch AI")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleApplyStrategy = async () => {
    if (!aiStrategy || !aiStrategy.calendar || !workspaceId) return
    setIsGeneratingAI(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const newPosts = aiStrategy.calendar.map((item: any) => {
        let dayOffset = 0
        const d = (item.day || "").toLowerCase()
        if (d.includes("3")) dayOffset = 1
        else if (d.includes("4")) dayOffset = 2
        else if (d.includes("5")) dayOffset = 3
        else if (d.includes("6")) dayOffset = 4
        else if (d.includes("7")) dayOffset = 5
        else if (d.includes("chủ nhật") || d.includes("cn") || d.includes("sun")) dayOffset = 6

        const targetDay = addDays(currentWeek, dayOffset)
        const [hh, mm] = (item.time || "09:00").split(":")
        targetDay.setHours(parseInt(hh||"0"), parseInt(mm||"0"), 0)

        return {
          user_id: user?.id,
          workspace_id: workspaceId,
          content: `📌 Chủ đề: ${item.topic}\n🎯 Mục tiêu: ${item.goal}\n\n(Bản nháp do AI đề xuất, hãy tạo nội dung chi tiết...)`,
          status: 'draft',
          scheduled_at: targetDay.toISOString()
        }
      })

      const { error } = await supabase.from('posts').insert(newPosts)
      if (error) throw error
      
      toast.success("Đã áp dụng lịch trình vào Calendar!")
      setShowAIModal(false)
      setAiStrategy(null)
      fetchPosts()
    } catch(e) {
      toast.error("Lỗi khi áp dụng lịch")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeek, i))

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-[#050406] text-[#F5F2F7] -m-4 sm:-m-8 p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* HEADER BENTO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#0D0B10] p-6 rounded-2xl border border-white/10 shadow-lg mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Social Media Command Center
          </h1>
          <p className="text-[#A7A0AA] text-sm mt-1">Quản lý toàn bộ chiến dịch nội dung Facebook của bạn.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A7A0AA]" />
            <Input placeholder="Tìm kiếm nội dung..." className="pl-9 bg-[#141118] border-white/10 text-white placeholder:text-white/30 h-10" />
          </div>
          <Link href="/create">
            <Button className="bg-[#806C8E] hover:bg-[#A895B8] text-white border-0">
              <Plus className="size-4 mr-2" /> Tạo Bài
            </Button>
          </Link>
          <Button onClick={() => setShowAIModal(true)} variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-[#141118]">
            <Sparkles className="size-4 mr-2" /> AI Scheduler
          </Button>
        </div>
      </motion.div>

      {/* STATS BENTO */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Đã lên lịch", value: stats.scheduled, color: "#806C8E", icon: Clock },
          { label: "Hôm nay", value: stats.today, color: "#4ADE80", icon: CalendarIcon },
          { label: "Chờ duyệt", value: stats.draft, color: "#FBBF24", icon: FileText },
          { label: "Bị Lỗi", value: stats.failed, color: "#F87171", icon: AlertCircle }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0D0B10] border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg flex items-center justify-center bg-white/5" style={{ color: stat.color }}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-[#A7A0AA] uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* TOOLBAR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-4 px-2"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#0D0B10] rounded-lg border border-white/10 p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 border-0" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-4 min-w-[140px] text-center">
              {format(currentWeek, 'dd MMM')} - {format(addDays(currentWeek, 6), 'dd MMM')}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 border-0" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <Button variant="outline" className="h-10 bg-transparent border-white/10 hover:bg-white/5 text-[#A7A0AA]">
            <Filter className="size-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex bg-[#0D0B10] rounded-lg border border-white/10 p-1">
          <Button variant="ghost" size="sm" className="text-[#A7A0AA] hover:text-white h-8 border-0"><LayoutGrid className="size-4 mr-2"/> Month</Button>
          <Button variant="secondary" size="sm" className="bg-white/10 text-white shadow-sm h-8 border-0"><CalendarDays className="size-4 mr-2"/> Week</Button>
          <Button variant="ghost" size="sm" className="text-[#A7A0AA] hover:text-white h-8 border-0"><ListIcon className="size-4 mr-2"/> List</Button>
        </div>
      </motion.div>

      {/* CALENDAR WEEK VIEW */}
      <div className="flex-1 bg-[#0D0B10] rounded-2xl border border-white/10 overflow-hidden flex flex-col relative shadow-2xl shadow-black/50">
        
        {/* NOW Line (Fake realtime line for UI showcase) */}
        <div className="absolute top-[40%] left-0 right-0 h-px bg-[#806C8E]/50 z-10 pointer-events-none flex items-center">
          <div className="size-2 rounded-full bg-[#A895B8] shadow-[0_0_10px_2px_#806C8E] ml-2 animate-pulse" />
          <span className="text-[10px] text-[#A895B8] font-bold ml-1 bg-[#0D0B10] px-1">NOW</span>
        </div>

        <div className="grid grid-cols-7 border-b border-white/5 bg-[#141118]">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-3 text-center border-r border-white/5 last:border-r-0">
              <p className="text-[11px] font-semibold text-[#A7A0AA] uppercase tracking-wider">{format(day, 'EEE')}</p>
              <p className={`text-lg font-bold mt-0.5 ${isToday(day) ? 'text-[#A895B8]' : 'text-white'}`}>
                {format(day, 'dd')}
              </p>
            </div>
          ))}
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 flex-1 overflow-y-auto custom-scrollbar">
            {weekDays.map(day => {
              const dayPosts = posts.filter(p => isSameDay(new Date(p.scheduled_at), day)).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
              
              return (
                <DroppableColumn key={day.toISOString()} date={day}>
                  {dayPosts.map(post => (
                    <DraggablePost 
                      key={post.id} 
                      post={post} 
                      onClick={() => {
                        setSelectedPost(post)
                        setShowSidePanel(true)
                      }} 
                    />
                  ))}
                  
                  {/* Empty state for the day */}
                  {dayPosts.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Link href="/create">
                        <Button variant="ghost" size="icon" className="size-8 rounded-full bg-white/5 hover:bg-[#806C8E] hover:text-white text-[#A7A0AA] border-0">
                          <Plus className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </DroppableColumn>
              )
            })}
          </div>
          <DragOverlay>
             {/* Simple overlay when dragging */}
             <div className="w-48 h-24 bg-[#141118] border border-[#A895B8] rounded-xl opacity-80 shadow-2xl" />
          </DragOverlay>
        </DndContext>
      </div>

      {/* SIDE PANEL */}
      <AnimatePresence>
        {showSidePanel && selectedPost && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowSidePanel(false)}
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0D0B10] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-semibold">Chi Tiết Bài Viết</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSidePanel(false)} className="rounded-full hover:bg-white/10 border-0">
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedPost.media_urls && selectedPost.media_urls.length > 0 && (
                  <div className="w-full aspect-video rounded-xl bg-black overflow-hidden border border-white/10">
                    <img src={selectedPost.media_urls[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-[#806C8E]/20 text-[#A895B8] border-none uppercase tracking-wide text-[10px]">
                      {selectedPost.status}
                    </Badge>
                    <span className="text-xs text-[#A7A0AA] flex items-center">
                      <Clock className="size-3 mr-1" />
                      {format(new Date(selectedPost.scheduled_at), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141118] border border-white/5 text-sm whitespace-pre-wrap leading-relaxed text-[#F5F2F7]">
                    {selectedPost.content}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#050406] flex gap-3">
                <Button 
                  onClick={() => router.push("/create")} 
                  className="flex-1 bg-[#806C8E] hover:bg-[#A895B8] text-white border-0"
                >
                  Chỉnh sửa
                </Button>
                <Button 
                  onClick={() => handleDeletePost(selectedPost.id)}
                  variant="destructive" 
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0"
                >
                  Xóa bài
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI SCHEDULER MODAL */}
      <Dialog open={showAIModal} onOpenChange={(open) => {
        setShowAIModal(open)
        if (!open) setAiStrategy(null)
      }}>
        <DialogContent className="sm:max-w-[600px] bg-[#0D0B10] border-white/10 text-[#F5F2F7]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="size-5 text-purple-400" />
              AI Scheduling Assistant
            </DialogTitle>
            <DialogDescription className="text-[#A7A0AA]">
              Để AI tự động lên lịch trình các bài viết phù hợp nhất cho tuần này.
            </DialogDescription>
          </DialogHeader>

          {!aiStrategy ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lĩnh vực / Ngành hàng</Label>
                <Input 
                  placeholder="VD: Thời trang nữ công sở..." 
                  value={aiNiche} onChange={e => setAiNiche(e.target.value)}
                  className="bg-[#141118] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Đối tượng khách hàng</Label>
                <Input 
                  placeholder="VD: Nữ 25-35 tuổi, dân văn phòng..." 
                  value={aiAudience} onChange={e => setAiAudience(e.target.value)}
                  className="bg-[#141118] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Số bài đăng trong tuần</Label>
                <Input 
                  type="number" min="1" max="14"
                  value={aiPostsCount} onChange={e => setAiPostsCount(e.target.value)}
                  className="bg-[#141118] border-white/10"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="flex gap-2 flex-wrap mb-4">
                {aiStrategy.pillars?.map((pillar: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="bg-[#806C8E]/20 text-[#A895B8] border-[#806C8E]/30">
                    {pillar}
                  </Badge>
                ))}
              </div>
              <div className="space-y-3">
                {aiStrategy.calendar?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-[#141118] p-3 rounded-xl border border-white/5 flex gap-4 items-start">
                    <div className="text-center min-w-[60px] bg-white/5 p-2 rounded-lg">
                      <p className="text-xs text-[#A7A0AA]">{item.day}</p>
                      <p className="text-sm font-bold text-white">{item.time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.topic}</p>
                      <p className="text-xs text-[#A895B8] mt-1">Mục tiêu: {item.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            {!aiStrategy ? (
              <Button 
                onClick={handleGenerateStrategy} 
                disabled={isGeneratingAI || !aiNiche || !aiAudience}
                className="w-full bg-[#806C8E] hover:bg-[#A895B8] text-white border-0"
              >
                {isGeneratingAI ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
                Generate Schedule
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setAiStrategy(null)} className="flex-1 bg-transparent border-white/10 hover:bg-white/5">
                  Làm lại
                </Button>
                <Button 
                  onClick={handleApplyStrategy} 
                  disabled={isGeneratingAI}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                >
                  {isGeneratingAI ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                  Apply Schedule
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  )
}
