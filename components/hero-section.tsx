"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag, Truck, Shield, Star } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Premium Məhsullar</h1>
          <p className="text-lg md:text-xl mb-6 opacity-90 max-w-xl mx-auto">
            Keyfiyyətli məhsullar, sürətli çatdırılma və zəmanət.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              <Truck className="w-4 h-4" />
              <span>Pulsuz Çatdırılma</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              <Shield className="w-4 h-4" />
              <span>Zəmanət</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              <Star className="w-4 h-4" />
              <span>Keyfiyyət</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2"
            onClick={() => {
              const productsSection = document.getElementById("products-section")
              if (productsSection) {
                productsSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Alış-verişə Başla
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
}
