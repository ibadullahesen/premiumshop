"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  LogOut,
  Shield,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Save,
  X,
  RefreshCw,
  Cloud,
  AlertCircle,
  Info,
} from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { useProducts } from "@/hooks/use-products"
import { useAuth } from "@/hooks/use-auth"
import { cloudStorage } from "@/lib/cloud-storage"
import Image from "next/image"

export function AdminPanel() {
  const { products, addProduct, deleteProduct, updateProduct, loading, refreshProducts } = useProducts()
  const { logout } = useAuth()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    images: [] as string[],
    rating: "4.5",
    soldCount: "0",
  })

  const [editProduct, setEditProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    images: [] as string[],
    rating: "4.5",
    soldCount: "0",
  })

  // Debug məlumatlarını yüklə
  useEffect(() => {
    const loadDebugInfo = async () => {
      const info = await cloudStorage.getDebugInfo()
      setDebugInfo(info)
    }
    loadDebugInfo()
  }, [products])

  // Məhsulları yenilə
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setShowSuccess("Cloud-dan yenilənir...")

    try {
      await refreshProducts()
      setShowSuccess("✅ Məhsullar cloud-dan yeniləndi!")

      // Debug info yenilə
      const info = await cloudStorage.getDebugInfo()
      setDebugInfo(info)
    } catch (error) {
      setShowSuccess("❌ Yeniləmə xətası! İnternet bağlantınızı yoxlayın.")
    }

    setIsRefreshing(false)
    setTimeout(() => setShowSuccess(""), 3000)
  }

  // Məhsul əlavə et
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || newProduct.images.length === 0) {
      alert("Zəhmət olmasa bütün məlumatları doldurun və ən azı 1 şəkil yükləyin!")
      return
    }

    console.log("Yeni məhsul əlavə edilir:", newProduct.name)
    setShowSuccess("Məhsul cloud-a əlavə edilir... Gözləyin...")

    const success = await addProduct({
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice
        ? Number.parseFloat(newProduct.originalPrice)
        : Number.parseFloat(newProduct.price),
      discount: 0,
      images: newProduct.images,
      rating: Number.parseFloat(newProduct.rating),
      soldCount: Number.parseInt(newProduct.soldCount),
      inStock: true,
      description: newProduct.description,
    })

    if (success) {
      setShowSuccess("✅ Məhsul cloud-a əlavə edildi! 10 saniyə sonra bütün cihazlarda görünəcək.")
      setTimeout(() => setShowSuccess(""), 5000)

      setIsAddingProduct(false)
      setNewProduct({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        description: "",
        images: [],
        rating: "4.5",
        soldCount: "0",
      })
    } else {
      setShowSuccess("❌ Xəta! Məhsul əlavə edilə bilmədi. Yenidən cəhd edin.")
      setTimeout(() => setShowSuccess(""), 3000)
    }
  }

  // Məhsul redaktə et
  const handleEditProduct = (product: any) => {
    setEditingProduct(product.id)
    setEditProduct({
      name: product.name || "",
      category: product.category || "",
      price: (product.price || 0).toString(),
      originalPrice: (product.originalPrice || 0).toString(),
      description: product.description || "",
      images: product.images || [],
      rating: (product.rating || 4.5).toString(),
      soldCount: (product.soldCount || 0).toString(),
    })
  }

  // Məhsul yenilə
  const handleUpdateProduct = async () => {
    if (!editProduct.name || !editProduct.category || !editProduct.price) {
      alert("Zəhmət olmasa bütün məlumatları doldurun!")
      return
    }

    const success = await updateProduct(editingProduct!, {
      name: editProduct.name,
      category: editProduct.category,
      price: Number.parseFloat(editProduct.price),
      originalPrice: editProduct.originalPrice
        ? Number.parseFloat(editProduct.originalPrice)
        : Number.parseFloat(editProduct.price),
      images: editProduct.images,
      description: editProduct.description,
      rating: Number.parseFloat(editProduct.rating),
      soldCount: Number.parseInt(editProduct.soldCount),
    })

    if (success) {
      setShowSuccess("Məhsul cloud-da yeniləndi!")
      setTimeout(() => setShowSuccess(""), 3000)

      setEditingProduct(null)
      setEditProduct({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        description: "",
        images: [],
        rating: "4.5",
        soldCount: "0",
      })
    } else {
      alert("Məhsul yenilənə bilmədi. Yenidən cəhd edin.")
    }
  }

  // Məhsul sil
  const handleDeleteProduct = async (id: number, name: string) => {
    if (confirm(`"${name}" məhsulunu bütün cihazlardan silmək istədiyinizə əminsiniz?`)) {
      const success = await deleteProduct(id)
      if (success) {
        setShowSuccess("Məhsul cloud-dan silindi!")
        setTimeout(() => setShowSuccess(""), 3000)
      } else {
        alert("Məhsul silinə bilmədi. Yenidən cəhd edin.")
      }
    }
  }

  const handleLogout = () => {
    if (confirm("Admin paneldən çıxmaq istədiyinizə əminsiniz?")) {
      logout()
    }
  }

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      eynekler: "Eynəklər",
      elektronika: "Elektronika",
      cantalar: "Çantalar",
      ayaqqabi: "Ayaqqabı",
      aksesuar: "Aksesuar",
      geyim: "Geyim",
    }
    return categories[category] || category
  }

  // Statistikalar
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price, 0)
  const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0
  const discountedProducts = products.filter((p) => p.discount > 0).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cloud-dan məhsullar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              Admin Panel
              <Cloud className="w-6 h-6 text-blue-500" title="Cloud Storage Aktiv" />
            </h1>
            <p className="text-gray-600">Məhsullar cloud-da saxlanır və bütün cihazlarda sinxronlaşır</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-blue-600 hover:text-blue-700 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Yenilənir..." : "Yenilə"}
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cloud Aktiv</span>
            </div>

            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Çıxış
            </Button>
          </div>
        </div>

        {/* Uğur mesajı */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {showSuccess}
          </div>
        )}

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Məhsullar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analitika
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Debug
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Məhsul İdarəetməsi</h2>
                <Button onClick={() => setIsAddingProduct(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Məhsul
                </Button>
              </div>

              {/* Cloud məlumat kartı */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Cloud Storage Aktiv</h3>
                      <p className="text-sm text-blue-600">
                        Məhsullar cloud-da saxlanır və bütün cihazlarda (telefon, kompüter) görünür
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Məhsul statistikaları */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ümumi Məhsul</p>
                        <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                      </div>
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ümumi Dəyər</p>
                        <p className="text-2xl font-bold text-gray-900">₼{totalValue.toFixed(0)}</p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Orta Qiymət</p>
                        <p className="text-2xl font-bold text-gray-900">₼{averagePrice.toFixed(0)}</p>
                      </div>
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Endirimlər</p>
                        <p className="text-2xl font-bold text-gray-900">{discountedProducts}</p>
                      </div>
                      <div className="text-red-500 text-xl font-bold">%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Yeni məhsul əlavə etmə */}
              {isAddingProduct && (
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center justify-between">
                      <span>Yeni Məhsul Əlavə Et (Cloud-a)</span>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingProduct(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productName">Məhsul Adı *</Label>
                        <Input
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Məhsul adını daxil edin"
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Kateqoriya *</Label>
                        <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Kateqoriya seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eynekler">Eynəklər</SelectItem>
                            <SelectItem value="elektronika">Elektronika</SelectItem>
                            <SelectItem value="cantalar">Çantalar</SelectItem>
                            <SelectItem value="ayaqqabi">Ayaqqabı</SelectItem>
                            <SelectItem value="aksesuar">Aksesuar</SelectItem>
                            <SelectItem value="geyim">Geyim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="price">Satış Qiyməti (₼) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="originalPrice">Orijinal Qiymət (₼) - Endirim üçün</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                          placeholder="Endirim varsa daxil edin"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rating">Reytinq (1-5) ⭐</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={newProduct.rating}
                          onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                          placeholder="4.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="soldCount">Satış Sayı 📦</Label>
                        <Input
                          id="soldCount"
                          type="number"
                          min="0"
                          value={newProduct.soldCount}
                          onChange={(e) => setNewProduct({ ...newProduct, soldCount: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Təsvir</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Məhsul haqqında ətraflı məlumat"
                        rows={4}
                      />
                    </div>

                    <div>
                      <ImageUpload
                        onImagesUpload={(urls) => setNewProduct({ ...newProduct, images: urls })}
                        currentImages={newProduct.images}
                        maxImages={5}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleAddProduct} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Cloud-a Əlavə Et
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                        Ləğv Et
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mövcud məhsullar */}
              <Card>
                <CardHeader>
                  <CardTitle>Cloud Məhsulları ({products.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">Hələ məhsul əlavə edilməyib</p>
                      <p className="text-sm">Yuxarıdakı "Yeni Məhsul" düyməsini basaraq başlayın</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id}>
                          {editingProduct === product.id ? (
                            // Redaktə formu
                            <Card className="border-2 border-blue-200 bg-blue-50">
                              <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label>Məhsul Adı</Label>
                                    <Input
                                      value={editProduct.name}
                                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Kateqoriya</Label>
                                    <Select
                                      value={editProduct.category}
                                      onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="eynekler">Eynəklər</SelectItem>
                                        <SelectItem value="elektronika">Elektronika</SelectItem>
                                        <SelectItem value="cantalar">Çantalar</SelectItem>
                                        <SelectItem value="ayaqqabi">Ayaqqabı</SelectItem>
                                        <SelectItem value="aksesuar">Aksesuar</SelectItem>
                                        <SelectItem value="geyim">Geyim</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Satış Qiyməti (₼)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editProduct.price}
                                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Orijinal Qiymət (₼) - Endirim</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editProduct.originalPrice}
                                      onChange={(e) =>
                                        setEditProduct({ ...editProduct, originalPrice: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label>Reytinq (1-5) ⭐</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="5"
                                      step="0.1"
                                      value={editProduct.rating}
                                      onChange={(e) => setEditProduct({ ...editProduct, rating: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Satış Sayı 📦</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={editProduct.soldCount}
                                      onChange={(e) => setEditProduct({ ...editProduct, soldCount: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <Label>Təsvir</Label>
                                  <Textarea
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    rows={3}
                                  />
                                </div>
                                <div className="mb-4">
                                  <ImageUpload
                                    onImagesUpload={(urls) => setEditProduct({ ...editProduct, images: urls })}
                                    currentImages={editProduct.images}
                                    maxImages={5}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleUpdateProduct} className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    Cloud-da Saxla
                                  </Button>
                                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                    Ləğv Et
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            // Normal görünüş
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.images[0] && (
                                    <Image
                                      src={product.images[0] || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {getCategoryName(product.category)} • {product.images.length} şəkil • ⭐{" "}
                                    {product.rating} • 📦 {product.soldCount} satış
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-purple-600 text-lg">₼{product.price}</span>
                                    {product.originalPrice > product.price && (
                                      <>
                                        <span className="text-sm text-gray-500 line-through">
                                          ₼{product.originalPrice}
                                        </span>
                                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                                          -{product.discount}%
                                        </Badge>
                                      </>
                                    )}
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      Stokda
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                      <Cloud className="w-3 h-3 mr-1" />
                                      Cloud
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="hover:bg-blue-50 bg-transparent">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-yellow-50 bg-transparent"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Cloud Analitikası</h2>

              {/* Analitika kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Məhsul Statistikaları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi məhsul:</span>
                        <span className="font-bold">{totalProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Endirimlər:</span>
                        <span className="font-bold text-red-600">{discountedProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orta qiymət:</span>
                        <span className="font-bold text-green-600">₼{averagePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Kateqoriya Paylanması
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        products.reduce(
                          (acc, product) => {
                            acc[product.category] = (acc[product.category] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([category, count]) => (
                        <div key={category} className="flex justify-between">
                          <span className="text-gray-600">{getCategoryName(category)}:</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      Qiymət Aralığı
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ən ucuz:</span>
                        <span className="font-bold text-green-600">
                          ₼{products.length > 0 ? Math.min(...products.map((p) => p.price)).toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ən bahalı:</span>
                        <span className="font-bold text-red-600">
                          ₼{products.length > 0 ? Math.max(...products.map((p) => p.price)).toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ümumi dəyər:</span>
                        <span className="font-bold text-purple-600">₼{totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Məhsul siyahısı analitikası */}
              {products.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ən Bahalı Məhsullar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {products
                        .sort((a, b) => b.price - a.price)
                        .slice(0, 5)
                        .map((product, index) => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="font-medium">{product.name}</span>
                            </div>
                            <span className="font-bold text-purple-600">₼{product.price}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="debug">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Debug Məlumatları</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Cloud Storage Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {debugInfo && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bin ID:</span>
                        <span className="font-mono text-sm">{debugInfo.binId || "Yoxdur"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backup mövcud:</span>
                        <span className={debugInfo.hasBackup ? "text-green-600" : "text-red-600"}>
                          {debugInfo.hasBackup ? "Bəli" : "Xeyr"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backup məhsul sayı:</span>
                        <span className="font-bold">{debugInfo.backupCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Son sinxronlaşma:</span>
                        <span className="text-sm">{debugInfo.lastSync}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cloud status:</span>
                        <span className={debugInfo.cloudStatus ? "text-green-600" : "text-red-600"}>
                          {debugInfo.cloudStatus ? "Aktiv" : "Xəta"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Console Logları</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    F12 basıb Console tab-ını açın və aşağıdakı mesajları axtarın:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
                    <div>🔄 Cloud-dan məhsullar yüklənir...</div>
                    <div>✅ Cloud-dan yükləndi: X məhsul</div>
                    <div>➕ Yeni məhsul əlavə edilir: ...</div>
                    <div>💾 Cloud-a saxlanır: X məhsul</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
