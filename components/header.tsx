"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { CartSidebar } from "@/components/cart-sidebar"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getTotalItems } = useCart()

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Premium Shop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Ana Səhifə
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Əlaqə
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-purple-600">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>

              <Link href="/admin">
                <Button className="bg-purple-600 hover:bg-purple-700">Admin Panel</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">
                  Ana Səhifə
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium">
                  Əlaqə
                </Link>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
                      <ShoppingCart className="w-5 h-5" />
                      {getTotalItems() > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-purple-600">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Button>

                    <Button variant="ghost" size="sm">
                      <User className="w-5 h-5" />
                    </Button>
                  </div>

                  <Link href="/admin">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Admin
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
