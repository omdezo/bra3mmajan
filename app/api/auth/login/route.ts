import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Admin } from '@/lib/models/Admin'
import { AuthService } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message)
    }

    await connectDB()
    const { email, password } = parsed.data

    const admin = await Admin.findOne({ email })
    if (!admin) return errorResponse('بيانات الدخول غير صحيحة', 401)

    const valid = await AuthService.comparePassword(password, admin.password)
    if (!valid) return errorResponse('بيانات الدخول غير صحيحة', 401)

    admin.lastLogin = new Date()
    await admin.save()

    const token = await AuthService.signToken({ adminId: admin._id.toString(), email: admin.email })
    await AuthService.setAuthCookie(token)

    return successResponse(
      { id: admin._id, email: admin.email, name: admin.name },
      'تم تسجيل الدخول بنجاح'
    )
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في الخادم', 500)
  }
}
