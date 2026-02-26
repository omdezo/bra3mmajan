/**
 * API Response Utilities - Standardized response format
 */
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { AuthService } from './auth'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200,
  pagination?: ApiResponse['pagination']
): NextResponse {
  const body: ApiResponse<T> = { success: true, data, message, pagination }
  return NextResponse.json(body, { status })
}

export function errorResponse(error: string, status = 400): NextResponse {
  const body: ApiResponse = { success: false, error }
  return NextResponse.json(body, { status })
}

export function withAdminAuth(
  handler: (req: NextRequest, context: { adminId: string; email: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const payload = await AuthService.getCurrentAdmin(req)
    if (!payload) {
      return errorResponse('غير مصرح به - يجب تسجيل الدخول', 401)
    }
    return handler(req, { adminId: payload.adminId, email: payload.email })
  }
}

export function parsePagination(url: string): { page: number; limit: number; skip: number } {
  const { searchParams } = new URL(url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}
