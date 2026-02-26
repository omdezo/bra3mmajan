import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { ClassSession } from '@/lib/models/ClassSession'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const session = await ClassSession.findById(id).lean()
    if (!session) return errorResponse('الحصة غير موجودة', 404)
    return successResponse(session)
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
    const session = await ClassSession.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!session) return errorResponse('الحصة غير موجودة', 404)
    return successResponse(session, 'تم تحديث الحصة بنجاح')
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
    await ClassSession.findByIdAndDelete(id)
    return successResponse(null, 'تم حذف الحصة بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
