import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Game } from '@/lib/models/Game'
import { Story } from '@/lib/models/Story'
import { Video } from '@/lib/models/Video'
import { Challenge } from '@/lib/models/Challenge'
import { OasisContent } from '@/lib/models/OasisContent'
import { Treasure } from '@/lib/models/Treasure'
import { ClassSession } from '@/lib/models/ClassSession'
import { PageStats, VisitorLog } from '@/lib/models/VisitorLog'
import { successResponse, errorResponse, withAdminAuth } from '@/lib/api'

export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB()

    const [
      gamesCount, storiesCount, videosCount,
      challengesCount, oasisCount, treasuresCount,
      classesCount, pageStats,
    ] = await Promise.all([
      Game.countDocuments({ isActive: true }),
      Story.countDocuments({ isActive: true }),
      Video.countDocuments({ isActive: true }),
      Challenge.countDocuments({ isActive: true }),
      OasisContent.countDocuments({ isActive: true }),
      Treasure.countDocuments({ isActive: true }),
      ClassSession.countDocuments({ isActive: true }),
      PageStats.find().lean(),
    ])

    const totalVisitors = pageStats.reduce((sum, p) => sum + p.totalVisits, 0)
    const uniqueVisitors = pageStats.reduce((sum, p) => sum + p.uniqueVisitors, 0)

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentVisits = await VisitorLog.countDocuments({ visitedAt: { $gte: sevenDaysAgo } })

    // Daily visits for the last 7 days
    const dailyVisits = await VisitorLog.aggregate([
      { $match: { visitedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return successResponse({
      content: {
        games: gamesCount,
        stories: storiesCount,
        videos: videosCount,
        challenges: challengesCount,
        oasis: oasisCount,
        treasures: treasuresCount,
        classes: classesCount,
        total: gamesCount + storiesCount + videosCount + challengesCount + oasisCount + treasuresCount,
      },
      visitors: {
        total: totalVisitors,
        unique: uniqueVisitors,
        recentWeek: recentVisits,
        byPage: pageStats,
        dailyChart: dailyVisits,
      },
    })
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في تحميل الإحصائيات', 500)
  }
})
