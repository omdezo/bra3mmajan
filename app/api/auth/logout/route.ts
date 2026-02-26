import { AuthService } from '@/lib/auth'
import { successResponse } from '@/lib/api'

export async function POST() {
  await AuthService.clearAuthCookie()
  return successResponse(null, 'تم تسجيل الخروج بنجاح')
}
