import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { SiteSettings } from '@/lib/models/SiteSettings'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

const DEFAULT_NAVBAR_ITEMS = [
  { label: 'الرئيسية', href: '/', icon: '🏠', gradient: 'from-blue-400 to-blue-600', order: 0, isActive: true },
  { label: 'الألعاب', href: '/games', icon: '🎮', gradient: 'from-blue-400 to-purple-500', order: 1, isActive: true },
  { label: 'المشاهدة', href: '/watch', icon: '🎬', gradient: 'from-pink-400 to-purple-500', order: 2, isActive: true },
  { label: 'القصص', href: '/stories', icon: '📖', gradient: 'from-yellow-400 to-orange-500', order: 3, isActive: true },
  { label: 'التحديات', href: '/challenges', icon: '🏆', gradient: 'from-sky-400 to-blue-600', order: 4, isActive: true },
  { label: 'الواحة', href: '/oasis', icon: '🌿', gradient: 'from-green-400 to-teal-500', order: 5, isActive: true },
  { label: 'كنوز التراث', href: '/variety', icon: '✨', gradient: 'from-amber-400 to-orange-500', order: 6, isActive: true },
  { label: 'الفصول', href: '/classes', icon: '🎓', gradient: 'from-indigo-400 to-purple-600', order: 7, isActive: true },
]

export async function GET() {
  try {
    await connectDB()
    let settings = await SiteSettings.findOne().lean()
    if (!settings) {
      settings = await SiteSettings.create({ navbarItems: DEFAULT_NAVBAR_ITEMS })
    }
    return successResponse(settings)
  } catch {
    return errorResponse('خطأ في تحميل الإعدادات', 500)
  }
}

export const PUT = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB()
    const body = await req.json()
    const settings = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    })
    return successResponse(settings, 'تم تحديث الإعدادات بنجاح')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return errorResponse(msg, 500)
  }
})
