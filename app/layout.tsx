import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/hooks/use-cart"
import { ProductProvider } from "@/hooks/use-products"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Premium E-Commerce | Ən Yaxşı Məhsullar",
  description: "Keyfiyyətli məhsullar, sürətli çatdırılma və əla xidmət",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
