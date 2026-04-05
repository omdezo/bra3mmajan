/**
 * Automated DB Backup → Cloudflare R2
 *
 * - Dumps every collection + its indexes
 * - Uploads as backups/YYYY-MM-DD.json
 * - Retains last 30 daily backups (deletes older)
 *
 * Manual trigger: GET /api/backup?secret=$BACKUP_SECRET
 * Cron trigger:   Vercel sends Authorization: Bearer $CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'
import { PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/r2'

const BACKUP_SECRET = process.env.BACKUP_SECRET ?? 'backup_baraem_2026'
const CRON_SECRET = process.env.CRON_SECRET
const RETENTION_DAYS = 30

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Auth
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

    // Dump every collection + its indexes
    const collections = await db.listCollections().toArray()
    const backup: Record<string, { docs: unknown[]; indexes: unknown[] }> = {}
    const stats: Record<string, number> = {}

    for (const c of collections) {
      if (c.name === 'challengerooms') continue // ephemeral
      const col = db.collection(c.name)
      const [docs, indexes] = await Promise.all([
        col.find({}).toArray(),
        col.indexes().catch(() => []),
      ])
      backup[c.name] = { docs, indexes }
      stats[c.name] = docs.length
    }

    const payload = {
      createdAt: new Date().toISOString(),
      schemaVersion: 2, // v2 includes indexes
      stats,
      collections: backup,
    }

    const body = Buffer.from(JSON.stringify(payload))
    const date = new Date().toISOString().slice(0, 10)
    const key = `backups/${date}.json`

    await r2.send(new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: 'application/json',
    }))

    // Retention: delete backups older than RETENTION_DAYS
    let deleted = 0
    try {
      const list = await r2.send(new ListObjectsV2Command({
        Bucket: process.env.CF_R2_BUCKET_NAME!,
        Prefix: 'backups/',
      }))
      const cutoff = Date.now() - RETENTION_DAYS * 24 * 3600 * 1000
      for (const obj of list.Contents ?? []) {
        if (!obj.Key || !obj.LastModified) continue
        if (obj.LastModified.getTime() < cutoff) {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.CF_R2_BUCKET_NAME!,
            Key: obj.Key,
          }))
          deleted++
        }
      }
    } catch {
      // retention failure is non-fatal
    }

    return NextResponse.json({
      success: true,
      message: 'Backup uploaded',
      key,
      publicUrl: `${process.env.CF_R2_PUBLIC_URL}/${key}`,
      sizeBytes: body.length,
      sizeKB: +(body.length / 1024).toFixed(1),
      collections: Object.keys(stats).length,
      totalDocs: Object.values(stats).reduce((a, b) => a + b, 0),
      stats,
      retention: { days: RETENTION_DAYS, deleted },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Backup failed'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
