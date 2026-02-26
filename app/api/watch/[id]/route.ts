import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Video } from '@/lib/models/Video'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const video = await Video.findById(id).lean()
    if (!video) return errorResponse('الفيديو غير موجود', 404)
    return successResponse(video)
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
    const video = await Video.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!video) return errorResponse('الفيديو غير موجود', 404)
    return successResponse(video, 'تم تحديث الفيديو بنجاح')
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
    await Video.findByIdAndDelete(id)
    return successResponse(null, 'تم حذف الفيديو بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
