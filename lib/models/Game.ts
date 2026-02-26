/**
 * Game Model - Manages games and game categories
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type Difficulty = 'سهل' | 'متوسط' | 'صعب'
export type AgeGroup = '1-2' | '3-4' | '1-4'

export interface IGame extends Document {
  title: string
  description: string
  category: string
  difficulty: Difficulty
  ageGroup: AgeGroup
  icon: string
  color: string
  bgColor: string
  externalLink?: string     // URL to external game website
  isExternalLink: boolean   // true = opens external site, false = internal
  isActive: boolean
  isComingSoon: boolean
  stars: number
  playersCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface IGameCategory extends Document {
  name: string
  icon: string
  color: string
  description: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['سهل', 'متوسط', 'صعب'], default: 'سهل' },
    ageGroup: { type: String, enum: ['1-2', '3-4', '1-4'], default: '1-4' },
    icon: { type: String, default: '🎮' },
    color: { type: String, default: '#3B82F6' },
    bgColor: { type: String, default: '#EFF6FF' },
    externalLink: { type: String },
    isExternalLink: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    stars: { type: Number, default: 3, min: 0, max: 5 },
    playersCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const GameCategorySchema = new Schema<IGameCategory>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '🎯' },
    color: { type: String, default: '#3B82F6' },
    description: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Game: Model<IGame> =
  mongoose.models.Game ?? mongoose.model<IGame>('Game', GameSchema)

export const GameCategory: Model<IGameCategory> =
  mongoose.models.GameCategory ??
  mongoose.model<IGameCategory>('GameCategory', GameCategorySchema)

export default Game
