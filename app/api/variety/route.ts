import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Treasure } from '@/lib/models/Treasure'
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

    const [treasures, total] = await Promise.all([
      Treasure.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Treasure.countDocuments(query),
    ])

    return successResponse(treasures, undefined, 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    })
  } catch {
    return errorResponse('خطأ في تحميل المحتوى', 500)
  }
}

export const POST = withAdminAuth(async (req) => {
  try {
    await connectDB()
    const body = await req.json()
    const treasure = await Treasure.create(body)
    return successResponse(treasure, 'تم إنشاء العنصر بنجاح', 201)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return errorResponse(msg, 500)
  }
})
