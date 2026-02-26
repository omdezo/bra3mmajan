/**
 * Oasis Content Model - Manages Islamic content (Quran, Duas, Dhikr, Manners)
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type OasisCategory = 'حفظ القرآن' | 'أدعية إسلامية' | 'أذكار الصباح والمساء' | 'آداب إسلامية'

export interface IOasisContent extends Document {
  title: string
  arabicText: string
  transliteration?: string
  meaning?: string
  category: OasisCategory
  icon: string
  color: string
  audioUrl?: string
  imageUrl?: string
  source?: string
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const OasisContentSchema = new Schema<IOasisContent>(
  {
    title: { type: String, required: true, trim: true },
    arabicText: { type: String, required: true },
    transliteration: { type: String },
    meaning: { type: String },
    category: {
      type: String,
      enum: ['حفظ القرآن', 'أدعية إسلامية', 'أذكار الصباح والمساء', 'آداب إسلامية'],
      required: true,
    },
    icon: { type: String, default: '🌸' },
    color: { type: String, default: '#10B981' },
    audioUrl: { type: String },
    imageUrl: { type: String },
    source: { type: String },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const OasisContent: Model<IOasisContent> =
  mongoose.models.OasisContent ??
  mongoose.model<IOasisContent>('OasisContent', OasisContentSchema)

export default OasisContent
