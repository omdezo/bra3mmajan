/**
 * VisitorLog Model - Real-time visitor tracking across all pages
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IVisitorLog extends Document {
  page: string
  pageName: string
  sessionId: string
  userAgent?: string
  ip?: string
  country?: string
  referrer?: string
  visitedAt: Date
  duration?: number
}

export interface IPageStats extends Document {
  page: string
  pageName: string
  totalVisits: number
  uniqueVisitors: number
  lastVisit: Date
  updatedAt: Date
}

const VisitorLogSchema = new Schema<IVisitorLog>(
  {
    page: { type: String, required: true },
    pageName: { type: String, required: true },
    sessionId: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
    referrer: { type: String },
    visitedAt: { type: Date, default: Date.now },
    duration: { type: Number },
  },
  { timestamps: false }
)

const PageStatsSchema = new Schema<IPageStats>(
  {
    page: { type: String, required: true, unique: true },
    pageName: { type: String, required: true },
    totalVisits: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastVisit: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

VisitorLogSchema.index({ page: 1, visitedAt: -1 })
VisitorLogSchema.index({ sessionId: 1 })
PageStatsSchema.index({ page: 1 })

export const VisitorLog: Model<IVisitorLog> =
  mongoose.models.VisitorLog ??
  mongoose.model<IVisitorLog>('VisitorLog', VisitorLogSchema)

export const PageStats: Model<IPageStats> =
  mongoose.models.PageStats ??
  mongoose.model<IPageStats>('PageStats', PageStatsSchema)

export default VisitorLog
