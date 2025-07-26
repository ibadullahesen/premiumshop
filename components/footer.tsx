import Link from "next/link"
import { Mail, Phone, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">Premium Shop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Keyfiyyətli məhsullar, sürətli çatdırılma və əla müştəri xidməti ilə sizə xidmət edirik. Ən yaxşı
              qiymətlərlə ən keyfiyyətli məhsulları təqdim edirik.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sürətli Keçidlər</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Səhifə
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Haqqımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Əlaqə
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Əlaqə Məlumatları</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <a href="tel:0606006162" className="text-gray-400 hover:text-white transition-colors">
                  060 600 61 62
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <a href="mailto:ibadulla.hesen@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  ibadulla.hesen@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <a
                  href="https://wa.me/994606006162"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  WhatsApp ilə yazın
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 Premium Shop. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  )
}
