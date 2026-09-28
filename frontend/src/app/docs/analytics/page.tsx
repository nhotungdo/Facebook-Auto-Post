import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot, Activity, Users, ThumbsUp, ChevronLeft, Rocket } from "lucide-react";

export default function AnalyticsDocsPage() {
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
                <Link href="/docs/schedule" className="flex items-center gap-2 px-3 py-2 text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary hover:bg-techdy-surface-muted/50 rounded-[6px] transition-colors">
                  <CalendarClock className="w-4 h-4" />
                  Lên lịch bài viết tự động
                </Link>
                <Link href="/docs/analytics" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <LineChart className="w-4 h-4 text-purple-500" />
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
            <span className="text-techdy-text-primary font-medium">Phân tích hiệu suất</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Phân tích hiệu suất bài đăng
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-8">
            <p className="text-[18px]">
              Việc tạo ra nội dung liên tục là không đủ nếu bạn không biết nội dung đó có hiệu quả hay không. AI Social Agent đi kèm với hệ thống Analytics tự động đồng bộ hoá dữ liệu từ Facebook về Dashboard của bạn.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Đồng bộ dữ liệu tự động
                </h3>
                <p className="mb-4">
                  Hệ thống phân tích của chúng tôi (sử dụng Celery worker ngầm) sẽ tự động quét các bài viết ở trạng thái <strong className="text-green-500">PUBLISHED</strong>. Dữ liệu sẽ được cập nhật định kỳ (mỗi giờ) nhằm mang lại các chỉ số chính xác nhất mà bạn không cần phải thực hiện thao tác thủ công nào.
                </p>
              </div>

              {/* Metrics Table */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-purple-500" />
                  Các chỉ số chính được đo lường
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-techdy-text-primary">Lượt tiếp cận (Reach)</h4>
                    </div>
                    <p className="text-[14px]">Tổng số người dùng (Unique users) nhìn thấy bài viết của bạn trên News Feed của họ. Chỉ số này phản ánh mức độ lan truyền của nội dung.</p>
                  </div>

                  <div className="p-4 bg-techdy-surface-muted border border-techdy-border-default rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                        <ThumbsUp className="w-4 h-4 text-pink-500" />
                      </div>
                      <h4 className="font-semibold text-techdy-text-primary">Tương tác (Engagement)</h4>
                    </div>
                    <p className="text-[14px]">Bao gồm số lượt Thích, Chia sẻ, Bình luận và Click chuột vào bài đăng. Đây là thước đo chất lượng của thông điệp mà bạn truyền tải.</p>
                  </div>
                </div>
              </div>

              {/* AI Feedback Loop */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-500" />
                  Tối ưu hoá AI bằng Lịch sử hiệu suất
                </h3>
                <p className="mb-4">
                  Dữ liệu Analytics không chỉ để hiển thị biểu đồ đẹp mắt! Khi bạn yêu cầu tạo nội dung (Content Strategy), hệ thống AI Strategist của chúng tôi có khả năng đọc lại <strong>&quot;Lịch sử hiệu suất&quot;</strong> các bài đăng trước đây.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>AI sẽ tự động nhận diện xem bài đăng với giọng văn nào (Hài hước hay Chuyên nghiệp) mang lại nhiều <em>Tương tác</em> hơn.</li>
                  <li>Phát hiện khung giờ đăng bài có <em>Reach</em> cao nhất từ các số liệu quá khứ.</li>
                  <li>Tự động đề xuất chủ đề tương tự (Content Pillars) để tiếp tục phát huy hiệu quả.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 mt-8">
              <p className="text-purple-400 text-[14px] flex gap-3">
                <span className="font-bold shrink-0">🚀 KẾT LUẬN:</span>
                Vòng lặp: &quot;Lên ý tưởng → Đăng bài → Phân tích hiệu suất → AI Học hỏi&quot; giúp Fanpage của bạn không ngừng cải thiện mỗi ngày.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/docs/schedule"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-techdy-text-secondary text-[14px] font-medium rounded-techdy-xs hover:text-techdy-text-primary hover:bg-techdy-surface-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước: Lên lịch bài viết
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Đến Bảng điều khiển (Dashboard)
              <Rocket className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
