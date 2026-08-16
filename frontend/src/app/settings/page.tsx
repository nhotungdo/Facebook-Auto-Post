"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Link as LinkIcon, Save, Settings as SettingsIcon, BrainCircuit } from "lucide-react"
import { Facebook } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
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
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    ABC
                  </div>
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      ABC Store 
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Đã kết nối</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: 104928392819203</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                  Ngắt kết nối
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    XYZ
                  </div>
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      XYZ Brand
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Đã kết nối</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: 593827182938475</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                  Ngắt kết nối
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 pt-4">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <LinkIcon className="size-4" />
                Kết nối Trang mới
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* AI Config Tab */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="size-5 text-primary" />
                Cấu hình OpenAI
              </CardTitle>
              <CardDescription>
                Thiết lập API key để cấp quyền cho Trợ lý AI và Trình tạo nội dung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key của OpenAI</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="openai-key" type="password" placeholder="sk-..." className="pl-9" defaultValue="sk-thisisafakekeyforui123456" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Khóa của bạn được lưu trữ an toàn và không bao giờ được chia sẻ.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model mặc định</Label>
                <Input id="model" defaultValue="gpt-5.6-turbo" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border/50 pt-4">
              <Button className="gap-2">
                <Save className="size-4" />
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
