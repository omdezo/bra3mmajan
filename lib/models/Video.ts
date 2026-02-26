/**
 * Video Model - Manages watch section content (cartoons, anasheed, educational videos)
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export type VideoCategory = 'رسوم متحركة' | 'أناشيد' | 'فيديوهات تعليمية' | 'برامج أطفال'

export interface IVideo extends Document {
  title: string
  description: string
  category: VideoCategory
  thumbnailUrl?: string
  videoUrl?: string
  youtubeId?: string
  duration: number
  icon: string
  color: string
  ageGroup: string
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  viewsCount: number
  order: number
  createdAt: Date
  updatedAt: Date
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['رسوم متحركة', 'أناشيد', 'فيديوهات تعليمية', 'برامج أطفال'],
      required: true,
    },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
    youtubeId: { type: String },
    duration: { type: Number, default: 0 },
    icon: { type: String, default: '🎬' },
    color: { type: String, default: '#EC4899' },
    ageGroup: { type: String, default: '1-4' },
    isActive: { type: Boolean, default: true },
    isComingSoon: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Video: Model<IVideo> =
  mongoose.models.Video ?? mongoose.model<IVideo>('Video', VideoSchema)

export default Video
