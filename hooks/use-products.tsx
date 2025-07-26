"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { cloudStorage } from "@/lib/cloud-storage"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  rating: number
  soldCount: number
  inStock: boolean
  description?: string
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => Promise<boolean>
  updateProduct: (id: number, product: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
  getProduct: (id: number) => Product | undefined
  loading: boolean
  refreshProducts: () => Promise<void>
  cloudStatus: boolean
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

// İlkin məhsullar
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Premium Günəş Eynəyi",
    category: "eynekler",
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    images: [
      "/placeholder.svg?height=300&width=300&text=Eynək+1",
      "/placeholder.svg?height=300&width=300&text=Eynək+2",
      "/placeholder.svg?height=300&width=300&text=Eynək+3",
    ],
    rating: 4.8,
    soldCount: 89,
    inStock: true,
    description: "Yüksək keyfiyyətli günəş eynəyi",
  },
  {
    id: 2,
    name: "Bluetooth Qulaqlıq",
    category: "elektronika",
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    images: [
      "/placeholder.svg?height=300&width=300&text=Qulaqlıq+1",
      "/placeholder.svg?height=300&width=300&text=Qulaqlıq+2",
    ],
    rating: 4.9,
    soldCount: 156,
    inStock: true,
    description: "Simsiz Bluetooth qulaqlıq",
  },
  {
    id: 3,
    name: "Smart Saat",
    category: "elektronika",
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    images: [
      "/placeholder.svg?height=300&width=300&text=Saat+1",
      "/placeholder.svg?height=300&width=300&text=Saat+2",
      "/placeholder.svg?height=300&width=300&text=Saat+3",
    ],
    rating: 4.7,
    soldCount: 203,
    inStock: true,
    description: "Ağıllı saat çoxlu funksiya ilə",
  },
]

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cloudStatus, setCloudStatus] = useState(false)

  // Cloud statusunu yoxla
  const checkCloudStatus = async () => {
    const status = await cloudStorage.checkCloudStatus()
    setCloudStatus(status)
    return status
  }

  // Cloud-dan məhsulları yüklə
  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log("🔄 Məhsullar yüklənir...")

      const cloudProducts = await cloudStorage.loadProducts()

      if (cloudProducts.length === 0) {
        console.log("📦 İlkin məhsullar əlavə edilir...")
        // İlk dəfə istifadə - ilkin məhsulları cloud-a yüklə
        for (const product of initialProducts) {
          await cloudStorage.addProduct(product)
        }
        setProducts(initialProducts)
      } else {
        console.log("✅ Cloud məhsulları yükləndi:", cloudProducts.length)
        setProducts(cloudProducts)
      }

      await checkCloudStatus()
    } catch (error) {
      console.error("❌ Məhsullar yüklənə bilmədi:", error)

      // Backup-dan yüklə
      const backup = localStorage.getItem("products_backup")
      if (backup) {
        console.log("📦 Backup-dan yüklənir...")
        setProducts(JSON.parse(backup))
      } else {
        setProducts(initialProducts)
      }
      setCloudStatus(false)
    } finally {
      setLoading(false)
    }
  }

  // Məhsulları yenilə
  const refreshProducts = async () => {
    console.log("🔄 Məhsullar yenilənir...")
    await loadProducts()
  }

  // İlk yükləmə
  useEffect(() => {
    loadProducts()

    // Hər 15 saniyədə cloud-dan yoxla
    const interval = setInterval(async () => {
      try {
        const cloudProducts = await cloudStorage.loadProducts()
        const currentIds = products.map((p) => p.id).sort()
        const cloudIds = cloudProducts.map((p) => p.id).sort()

        // Məhsul sayı dəyişibsə yenilə
        if (JSON.stringify(currentIds) !== JSON.stringify(cloudIds)) {
          console.log("🔄 Cloud-da dəyişiklik tapıldı, yenilənir...")
          setProducts(cloudProducts)
        }

        setCloudStatus(true)
      } catch (error) {
        console.log("⚠️ Avtomatik yoxlama xətası:", error)
        setCloudStatus(false)
      }
    }, 15000) // 15 saniyə

    return () => clearInterval(interval)
  }, [])

  // Məhsul əlavə et
  const addProduct = async (productData: Omit<Product, "id">): Promise<boolean> => {
    try {
      console.log("➕ Yeni məhsul əlavə edilir:", productData.name)

      const success = await cloudStorage.addProduct({
        ...productData,
        discount:
          productData.originalPrice > productData.price
            ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
            : 0,
        rating: productData.rating || 4.5,
        soldCount: productData.soldCount || 0,
      })

      if (success) {
        console.log("✅ Cloud-a əlavə edildi!")
        // 3 saniyə sonra yenilə
        setTimeout(async () => {
          await refreshProducts()
        }, 3000)
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Məhsul əlavə edilə bilmədi:", error)
      return false
    }
  }

  // Məhsul yenilə
  const updateProduct = async (id: number, productData: Partial<Product>): Promise<boolean> => {
    try {
      const success = await cloudStorage.updateProduct(id, productData)
      if (success) {
        await refreshProducts()
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Məhsul yenilənə bilmədi:", error)
      return false
    }
  }

  // Məhsul sil
  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      const success = await cloudStorage.deleteProduct(id)
      if (success) {
        await refreshProducts()
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Məhsul silinə bilmədi:", error)
      return false
    }
  }

  const getProduct = (id: number) => {
    return products.find((product) => product.id === id)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        loading,
        refreshProducts,
        cloudStatus,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
