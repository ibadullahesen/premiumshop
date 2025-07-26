"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { ImageModal } from "@/components/image-modal"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  rating: number
  inStock: boolean
  soldCount: number
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      ...product,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const openImageModal = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const currentImage = product.images[currentImageIndex] || "/placeholder.svg"

  if (viewMode === "list") {
    return (
      <>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0">
              <Image src={currentImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{product.discount}%</Badge>
              )}

              {/* Şəkil naviqasiyası */}
              {product.images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 opacity-70 hover:opacity-100"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 opacity-70 hover:opacity-100"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Göz işarəsi - List view */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-2 right-2 w-8 h-8 p-0 opacity-80 hover:opacity-100 bg-white/90 hover:bg-white"
                onClick={openImageModal}
                title="Şəkli böyüt"
              >
                <Eye className="w-4 h-4 text-purple-600" />
              </Button>
            </div>

            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      📦 {product.soldCount} satış
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-purple-600">₼{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">₼{product.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleAddToCart}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Səbətə At
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={product.images}
          currentIndex={currentImageIndex}
          productName={product.name}
        />
      </>
    )
  }

  return (
    <>
      <Card
        className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold z-10">
              -{product.discount}%
            </Badge>
          )}

          {/* Şəkil naviqasiyası */}
          {product.images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 transition-all duration-300 z-10 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 transition-all duration-300 z-10 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                }`}
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Göz işarəsi - Grid view */}
          <Button
            size="sm"
            variant="secondary"
            className={`absolute top-3 right-3 w-8 h-8 p-0 transition-all duration-300 z-10 bg-white/90 hover:bg-white ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            onClick={openImageModal}
            title="Şəkli böyüt"
          >
            <Eye className="w-4 h-4 text-purple-600" />
          </Button>

          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Səbətə At
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">📦 {product.soldCount} satış</span>
            {product.images.length > 1 && (
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                {product.images.length} şəkil
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-purple-600">₼{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₼{product.originalPrice}</span>
              )}
            </div>

            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Stokda
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Bitib
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={product.images}
        currentIndex={currentImageIndex}
        productName={product.name}
      />
    </>
  )
}
