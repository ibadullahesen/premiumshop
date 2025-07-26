"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "all", name: "Hamısı" },
  { id: "eynekler", name: "Eynəklər" },
  { id: "elektronika", name: "Elektronika" },
  { id: "cantalar", name: "Çantalar" },
  { id: "ayaqqabi", name: "Ayaqqabı" },
  { id: "aksesuar", name: "Aksesuar" },
  { id: "geyim", name: "Geyim" },
]

interface AdvancedSearchProps {
  onSearch?: (filters: {
    query: string
    category: string
    priceRange: [number, number]
    sortBy: string
  }) => void
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  // Filtrlər dəyişəndə avtomatik axtarış
  useEffect(() => {
    if (onSearch) {
      onSearch({
        query: searchQuery,
        category: selectedCategory,
        priceRange: priceRange as [number, number],
        sortBy,
      })
    }
  }, [searchQuery, selectedCategory, priceRange, sortBy, onSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filters = {
      query: searchQuery,
      category: selectedCategory,
      priceRange: priceRange as [number, number],
      sortBy,
    }

    // Filtrlər dəyişəndə dərhal axtarış et
    if (onSearch) {
      onSearch(filters)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPriceRange([0, 1000])
    setSortBy("featured")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    sortBy !== "featured"

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Ana Axtarış */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Məhsul axtarın... (məs: eynək, qulaqlıq, saat)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-4">
              <Filter className="w-5 h-5 mr-2" />
              Filtrlər
            </Button>
            <Button type="submit" className="h-12 px-6 bg-purple-600 hover:bg-purple-700">
              <Search className="w-5 h-5 mr-2" />
              Axtar
            </Button>
          </div>

          {/* Filtrlər */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Kateqoriya</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sıralama</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Tövsiyə olunan</SelectItem>
                    <SelectItem value="price-low">Qiymət: Aşağıdan Yuxarı</SelectItem>
                    <SelectItem value="price-high">Qiymət: Yuxarıdan Aşağı</SelectItem>
                    <SelectItem value="rating">Reytinq</SelectItem>
                    <SelectItem value="discount">Endirim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Qiymət Aralığı: ₼{priceRange[0]} - ₼{priceRange[1]}
                </label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full mt-2" />
              </div>
            </div>
          )}

          {/* Aktiv Filtrlər */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Aktiv filtrlər:</span>
              {searchQuery && (
                <Badge variant="secondary" className="cursor-pointer">
                  "{searchQuery}"
                  <X className="w-3 h-3 ml-1" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <X className="w-3 h-3 ml-1" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="cursor-pointer">
                  ₼{priceRange[0]} - ₼{priceRange[1]}
                  <X className="w-3 h-3 ml-1" onClick={() => setPriceRange([0, 1000])} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Hamısını Təmizlə
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
