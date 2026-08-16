"use client"

import * as React from "react"
import { Sparkles, CalendarIcon, Image as ImageIcon, Save } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CreatePost() {
  const [content, setContent] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setContent("🎉 ƯU ĐÃI ĐẶC BIỆT THÁNG 8 🎉\n\nGiảm đến 30% cho tất cả sản phẩm thời trang nam tại cửa hàng!\nBộ sưu tập mới nhất với chất liệu premium, kiểu dáng thời thượng đã lên kệ.\n\n👉 Xem ngay tại link bên dưới hoặc inbox để được tư vấn.\n\n#Fashion #Menswear #KhuyenMaiThang8")
      setIsGenerating(false)
    }, 1500)
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
                  />
                  <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
                    {isGenerating ? <Sparkles className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    Tạo bài
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giọng văn</Label>
                  <Select defaultValue="professional">
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
                  <Select defaultValue="page1">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page1">ABC Store</SelectItem>
                      <SelectItem value="page2">XYZ Brand</SelectItem>
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

              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label>Hình ảnh / Video</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/10 transition-colors cursor-pointer">
                  <ImageIcon className="size-8 mb-2 opacity-50" />
                  <p className="text-sm">Nhấn để tải lên hoặc kéo thả</p>
                  <p className="text-xs opacity-70">Định dạng PNG, JPG hoặc MP4</p>
                </div>
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
              <div className="p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">ABC Store</p>
                    <p className="text-xs text-muted-foreground">Vừa xong • 🌍</p>
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap mb-3">
                  {content || "Nội dung bài viết sẽ hiển thị tại đây..."}
                </div>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center border border-border">
                  <ImageIcon className="size-10 text-muted-foreground/30" />
                </div>
                <div className="flex items-center justify-between border-t border-b border-border mt-3 py-1 px-4 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8"><span className="text-xs">Thích</span></Button>
                  <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8"><span className="text-xs">Bình luận</span></Button>
                  <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8"><span className="text-xs">Chia sẻ</span></Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 flex-col gap-3 p-4">
              <div className="flex w-full items-center gap-2">
                <Input type="datetime-local" className="flex-1" />
              </div>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1"><Save className="size-4 mr-2" /> Lưu nháp</Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"><CalendarIcon className="size-4 mr-2" /> Lên lịch</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
