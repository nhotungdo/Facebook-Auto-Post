"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, MoreHorizontal, Plus, Image as ImageIcon } from "lucide-react"
import { Facebook } from "@/components/icons"

const scheduledPosts = [
  {
    id: 1,
    date: "Hôm nay, 16/08",
    posts: [
      {
        time: "19:30",
        title: "Khuyến mãi thời trang nam tháng 8",
        content: "🎉 ƯU ĐÃI ĐẶC BIỆT THÁNG 8 🎉\nGiảm đến 30% cho tất cả sản phẩm thời trang nam tại cửa hàng!...",
        status: "Ready",
        platform: "Facebook",
        page: "ABC Store"
      },
      {
        time: "21:00",
        title: "Giới thiệu áo thun polo mới",
        content: "Mẫu áo thun polo mới nhất đã cập bến. Chất liệu cotton thoáng mát, form chuẩn...",
        status: "Generating",
        platform: "Facebook",
        page: "XYZ Brand"
      }
    ]
  },
  {
    id: 2,
    date: "Ngày mai, 17/08",
    posts: [
      {
        time: "09:00",
        title: "Chào ngày mới",
        content: "Bắt đầu ngày mới đầy năng lượng cùng ABC Store. Đừng quên chúng tôi đang có chương trình...",
        status: "Draft",
        platform: "Facebook",
        page: "ABC Store"
      }
    ]
  }
]

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Lịch đăng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các bài viết do AI tạo sắp tới.
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4" />
          Tạo bài viết
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Timeline View */}
        <div className="space-y-8">
          {scheduledPosts.map((group) => (
            <div key={group.id} className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
                <CalendarIcon className="size-5 text-primary" />
                {group.date}
              </h2>
              
              <div className="space-y-4">
                {group.posts.map((post, idx) => (
                  <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      {/* Left: Time & Status */}
                      <div className="p-4 bg-muted/20 border-b sm:border-b-0 sm:border-r border-border/50 flex flex-col items-center justify-center min-w-[120px] gap-2">
                        <div className="text-xl font-bold tracking-tight">{post.time}</div>
                        <Badge 
                          variant={post.status === 'Ready' ? 'default' : (post.status === 'Generating' ? 'secondary' : 'outline')}
                          className={post.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        >
                          {post.status}
                        </Badge>
                      </div>
                      
                      {/* Right: Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {post.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Facebook className="size-3.5 text-blue-500" />
                            <span className="font-medium">{post.page}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="size-3.5" />
                            <span>1 Hình ảnh</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Mini-Calendar or Stats */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Trạng thái chờ</CardTitle>
              <CardDescription>Tổng quan các bài đã lên lịch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tổng số</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-500">Sẵn sàng đăng</span>
                <span className="font-bold text-emerald-500">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-500">AI Đang tạo</span>
                <span className="font-bold text-amber-500">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bản nháp</span>
                <span className="font-bold">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
