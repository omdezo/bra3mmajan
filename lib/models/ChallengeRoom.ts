/**
 * ChallengeRoom Model — Live game session
 * Supports solo / 1v1 / 2v2 / 4v4 modes with real-time polling
 */
import mongoose, { Document, Schema, Model } from 'mongoose'
import type { GameMode } from './Challenge'

export interface IPlayerAnswer {
  questionIndex: number
  answerIndex: number   // 0-3, or -1 for timeout
  correct: boolean
  timeMs: number        // milliseconds taken to answer
  pointsEarned: number
}

export interface IPlayer {
  name: string
  sessionId: string
  score: number
  answers: IPlayerAnswer[]
  team: 'A' | 'B'
  isReady: boolean
  joinedAt: Date
}

export interface IChallengeRoom extends Document {
  code: string
  challengeId: string
  challengeTitle: string
  mode: GameMode
  maxPlayers: number
  status: 'waiting' | 'countdown' | 'playing' | 'results'
  players: IPlayer[]
  currentQuestion: number
  questionStartedAt?: Date
  countdownStartedAt?: Date
  createdAt: Date
  expiresAt: Date
}

const PlayerAnswerSchema = new Schema<IPlayerAnswer>(
  {
    questionIndex: { type: Number, required: true },
    answerIndex: { type: Number, required: true },
    correct: { type: Boolean, required: true },
    timeMs: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
  },
  { _id: false }
)

const PlayerSchema = new Schema<IPlayer>(
  {
    name: { type: String, required: true, maxlength: 20 },
    sessionId: { type: String, required: true },
    score: { type: Number, default: 0 },
    answers: { type: [PlayerAnswerSchema], default: [] },
    team: { type: String, enum: ['A', 'B'], required: true },
    isReady: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const ChallengeRoomSchema = new Schema<IChallengeRoom>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, length: 6 },
    challengeId: { type: String, required: true },
    challengeTitle: { type: String, required: true },
    mode: { type: String, enum: ['solo', '1v1', '2v2', '4v4'], required: true },
    maxPlayers: { type: Number, required: true },
    status: {
      type: String,
      enum: ['waiting', 'countdown', 'playing', 'results'],
      default: 'waiting',
    },
    players: { type: [PlayerSchema], default: [] },
    currentQuestion: { type: Number, default: 0 },
    questionStartedAt: { type: Date },
    countdownStartedAt: { type: Date },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  },
  { timestamps: true }
)

ChallengeRoomSchema.index({ code: 1 })
ChallengeRoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const ChallengeRoom: Model<IChallengeRoom> =
  mongoose.models.ChallengeRoom ??
  mongoose.model<IChallengeRoom>('ChallengeRoom', ChallengeRoomSchema)

export default ChallengeRoom
