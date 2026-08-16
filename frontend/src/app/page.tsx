"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CheckCircle2, Clock, XCircle, BarChart3, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Bài trong ngày",
    value: "12",
    icon: CalendarClock,
    trend: "+2 so với hôm qua",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Đã đăng",
    value: "8",
    icon: CheckCircle2,
    trend: "Tỷ lệ thành công 100%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Chờ đăng",
    value: "4",
    icon: Clock,
    trend: "Bài tiếp theo lúc 19:30",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Lỗi",
    value: "0",
    icon: XCircle,
    trend: "Hệ thống hoạt động tốt",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
]

const upcoming = [
  { time: "19:30", title: "Khuyến mãi tháng 8", status: "Sẵn sàng", platform: "Facebook" },
  { time: "21:00", title: "Giới thiệu bộ sưu tập mới", status: "Đang tạo", platform: "Facebook" },
  { time: "09:00 (Mai)", title: "Chào ngày mới năng lượng", status: "Bản nháp", platform: "Facebook" },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Tổng quan
        </h1>
        <p className="text-muted-foreground mt-1">
          Theo dõi hiệu suất của AI và mạng xã hội.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="size-3 text-emerald-500" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Tổng quan tương tác
            </CardTitle>
            <CardDescription>
              Tương tác trang trong 7 ngày qua.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-border/50 mt-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">Biểu đồ minh họa (Ví dụ: Recharts)</p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Lịch trình sắp tới</CardTitle>
            <CardDescription>Các bài viết đang chờ xuất bản.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-muted-foreground tabular-nums">
                    {item.time}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.platform}</p>
                  </div>
                  <Badge 
                    variant={item.status === 'Sẵn sàng' ? 'default' : 'secondary'}
                    className={item.status === 'Sẵn sàng' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
