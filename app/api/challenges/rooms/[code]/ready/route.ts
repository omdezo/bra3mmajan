/**
 * POST /api/challenges/rooms/[code]/ready — Mark player as ready
 * When all players are ready, start countdown
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { ChallengeRoom } from '@/lib/models/ChallengeRoom'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB()
    const { code } = await params
    const { sessionId } = await req.json()

    const room = await ChallengeRoom.findOne({ code: code.toUpperCase() })
    if (!room) return errorResponse('الغرفة غير موجودة', 404)
    if (room.status !== 'waiting') return errorResponse('الغرفة ليست في وضع الانتظار', 400)

    const player = room.players.find(p => p.sessionId === sessionId)
    if (!player) return errorResponse('أنت لست في هذه الغرفة', 403)

    player.isReady = true

    // All players ready? Start countdown
    const allReady =
      room.players.length === room.maxPlayers && room.players.every(p => p.isReady)

    if (allReady) {
      room.status = 'countdown'
      room.countdownStartedAt = new Date()
    }

    await room.save()
    return successResponse({ allReady }, allReady ? 'بدأ العد التنازلي!' : 'في انتظار بقية اللاعبين')
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في الخادم', 500)
  }
}
