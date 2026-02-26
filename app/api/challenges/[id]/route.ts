import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/lib/models/Challenge'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const challenge = await Challenge.findById(id).lean()
    if (!challenge) return errorResponse('التحدي غير موجود', 404)
    return successResponse(challenge)
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
    const challenge = await Challenge.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!challenge) return errorResponse('التحدي غير موجود', 404)
    return successResponse(challenge, 'تم تحديث التحدي بنجاح')
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
    await Challenge.findByIdAndDelete(id)
    return successResponse(null, 'تم حذف التحدي بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
