/**
 * Challenge Model — Full quiz engine with question bank
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type ChallengeCategory = 'معلومات عامة' | 'تحديات أسبوعية' | 'منافسة الأصدقاء' | 'اختبارات ذاتية'
export type GameMode = 'solo' | '1v1' | '2v2' | '4v4'

export interface IQuestion {
  _id?: string
  question: string
  options: [string, string, string, string]
  correctAnswer: 0 | 1 | 2 | 3
  points: number       // base points for correct answer
  timeLimit: number    // seconds allowed (5–60)
  hint?: string
}

export interface IChallenge extends Document {
  title: string
  description: string
  category: ChallengeCategory
  icon: string
  color: string
  difficulty: 'سهل' | 'متوسط' | 'صعب'
  ageGroup: string
  allowedModes: GameMode[]
  questions: IQuestion[]
  basePoints: number        // default points per question
  defaultTimeLimit: number  // default seconds per question
  speedBonus: boolean       // award extra points for fast answers
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  participantsCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: { validator: (v: string[]) => v.length === 4, message: 'يجب أن يكون هناك ٤ خيارات بالضبط' },
    },
    correctAnswer: { type: Number, enum: [0, 1, 2, 3], required: true },
    points: { type: Number, default: 100, min: 10, max: 1000 },
    timeLimit: { type: Number, default: 20, min: 5, max: 60 },
    hint: { type: String },
  },
  { _id: true }
)

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['معلومات عامة', 'تحديات أسبوعية', 'منافسة الأصدقاء', 'اختبارات ذاتية'],
      required: true,
    },
    icon: { type: String, default: '🏆' },
    color: { type: String, default: '#F59E0B' },
    difficulty: { type: String, enum: ['سهل', 'متوسط', 'صعب'], default: 'سهل' },
    ageGroup: { type: String, default: '1-4' },
    allowedModes: {
      type: [String],
      enum: ['solo', '1v1', '2v2', '4v4'],
      default: ['solo', '1v1'],
    },
    questions: { type: [QuestionSchema], default: [] },
    basePoints: { type: Number, default: 100 },
    defaultTimeLimit: { type: Number, default: 20 },
    speedBonus: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    participantsCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Challenge: Model<IChallenge> =
  mongoose.models.Challenge ?? mongoose.model<IChallenge>('Challenge', ChallengeSchema)

export default Challenge
