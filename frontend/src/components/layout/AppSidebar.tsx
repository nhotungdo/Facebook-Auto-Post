"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Settings, PenTool, LayoutDashboard, History, Sparkles, LogOut } from "lucide-react"
import { Facebook } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"

// Menu items
const items = [
  {
    title: "Tổng quan",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tạo bài viết",
    url: "/create",
    icon: PenTool,
  },
  {
    title: "Facebook Pages",
    url: "/pages",
    icon: Facebook,
  },
  {
    title: "Lịch đăng (Tháng)",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Sidebar variant="inset" className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold text-lg">Trợ lý AI</span>
          <span className="text-xs text-muted-foreground">Mạng xã hội</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="block w-full">
                    <SidebarMenuButton tooltip={item.title} className="hover:bg-accent/50 transition-colors">
                      <item.icon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors w-full">
              <LogOut className="size-4" />
              <span className="font-medium">Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
