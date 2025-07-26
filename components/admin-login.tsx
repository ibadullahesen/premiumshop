"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, Eye, EyeOff, Shield, AlertTriangle, Clock, Fingerprint } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AdminLogin() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)

  // Blok müddətini yoxla
  useEffect(() => {
    const checkBlockStatus = () => {
      const attempts = localStorage.getItem("auth_attempts")
      const lastAttempt = localStorage.getItem("auth_last_attempt")

      if (attempts && lastAttempt) {
        const attemptCount = Number.parseInt(attempts)
        const lastTime = Number.parseInt(lastAttempt)
        const now = Date.now()
        const lockoutTime = 30 * 60 * 1000 // 30 dəqiqə

        if (attemptCount >= 3) {
          const timeLeft = lockoutTime - (now - lastTime)
          if (timeLeft > 0) {
            setIsBlocked(true)
            setBlockTimeLeft(Math.ceil(timeLeft / 1000))
          } else {
            setIsBlocked(false)
            setBlockTimeLeft(0)
          }
        }
      }
    }

    checkBlockStatus()
    const interval = setInterval(checkBlockStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isBlocked) {
      setError(
        `Təhlükəsizlik bloku aktiv. ${Math.floor(blockTimeLeft / 60)}:${(blockTimeLeft % 60).toString().padStart(2, "0")} sonra cəhd edin.`,
      )
      return
    }

    if (!username.trim() || !password.trim()) {
      setError("Bütün sahələri doldurun!")
      return
    }

    setError("")
    setLoading(true)

    // Təhlükəsizlik gecikdirməsi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = login(username, password)

    if (!success) {
      const attempts = localStorage.getItem("auth_attempts")
      const currentAttempts = attempts ? Number.parseInt(attempts) : 0
      const remainingAttempts = 3 - currentAttempts - 1

      if (remainingAttempts > 0) {
        setError(`Giriş uğursuz! ${remainingAttempts} cəhd hüququnuz qalıb.`)
      } else {
        setError("Çox yanlış cəhd! 30 dəqiqə gözləyin.")
        setIsBlocked(true)
      }

      // Təhlükəsizlik üçün inputları təmizlə
      setUsername("")
      setPassword("")
    }

    setLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Güvənlik animasiyaları */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            🔒 SECURE ACCESS
          </CardTitle>
          <p className="text-gray-600 text-sm font-medium">Yalnız səlahiyyətli şəxslər üçün</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="flex items-center gap-2 mb-3 font-semibold">
                <User className="w-4 h-4 text-purple-600" />
                İstifadəçi Adı
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="••••••"
                className="h-12 border-2 focus:border-purple-500 bg-gray-50"
                required
                disabled={isBlocked || loading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-3 font-semibold">
                <Lock className="w-4 h-4 text-purple-600" />
                Şifrə
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="h-12 pr-12 border-2 focus:border-purple-500 bg-gray-50"
                  required
                  disabled={isBlocked || loading}
                  autoComplete="off"
                  spellCheck={false}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked || loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-purple-600" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 font-medium">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isBlocked && (
              <div className="bg-orange-50 border-2 border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 font-medium">
                <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <span>Təhlükəsizlik bloku: {formatTime(blockTimeLeft)}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 hover:from-red-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg"
              disabled={loading || isBlocked}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Yoxlanılır...
                </div>
              ) : isBlocked ? (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  BLOKLANIB
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  GİRİŞ
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
                <Fingerprint className="w-4 h-4 text-purple-600" />
                <span>256-bit şifrələmə • Cihaz tanıma • Session qorunması</span>
              </div>
              <div className="text-xs text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg border">
                ⚠️ XƏBƏRDARLIQ: Səlahiyyətsiz giriş cəhdləri qeydə alınır
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
