/**
 * POST /api/challenges/rooms/[code]/start — Transition countdown→playing
 * Called by client after 3-second countdown animation finishes
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/lib/models/Challenge'
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
    if (room.status !== 'countdown') return errorResponse('العد التنازلي لم يبدأ بعد', 400)

    const challenge = await Challenge.findById(room.challengeId)
    if (!challenge?.questions.length) return errorResponse('لا توجد أسئلة', 400)

    room.status = 'playing'
    room.currentQuestion = 0
    room.questionStartedAt = new Date()
    await room.save()

    return successResponse({ started: true })
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في بدء اللعبة', 500)
  }
}
