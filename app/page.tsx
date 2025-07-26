"use client"

import { Suspense, useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import { AdvancedSearch } from "@/components/advanced-search"

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState({
    query: "",
    category: "all",
    priceRange: [0, 1000] as [number, number],
    sortBy: "featured",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8" id="products-section">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bütün Məhsullarımız
          </h2>

          <div className="mb-6">
            <AdvancedSearch onSearch={setSearchFilters} />
          </div>

          <Suspense fallback={<div className="text-center py-8">Yüklənir...</div>}>
            <ProductGrid searchFilters={searchFilters} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
