/**
 * POST /api/challenges/rooms — Create a new game room
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/lib/models/Challenge'
import { ChallengeRoom } from '@/lib/models/ChallengeRoom'
import { generateRoomCode, getMaxPlayersForMode, assignTeam } from '@/lib/pointsEngine'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { challengeId, mode, playerName, sessionId } = await req.json()

    if (!challengeId || !mode || !playerName || !sessionId) {
      return errorResponse('بيانات ناقصة')
    }

    const challenge = await Challenge.findById(challengeId)
    if (!challenge) return errorResponse('التحدي غير موجود', 404)
    if (!challenge.questions.length) return errorResponse('هذا التحدي لا يحتوي على أسئلة بعد', 400)
    if (!challenge.allowedModes.includes(mode)) return errorResponse('هذا الوضع غير متاح لهذا التحدي', 400)

    const maxPlayers = getMaxPlayersForMode(mode)

    // Generate unique code
    let code = generateRoomCode()
    let attempts = 0
    while (await ChallengeRoom.exists({ code }) && attempts < 10) {
      code = generateRoomCode()
      attempts++
    }

    const room = await ChallengeRoom.create({
      code,
      challengeId: challenge._id.toString(),
      challengeTitle: challenge.title,
      mode,
      maxPlayers,
      status: mode === 'solo' ? 'countdown' : 'waiting',
      countdownStartedAt: mode === 'solo' ? new Date() : undefined,
      players: [{
        name: playerName.trim().slice(0, 20),
        sessionId,
        score: 0,
        answers: [],
        team: assignTeam(0, mode),
        isReady: mode === 'solo',
        joinedAt: new Date(),
      }],
    })

    return successResponse({ code: room.code, roomId: room._id }, 'تم إنشاء الغرفة', 201)
  } catch (err: unknown) {
    console.error(err)
    return errorResponse('خطأ في إنشاء الغرفة', 500)
  }
}
