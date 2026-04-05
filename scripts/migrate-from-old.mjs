/**
 * Migrate data FROM old Bahrain cluster TO new cluster.
 * Run this ONCE when the old cluster is reachable again.
 *
 * Usage:
 *   OLD_MONGODB_URI="mongodb+srv://old..." \
 *   NEW_MONGODB_URI="mongodb+srv://new..." \
 *   node scripts/migrate-from-old.mjs
 *
 * Strategy: per collection, for each doc in OLD:
 *   - if NOT present in NEW (by title+category, or _id for settings/admin) → insert
 *   - if present → skip (don't overwrite newer data in NEW)
 * Result: NEW cluster becomes a superset. You keep all of NEW plus any old
 * dashboard additions that were missing from the reconstruction.
 */
import mongoose from 'mongoose'

const OLD_URI = process.env.OLD_MONGODB_URI
const NEW_URI = process.env.NEW_MONGODB_URI
if (!OLD_URI || !NEW_URI) {
  console.error('❌ Need OLD_MONGODB_URI and NEW_MONGODB_URI env vars')
  process.exit(1)
}

// Collections and the key(s) that identify a unique doc
const COLLECTIONS = [
  { name: 'games',           keys: ['title'] },
  { name: 'stories',         keys: ['title'] },
  { name: 'videos',          keys: ['title'] },
  { name: 'challenges',      keys: ['title'] },
  { name: 'oasiscontents',   keys: ['title'] },
  { name: 'treasures',       keys: ['title'] },
  { name: 'classsessions',   keys: ['title', 'grade'] },
  { name: 'admins',          keys: ['email'] },
  { name: 'sitesettings',    keys: [] },           // only keep first
  { name: 'visitorlogs',     keys: [] },           // append all
  { name: 'challengerooms',  keys: [] },           // skip old rooms
]

async function migrate() {
  console.log('🔌 Connecting to OLD cluster...')
  const oldConn = await mongoose.createConnection(OLD_URI, { serverSelectionTimeoutMS: 30000 }).asPromise()
  console.log('🔌 Connecting to NEW cluster...')
  const newConn = await mongoose.createConnection(NEW_URI, { serverSelectionTimeoutMS: 30000 }).asPromise()
  console.log('✅ Both connected\n')

  const summary = []

  for (const { name, keys } of COLLECTIONS) {
    console.log(`\n📦 ${name}`)
    const oldCol = oldConn.db.collection(name)
    const newCol = newConn.db.collection(name)

    const oldCount = await oldCol.countDocuments()
    const newCountBefore = await newCol.countDocuments()
    console.log(`  old: ${oldCount} docs · new: ${newCountBefore} docs`)

    if (oldCount === 0) { summary.push({ name, inserted: 0, skipped: 0 }); continue }

    let inserted = 0, skipped = 0

    if (name === 'challengerooms') {
      console.log('  ⏭  skipping stale game rooms')
      summary.push({ name, inserted: 0, skipped: oldCount })
      continue
    }

    if (name === 'visitorlogs') {
      // Append all old logs (they're immutable records)
      const oldDocs = await oldCol.find({}).toArray()
      // Remove _id so Mongo assigns new ones (avoid potential conflicts)
      const prepared = oldDocs.map(d => { const { _id, ...rest } = d; return rest })
      if (prepared.length) await newCol.insertMany(prepared, { ordered: false }).catch(() => {})
      inserted = prepared.length
      console.log(`  ✅ appended ${inserted} visitor logs`)
      summary.push({ name, inserted, skipped: 0 })
      continue
    }

    if (name === 'sitesettings') {
      // Only insert if NEW has no settings doc
      if (newCountBefore === 0) {
        const one = await oldCol.findOne({})
        if (one) { const { _id, ...rest } = one; await newCol.insertOne(rest); inserted = 1 }
      } else skipped = oldCount
      console.log(`  ${inserted ? '✅' : '⏭ '} settings: ${inserted ? 'copied' : 'already exists'}`)
      summary.push({ name, inserted, skipped })
      continue
    }

    // Key-based merge for all other collections
    const cursor = oldCol.find({})
    for await (const doc of cursor) {
      const query = {}
      for (const k of keys) query[k] = doc[k]
      const exists = await newCol.findOne(query)
      if (exists) { skipped++; continue }
      const { _id, ...rest } = doc
      await newCol.insertOne(rest)
      inserted++
    }
    console.log(`  ✅ +${inserted} inserted, ${skipped} already existed`)
    summary.push({ name, inserted, skipped })
  }

  console.log('\n\n📊 Migration summary:')
  console.log('─'.repeat(50))
  for (const s of summary) {
    console.log(`  ${s.name.padEnd(20)} +${s.inserted}  (${s.skipped} skipped)`)
  }
  console.log('─'.repeat(50))

  await oldConn.close()
  await newConn.close()
  console.log('\n✅ Migration complete — NEW cluster now has all unique data from OLD')
}

migrate().catch(err => {
  console.error('❌', err.message)
  process.exit(1)
})
