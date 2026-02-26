/**
 * GET /api/challenges/rooms/[code]/results — Full results with leaderboard
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { ChallengeRoom } from '@/lib/models/ChallengeRoom'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB()
    const { code } = await params

    const room = await ChallengeRoom.findOne({ code: code.toUpperCase() })
    if (!room) return errorResponse('الغرفة غير موجودة', 404)

    const sorted = [...room.players].sort((a, b) => b.score - a.score)
    const teamA = room.players.filter(p => p.team === 'A')
    const teamB = room.players.filter(p => p.team === 'B')
    const teamAScore = teamA.reduce((s, p) => s + p.score, 0)
    const teamBScore = teamB.reduce((s, p) => s + p.score, 0)

    const winner =
      room.mode === 'solo'
        ? sorted[0]?.name
        : teamAScore > teamBScore
        ? 'الفريق أ'
        : teamBScore > teamAScore
        ? 'الفريق ب'
        : 'تعادل'

    return successResponse({
      leaderboard: sorted.map((p, i) => ({
        rank: i + 1,
        name: p.name,
        score: p.score,
        team: p.team,
        correct: p.answers.filter(a => a.correct).length,
        total: p.answers.length,
      })),
      teamScores: { A: teamAScore, B: teamBScore },
      winner,
      mode: room.mode,
    })
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في تحميل النتائج', 500)
  }
}
