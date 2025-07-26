"use client"

import { AdminPanel } from "@/components/admin-panel"
import { AdminLogin } from "@/components/admin-login"
import { useAuth } from "@/hooks/use-auth"

export default function AdminPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return isAuthenticated ? <AdminPanel /> : <AdminLogin />
}
