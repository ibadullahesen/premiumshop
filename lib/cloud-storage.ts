// Düzəldilmiş cloud storage sistemi

const STORAGE_URL = "https://api.jsonbin.io/v3/b"
const API_KEY = "$2a$10$k6rsgPGqaFfbqKSq.pYlUeG4.kc/AMxugVygCmW9yzKw3OcSh/F4a"

interface CloudProduct {
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
  createdAt: string
  updatedAt: string
}

class CloudStorage {
  private binId: string | null = null

  // Bin ID-ni al və ya yarat
  private async getBinId(): Promise<string> {
    // Əvvəlcə localStorage-dan yoxla
    const savedBinId = localStorage.getItem("premium_shop_bin_id")
    if (savedBinId) {
      console.log("📦 Mövcud bin ID istifadə edilir:", savedBinId)
      this.binId = savedBinId
      return savedBinId
    }

    // Yeni bin yarat
    try {
      console.log("🆕 Yeni bin yaradılır...")

      const response = await fetch("https://api.jsonbin.io/v3/b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
          "X-Bin-Name": "premium-shop-products-" + Date.now(),
        },
        body: JSON.stringify({
          products: [],
          created: new Date().toISOString(),
          version: "1.0",
        }),
      })

      if (!response.ok) {
        throw new Error(`Bin yaradıla bilmədi: ${response.status}`)
      }

      const data = await response.json()
      this.binId = data.metadata.id

      // LocalStorage-a saxla
      localStorage.setItem("premium_shop_bin_id", this.binId!)

      console.log("✅ Yeni bin yaradıldı:", this.binId)
      return this.binId!
    } catch (error) {
      console.error("❌ Bin yaradıla bilmədi:", error)
      throw error
    }
  }

  // Bin-in mövcudluğunu yoxla
  private async checkBinExists(binId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Məhsulları cloud-dan yüklə
  async loadProducts(): Promise<CloudProduct[]> {
    try {
      console.log("🔄 Cloud-dan məhsullar yüklənir...")

      const binId = await this.getBinId()

      // Bin mövcudluğunu yoxla
      const binExists = await this.checkBinExists(binId)
      if (!binExists) {
        console.log("⚠️ Bin mövcud deyil, yenisi yaradılır...")
        localStorage.removeItem("premium_shop_bin_id")
        return await this.loadProducts() // Rekursiv çağırış
      }

      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      })

      if (!response.ok) {
        console.error("❌ API cavab vermədi:", response.status)

        if (response.status === 404) {
          // Bin tapılmadı, yenisini yarat
          console.log("🔄 404 xətası, yeni bin yaradılır...")
          localStorage.removeItem("premium_shop_bin_id")
          this.binId = null
          return await this.loadProducts()
        }

        throw new Error(`API xətası: ${response.status}`)
      }

      const data = await response.json()
      const products = data.record?.products || []

      console.log("✅ Cloud-dan yükləndi:", products.length, "məhsul")

      // Backup saxla
      localStorage.setItem("products_backup", JSON.stringify(products))
      localStorage.setItem("last_cloud_sync", Date.now().toString())

      return products
    } catch (error) {
      console.error("❌ Cloud yükləmə xətası:", error)

      // Backup-dan yüklə
      const backup = localStorage.getItem("products_backup")
      if (backup) {
        console.log("📦 Backup-dan yüklənir...")
        return JSON.parse(backup)
      }

      console.log("📦 Boş array qaytarılır")
      return []
    }
  }

  // Məhsulları cloud-a saxla
  async saveProducts(products: CloudProduct[]): Promise<boolean> {
    try {
      console.log("💾 Cloud-a saxlanır:", products.length, "məhsul")

      const binId = await this.getBinId()

      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify({
          products,
          lastUpdated: new Date().toISOString(),
          version: Date.now(),
        }),
      })

      if (!response.ok) {
        console.error("❌ Saxlama uğursuz:", response.status)
        throw new Error(`Saxlama xətası: ${response.status}`)
      }

      console.log("✅ Cloud-a saxlandı!")

      // Backup saxla
      localStorage.setItem("products_backup", JSON.stringify(products))
      localStorage.setItem("last_cloud_sync", Date.now().toString())

      return true
    } catch (error) {
      console.error("❌ Cloud saxlama xətası:", error)

      // LocalStorage backup
      localStorage.setItem("products_backup", JSON.stringify(products))
      return false
    }
  }

  // Məhsul əlavə et
  async addProduct(productData: Omit<CloudProduct, "id" | "createdAt" | "updatedAt">): Promise<boolean> {
    try {
      console.log("➕ Yeni məhsul əlavə edilir:", productData.name)

      const products = await this.loadProducts()
      const newProduct: CloudProduct = {
        ...productData,
        id: Date.now() + Math.floor(Math.random() * 1000), // Daha unikal ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      products.unshift(newProduct)
      const success = await this.saveProducts(products)

      if (success) {
        console.log("✅ Məhsul əlavə edildi!")
      }

      return success
    } catch (error) {
      console.error("❌ Məhsul əlavə edilə bilmədi:", error)
      return false
    }
  }

  // Məhsul yenilə
  async updateProduct(id: number, updates: Partial<CloudProduct>): Promise<boolean> {
    try {
      const products = await this.loadProducts()
      const index = products.findIndex((p) => p.id === id)

      if (index === -1) {
        console.error("❌ Məhsul tapılmadı:", id)
        return false
      }

      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      return await this.saveProducts(products)
    } catch (error) {
      console.error("❌ Məhsul yenilənə bilmədi:", error)
      return false
    }
  }

  // Məhsul sil
  async deleteProduct(id: number): Promise<boolean> {
    try {
      const products = await this.loadProducts()
      const filteredProducts = products.filter((p) => p.id !== id)
      return await this.saveProducts(filteredProducts)
    } catch (error) {
      console.error("❌ Məhsul silinə bilmədi:", error)
      return false
    }
  }

  // Cloud statusunu yoxla
  async checkCloudStatus(): Promise<boolean> {
    try {
      const binId = await this.getBinId()
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Debug məlumatları
  async getDebugInfo(): Promise<any> {
    const binId = localStorage.getItem("premium_shop_bin_id")
    const backup = localStorage.getItem("products_backup")
    const lastSync = localStorage.getItem("last_cloud_sync")

    return {
      binId,
      hasBackup: !!backup,
      backupCount: backup ? JSON.parse(backup).length : 0,
      lastSync: lastSync ? new Date(Number.parseInt(lastSync)).toLocaleString() : "Heç vaxt",
      cloudStatus: await this.checkCloudStatus(),
    }
  }
}

export const cloudStorage = new CloudStorage()
