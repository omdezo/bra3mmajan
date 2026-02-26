import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Game } from '@/lib/models/Game'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const game = await Game.findById(id).lean()
    if (!game) return errorResponse('اللعبة غير موجودة', 404)
    return successResponse(game)
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
}

export const PUT = withAdminAuth(async (req, _ctx) => {
  try {
    await connectDB()
    const url = new URL(req.url)
    const id = url.pathname.split('/').at(-1)
    const body = await req.json()
    const game = await Game.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!game) return errorResponse('اللعبة غير موجودة', 404)
    return successResponse(game, 'تم تحديث اللعبة بنجاح')
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
    const game = await Game.findByIdAndDelete(id)
    if (!game) return errorResponse('اللعبة غير موجودة', 404)
    return successResponse(null, 'تم حذف اللعبة بنجاح')
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
})
