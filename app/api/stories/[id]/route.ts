import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Story } from '@/lib/models/Story'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const story = await Story.findById(id).lean()
    if (!story) return errorResponse('القصة غير موجودة', 404)
    return successResponse(story)
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
    const story = await Story.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!story) return errorResponse('القصة غير موجودة', 404)
    return successResponse(story, 'تم تحديث القصة بنجاح')
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
    const story = await Story.findByIdAndDelete(id)
    if (!story) return errorResponse('القصة غير موجودة', 404)
    return successResponse(null, 'تم حذف القصة بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
