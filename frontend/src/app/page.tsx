"use client"

import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, Sparkles, Clock, BarChart3, Bot } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const openAuth = (view: "login" | "register") => {
    setAuthView(view);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-techdy-surface-base text-techdy-text-primary font-inter font-[400] selection:bg-techdy-surface-muted flex flex-col">
      <AuthModal 
        isOpen={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        defaultView={authView} 
      />
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-techdy-border-default bg-techdy-surface-raised shadow-techdy-1 backdrop-blur-md">
        <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-techdy-xs bg-techdy-text-inverse flex items-center justify-center">
              <Bot className="w-5 h-5 text-techdy-surface-base" />
            </div>
            <span className="text-[20px] font-semibold text-techdy-text-primary">AI Social Agent</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-[32px]">
            <Link 
              href="#features" 
              className="text-[16px] leading-[24px] text-techdy-text-secondary hover:text-techdy-text-primary transition-[color] duration-[150ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary rounded-[4px]"
            >
              Tính năng
            </Link>
            <Link 
              href="/docs" 
              className="text-[16px] leading-[24px] text-techdy-text-secondary hover:text-techdy-text-primary transition-[color] duration-[150ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary rounded-[4px]"
            >
              Tài liệu
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => openAuth("login")}
              className="text-[16px] leading-[24px] text-techdy-text-primary hover:text-techdy-text-secondary transition-[color] duration-[150ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary rounded-[4px]"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => openAuth("register")}
              className="inline-flex items-center justify-center h-[44px] px-[24px] py-[16px] text-[16px] leading-[24px] bg-techdy-text-inverse text-techdy-surface-base rounded-techdy-xs hover:opacity-90 active:scale-98 transition-all duration-[200ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
            >
              Bắt đầu ngay
            </button>
          </div>

          <button className="md:hidden p-2 text-techdy-text-primary focus-visible:outline-2 focus-visible:outline-techdy-text-primary rounded-[4px]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-6 py-[80px] md:py-[120px] max-w-5xl mx-auto">
        <h1 className="text-[clamp(40px,8vw,96px)] leading-[1.1] font-bold text-techdy-text-primary tracking-tight mb-[24px]">
          Tự động hoá Fanpage <br className="hidden md:block" /> với <span className="text-blue-500">Trí tuệ nhân tạo</span>
        </h1>
        <p className="text-[20px] leading-[1.5] text-techdy-text-secondary max-w-2xl mb-[40px]">
          Tạo và lên lịch bài viết hoàn toàn tự động nhờ sức mạnh của AI. Tiết kiệm thời gian, duy trì tương tác và phát triển thương hiệu của bạn một cách tối ưu nhất.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full sm:w-auto mb-[60px]">
          <button 
            onClick={() => openAuth("register")}
            className="inline-flex w-full sm:w-auto items-center justify-center h-[44px] px-[24px] py-[16px] text-[16px] leading-[24px] bg-techdy-text-inverse text-techdy-surface-base rounded-techdy-xs hover:opacity-90 active:scale-98 transition-all duration-[200ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
          >
            Bắt đầu miễn phí
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          <Link 
            href="/docs" 
            className="inline-flex w-full sm:w-auto items-center justify-center h-[44px] px-[24px] py-[16px] text-[16px] leading-[24px] bg-techdy-surface-muted text-techdy-text-primary border border-techdy-border-default rounded-techdy-xs hover:bg-techdy-border-muted active:scale-98 transition-all duration-[200ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-techdy-text-primary"
          >
            Xem Hướng dẫn
          </Link>
        </div>

        {/* Feature Highlights */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <div className="p-6 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-[18px] font-semibold text-techdy-text-primary mb-2">Tạo Content bằng AI</h3>
            <p className="text-[14px] text-techdy-text-secondary leading-relaxed">
              Tự động soạn thảo nội dung hấp dẫn, thu hút người dùng dựa trên mục tiêu chiến dịch của bạn.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-[18px] font-semibold text-techdy-text-primary mb-2">Lên lịch thông minh</h3>
            <p className="text-[14px] text-techdy-text-secondary leading-relaxed">
              Chọn thời gian và chiến lược đăng bài, hệ thống sẽ tự động xuất bản đúng giờ trên Facebook.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-techdy-surface-muted border border-techdy-border-default">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-[18px] font-semibold text-techdy-text-primary mb-2">Phân tích hiệu suất</h3>
            <p className="text-[14px] text-techdy-text-secondary leading-relaxed">
              Theo dõi lượt tiếp cận, tương tác để liên tục cải thiện chất lượng nội dung bằng AI.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-techdy-border-default bg-techdy-surface-muted mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-techdy-xs bg-techdy-text-inverse flex items-center justify-center">
                  <Bot className="w-3 h-3 text-techdy-surface-base" />
                </div>
                <span className="text-[18px] font-semibold text-techdy-text-primary">AI Social Agent</span>
              </div>
              <p className="text-[14px] text-techdy-text-secondary max-w-sm">
                Giải pháp toàn diện giúp doanh nghiệp tự động hoá quy trình quản lý và phát triển nội dung trên Facebook bằng công nghệ Trí tuệ nhân tạo.
              </p>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-techdy-text-primary mb-4 uppercase tracking-wider">Sản phẩm</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Tính năng</Link></li>
                <li><Link href="#" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Bảng giá</Link></li>
                <li><Link href="#" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Cập nhật mới</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-techdy-text-primary mb-4 uppercase tracking-wider">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Tài liệu</Link></li>
                <li><Link href="#" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Liên hệ</Link></li>
                <li><Link href="#" className="text-[14px] text-techdy-text-secondary hover:text-techdy-text-primary">Điều khoản & Bảo mật</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-techdy-border-default pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[14px] text-techdy-text-secondary">
              &copy; {new Date().getFullYear()} AI Social Agent. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-techdy-text-secondary hover:text-techdy-text-primary">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
