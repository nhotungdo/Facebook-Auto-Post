import * as React from "react"
import { Calendar, Settings, PenTool, LayoutDashboard, History, Sparkles } from "lucide-react"
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
} from "@/components/ui/sidebar"

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
    title: "AI Studio",
    url: "/studio",
    icon: Sparkles,
  },
  {
    title: "Lịch đăng",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Lịch sử",
    url: "/history",
    icon: History,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
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
                  <a href={item.url} className="block w-full">
                    <SidebarMenuButton tooltip={item.title} className="hover:bg-accent/50 transition-colors">
                      <item.icon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
