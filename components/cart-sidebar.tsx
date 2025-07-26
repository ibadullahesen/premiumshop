"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, X, Plus, Minus, MessageCircle, Truck } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  })
  const [receiptImage, setReceiptImage] = useState<File | null>(null)

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Zəhmət olmasa bütün məlumatları doldurun!")
      return
    }

    if (!receiptImage) {
      alert("Zəhmət olmasa ödəniş çekini yükləyin!")
      return
    }

    const orderDetails = items
      .map((item) => `${item.name} - ${item.quantity} ədəd - ₼${(item.price * item.quantity).toFixed(2)}`)
      .join("\n")

    const totalPrice = getTotalPrice().toFixed(2)

    const message = `🛍️ *YENİ SİFARİŞ*

👤 *Müştəri Məlumatları:*
Ad: ${customerInfo.name}
Telefon: ${customerInfo.phone}
Ünvan: ${customerInfo.address}

📦 *Sifariş Təfərrüatları:*
${orderDetails}

💰 *Ümumi Məbləğ: ₼${totalPrice}*

💳 *Ödəniş Məlumatları:*
Kart nömrəsi: 4169 7388 9320 8763
Ödəniş edilib və çek yüklənib ✅

📝 *Qeyd:* ${customerInfo.note || "Yoxdur"}

Təşəkkür edirik! Sifarişiniz hazırlanır 🙏`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/994606006162?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")

    // Sifarişdən sonra səbəti təmizlə
    clearCart()
    setCustomerInfo({ name: "", phone: "", address: "", note: "" })
    setReceiptImage(null)
    onClose()
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptImage(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Səbətim ({items.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Səbətiniz boşdur</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                          <p className="text-purple-600 font-bold">₼{item.price}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Müştəri Məlumatları */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Çatdırılma Məlumatları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Adınızı daxil edin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+994 50 123 45 67"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Ünvan *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Çatdırılma ünvanını daxil edin"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="note">Qeyd</Label>
                      <Textarea
                        id="note"
                        value={customerInfo.note}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                        placeholder="Əlavə qeydləriniz"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Ödəniş Məlumatları - YENİ KART */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">💳 Ödəniş Məlumatları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-purple-300">
                      <div className="text-center space-y-2">
                        <div className="text-lg font-bold text-purple-700">Premium Shop</div>
                        <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                          4169 7388 9320 8763
                        </div>
                        <div className="text-sm text-gray-600">Kapital Bank • Visa</div>
                        <div className="text-xs text-purple-600 font-medium">⚡ Ödənişdən sonra çeki yükləyin</div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="receipt" className="text-base font-semibold">
                        Ödəniş Çeki *
                      </Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                        {receiptImage ? (
                          <div className="space-y-2">
                            <div className="text-green-600 font-semibold">✅ Çek yükləndi</div>
                            <div className="text-sm text-gray-600">{receiptImage.name}</div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setReceiptImage(null)}>
                              Dəyişdir
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-4xl">📸</div>
                            <div className="text-sm text-gray-600">Ödəniş çekinin şəklini yükləyin</div>
                            <Input
                              id="receipt"
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("receipt")?.click()}
                              className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                              Çek Yüklə
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">PNG, JPG və ya JPEG formatında yükləyin</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Pulsuz çatdırılma qeydi */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">Şəhər daxili çatdırılma pulsuzdur!</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Ümumi:</span>
                <span className="text-xl font-bold text-purple-600">₼{getTotalPrice().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={!receiptImage}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {receiptImage ? "WhatsApp ilə Sifariş Ver" : "Əvvəlcə Çek Yükləyin"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
