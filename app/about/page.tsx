import { Card } from "@/components/ui/card"
import { Shield, Truck, Star, Heart, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Haqqımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Premium Shop olaraq, müştərilərimizə ən keyfiyyətli məhsulları ən münasib qiymətlərlə təqdim etməyi
            missiyamız hesab edirik.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Bizim Hekayəmiz</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Premium Shop, müştəri məmnuniyyətini ön planda tutan, keyfiyyətli məhsullar təklif edən bir e-ticarət
                platformasıdır. Biz hər zaman sizlər üçün ən yaxşısını təqdim etməyə çalışırıq.
              </p>
              <p>
                Məhsullarımızı diqqətlə seçir, keyfiyyətini yoxlayır və yalnız ən yaxşılarını sizlərə təqdim edirik.
                Qiymətlərimiz bazar şəraitinə uyğun və əlverişlidir.
              </p>
              <p>
                Müntəzəm olaraq müştərilərimiz üçün xüsusi endirimlər təşkil edir, kampaniyalar keçiririk. Məqsədimiz
                sizlərə ən yaxşı alış-veriş təcrübəsini yaşatmaqdır.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 border-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Keyfiyyət Zəmanəti</h3>
              </div>
              <p className="text-gray-600">
                Bütün məhsullarımız keyfiyyət standartlarına uyğundur və zəmanət ilə təqdim olunur.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100 border-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Sürətli Çatdırılma</h3>
              </div>
              <p className="text-gray-600">Sifarişlərinizi ən qısa müddətdə və təhlükəsiz şəkildə sizə çatdırırıq.</p>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-red-100 to-purple-100 border-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Müştəri Məmnuniyyəti</h3>
              </div>
              <p className="text-gray-600">
                Müştəri məmnuniyyəti bizim üçün ən vacib məsələdir. Sizin xoşbəxtliyiniz bizim uğurumuzdur.
              </p>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Təhlükəsiz Alış-veriş</h3>
            <p className="text-gray-600">Bütün ödənişləriniz SSL şifrələmə ilə qorunur və təhlükəsizdir.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Keyfiyyət Standartları</h3>
            <p className="text-gray-600">Yalnız yüksək keyfiyyətli və sertifikatlı məhsulları təklif edirik.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Dəstək</h3>
            <p className="text-gray-600">Müştəri xidmətlərimiz həftənin 7 günü sizin xidmətinizdədir.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Bizə Qoşulun!</h2>
          <p className="text-xl mb-6 opacity-90">Keyfiyyətli məhsullar və əla xidmət üçün Premium Shop-u seçin.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0606006162"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              İndi Zəng Et: 060 600 61 62
            </a>
            <a
              href="https://wa.me/994606006162"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              WhatsApp ilə Yazın
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
