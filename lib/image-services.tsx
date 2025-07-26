// Pulsuz şəkil hosting xidmətləri

export const imageServices = {
  // 1. ImageBB (Ən asan və pulsuz)
  imagebb: {
    name: "ImageBB",
    website: "https://imgbb.com",
    features: ["32MB-a qədər şəkil", "API key pulsuz", "Sürətli yükləmə", "Daimi saxlama"],
    setup: `
1. https://imgbb.com saytına daxil olun
2. Qeydiyyatdan keçin
3. API bölməsinə gedin
4. API key alın
5. ImageUpload komponentində API_KEY dəyişin
    `,
  },

  // 2. Cloudinary (Güclü və pulsuz plan)
  cloudinary: {
    name: "Cloudinary",
    website: "https://cloudinary.com",
    features: ["25GB pulsuz saxlama", "Şəkil optimallaşdırması", "Çox güclü API", "Transformasiya imkanları"],
    setup: `
1. https://cloudinary.com saytına daxil olun
2. Pulsuz hesab yaradın
3. Dashboard-dan Cloud Name alın
4. Upload Preset yaradın
5. ImageUpload komponentində məlumatları dəyişin
    `,
  },

  // 3. Supabase Storage (Database ilə birlikdə)
  supabase: {
    name: "Supabase Storage",
    website: "https://supabase.com",
    features: ["1GB pulsuz saxlama", "Database ilə inteqrasiya", "Real-time yenilənmələr", "Təhlükəsizlik qaydaları"],
  },
}

// Sadə placeholder şəkil generatoru
export const generatePlaceholder = (width: number, height: number, text?: string) => {
  return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(text || "Məhsul")}`
}
