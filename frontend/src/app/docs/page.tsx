import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-techdy-surface-base text-techdy-text-primary font-inter font-[400] selection:bg-techdy-surface-muted flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-techdy-border-default bg-techdy-surface-raised shadow-techdy-1 backdrop-blur-md">
        <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 -ml-2 text-techdy-text-secondary hover:text-techdy-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-techdy-text-primary rounded-techdy-xs"
              aria-label="Quay lại trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-techdy-border-default hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-techdy-xs bg-techdy-text-inverse flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-techdy-surface-base" />
              </div>
              <span className="text-[20px] font-semibold text-techdy-text-primary">Tài liệu hướng dẫn</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-[14px] leading-[20px] text-techdy-text-secondary hover:text-techdy-text-primary transition-[color] duration-[150ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary rounded-[4px]"
            >
              Đi đến Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex container mx-auto px-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0 border-r border-techdy-border-default py-8 pr-6 overflow-y-auto sticky top-[72px] h-[calc(100vh-72px)]">
          <div className="space-y-8">
            <div>
              <h4 className="text-[12px] font-semibold text-techdy-text-secondary uppercase tracking-wider mb-4">Bắt đầu</h4>
              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Giới thiệu chung
                </Link>
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Hướng dẫn cài đặt ban đầu
                </Link>
              </nav>
            </div>
            
            <div>
              <h4 className="text-[12px] font-semibold text-techdy-text-secondary uppercase tracking-wider mb-4">Tính năng cốt lõi</h4>
              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <Bot className="w-4 h-4" />
                  Kết nối Fanpage
                </Link>
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Trợ lý AI tạo Content
                </Link>
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <CalendarClock className="w-4 h-4" />
                  Lên lịch bài viết tự động
                </Link>
                <Link href="#" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <LineChart className="w-4 h-4" />
                  Phân tích hiệu suất (Analytics)
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 py-10 lg:pl-12 max-w-3xl">
          <div className="flex items-center gap-2 text-[14px] text-techdy-text-secondary mb-6">
            <span>Tài liệu</span>
            <ChevronRight className="w-4 h-4" />
            <span>Bắt đầu</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-techdy-text-primary font-medium">Giới thiệu chung</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Giới thiệu chung về AI Social Agent
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-6">
            <p className="text-[20px] text-techdy-text-primary font-medium">
              Chào mừng bạn đến với tài liệu hướng dẫn sử dụng hệ thống tự động hoá Facebook Page bằng Trí tuệ nhân tạo.
            </p>

            <p>
              AI Social Agent là một nền tảng toàn diện giúp bạn quản lý nội dung mạng xã hội mà không tốn nhiều công sức. Bằng cách kết hợp sức mạnh của <strong>Generative AI (Trí tuệ nhân tạo tạo sinh)</strong> và API chính thức của Facebook, hệ thống cho phép bạn tự động hóa hoàn toàn luồng công việc từ lúc lên ý tưởng đến khi bài viết được xuất bản và phân tích.
            </p>

            <h2 className="text-[24px] font-semibold text-techdy-text-primary mt-10 mb-4 pb-2 border-b border-techdy-border-default">
              Hệ thống có thể làm được gì?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
                <Sparkles className="w-6 h-6 text-blue-500 mb-3" />
                <h3 className="text-[16px] font-semibold text-techdy-text-primary mb-2">Tạo Content tự động</h3>
                <p className="text-[14px]">Viết bài chuẩn SEO, đúng văn phong thương hiệu dựa trên các prompt được tối ưu sẵn.</p>
              </div>
              <div className="p-5 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
                <CalendarClock className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="text-[16px] font-semibold text-techdy-text-primary mb-2">Lên lịch & Xuất bản</h3>
                <p className="text-[14px]">Đặt lịch đăng bài trước hàng tuần, hệ thống sẽ tự động gọi Facebook API đúng giờ.</p>
              </div>
            </div>

            <h2 className="text-[24px] font-semibold text-techdy-text-primary mt-10 mb-4 pb-2 border-b border-techdy-border-default">
              Đối tượng sử dụng
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chủ doanh nghiệp nhỏ (SMEs):</strong> Tiết kiệm chi phí thuê nhân sự quản lý fanpage.</li>
              <li><strong>Marketing Agency:</strong> Tự động hoá công việc quản lý hàng tá fanpage của khách hàng.</li>
              <li><strong>Cá nhân xây dựng thương hiệu (Creators):</strong> Duy trì tần suất đăng bài liên tục một cách nhàn rỗi.</li>
            </ul>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-8">
              <p className="text-blue-400 text-[14px] flex gap-3">
                <span className="font-bold shrink-0">💡 MẸO NHỎ:</span>
                Bạn chỉ cần kết nối Fanpage 1 lần duy nhất, sau đó AI sẽ thay bạn làm tất cả phần việc còn lại.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex items-center justify-between">
            <div className="text-techdy-text-secondary text-[14px]">Bạn chưa tìm thấy thông tin mình cần?</div>
            <Link 
              href="/docs/setup"
              className="inline-flex items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Tiếp theo: Hướng dẫn cài đặt
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
