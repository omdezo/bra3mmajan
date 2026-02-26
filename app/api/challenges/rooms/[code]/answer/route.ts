/**
 * POST /api/challenges/rooms/[code]/answer — Submit answer for current question
 * Calculates points with speed bonus, advances question when all answered
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/lib/models/Challenge'
import { ChallengeRoom } from '@/lib/models/ChallengeRoom'
import { calculatePoints } from '@/lib/pointsEngine'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB()
    const { code } = await params
    const { sessionId, answerIndex } = await req.json()

    if (sessionId === undefined || answerIndex === undefined) {
      return errorResponse('بيانات ناقصة')
    }

    const room = await ChallengeRoom.findOne({ code: code.toUpperCase() })
    if (!room) return errorResponse('الغرفة غير موجودة', 404)
    if (room.status !== 'playing') return errorResponse('اللعبة لم تبدأ', 400)

    const player = room.players.find(p => p.sessionId === sessionId)
    if (!player) return errorResponse('أنت لست في هذه الغرفة', 403)

    // Already answered this question?
    if (player.answers.some(a => a.questionIndex === room.currentQuestion)) {
      return errorResponse('لقد أجبت على هذا السؤال بالفعل', 400)
    }

    const challenge = await Challenge.findById(room.challengeId)
    if (!challenge) return errorResponse('التحدي غير موجود', 404)

    const question = challenge.questions[room.currentQuestion]
    if (!question) return errorResponse('السؤال غير موجود', 404)

    const timeUsedMs = room.questionStartedAt
      ? Date.now() - room.questionStartedAt.getTime()
      : question.timeLimit * 1000

    const correct = answerIndex === question.correctAnswer
    const pts = calculatePoints(
      question.points,
      question.timeLimit,
      timeUsedMs,
      correct,
      challenge.speedBonus
    )

    player.answers.push({
      questionIndex: room.currentQuestion,
      answerIndex,
      correct,
      timeMs: timeUsedMs,
      pointsEarned: pts.total,
    })
    player.score += pts.total

    // Check if all players answered this question
    const allAnswered = room.players.every(p =>
      p.answers.some(a => a.questionIndex === room.currentQuestion)
    )

    if (allAnswered) {
      const nextIndex = room.currentQuestion + 1
      if (nextIndex >= challenge.questions.length) {
        room.status = 'results'
        await Challenge.findByIdAndUpdate(room.challengeId, {
          $inc: { participantsCount: room.players.length },
        })
      } else {
        room.currentQuestion = nextIndex
        room.questionStartedAt = new Date()
      }
    }

    await room.save()

    return successResponse({
      correct,
      correctAnswer: question.correctAnswer,
      pointsEarned: pts.total,
      multiplier: pts.multiplier,
      tier: pts.tier,
      bonus: pts.bonus,
      newScore: player.score,
      allAnswered,
    })
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في تسجيل الإجابة', 500)
  }
}
