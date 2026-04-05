/**
 * Automated DB Backup → Cloudflare R2
 *
 * Called by Vercel Cron daily. Dumps all collections to a single JSON file
 * in R2 under `backups/YYYY-MM-DD.json`, so if the primary cluster dies we
 * always have a warm copy in a different cloud provider.
 *
 * Manual trigger:   GET /api/backup?secret=$BACKUP_SECRET
 * Cron trigger:     Vercel adds `Authorization: Bearer $CRON_SECRET` header
 */
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/r2'

const BACKUP_SECRET = process.env.BACKUP_SECRET ?? 'backup_baraem_2026'
const CRON_SECRET = process.env.CRON_SECRET

// Always mark as dynamic — backups should never be cached
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Auth: either Vercel Cron header OR manual secret query param
  const authHeader = req.headers.get('authorization')
  const isVercelCron = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`
  const manualSecret = new URL(req.url).searchParams.get('secret')
  const isManual = manualSecret === BACKUP_SECRET

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const db = mongoose.connection.db
    if (!db) throw new Error('Database connection not ready')

    // Dump every collection
    const collections = await db.listCollections().toArray()
    const backup: Record<string, unknown[]> = {}
    const stats: Record<string, number> = {}

    for (const c of collections) {
      // Skip large ephemeral collections
      if (c.name === 'challengerooms') continue
      const docs = await db.collection(c.name).find({}).toArray()
      backup[c.name] = docs
      stats[c.name] = docs.length
    }

    const payload = {
      createdAt: new Date().toISOString(),
      schemaVersion: 1,
      collections: backup,
    }

    const body = Buffer.from(JSON.stringify(payload))
    const date = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const key = `backups/${date}.json`

    await r2.send(new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: 'application/json',
    }))

    return NextResponse.json({
      success: true,
      message: 'Backup uploaded to R2',
      key,
      publicUrl: `${process.env.CF_R2_PUBLIC_URL}/${key}`,
      sizeBytes: body.length,
      stats,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Backup failed'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
