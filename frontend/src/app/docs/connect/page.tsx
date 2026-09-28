import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot, AlertTriangle, Image as ImageIcon, ChevronLeft, Link as LinkIcon } from "lucide-react";

export default function ConnectDocsPage() {
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
                <Link href="/docs/setup" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Hướng dẫn cài đặt ban đầu
                </Link>
              </nav>
            </div>
            
            <div>
              <h4 className="text-[12px] font-semibold text-techdy-text-secondary uppercase tracking-wider mb-4">Tính năng cốt lõi</h4>
              <nav className="space-y-1">
                <Link href="/docs/connect" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <Bot className="w-4 h-4 text-blue-500" />
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
            <span>Tính năng cốt lõi</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-techdy-text-primary font-medium">Kết nối Fanpage</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Kết nối Facebook Fanpage
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-8">
            <p className="text-[18px]">
              Để AI Social Agent có thể tự động đăng bài và phân tích dữ liệu, bước quan trọng nhất là liên kết hệ thống với Fanpage của bạn thông qua Facebook Graph API.
            </p>

            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-8">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-orange-400 font-bold text-[14px] mb-1">Yêu cầu bắt buộc</h4>
                  <p className="text-orange-400/80 text-[14px] leading-relaxed">
                    Bạn phải là <strong>Quản trị viên (Admin)</strong> hoặc <strong>Biên tập viên (Editor)</strong> của Fanpage mới có thể cấp quyền đăng bài. Quyền "Người kiểm duyệt" hoặc "Nhà phân tích" sẽ không thể xuất bản nội dung.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <span className="bg-techdy-surface-muted text-techdy-text-primary w-8 h-8 rounded-full flex items-center justify-center text-[14px] border border-techdy-border-default">1</span>
                  Truy cập trang Quản lý tích hợp
                </h3>
                <p className="mb-4 pl-10">
                  Tại Dashboard của ứng dụng, hãy nhấp vào menu <strong>"Tích hợp" (Integrations)</strong> ở thanh điều hướng bên trái. Sau đó bấm vào nút <strong className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded">Kết nối Facebook</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <span className="bg-techdy-surface-muted text-techdy-text-primary w-8 h-8 rounded-full flex items-center justify-center text-[14px] border border-techdy-border-default">2</span>
                  Xác thực tài khoản Meta
                </h3>
                <p className="mb-4 pl-10">
                  Một cửa sổ pop-up của Facebook sẽ hiện ra yêu cầu bạn đăng nhập (nếu chưa) và xác nhận cấp quyền. Vui lòng bấm <strong>Tiếp tục dưới tên [Tên của bạn]</strong>.
                </p>
                <div className="pl-10">
                  <div className="border border-techdy-border-default bg-techdy-surface-muted rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-70">
                    <ImageIcon className="w-12 h-12 text-techdy-text-secondary mb-4 opacity-50" />
                    <p className="text-[14px]">Minh hoạ: Màn hình xác thực OAuth của Facebook</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <span className="bg-techdy-surface-muted text-techdy-text-primary w-8 h-8 rounded-full flex items-center justify-center text-[14px] border border-techdy-border-default">3</span>
                  Chọn Fanpage cần liên kết
                </h3>
                <p className="mb-4 pl-10">
                  Facebook sẽ hiển thị danh sách tất cả các trang mà bạn đang quản lý. Bạn có thể chọn một hoặc nhiều Fanpage mà bạn muốn AI Social Agent hoạt động.
                </p>
                <ul className="list-disc pl-16 space-y-2 mb-4">
                  <li>Nên chọn <strong>Tất cả các trang</strong> để sau này nếu bạn tạo Fanpage mới, bạn không cần phải xác thực lại.</li>
                  <li>Đảm bảo các quyền như <em>"Tạo và quản lý nội dung trên trang của bạn"</em> đều được gạt sang <strong>Có (Yes)</strong>.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-[24px] font-semibold text-techdy-text-primary mt-12 mb-4 pb-2 border-b border-techdy-border-default">
              Quản lý Fanpage đã kết nối
            </h2>
            <p className="mb-6">
              Sau khi hoàn tất, Fanpage của bạn sẽ xuất hiện trên Dashboard. Tại đây, bạn có thể thiết lập:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                  <Bot className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-semibold text-techdy-text-primary mb-1">Gán Trợ lý AI</h4>
                <p className="text-[14px]">Chọn một Persona (Mẫu giọng văn) cụ thể cho từng Fanpage để AI viết bài chuẩn xác.</p>
              </div>
              <div className="p-5 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                  <LinkIcon className="w-4 h-4 text-red-500" />
                </div>
                <h4 className="font-semibold text-techdy-text-primary mb-1">Ngắt kết nối</h4>
                <p className="text-[14px]">Bạn có thể dừng cấp quyền hoặc xoá liên kết bất cứ lúc nào với 1 click.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/docs/setup"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-techdy-text-secondary text-[14px] font-medium rounded-techdy-xs hover:text-techdy-text-primary hover:bg-techdy-surface-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước: Hướng dẫn cài đặt
            </Link>
            <Link 
              href="/docs/ai-content"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Tiếp theo: Tạo Content bằng AI
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
