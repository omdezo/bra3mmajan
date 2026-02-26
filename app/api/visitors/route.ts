import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { VisitorLog, PageStats } from '@/lib/models/VisitorLog'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { page, pageName, sessionId } = body

    if (!page || !sessionId) return errorResponse('بيانات ناقصة')

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const userAgent = req.headers.get('user-agent') ?? undefined

    await VisitorLog.create({ page, pageName, sessionId, ip, userAgent, visitedAt: new Date() })

    const uniqueSessionCount = await VisitorLog.distinct('sessionId', { page })
    await PageStats.findOneAndUpdate(
      { page },
      {
        $inc: { totalVisits: 1 },
        $set: {
          pageName,
          lastVisit: new Date(),
          uniqueVisitors: uniqueSessionCount.length,
        },
      },
      { upsert: true }
    )

    const stats = await PageStats.findOne({ page }).lean()
    return successResponse({ totalVisits: stats?.totalVisits ?? 1 })
  } catch {
    return errorResponse('خطأ في تسجيل الزيارة', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')

    if (page) {
      const stats = await PageStats.findOne({ page }).lean()
      return successResponse(stats ?? { totalVisits: 0, uniqueVisitors: 0 })
    }

    const allStats = await PageStats.find().sort({ totalVisits: -1 }).lean()
    return successResponse(allStats)
  } catch {
    return errorResponse('خطأ في تحميل الإحصائيات', 500)
  }
}
