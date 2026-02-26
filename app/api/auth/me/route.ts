import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Admin } from '@/lib/models/Admin'
import { AuthService } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const payload = await AuthService.getCurrentAdmin(req)
    if (!payload) return errorResponse('غير مصرح به', 401)

    await connectDB()
    const admin = await Admin.findById(payload.adminId).select('-password')
    if (!admin) return errorResponse('المشرف غير موجود', 404)

    return successResponse({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      lastLogin: admin.lastLogin,
    })
  } catch {
    return errorResponse('خطأ في الخادم', 500)
  }
}
