import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { ClassSession } from '@/lib/models/ClassSession'
import { successResponse, errorResponse, withAdminAuth, parsePagination } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { page, limit, skip } = parsePagination(req.url)
    const { searchParams } = new URL(req.url)
    const grade = searchParams.get('grade')
    const activeOnly = searchParams.get('active') !== 'false'

    const query: Record<string, unknown> = {}
    if (grade) query.grade = parseInt(grade)
    if (activeOnly) query.isActive = true

    const [sessions, total] = await Promise.all([
      ClassSession.find(query).sort({ grade: 1, order: 1 }).skip(skip).limit(limit).lean(),
      ClassSession.countDocuments(query),
    ])

    return successResponse(sessions, undefined, 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    })
  } catch {
    return errorResponse('خطأ في تحميل الحصص', 500)
  }
}

export const POST = withAdminAuth(async (req) => {
  try {
    await connectDB()
    const body = await req.json()
    const session = await ClassSession.create(body)
    return successResponse(session, 'تم إنشاء الحصة بنجاح', 201)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'خطأ في الخادم'
    return errorResponse(msg, 500)
  }
})
