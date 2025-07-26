"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

interface ProductGridProps {
  searchFilters?: {
    query: string
    category: string
    priceRange: [number, number]
    sortBy: string
  }
}

export function ProductGrid({ searchFilters }: ProductGridProps) {
  const { products: allProducts } = useProducts()
  const [products, setProducts] = useState(allProducts)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  // Məhsulları filtrləmə funksiyası
  const filterProducts = (products: any[], filters: any) => {
    let filtered = [...products]

    // Axtarış sorğusu
    if (filters?.query && filters.query.trim() !== "") {
      const query = filters.query.toLowerCase().trim()
      filtered = filtered.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        )
      })
    }

    // Kateqoriya filtri
    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Qiymət aralığı filtri
    if (filters?.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange
      filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    }

    return filtered
  }

  // Məhsullar və filtrlər dəyişəndə yenilə
  useEffect(() => {
    const filteredProducts = filterProducts(allProducts, searchFilters)

    // Sıralama
    if (searchFilters?.sortBy) {
      switch (searchFilters.sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case "discount":
          filteredProducts.sort((a, b) => b.discount - a.discount)
          break
        case "newest":
          filteredProducts.sort((a, b) => b.id - a.id)
          break
        default:
          // featured - default order
          break
      }
    }

    setProducts(filteredProducts)
    setLoading(false)
  }, [allProducts, searchFilters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Məhsullar yüklənir...</p>
      </div>
    )
  }

  // Axtarış nəticəsi tapılmadı
  if (products.length === 0 && searchFilters?.query) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">"{searchFilters.query}" üçün nəticə tapılmadı</h3>
        <p className="text-gray-500 mb-4">Başqa açar söz ilə axtarış edin və ya filtrlər dəyişin</p>
        <div className="text-sm text-gray-400">
          <p>Məsələn: eynək, qulaqlıq, saat, elektronika</p>
        </div>
      </div>
    )
  }

  // Heç məhsul yoxdur
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Hələ məhsul yoxdur</h3>
        <p className="text-gray-500">Admin paneldən ilk məhsulunuzu əlavə edin</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sorting and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {products.length} məhsul tapıldı
            {searchFilters?.query && (
              <span className="ml-2 text-purple-600 font-medium">"{searchFilters.query}" üçün</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}
