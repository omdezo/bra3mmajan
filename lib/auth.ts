/**
 * Authentication Utilities
 * Uses jose (Edge-compatible) for JWT and bcryptjs for password hashing
 */
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export interface JWTPayload {
  adminId: string
  email: string
  iat?: number
  exp?: number
}

const COOKIE_NAME = 'baraem_admin_token'
const TOKEN_EXPIRY = '7d'
const SALT_ROUNDS = 12

export class AuthService {
  private static getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET ?? 'baraem_majan_super_secret_key_2024_!@#$%'
    return new TextEncoder().encode(secret)
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  static async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }

  static async signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(this.getSecret())
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.getSecret())
      return payload as unknown as JWTPayload
    } catch {
      return null
    }
  }

  static async setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
  }

  static async clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  }

  static async getTokenFromCookie(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value ?? null
  }

  static async getCurrentAdmin(req?: NextRequest): Promise<JWTPayload | null> {
    let token: string | null = null

    if (req) {
      token = req.cookies.get(COOKIE_NAME)?.value ?? null
    } else {
      token = await this.getTokenFromCookie()
    }

    if (!token) return null
    return this.verifyToken(token)
  }
}

export default AuthService
