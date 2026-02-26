/**
 * POST /api/challenges/rooms/[code]/join — Join an existing room
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { ChallengeRoom } from '@/lib/models/ChallengeRoom'
import { assignTeam } from '@/lib/pointsEngine'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB()
    const { code } = await params
    const { playerName, sessionId } = await req.json()

    if (!playerName || !sessionId) return errorResponse('بيانات ناقصة')

    const room = await ChallengeRoom.findOne({ code: code.toUpperCase() })
    if (!room) return errorResponse('كود الغرفة غير صحيح', 404)
    if (room.status !== 'waiting') return errorResponse('اللعبة بدأت بالفعل أو انتهت', 400)
    if (room.players.length >= room.maxPlayers) return errorResponse('الغرفة ممتلئة', 400)

    // Check if already in room (reconnect)
    const existing = room.players.find(p => p.sessionId === sessionId)
    if (existing) {
      return successResponse({ rejoined: true }, 'أنت موجود بالفعل في الغرفة')
    }

    const playerIndex = room.players.length
    room.players.push({
      name: playerName.trim().slice(0, 20),
      sessionId,
      score: 0,
      answers: [],
      team: assignTeam(playerIndex, room.mode),
      isReady: false,
      joinedAt: new Date(),
    })

    await room.save()
    return successResponse({ joined: true }, 'تم الانضمام للغرفة')
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في الانضمام', 500)
  }
}
