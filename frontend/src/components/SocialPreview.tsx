import * as React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image as ImageIcon } from "lucide-react"

interface SocialPreviewProps {
  pageName?: string
  content?: string
  mediaUrl?: string
}

export function SocialPreview({ 
  pageName = "ABC Store", 
  content = "", 
  mediaUrl 
}: SocialPreviewProps) {
  return (
    <div className="p-4 bg-background">
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{pageName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{pageName}</p>
          <p className="text-xs text-muted-foreground">Vừa xong • 🌍</p>
        </div>
      </div>
      <div className="text-sm whitespace-pre-wrap mb-3">
        {content || "Nội dung bài viết sẽ hiển thị tại đây..."}
      </div>
      
      {mediaUrl ? (
        <div className="rounded-md overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl} alt="Post media" className="w-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center border border-border">
          <ImageIcon className="size-10 text-muted-foreground/30" />
        </div>
      )}
      
      <div className="flex items-center justify-between border-t border-b border-border mt-3 py-1 px-4 text-muted-foreground">
        <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8">
          <span className="text-xs font-semibold">Thích</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8">
          <span className="text-xs font-semibold">Bình luận</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-8">
          <span className="text-xs font-semibold">Chia sẻ</span>
        </Button>
      </div>
    </div>
  )
}
