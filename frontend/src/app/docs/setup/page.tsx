import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot, CheckCircle2, ChevronLeft } from "lucide-react";

export default function SetupDocsPage() {
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
                <Link href="/docs" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <FileText className="w-4 h-4" />
                  Giới thiệu chung
                </Link>
                <Link href="/docs/setup" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <BookOpen className="w-4 h-4 text-blue-500" />
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
            <Link href="/docs" className="hover:text-techdy-text-primary transition-colors">Tài liệu</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Bắt đầu</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-techdy-text-primary font-medium">Hướng dẫn cài đặt ban đầu</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Hướng dẫn cài đặt ban đầu
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-8">
            <p className="text-[18px]">
              Để bắt đầu tự động hoá Fanpage của bạn bằng AI Social Agent, bạn chỉ cần thực hiện 3 bước đơn giản dưới đây. Toàn bộ quá trình chỉ mất chưa tới 5 phút.
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative pl-10 border-l border-techdy-border-default pb-4">
                <div className="absolute left-[-17px] top-0 bg-techdy-surface-base text-techdy-text-primary font-bold w-8 h-8 rounded-full border-2 border-techdy-border-default flex items-center justify-center text-[14px]">
                  1
                </div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-2">Tạo tài khoản và Workspace</h3>
                <p className="mb-4">
                  Đầu tiên, bạn cần đăng ký một tài khoản trên hệ thống của chúng tôi. Sau khi đăng ký thành công, bạn sẽ được yêu cầu tạo một <strong>Workspace (Không gian làm việc)</strong>. 
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Truy cập vào trang <Link href="/register" className="text-blue-400 hover:underline">Đăng ký</Link>.</li>
                  <li>Sử dụng Email hoặc đăng nhập nhanh bằng tài khoản Google.</li>
                  <li>Nhập tên Workspace (Ví dụ: <em>Công ty ABC</em> hoặc <em>Thương hiệu cá nhân</em>).</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="relative pl-10 border-l border-techdy-border-default pb-4">
                <div className="absolute left-[-17px] top-0 bg-techdy-surface-base text-techdy-text-primary font-bold w-8 h-8 rounded-full border-2 border-techdy-border-default flex items-center justify-center text-[14px]">
                  2
                </div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-2">Kết nối với Facebook Fanpage</h3>
                <p className="mb-4">
                  Để AI có thể tự động đăng bài, bạn cần cấp quyền truy cập Fanpage cho hệ thống. Chúng tôi tuân thủ nghiêm ngặt chính sách bảo mật của Meta và chỉ sử dụng quyền này để đăng bài thay bạn.
                </p>
                <div className="bg-techdy-surface-muted border border-techdy-border-default rounded-xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-techdy-text-primary font-medium">Quyền lợi khi kết nối:</span>
                  </div>
                  <ul className="space-y-2 text-[14px] ml-8">
                    <li>✓ Lấy danh sách Fanpage bạn đang quản trị.</li>
                    <li>✓ Cấp quyền xuất bản nội dung (Publish Content).</li>
                    <li>✓ Theo dõi thông số tương tác (Insights).</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-10 border-l border-transparent">
                <div className="absolute left-[-17px] top-0 bg-techdy-surface-base text-techdy-text-primary font-bold w-8 h-8 rounded-full border-2 border-techdy-border-default flex items-center justify-center text-[14px]">
                  3
                </div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-2">Thiết lập mục tiêu Content</h3>
                <p className="mb-4">
                  Sau khi kết nối Fanpage, hãy định hướng cho trợ lý AI biết bạn muốn viết về chủ đề gì, giọng văn (tone) như thế nào.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Giọng văn (Tone):</strong> Chuyên nghiệp, hài hước, truyền cảm hứng, hay chia sẻ kiến thức.</li>
                  <li><strong>Mục tiêu:</strong> Tăng nhận diện thương hiệu, bán hàng, hay thu hút bình luận.</li>
                </ul>
                <p className="mt-4 italic text-[14px] text-techdy-text-secondary">
                  Lưu ý: Bạn luôn có thể chỉnh sửa các thiết lập này trong quá trình sử dụng ở mục Cài đặt AI.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-8">
              <p className="text-green-400 text-[14px] flex gap-3">
                <span className="font-bold shrink-0">🎉 HOÀN TẤT:</span>
                Bạn đã sẵn sàng để tạo bài viết đầu tiên hoàn toàn bằng AI!
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex items-center justify-between">
            <Link 
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 text-techdy-text-secondary text-[14px] font-medium rounded-techdy-xs hover:text-techdy-text-primary hover:bg-techdy-surface-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước: Giới thiệu chung
            </Link>
            <Link 
              href="/docs/connect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Tiếp theo: Kết nối Fanpage
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
