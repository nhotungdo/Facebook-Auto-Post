"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.session) {
        router.push("/")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Đã xảy ra lỗi khi đăng nhập")
      } else {
        setError("Đã xảy ra lỗi khi đăng nhập")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-2000" />
      
      <div className="z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập để quản lý AI Social Media của bạn
          </p>
        </div>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-backwards">
          <form onSubmit={handleLogin}>
            <CardContent className="pt-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-9 bg-background/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 bg-background/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-4 pb-6">
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng nhập"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
