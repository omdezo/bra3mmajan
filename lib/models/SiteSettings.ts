/**
 * SiteSettings Model - Global site configuration (singleton document)
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export interface INavbarItem {
  label: string
  href: string
  icon: string
  gradient: string
  order: number
  isActive: boolean
}

export interface IAnnouncement {
  text: string
  color: string
  isActive: boolean
  expiresAt?: Date
}

export interface ILegacyMigration {
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  lastAttemptAt?: Date
  completedAt?: Date
  error?: string
  stats?: Record<string, number>
  attempts: number
}

export interface ISiteSettings extends Document {
  siteName: string
  siteTagline: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  heroGradientStart: string
  heroGradientEnd: string
  navbarItems: INavbarItem[]
  announcements: IAnnouncement[]
  footerText: string
  maintenanceMode: boolean
  allowedAgeMin: number
  allowedAgeMax: number
  legacyMigration?: ILegacyMigration
  createdAt: Date
  updatedAt: Date
}

const NavbarItemSchema = new Schema<INavbarItem>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, default: '⭐' },
    gradient: { type: String, default: 'from-blue-400 to-purple-500' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
)

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    text: { type: String, required: true },
    color: { type: String, default: '#EF4444' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { _id: false }
)

const LegacyMigrationSchema = new Schema<ILegacyMigration>(
  {
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending' },
    lastAttemptAt: { type: Date },
    completedAt: { type: Date },
    error: { type: String },
    stats: { type: Schema.Types.Mixed },
    attempts: { type: Number, default: 0 },
  },
  { _id: false }
)

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'براعم مجان' },
    siteTagline: { type: String, default: 'رحلة التعلم تبدأ هنا' },
    logoUrl: { type: String, default: '/assets/logo.png' },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#8B5CF6' },
    heroGradientStart: { type: String, default: '#87CEEB' },
    heroGradientEnd: { type: String, default: '#191970' },
    navbarItems: { type: [NavbarItemSchema], default: [] },
    announcements: { type: [AnnouncementSchema], default: [] },
    footerText: { type: String, default: 'جميع الحقوق محفوظة © براعم مجان' },
    maintenanceMode: { type: Boolean, default: false },
    allowedAgeMin: { type: Number, default: 6 },
    allowedAgeMax: { type: Number, default: 12 },
    legacyMigration: { type: LegacyMigrationSchema, default: () => ({ status: 'pending', attempts: 0 }) },
  },
  { timestamps: true }
)

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)

export default SiteSettings
