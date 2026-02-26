/**
 * Story Model - Manages stories and story categories
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type StoryCategory = 'حكايات عُمانية' | 'قصص الأنبياء' | 'قصص أخلاقية' | 'مغامرات مصورة'

export interface IStory extends Document {
  title: string
  description: string
  content: string
  category: StoryCategory
  coverImage?: string
  icon: string
  color: string
  ageGroup: string
  readTime: number
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, default: '' },
    category: {
      type: String,
      enum: ['حكايات عُمانية', 'قصص الأنبياء', 'قصص أخلاقية', 'مغامرات مصورة'],
      required: true,
    },
    coverImage: { type: String },
    icon: { type: String, default: '📖' },
    color: { type: String, default: '#7C3AED' },
    ageGroup: { type: String, default: '1-4' },
    readTime: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Story: Model<IStory> =
  mongoose.models.Story ?? mongoose.model<IStory>('Story', StorySchema)

export default Story
