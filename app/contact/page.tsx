import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bizimlə Əlaqə
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hər hansı sualınız varsa, bizimlə əlaqə saxlayın. Sizə kömək etməkdən məmnunuq!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Əlaqə Məlumatları */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Əlaqə Məlumatları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Telefon</h3>
                  <a href="tel:0606006162" className="text-purple-600 hover:text-purple-800 text-xl font-bold">
                    060 600 61 62
                  </a>
                  <p className="text-sm text-gray-600">Zəng edin və ya SMS göndərin</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <a
                    href="https://wa.me/994606006162"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-xl font-bold"
                  >
                    060 600 61 62
                  </a>
                  <p className="text-sm text-gray-600">Sürətli cavab üçün WhatsApp</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a
                    href="mailto:ibadulla.hesen@gmail.com"
                    className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                  >
                    ibadulla.hesen@gmail.com
                  </a>
                  <p className="text-sm text-gray-600">Email ilə bizə yazın</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">İş Saatları</h3>
                  <p className="text-gray-800 font-medium">Bazar ertəsi - Şənbə</p>
                  <p className="text-sm text-gray-600">09:00 - 22:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sürətli Əlaqə */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sürətli Əlaqə</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">Ən sürətli cavab üçün aşağıdakı üsullardan birini seçin:</p>
              </div>

              <div className="space-y-4">
                <a href="tel:0606006162">
                  <Button className="w-full h-16 text-lg bg-purple-600 hover:bg-purple-700">
                    <Phone className="w-6 h-6 mr-3" />
                    İndi Zəng Et
                  </Button>
                </a>

                <a href="https://wa.me/994606006162" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    WhatsApp ilə Yaz
                  </Button>
                </a>

                <a href="mailto:ibadulla.hesen@gmail.com">
                  <Button variant="outline" className="w-full h-16 text-lg border-2 hover:bg-blue-50 bg-transparent">
                    <Mail className="w-6 h-6 mr-3" />
                    Email Göndər
                  </Button>
                </a>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-yellow-800">Sürətli Cavab</span>
                </div>
                <p className="text-sm text-yellow-700">
                  WhatsApp və telefon zənglərinə 5 dəqiqə ərzində cavab veririk!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
