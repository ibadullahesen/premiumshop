"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon, Plus } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImagesUpload: (imageUrls: string[]) => void
  currentImages?: string[]
  maxImages?: number
}

export function ImageUpload({ onImagesUpload, currentImages = [], maxImages = 3 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(currentImages)

  // ImageBB API ilə şəkil yükləmə
  const uploadToImageBB = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      setUploading(true)

      // Sizin ImageBB API key
      const API_KEY = "dcdc6756ea8c93cd382510bd1fb96f66"

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        const uploadedUrl = data.data.url
        const newImageUrls = [...imageUrls, uploadedUrl]
        setImageUrls(newImageUrls)
        onImagesUpload(newImageUrls)
        return true
      } else {
        alert("Şəkil yüklənmədi. Yenidən cəhd edin.")
        return false
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Xəta baş verdi. Yenidən cəhd edin.")
      return false
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Maksimum şəkil sayını yoxla
    if (imageUrls.length + files.length > maxImages) {
      alert(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz!`)
      return
    }

    for (const file of files) {
      // Fayl ölçüsü yoxlanışı (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} faylı 5MB-dan kiçik olmalıdır!`)
        continue
      }

      // Fayl tipi yoxlanışı
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} yalnız şəkil faylı olmalıdır!`)
        continue
      }

      await uploadToImageBB(file)
    }

    // Input-u təmizlə
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newImageUrls)
    onImagesUpload(newImageUrls)
  }

  return (
    <div className="space-y-4">
      <Label>Məhsul Şəkilləri (Maksimum {maxImages})</Label>

      {/* Mövcud şəkillər */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                <Image src={url || "/placeholder.svg"} alt={`Şəkil ${index + 1}`} fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni şəkil əlavə etmə */}
      {imageUrls.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-4">
            {imageUrls.length === 0 ? "Şəkillər yükləyin" : `Daha ${maxImages - imageUrls.length} şəkil əlavə edin`}
          </p>

          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={uploading}
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            {uploading ? (
              "Yüklənir..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Şəkil Əlavə Et
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG (Max: 5MB hər biri)</p>
        </div>
      )}
    </div>
  )
}
