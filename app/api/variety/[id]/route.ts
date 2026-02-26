import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Treasure } from '@/lib/models/Treasure'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const treasure = await Treasure.findById(id).lean()
    if (!treasure) return errorResponse('العنصر غير موجود', 404)
    return successResponse(treasure)
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
}

export const PUT = withAdminAuth(async (req) => {
  try {
    await connectDB()
    const url = new URL(req.url)
    const id = url.pathname.split('/').at(-1)
    const body = await req.json()
    const treasure = await Treasure.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!treasure) return errorResponse('العنصر غير موجود', 404)
    return successResponse(treasure, 'تم تحديث العنصر بنجاح')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return errorResponse(msg, 500)
  }
})

export const DELETE = withAdminAuth(async (req) => {
  try {
    await connectDB()
    const url = new URL(req.url)
    const id = url.pathname.split('/').at(-1)
    await Treasure.findByIdAndDelete(id)
    return successResponse(null, 'تم حذف العنصر بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
