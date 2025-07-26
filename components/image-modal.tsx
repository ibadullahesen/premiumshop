"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  productName: string
}

export function ImageModal({ isOpen, onClose, images, currentIndex, productName }: ImageModalProps) {
  const [imageIndex, setImageIndex] = useState(currentIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!isOpen) return null

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length)
    setIsZoomed(false)
  }

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsZoomed(false)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = images[imageIndex]
    link.download = `${productName}-${imageIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose()
    if (e.key === "ArrowLeft") prevImage()
    if (e.key === "ArrowRight") nextImage()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="text-white">
          <h3 className="text-lg font-semibold">{productName}</h3>
          <p className="text-sm text-gray-300">
            {imageIndex + 1} / {images.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsZoomed(!isZoomed)}
            className="text-white hover:bg-white/20"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-white/20">
            <Download className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="lg"
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 rounded-full z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 rounded-full z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
        <div
          className={`relative transition-transform duration-300 ${
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={images[imageIndex] || "/placeholder.svg"}
            alt={`${productName} - Şəkil ${imageIndex + 1}`}
            width={800}
            height={600}
            className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setImageIndex(index)
                setIsZoomed(false)
              }}
              className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                index === imageIndex ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
        <p>Böyütmək üçün şəklə basın • ESC ilə bağlayın • ← → ilə keçid edin</p>
      </div>
    </div>
  )
}
