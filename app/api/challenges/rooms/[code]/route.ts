/**
 * GET /api/challenges/rooms/[code] — Poll room state (used for real-time updates)
 * Returns sanitized room state + current question (without revealing answer)
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/lib/models/Challenge'
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
    if (!room) return errorResponse('الغرفة غير موجودة أو انتهت صلاحيتها', 404)

    const challenge = await Challenge.findById(room.challengeId).lean()
    if (!challenge) return errorResponse('التحدي غير موجود', 404)

    const totalQuestions = challenge.questions.length
    const currentQ = challenge.questions[room.currentQuestion]

    // Auto-advance if question timer expired during 'playing'
    if (room.status === 'playing' && room.questionStartedAt && currentQ) {
      const elapsed = Date.now() - room.questionStartedAt.getTime()
      const limit = currentQ.timeLimit * 1000

      if (elapsed > limit + 1500) { // 1.5s grace
        // All players who didn't answer this question get 0
        // Advance to next question or end
        const nextIndex = room.currentQuestion + 1
        if (nextIndex >= totalQuestions) {
          room.status = 'results'
          await Challenge.findByIdAndUpdate(room.challengeId, {
            $inc: { participantsCount: room.players.length },
          })
        } else {
          room.currentQuestion = nextIndex
          room.questionStartedAt = new Date()
        }
        await room.save()
      }
    }

    // Sanitize: hide correct answer from question
    const safeQuestion = currentQ
      ? {
          index: room.currentQuestion,
          total: totalQuestions,
          question: currentQ.question,
          options: currentQ.options,
          timeLimit: currentQ.timeLimit,
          points: currentQ.points,
          hint: currentQ.hint,
          // Only reveal answer when question is over
          correctAnswer:
            room.status === 'results' ||
            (room.questionStartedAt &&
              Date.now() - room.questionStartedAt.getTime() > currentQ.timeLimit * 1000)
              ? currentQ.correctAnswer
              : undefined,
        }
      : null

    const playersPublic = room.players.map(p => ({
      name: p.name,
      score: p.score,
      team: p.team,
      isReady: p.isReady,
      answeredCurrent: p.answers.some(a => a.questionIndex === room.currentQuestion),
    }))

    const teamScores = {
      A: room.players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0),
      B: room.players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0),
    }

    return successResponse({
      code: room.code,
      mode: room.mode,
      status: room.status,
      maxPlayers: room.maxPlayers,
      players: playersPublic,
      teamScores,
      currentQuestion: safeQuestion,
      questionStartedAt: room.questionStartedAt,
      countdownStartedAt: room.countdownStartedAt,
      challengeTitle: room.challengeTitle,
      speedBonus: challenge.speedBonus,
    })
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في تحميل الغرفة', 500)
  }
}
