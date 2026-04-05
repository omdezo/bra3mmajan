/**
 * Auto-Migration Cron — Polls the old Bahrain cluster and migrates its data
 * into the new cluster the moment AWS me-south-1 recovers.
 *
 * Runs every 6h via Vercel Cron. Safe to call many times:
 *   - If MONGODB_URI_OLD not set → skip
 *   - If already completed → skip
 *   - If old cluster unreachable → log attempt, return
 *   - Otherwise → migrate, mark completed
 *
 * The migration is keyed on a natural business key per collection (title,
 * email, etc.) so items already in the new cluster are NEVER overwritten.
 * Items that existed only in the old cluster get appended.
 */
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import { SiteSettings } from '@/lib/models/SiteSettings'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // seconds

const CRON_SECRET = process.env.CRON_SECRET
const MANUAL_SECRET = process.env.BACKUP_SECRET ?? 'backup_baraem_2026'

interface CollectionSpec {
  name: string
  keys: string[]  // natural keys for dedup; empty = append all
  skip?: boolean
}

const COLLECTIONS: CollectionSpec[] = [
  { name: 'games',         keys: ['title'] },
  { name: 'stories',       keys: ['title'] },
  { name: 'videos',        keys: ['title'] },
  { name: 'challenges',    keys: ['title'] },
  { name: 'oasiscontents', keys: ['title'] },
  { name: 'treasures',     keys: ['title'] },
  { name: 'classsessions', keys: ['title', 'grade'] },
  { name: 'admins',        keys: ['email'] },
  { name: 'pagestats',     keys: ['page'] },
  { name: 'visitorlogs',   keys: ['sessionId', 'page', 'visitedAt'] },
  { name: 'challengerooms', skip: true, keys: [] },
]

export async function GET(req: NextRequest) {
  // Auth
  const authHeader = req.headers.get('authorization')
  const isCron = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`
  const manualSecret = new URL(req.url).searchParams.get('secret')
  const isManual = manualSecret === MANUAL_SECRET
  if (!isCron && !isManual) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const OLD_URI = process.env.MONGODB_URI_OLD
  const NEW_URI = process.env.MONGODB_URI

  // Safety: no old URI, or same as new → nothing to do
  if (!OLD_URI) {
    return NextResponse.json({ success: true, status: 'skipped', reason: 'MONGODB_URI_OLD not set' })
  }
  if (OLD_URI === NEW_URI) {
    return NextResponse.json({ success: false, error: 'OLD and NEW URIs are identical — refusing to run' }, { status: 400 })
  }

  try {
    await connectDB()
    const settings = await SiteSettings.findOne()
    if (!settings) {
      return NextResponse.json({ success: false, error: 'SiteSettings missing' }, { status: 500 })
    }

    // Already done? Skip.
    if (settings.legacyMigration?.status === 'completed') {
      return NextResponse.json({
        success: true, status: 'already_completed',
        completedAt: settings.legacyMigration.completedAt,
        stats: settings.legacyMigration.stats,
      })
    }

    // Test old cluster reachability with a short timeout
    let oldConn: mongoose.Connection | null = null
    try {
      oldConn = await mongoose.createConnection(OLD_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      }).asPromise()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // Log the attempt
      settings.legacyMigration = {
        status: 'pending',
        lastAttemptAt: new Date(),
        attempts: (settings.legacyMigration?.attempts ?? 0) + 1,
        error: msg.slice(0, 200),
        stats: settings.legacyMigration?.stats,
        completedAt: settings.legacyMigration?.completedAt,
      }
      await settings.save()
      return NextResponse.json({
        success: true, status: 'old_cluster_unreachable',
        attempts: settings.legacyMigration.attempts,
        lastAttemptAt: settings.legacyMigration.lastAttemptAt,
        message: 'Old cluster still down, will retry on next cron',
      })
    }

    // Old cluster is UP — run migration
    settings.legacyMigration = {
      status: 'in_progress',
      lastAttemptAt: new Date(),
      attempts: (settings.legacyMigration?.attempts ?? 0) + 1,
    }
    await settings.save()

    const oldDb = oldConn.db!
    const newDb = mongoose.connection.db!
    const stats: Record<string, number> = {}
    const errors: string[] = []

    for (const spec of COLLECTIONS) {
      if (spec.skip) { stats[spec.name] = 0; continue }

      try {
        const oldCol = oldDb.collection(spec.name)
        const newCol = newDb.collection(spec.name)
        const oldCount = await oldCol.countDocuments()
        if (oldCount === 0) { stats[spec.name] = 0; continue }

        let inserted = 0
        const cursor = oldCol.find({})
        for await (const doc of cursor) {
          if (spec.keys.length === 0) {
            const { _id, ...rest } = doc
            await newCol.insertOne(rest).catch(() => {})
            inserted++
            continue
          }
          const query: Record<string, unknown> = {}
          for (const k of spec.keys) query[k] = doc[k]
          const exists = await newCol.findOne(query)
          if (exists) continue
          const { _id, ...rest } = doc
          await newCol.insertOne(rest)
          inserted++
        }
        stats[spec.name] = inserted
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`${spec.name}: ${msg}`)
        stats[spec.name] = -1
      }
    }

    await oldConn.close()

    // Mark done
    const hasErrors = errors.length > 0
    settings.legacyMigration = {
      status: hasErrors ? 'failed' : 'completed',
      lastAttemptAt: new Date(),
      completedAt: hasErrors ? undefined : new Date(),
      attempts: settings.legacyMigration.attempts,
      stats,
      error: hasErrors ? errors.join('; ').slice(0, 500) : undefined,
    }
    await settings.save()

    return NextResponse.json({
      success: !hasErrors,
      status: hasErrors ? 'failed' : 'migrated',
      stats,
      errors,
      totalInserted: Object.values(stats).reduce((a, b) => a + Math.max(0, b), 0),
      completedAt: settings.legacyMigration.completedAt,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
