import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Game } from '@/lib/models/Game'
import { successResponse, errorResponse, withAdminAuth, parsePagination } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { page, limit, skip } = parsePagination(req.url)
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active') !== 'false'

    const query: Record<string, unknown> = {}
    if (category) query.category = category
    if (activeOnly) query.isActive = true

    const [games, total] = await Promise.all([
      Game.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Game.countDocuments(query),
    ])

    return successResponse(games, undefined, 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    })
  } catch {
    return errorResponse('خطأ في تحميل الألعاب', 500)
  }
}

export const POST = withAdminAuth(async (req) => {
  try {
    await connectDB()
    const body = await req.json()
    const game = await Game.create(body)
    return successResponse(game, 'تم إنشاء اللعبة بنجاح', 201)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return errorResponse(msg, 500)
  }
})
