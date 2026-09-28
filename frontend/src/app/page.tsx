"use client"

import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, Sparkles, Clock, BarChart3, Bot, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#050406] text-[#B8B1BC] font-inter flex flex-col selection:bg-[#594F63] selection:text-[#F5F2F7]">
      <AuthModal 
        isOpen={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        defaultView={authView} 
      />
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#29232D] bg-[#0A080C]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#594F63] to-[#806C8E] flex items-center justify-center shadow-[0_0_15px_rgba(111,87,128,0.5)]">
              <Bot className="w-5 h-5 text-[#F5F2F7]" />
            </div>
            <span className="text-[20px] font-semibold text-[#F5F2F7] tracking-tight">AI Social Agent</span>
          </div>


          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => openAuth("login")}
              className="text-[15px] font-medium text-[#B8B1BC] hover:text-[#F5F2F7] transition-colors duration-200"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => openAuth("register")}
              className="inline-flex items-center justify-center h-[40px] px-[20px] text-[15px] font-medium text-[#F5F2F7] rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(137,105,158,0.4)] hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg, #594F63, #806C8E)' }}
            >
              Bắt đầu ngay
            </button>
          </div>

          <button className="md:hidden p-2 text-[#F5F2F7]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center relative overflow-hidden">

        {/* === LAYER 1: Deep background glow === */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
          {/* Giant ambient glow center */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #6E6078 0%, transparent 65%)' }}></div>
        </div>

        {/* === LAYER 2: Floating blobs (darker, denser) === */}
        <div className="absolute pointer-events-none overflow-hidden inset-0 -z-10">
          {/* Big dark purple drifting orb — top left */}
          <div className="absolute top-[0%] left-[-5%] w-[600px] h-[600px] rounded-full animate-drift opacity-40"
            style={{ background: 'radial-gradient(circle, #3D2E4A 0%, transparent 65%)', filter: 'blur(70px)' }}></div>
          {/* Bright violet orb — top right */}
          <div className="absolute top-[5%] right-[-8%] w-[550px] h-[550px] rounded-full animate-blob animation-delay-2000 opacity-50"
            style={{ background: 'radial-gradient(circle, #594F63 0%, transparent 65%)', filter: 'blur(80px)' }}></div>
          {/* Lighter lavender — mid left */}
          <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-full animate-drift animation-delay-4000 opacity-35"
            style={{ background: 'radial-gradient(circle, #857392 0%, transparent 65%)', filter: 'blur(90px)' }}></div>
          {/* Dark mauve — mid right */}
          <div className="absolute top-[45%] right-[5%] w-[380px] h-[380px] rounded-full animate-blob animation-delay-6000 opacity-35"
            style={{ background: 'radial-gradient(circle, #4A3857 0%, transparent 65%)', filter: 'blur(80px)' }}></div>
          {/* Bottom center accent */}
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full animate-drift animation-delay-3000 opacity-30"
            style={{ background: 'radial-gradient(ellipse, #2E2038 0%, transparent 65%)', filter: 'blur(100px)' }}></div>
        </div>

        {/* === LAYER 3: Aurora streaks — horizontal light sweeps === */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[18%] left-0 w-full h-[2px] animate-aurora animation-delay-2000"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #6E6078 30%, #A895B8 50%, #6E6078 70%, transparent 100%)', filter: 'blur(3px)', opacity: 0.4 }}></div>
          <div className="absolute top-[38%] left-0 w-full h-[1px] animate-aurora animation-delay-4000"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #594F63 40%, #806C8E 60%, transparent 100%)', filter: 'blur(2px)', opacity: 0.35 }}></div>
          <div className="absolute top-[65%] left-0 w-full h-[2px] animate-aurora animation-delay-6000"
            style={{ background: 'linear-gradient(90deg, transparent 10%, #857392 40%, #C4AEDE 55%, #857392 70%, transparent 100%)', filter: 'blur(4px)', opacity: 0.3 }}></div>
        </div>

        {/* === LAYER 4: Rotating conic-gradient disk === */}
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-[700px] h-[700px] opacity-10 animate-conic-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent 60deg, #594F63 90deg, #A895B8 130deg, #594F63 160deg, transparent 200deg, #3D2E4A 260deg, transparent 320deg)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}></div>

        {/* === LAYER 5: Spinning purple rings centered behind hero text === */}
        <div className="absolute top-[260px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 0 }}>

          {/* Ring 1 — outermost, slow clockwise spin, dashed border */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full animate-spin-slow"
            style={{ border: '1px solid rgba(89,79,99,0.5)', boxShadow: '0 0 30px 2px rgba(89,79,99,0.15)' }}>
            {/* Dot riding the ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#806C8E] shadow-[0_0_8px_3px_rgba(128,108,142,0.8)]"></div>
          </div>

          {/* Ring 2 — medium, counter-clockwise */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full animate-spin-reverse"
            style={{ border: '1px solid rgba(133,115,146,0.45)', boxShadow: '0 0 20px 1px rgba(133,115,146,0.12)' }}>
            {/* Dot riding the ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#A895B8] shadow-[0_0_12px_4px_rgba(168,149,184,0.9)]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#594F63] shadow-[0_0_8px_3px_rgba(89,79,99,0.7)]"></div>
          </div>

          {/* Ring 3 — inner fast clockwise, purple glow */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full animate-spin-slow animation-delay-3000"
            style={{
              border: '1.5px solid rgba(168,149,184,0.35)',
              boxShadow: '0 0 25px 3px rgba(168,149,184,0.1), inset 0 0 25px 3px rgba(89,79,99,0.05)'
            }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C4AEDE] shadow-[0_0_14px_5px_rgba(196,174,222,0.9)]"></div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#857392] shadow-[0_0_8px_3px_rgba(133,115,146,0.7)]"></div>
          </div>

          {/* Ring 4 — innermost subtle pulse ring */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full animate-ring-pulse"
            style={{ border: '1px solid rgba(196,174,222,0.3)' }}></div>
          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full animate-ring-pulse animation-delay-2000"
            style={{ border: '1px solid rgba(128,108,142,0.2)' }}></div>
        </div>

        {/* === LAYER 4: Floating particles scattered around === */}
        <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
          {[
            { top: '12%', left: '20%', delay: '0s', size: 'w-1 h-1' },
            { top: '18%', right: '22%', delay: '1.5s', size: 'w-1.5 h-1.5' },
            { top: '35%', left: '10%', delay: '2s', size: 'w-1 h-1' },
            { top: '42%', right: '15%', delay: '0.8s', size: 'w-1 h-1' },
            { top: '60%', left: '25%', delay: '3s', size: 'w-1.5 h-1.5' },
            { top: '70%', right: '20%', delay: '1s', size: 'w-1 h-1' },
            { top: '80%', left: '40%', delay: '2.5s', size: 'w-1 h-1' },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.size} rounded-full bg-[#A895B8] animate-float-up`}
              style={{
                top: p.top,
                left: 'left' in p ? p.left : undefined,
                right: 'right' in p ? p.right : undefined,
                animationDelay: p.delay,
                boxShadow: '0 0 6px 2px rgba(168,149,184,0.6)',
              }}
            ></div>
          ))}
        </div>

        {/* HERO CONTENT */}
        <section 
          className="relative z-10 w-full flex flex-col items-center text-center px-6 pt-[140px] pb-[80px] md:pt-[180px] md:pb-[120px]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#100D13]/80 border border-[#594F63]/40 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(89,79,99,0.3)]">
            <Sparkles className="w-4 h-4 text-[#A895B8]" />
            <span className="text-[13px] font-medium text-[#A895B8]">Phiên bản Beta 1.0</span>
          </div>

          <h1 className="text-[clamp(40px,8vw,80px)] leading-[1.1] font-bold text-[#F5F2F7] tracking-tight mb-[24px] max-w-4xl">
            Tự động hoá Fanpage <br className="hidden md:block" /> với sức mạnh <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #C4AEDE, #A895B8, #806C8E)' }}
            >Trí tuệ nhân tạo</span>
          </h1>
          
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-[#B8B1BC] max-w-2xl mb-[48px] font-light">
            Sáng tạo nội dung, lên lịch tự động và tối ưu hóa tương tác hoàn toàn bằng AI. Một trải nghiệm mượt mà, đẳng cấp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full sm:w-auto">
            <button 
              onClick={() => openAuth("register")}
              className="group relative inline-flex w-full sm:w-auto items-center justify-center h-[52px] px-[32px] text-[16px] font-medium text-[#F5F2F7] rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #594F63, #806C8E)' }}
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
              <span className="relative z-10 flex items-center">
                Bắt đầu miễn phí
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <Link 
              href="/docs" 
              className="inline-flex w-full sm:w-auto items-center justify-center h-[52px] px-[32px] text-[16px] font-medium text-[#F5F2F7] bg-[#100D13]/60 border border-[#382F3D] rounded-full hover:bg-[#29232D] hover:border-[#6E6078] transition-all duration-300 backdrop-blur-sm"
            >
              Xem Hướng dẫn
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-[80px] md:py-[120px]">
          {/* Section glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none -z-10 opacity-30"
            style={{ background: 'radial-gradient(ellipse, #594F63, transparent 70%)', filter: 'blur(60px)' }}></div>

          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#F5F2F7] mb-4">Tính năng nổi bật</h2>
            <p className="text-[#817985] text-[16px] max-w-2xl mx-auto">Mọi thứ bạn cần để phát triển thương hiệu trên mạng xã hội, được thiết kế tối giản và tinh tế.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: <Sparkles className="w-6 h-6 text-[#A895B8]" />, title: 'Tạo Content bằng AI', desc: 'Tự động soạn thảo nội dung hấp dẫn, thu hút người dùng dựa trên mục tiêu chiến dịch của bạn.' },
              { icon: <Clock className="w-6 h-6 text-[#A895B8]" />, title: 'Lên lịch thông minh', desc: 'Chọn thời gian và chiến lược đăng bài, hệ thống sẽ tự động xuất bản đúng giờ trên Facebook.' },
              { icon: <BarChart3 className="w-6 h-6 text-[#A895B8]" />, title: 'Phân tích chuyên sâu', desc: 'Theo dõi lượt tiếp cận, tương tác để liên tục cải thiện chất lượng nội dung bằng AI.' },
            ].map((card, i) => (
              <div key={i} className="relative p-8 rounded-[24px] bg-[#0A080C]/70 backdrop-blur-xl border border-[#29232D] hover:border-[#594F63]/60 transition-all duration-500 group hover:-translate-y-2 overflow-hidden">
                {/* Card inner glow on hover */}
                <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(89,79,99,0.15), transparent 70%)' }}></div>
                <div className="w-12 h-12 rounded-2xl bg-[#100D13] border border-[#382F3D] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#6E6078] transition-all duration-300 relative">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'radial-gradient(circle, rgba(137,105,158,0.3), transparent)' }}></div>
                  <span className="relative z-10">{card.icon}</span>
                </div>
                <h3 className="text-[20px] font-semibold text-[#F5F2F7] mb-3">{card.title}</h3>
                <p className="text-[15px] text-[#817985] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#29232D] bg-[#0A080C] mt-auto relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#594F63] to-[#806C8E] flex items-center justify-center shadow-[0_0_10px_rgba(111,87,128,0.4)]">
                  <Bot className="w-4 h-4 text-[#F5F2F7]" />
                </div>
                <span className="text-[18px] font-semibold text-[#F5F2F7]">AI Social Agent</span>
              </div>
              <p className="text-[14px] text-[#817985] max-w-xs leading-relaxed">
                Nền tảng tự động hoá đăng bài Facebook bằng trí tuệ nhân tạo — tạo nội dung, lên lịch và theo dõi hiệu suất trong một hệ thống duy nhất.
              </p>
            </div>

            {/* Công cụ */}
            <div>
              <h4 className="text-[12px] font-bold text-[#F5F2F7] mb-4 uppercase tracking-widest">Công cụ</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => openAuth("register")} className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors text-left">
                    Tạo bài viết AI
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuth("register")} className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors text-left">
                    Lên lịch đăng bài
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuth("register")} className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors text-left">
                    Quản lý Fanpage
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuth("register")} className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors text-left">
                    Dashboard thống kê
                  </button>
                </li>
              </ul>
            </div>

            {/* Tài nguyên */}
            <div>
              <h4 className="text-[12px] font-bold text-[#F5F2F7] mb-4 uppercase tracking-widest">Tài nguyên</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors">Tài liệu hướng dẫn</Link></li>
                <li><Link href="/docs/connect" className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors">Kết nối Facebook</Link></li>
                <li><Link href="/docs/ai-content" className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors">Tạo nội dung AI</Link></li>
                <li><Link href="/docs/schedule" className="text-[14px] text-[#817985] hover:text-[#A895B8] transition-colors">Lên lịch tự động</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#29232D] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-[#817985]">
              &copy; {new Date().getFullYear()} AI Social Agent. Được xây dựng với ❤️ cho các doanh nghiệp Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#594F63] bg-[#100D13] border border-[#29232D] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A895B8] animate-pulse"></span>
                Beta v1.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
