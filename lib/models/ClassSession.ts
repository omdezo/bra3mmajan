/**
 * ClassSession Model - Manages virtual class sessions with Microsoft Teams
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type GradeLevel = 1 | 2 | 3 | 4

export interface IClassSession extends Document {
  title: string
  subject: string
  grade: GradeLevel
  teacher: string
  teamsLink: string
  description?: string
  schedule?: string
  day?: string
  time?: string
  icon: string
  color: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const ClassSessionSchema = new Schema<IClassSession>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    grade: { type: Number, enum: [1, 2, 3, 4], required: true },
    teacher: { type: String, required: true },
    teamsLink: { type: String, required: true },
    description: { type: String },
    schedule: { type: String },
    day: { type: String },
    time: { type: String },
    icon: { type: String, default: '📚' },
    color: { type: String, default: '#3B82F6' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

ClassSessionSchema.index({ grade: 1 })

export const ClassSession: Model<IClassSession> =
  mongoose.models.ClassSession ??
  mongoose.model<IClassSession>('ClassSession', ClassSessionSchema)

export default ClassSession
