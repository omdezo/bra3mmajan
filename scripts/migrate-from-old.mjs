/**
 * Manually migrate data FROM old Bahrain cluster TO new cluster.
 * (The same logic runs automatically via /api/migrate-check every 6h.)
 * Run this only if you want to force-migrate before the cron picks it up.
 *
 * Usage:
 *   OLD_MONGODB_URI="mongodb+srv://old..." \
 *   NEW_MONGODB_URI="mongodb+srv://new..." \
 *   node scripts/migrate-from-old.mjs
 *
 * Strategy: per collection, for each doc in OLD:
 *   - if NOT present in NEW (by natural key) → insert
 *   - if present → skip (don't overwrite newer data in NEW)
 * Result: NEW cluster becomes a superset. Safe to re-run (idempotent).
 */
import mongoose from 'mongoose'

const OLD_URI = process.env.OLD_MONGODB_URI
const NEW_URI = process.env.NEW_MONGODB_URI

if (!OLD_URI || !NEW_URI) {
  console.error('❌ Need OLD_MONGODB_URI and NEW_MONGODB_URI env vars')
  process.exit(1)
}
if (OLD_URI === NEW_URI) {
  console.error('❌ OLD_MONGODB_URI and NEW_MONGODB_URI are identical — refusing to run')
  process.exit(1)
}

// Collections + natural keys for dedup
const COLLECTIONS = [
  { name: 'games',           keys: ['title'] },
  { name: 'stories',         keys: ['title'] },
  { name: 'videos',          keys: ['title'] },
  { name: 'challenges',      keys: ['title'] },
  { name: 'oasiscontents',   keys: ['title'] },
  { name: 'treasures',       keys: ['title'] },
  { name: 'classsessions',   keys: ['title', 'grade'] },
  { name: 'admins',          keys: ['email'] },
  { name: 'pagestats',       keys: ['page'] },
  { name: 'visitorlogs',     keys: ['sessionId', 'page', 'visitedAt'] },
  { name: 'sitesettings',    keys: [], singleton: true },
  { name: 'challengerooms',  skip: true },
]

async function migrate() {
  console.log('🔌 Connecting to OLD cluster...')
  const oldConn = await mongoose.createConnection(OLD_URI, { serverSelectionTimeoutMS: 30000 }).asPromise()
  console.log('🔌 Connecting to NEW cluster...')
  const newConn = await mongoose.createConnection(NEW_URI, { serverSelectionTimeoutMS: 30000 }).asPromise()
  console.log('✅ Both connected\n')

  const summary = []

  for (const spec of COLLECTIONS) {
    const { name, keys, skip, singleton } = spec
    console.log(`\n📦 ${name}`)
    if (skip) { console.log('  ⏭  skipped'); summary.push({ name, inserted: 0, skipped: 0 }); continue }

    const oldCol = oldConn.db.collection(name)
    const newCol = newConn.db.collection(name)

    const oldCount = await oldCol.countDocuments()
    const newCount = await newCol.countDocuments()
    console.log(`  old: ${oldCount} · new: ${newCount}`)
    if (oldCount === 0) { summary.push({ name, inserted: 0, skipped: 0 }); continue }

    if (singleton) {
      if (newCount === 0) {
        const one = await oldCol.findOne({})
        if (one) { const { _id, ...rest } = one; await newCol.insertOne(rest) }
        console.log('  ✅ copied singleton')
        summary.push({ name, inserted: 1, skipped: 0 })
      } else {
        console.log('  ⏭  singleton already exists in new')
        summary.push({ name, inserted: 0, skipped: 1 })
      }
      continue
    }

    let inserted = 0, skippedCount = 0, progress = 0
    const cursor = oldCol.find({})
    for await (const doc of cursor) {
      progress++
      if (progress % 500 === 0) process.stdout.write(`\r  processing ${progress}/${oldCount}...`)

      const query = {}
      for (const k of keys) query[k] = doc[k]
      const exists = await newCol.findOne(query)
      if (exists) { skippedCount++; continue }
      const { _id, ...rest } = doc
      await newCol.insertOne(rest)
      inserted++
    }
    if (progress > 500) process.stdout.write('\r')
    console.log(`  ✅ +${inserted} inserted, ${skippedCount} already existed`)
    summary.push({ name, inserted, skipped: skippedCount })
  }

  console.log('\n\n📊 Migration summary:')
  console.log('─'.repeat(50))
  for (const s of summary) {
    console.log(`  ${s.name.padEnd(18)} +${String(s.inserted).padStart(4)}  (${s.skipped} skipped)`)
  }
  console.log('─'.repeat(50))
  const total = summary.reduce((a, s) => a + s.inserted, 0)
  console.log(`  TOTAL inserted: ${total}`)

  await oldConn.close()
  await newConn.close()
  console.log('\n✅ Migration complete')
}

migrate().catch(err => { console.error('❌', err.message); process.exit(1) })
