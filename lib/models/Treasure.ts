/**
 * Treasure Model - Manages variety/cultural content (Omani heritage items)
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type TreasureCategory = 'ركن الإبداع' | 'كنوز عُمانية' | 'أغانٍ' | 'أساليب تعليمية'

export interface ITreasure extends Document {
  title: string
  description: string
  content?: string
  category: TreasureCategory
  icon: string
  color: string
  imageUrl?: string
  audioUrl?: string
  videoUrl?: string
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const TreasureSchema = new Schema<ITreasure>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String },
    category: {
      type: String,
      enum: ['ركن الإبداع', 'كنوز عُمانية', 'أغانٍ', 'أساليب تعليمية'],
      required: true,
    },
    icon: { type: String, default: '💎' },
    color: { type: String, default: '#F59E0B' },
    imageUrl: { type: String },
    audioUrl: { type: String },
    videoUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Treasure: Model<ITreasure> =
  mongoose.models.Treasure ?? mongoose.model<ITreasure>('Treasure', TreasureSchema)

export default Treasure
