import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot, Clock, CalendarDays, CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react";

export default function ScheduleDocsPage() {
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
                <Link href="/docs/connect" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <Bot className="w-4 h-4" />
                  Kết nối Fanpage
                </Link>
                <Link href="/docs/ai-content" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Trợ lý AI tạo Content
                </Link>
                <Link href="/docs/schedule" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <CalendarClock className="w-4 h-4 text-green-500" />
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
            <span className="text-techdy-text-primary font-medium">Lên lịch bài viết tự động</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Lên lịch bài viết tự động
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-8">
            <p className="text-[18px]">
              Tính năng Lên lịch (Scheduling) giúp bạn thiết lập một "lịch phát sóng" hoàn hảo. Hệ thống worker chạy ngầm 24/7 của chúng tôi sẽ thay bạn ấn nút Đăng bài (Publish) một cách chính xác từng phút.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  Cách chọn thời gian đăng bài
                </h3>
                <p className="mb-4">
                  Trong màn hình soạn thảo bài viết, thay vì bấm <strong>"Đăng ngay"</strong>, bạn có thể chọn <strong>"Lên lịch" (Schedule)</strong>.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Chọn ngày & giờ:</strong> Sử dụng công cụ lịch (Date picker) để thiết lập thời gian mong muốn. Hệ thống mặc định lấy múi giờ theo trình duyệt của bạn (VD: GMT+7 cho Việt Nam).</li>
                  <li><strong>Đồng ý lưu:</strong> Bài viết sẽ chuyển sang trạng thái chờ.</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  Hiểu về Trạng thái bài viết (Status)
                </h3>
                <p className="mb-4">
                  Một bài viết trên hệ thống sẽ trải qua các vòng đời (lifecycle) sau đây:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-lg">
                    <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-[12px] font-bold rounded mt-1 shrink-0 w-20 text-center">DRAFT</div>
                    <p className="text-[14px]">Bản nháp. Bài viết đang được soạn thảo hoặc chờ bạn duyệt, hệ thống sẽ KHÔNG tự động đăng bản nháp này.</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-lg">
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[12px] font-bold rounded mt-1 shrink-0 w-20 text-center">READY</div>
                    <p className="text-[14px]">Sẵn sàng. Bạn đã chốt lịch, bài viết đang chờ tới giờ xuất bản (Worker sẽ quét các bài ở trạng thái này mỗi phút).</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-lg">
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-[12px] font-bold rounded mt-1 shrink-0 w-20 text-center">PUBLISHED</div>
                    <p className="text-[14px]">Thành công. Bài viết đã được đẩy lên Facebook an toàn.</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-lg">
                    <div className="px-2 py-1 bg-red-500/20 text-red-400 text-[12px] font-bold rounded mt-1 shrink-0 w-20 text-center">FAILED</div>
                    <p className="text-[14px]">Thất bại. Token Facebook hết hạn hoặc lỗi mạng. Bạn có thể kiểm tra lỗi trong mục Lịch sử và Đăng lại.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-[24px] font-semibold text-techdy-text-primary mt-12 mb-4 pb-2 border-b border-techdy-border-default">
              Xử lý các tình huống thường gặp
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-techdy-border-default rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h4 className="font-semibold text-techdy-text-primary text-[14px]">Đổi ý muốn huỷ lịch?</h4>
                </div>
                <p className="text-[14px]">Miễn là bài viết chưa tới giờ đăng (Trạng thái vẫn là READY), bạn có thể ấn "Chỉnh sửa" và đổi trạng thái về DRAFT để huỷ lệnh đăng.</p>
              </div>
              <div className="p-4 border border-techdy-border-default rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h4 className="font-semibold text-techdy-text-primary text-[14px]">Mẹo khung giờ vàng</h4>
                </div>
                <p className="text-[14px]">Hãy tận dụng lịch đăng bài vào lúc 19:00 - 21:00 tối các ngày trong tuần - thời điểm lượng người online trên Facebook đạt đỉnh.</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-8">
              <p className="text-blue-400 text-[14px] flex gap-3">
                <span className="font-bold shrink-0">💡 PRO TIP:</span>
                Thay vì làm việc mỗi ngày, bạn có thể dành ra 1 giờ vào Chủ Nhật để AI tạo và lên lịch cho toàn bộ 7 ngày trong tuần tiếp theo.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/docs/ai-content"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-techdy-text-secondary text-[14px] font-medium rounded-techdy-xs hover:text-techdy-text-primary hover:bg-techdy-surface-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước: Trợ lý AI tạo Content
            </Link>
            <Link 
              href="/docs/analytics"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Tiếp theo: Phân tích hiệu suất
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
