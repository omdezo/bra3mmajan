/**
 * Admin Model - Single admin role for dashboard control
 */
import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IAdmin extends Document {
  email: string
  password: string
  name: string
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, default: 'المشرف' },
    avatar: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
)

AdminSchema.index({ email: 1 })

export const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
