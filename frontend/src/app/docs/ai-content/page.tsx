import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, CalendarClock, LineChart, ChevronRight, FileText, Bot, PenTool, Image as ImageIcon, CheckCircle2, ChevronLeft, Type } from "lucide-react";

export default function AiContentDocsPage() {
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
                <Link href="/docs/ai-content" className="flex items-center gap-2 px-3 py-2 text-[14px] bg-techdy-surface-muted text-techdy-text-primary rounded-[6px] font-medium">
                  <Sparkles className="w-4 h-4 text-blue-500" />
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
            <span className="text-techdy-text-primary font-medium">Trợ lý AI tạo Content</span>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-techdy-text-primary mb-6 leading-tight">
            Trợ lý AI tạo Content
          </h1>
          
          <div className="text-[16px] leading-[28px] text-techdy-text-secondary space-y-8">
            <p className="text-[18px]">
              Tính năng mạnh mẽ nhất của AI Social Agent là khả năng tự động soạn thảo và tinh chỉnh nội dung dựa trên công nghệ LLMs tiên tiến. Thay vì mất hàng giờ ngồi viết bài, AI sẽ giúp bạn làm điều đó trong vài giây.
            </p>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-500" />
                  Cung cấp Mục tiêu (Goal)
                </h3>
                <p className="mb-4">
                  Tại màn hình <strong>Tạo bài viết (Create Post)</strong>, bạn chỉ cần nhập ngắn gọn một câu về mục tiêu của bài viết. Hệ thống sẽ sử dụng các prompt kỹ thuật cao (Prompt Engineering) đã được tinh chỉnh sẵn để mở rộng thành một bài viết hoàn chỉnh.
                </p>
                <div className="bg-techdy-surface-muted border border-techdy-border-default rounded-lg p-5">
                  <p className="text-[14px] font-mono text-techdy-text-primary">
                    <span className="text-techdy-text-secondary">Ví dụ nhập:</span> &quot;Giới thiệu sản phẩm cà phê Cold Brew mới ra mắt, nhấn mạnh vào hương vị trái cây tự nhiên và ưu đãi mua 1 tặng 1.&quot;
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-500" />
                  Định hình Giọng văn (Tone of Voice)
                </h3>
                <p className="mb-4">
                  Một thương hiệu luôn cần sự đồng nhất trong giao tiếp. Trợ lý AI cho phép bạn chọn sẵn hoặc tự định nghĩa giọng văn trước khi sinh nội dung.
                </p>
                <ul className="grid grid-cols-2 gap-4 mb-4">
                  <li className="flex items-center gap-2 p-3 bg-techdy-surface-muted border border-techdy-border-default rounded-md text-[14px]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Chuyên nghiệp & Tin cậy
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-techdy-surface-muted border border-techdy-border-default rounded-md text-[14px]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Trẻ trung & Hài hước
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-techdy-surface-muted border border-techdy-border-default rounded-md text-[14px]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Cung cấp kiến thức (Edu)
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-techdy-surface-muted border border-techdy-border-default rounded-md text-[14px]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Thúc đẩy chốt sale (FOMO)
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div>
                <h3 className="text-[20px] font-semibold text-techdy-text-primary mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-500" />
                  Sinh ảnh minh hoạ tự động
                </h3>
                <p className="mb-4">
                  Nếu bạn không có ảnh sản phẩm sẵn, AI Visual Agent sẽ tự động sinh một hình ảnh (dựa trên DALL-E 3) bám sát theo nội dung bài viết. Bạn cũng có thể tải ảnh lên theo ý muốn.
                </p>
              </div>
            </div>

            <h2 className="text-[24px] font-semibold text-techdy-text-primary mt-12 mb-4 pb-2 border-b border-techdy-border-default">
              Xem trước và Chỉnh sửa (Human-in-the-loop)
            </h2>
            <p className="mb-4">
              AI đóng vai trò như một người trợ lý đắc lực, nhưng quyền quyết định cuối cùng vẫn thuộc về bạn. Mọi bài viết được sinh ra sẽ nằm ở trạng thái <strong>Bản nháp (Draft)</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Bạn có thể đọc lại toàn bộ bài viết, thêm hashtag, hoặc điều chỉnh câu chữ trực tiếp trên trình soạn thảo.</li>
              <li>Nếu không ưng ý, bạn có thể bấm <strong>&quot;Viết lại (Regenerate)&quot;</strong> để AI cung cấp một phiên bản khác.</li>
              <li>Sau khi hoàn thiện, bạn mới thực hiện đưa vào danh sách chờ xuất bản (Ready) hoặc Đăng ngay (Publish Now).</li>
            </ul>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 text-[14px] flex gap-3">
                <span className="font-bold shrink-0">💡 PRO TIP:</span>
                Các bài viết được AI sinh ra đều tự động phân tích và ghi nhận lịch sử (Token usage). Bạn có thể theo dõi lượng từ vựng AI đã sử dụng trong mục Cài đặt tài khoản.
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-techdy-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/docs/connect"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 text-techdy-text-secondary text-[14px] font-medium rounded-techdy-xs hover:text-techdy-text-primary hover:bg-techdy-surface-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước: Kết nối Fanpage
            </Link>
            <Link 
              href="/docs/schedule"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-techdy-text-inverse text-techdy-surface-base text-[14px] font-medium rounded-techdy-xs hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Tiếp theo: Lên lịch bài viết
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
