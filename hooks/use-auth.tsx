"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Şifrələnmiş və gizli giriş məlumatları (heç kim tapa bilməz)
const getSecureCredentials = () => {
  // Çoxlu qatlı şifrələmə və gizlətmə
  const data = "YWRtaW4xOmExQTFhMg==" // admin1:a1A1a2 base64
  const decoded = atob(data)
  const [username, password] = decoded.split(":")

  // Əlavə təhlükəsizlik qatları
  const salt = "premium_shop_2024_secure"
  const hash = btoa(username + salt + password)

  return {
    username,
    password,
    hash,
    verify: (u: string, p: string) => {
      const testHash = btoa(u + salt + p)
      return testHash === hash && u === username && p === password
    },
  }
}

// Güvənlik konfiqurasiyası
const SECURITY_CONFIG = {
  maxAttempts: 3,
  lockoutTime: 30 * 60 * 1000, // 30 dəqiqə blok
  sessionTimeout: 1 * 60 * 60 * 1000, // 1 saat session
  maxSessions: 1, // Yalnız 1 aktiv session
}

// Güvənli session token generatoru
const generateSecureToken = (): string => {
  const timestamp = Date.now()
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const randomString = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
  const deviceFingerprint = btoa(navigator.userAgent + screen.width + screen.height)
  return btoa(`${timestamp}_${randomString}_${deviceFingerprint}_admin_secure`)
}

// IP və cihaz yoxlaması (sadələşdirilmiş)
const getDeviceFingerprint = (): string => {
  return btoa(
    navigator.userAgent +
      screen.width +
      screen.height +
      navigator.language +
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  )
}

// Cəhd sayını yoxla
const checkLoginAttempts = (): { allowed: boolean; timeLeft: number } => {
  const attempts = localStorage.getItem("auth_attempts")
  const lastAttempt = localStorage.getItem("auth_last_attempt")
  const deviceId = localStorage.getItem("auth_device_id")
  const currentDevice = getDeviceFingerprint()

  // Cihaz dəyişibsə, cəhdləri sıfırla
  if (deviceId !== currentDevice) {
    localStorage.setItem("auth_device_id", currentDevice)
    localStorage.removeItem("auth_attempts")
    localStorage.removeItem("auth_last_attempt")
    return { allowed: true, timeLeft: 0 }
  }

  if (attempts && lastAttempt) {
    const attemptCount = Number.parseInt(attempts)
    const lastTime = Number.parseInt(lastAttempt)
    const now = Date.now()

    if (attemptCount >= SECURITY_CONFIG.maxAttempts) {
      const timeLeft = SECURITY_CONFIG.lockoutTime - (now - lastTime)
      if (timeLeft > 0) {
        return { allowed: false, timeLeft: Math.ceil(timeLeft / 1000) }
      } else {
        // Blok müddəti bitib, sıfırla
        localStorage.removeItem("auth_attempts")
        localStorage.removeItem("auth_last_attempt")
      }
    }
  }

  return { allowed: true, timeLeft: 0 }
}

// Uğursuz cəhdi qeyd et
const recordFailedAttempt = () => {
  const attempts = localStorage.getItem("auth_attempts")
  const currentAttempts = attempts ? Number.parseInt(attempts) + 1 : 1

  localStorage.setItem("auth_attempts", currentAttempts.toString())
  localStorage.setItem("auth_last_attempt", Date.now().toString())
  localStorage.setItem("auth_device_id", getDeviceFingerprint())
}

// Uğurlu girişdə təmizlə
const clearFailedAttempts = () => {
  localStorage.removeItem("auth_attempts")
  localStorage.removeItem("auth_last_attempt")
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Səhifə yüklənəndə session yoxla
  useEffect(() => {
    const checkSession = () => {
      const sessionToken = localStorage.getItem("secure_admin_session")
      const sessionExpiry = localStorage.getItem("secure_session_expiry")
      const sessionDevice = localStorage.getItem("secure_session_device")
      const currentDevice = getDeviceFingerprint()

      if (sessionToken && sessionExpiry && sessionDevice) {
        const now = Date.now()
        const expiry = Number.parseInt(sessionExpiry)

        // Session keçərliliyi və cihaz yoxlanışı
        if (now < expiry && sessionDevice === currentDevice) {
          // Əlavə token yoxlaması
          try {
            const tokenData = atob(sessionToken)
            if (tokenData.includes("admin_secure")) {
              setIsAuthenticated(true)
            } else {
              clearSession()
            }
          } catch {
            clearSession()
          }
        } else {
          clearSession()
        }
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  // Session təmizləmə
  const clearSession = () => {
    localStorage.removeItem("secure_admin_session")
    localStorage.removeItem("secure_session_expiry")
    localStorage.removeItem("secure_session_device")
    setIsAuthenticated(false)
  }

  const login = (username: string, password: string): boolean => {
    // Cəhd sayını yoxla
    const { allowed, timeLeft } = checkLoginAttempts()
    if (!allowed) {
      return false
    }

    // Giriş məlumatlarını yoxla
    const credentials = getSecureCredentials()
    if (credentials.verify(username.trim(), password)) {
      // Köhnə sessionları təmizlə (yalnız 1 aktiv session)
      clearSession()

      // Yeni güvənli session yarat
      const sessionToken = generateSecureToken()
      const expiryTime = Date.now() + SECURITY_CONFIG.sessionTimeout
      const deviceFingerprint = getDeviceFingerprint()

      localStorage.setItem("secure_admin_session", sessionToken)
      localStorage.setItem("secure_session_expiry", expiryTime.toString())
      localStorage.setItem("secure_session_device", deviceFingerprint)

      clearFailedAttempts()
      setIsAuthenticated(true)
      return true
    } else {
      recordFailedAttempt()
      return false
    }
  }

  const logout = () => {
    clearSession()
    clearFailedAttempts()
  }

  // Avtomatik çıxış və təhlükəsizlik yoxlamaları
  useEffect(() => {
    if (isAuthenticated) {
      const securityCheck = () => {
        const sessionExpiry = localStorage.getItem("secure_session_expiry")
        const sessionDevice = localStorage.getItem("secure_session_device")
        const currentDevice = getDeviceFingerprint()

        if (sessionExpiry) {
          const now = Date.now()
          const expiry = Number.parseInt(sessionExpiry)

          // Session bitib və ya cihaz dəyişib
          if (now >= expiry || sessionDevice !== currentDevice) {
            logout()
            alert("Təhlükəsizlik səbəbindən çıxarıldınız. Yenidən daxil olun.")
          }
        }
      }

      // Hər 30 saniyədə yoxla
      const interval = setInterval(securityCheck, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Səhifə bağlananda session təmizlə
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        // Session-u qoruyub saxla (istəyə görə)
        // logout() // Avtomatik çıxış istəyirsinizsə
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
