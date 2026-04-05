/**
 * Health Check — Reports status of primary DB, backup cluster, R2, and migration
 */
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import { SiteSettings } from '@/lib/models/SiteSettings'

export const dynamic = 'force-dynamic'

async function pingCluster(uri: string): Promise<{ up: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now()
  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    }).asPromise()
    await conn.db!.admin().ping()
    await conn.close()
    return { up: true, latencyMs: Date.now() - start }
  } catch (err) {
    return { up: false, error: err instanceof Error ? err.message.slice(0, 120) : String(err) }
  }
}

async function pingR2(): Promise<{ up: boolean; error?: string }> {
  try {
    const url = process.env.CF_R2_PUBLIC_URL
    if (!url) return { up: false, error: 'R2 not configured' }
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return { up: res.ok || res.status === 404 } // 404 on root is fine — bucket exists
  } catch (err) {
    return { up: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function GET() {
  const startedAt = new Date().toISOString()

  // Check primary (cached singleton)
  let primary: { up: boolean; latencyMs?: number; error?: string } = { up: false }
  try {
    const s = Date.now()
    await connectDB()
    await mongoose.connection.db!.admin().ping()
    primary = { up: true, latencyMs: Date.now() - s }
  } catch (err) {
    primary = { up: false, error: err instanceof Error ? err.message.slice(0, 120) : 'unknown' }
  }

  // Check old cluster in parallel with R2
  const [oldCluster, r2] = await Promise.all([
    process.env.MONGODB_URI_OLD ? pingCluster(process.env.MONGODB_URI_OLD) : Promise.resolve({ up: false, error: 'not configured' }),
    pingR2(),
  ])

  // Get migration status
  let migration: Record<string, unknown> | null = null
  try {
    const settings = await SiteSettings.findOne().lean()
    migration = (settings?.legacyMigration ?? null) as unknown as Record<string, unknown> | null
  } catch {
    // ignore
  }

  const allUp = primary.up && r2.up
  return NextResponse.json({
    status: allUp ? 'healthy' : 'degraded',
    checkedAt: startedAt,
    services: {
      mongodb_primary: primary,
      mongodb_old_bahrain: oldCluster,
      cloudflare_r2: r2,
    },
    migration,
  }, { status: allUp ? 200 : 503 })
}
