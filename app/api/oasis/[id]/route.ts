import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { OasisContent } from '@/lib/models/OasisContent'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const item = await OasisContent.findById(id).lean()
    if (!item) return errorResponse('المحتوى غير موجود', 404)
    return successResponse(item)
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
    const item = await OasisContent.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!item) return errorResponse('المحتوى غير موجود', 404)
    return successResponse(item, 'تم تحديث المحتوى بنجاح')
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
    await OasisContent.findByIdAndDelete(id)
    return successResponse(null, 'تم حذف المحتوى بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
