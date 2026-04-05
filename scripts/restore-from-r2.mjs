/**
 * Restore DB from an R2 backup file.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." \
 *   BACKUP_URL="https://pub-....r2.dev/backups/2026-04-05.json" \
 *   node scripts/restore-from-r2.mjs
 *
 * Flags:
 *   DRY_RUN=1     — print what would be restored without writing
 *   WIPE_FIRST=1  — DANGEROUS: drop each collection before restoring
 */
import mongoose from 'mongoose'
import fs from 'fs'

const MONGODB_URI = process.env.MONGODB_URI
const BACKUP_URL = process.env.BACKUP_URL
const BACKUP_FILE = process.env.BACKUP_FILE
const DRY_RUN = process.env.DRY_RUN === '1'
const WIPE_FIRST = process.env.WIPE_FIRST === '1'

if (!MONGODB_URI || (!BACKUP_URL && !BACKUP_FILE)) {
  console.error('❌ Need MONGODB_URI + (BACKUP_URL or BACKUP_FILE)')
  process.exit(1)
}

// Convert plain objects with _id string back to Mongo ObjectId, and
// date-shaped strings to Date objects, so restored data is indistinguishable
// from live data.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/
function rehydrate(value) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'string' && ISO_DATE.test(value)) return new Date(value)
    return value
  }
  if (Array.isArray(value)) return value.map(rehydrate)
  const out = {}
  for (const [k, v] of Object.entries(value)) {
    if (k === '_id' && typeof v === 'string' && /^[a-f0-9]{24}$/i.test(v)) {
      out._id = new mongoose.Types.ObjectId(v)
    } else if (v && typeof v === 'object' && '$oid' in v && typeof v.$oid === 'string') {
      // Support Mongo Extended JSON for ObjectIds
      out[k] = new mongoose.Types.ObjectId(v.$oid)
    } else if (v && typeof v === 'object' && '$date' in v) {
      out[k] = new Date(v.$date)
    } else {
      out[k] = rehydrate(v)
    }
  }
  return out
}

async function loadBackup() {
  if (BACKUP_FILE) {
    console.log(`📂 Reading local file: ${BACKUP_FILE}`)
    return JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'))
  }
  console.log(`📥 Downloading: ${BACKUP_URL}`)
  const res = await fetch(BACKUP_URL)
  if (!res.ok) throw new Error(`Failed to fetch backup: ${res.status}`)
  return res.json()
}

async function main() {
  const backup = await loadBackup()
  const version = backup.schemaVersion ?? 1
  console.log(`✅ Loaded backup (schema v${version}) from ${backup.createdAt}`)
  const collections = backup.collections
  console.log(`   Collections: ${Object.keys(collections).length}`)
  if (DRY_RUN) console.log('🚧 DRY_RUN mode — no writes will be made')
  if (WIPE_FIRST) console.log('⚠️  WIPE_FIRST mode — will drop collections before restoring')

  console.log('\n🔌 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 20000 })
  const db = mongoose.connection.db
  console.log('✅ Connected\n')

  for (const [name, raw] of Object.entries(collections)) {
    // schema v2: { docs, indexes } · v1: direct array
    const docs = Array.isArray(raw) ? raw : raw?.docs ?? []
    const indexes = !Array.isArray(raw) ? raw?.indexes ?? [] : []
    if (!Array.isArray(docs) || docs.length === 0) { console.log(`  ${name}: empty, skip`); continue }

    const col = db.collection(name)
    if (WIPE_FIRST && !DRY_RUN) await col.drop().catch(() => {})
    const existing = await col.countDocuments()

    let inserted = 0, dup = 0
    for (const rawDoc of docs) {
      const doc = rehydrate(rawDoc)
      if (DRY_RUN) { inserted++; continue }
      try {
        await col.insertOne(doc)
        inserted++
      } catch (err) {
        if (err.code === 11000) dup++
        else throw err
      }
    }

    // Recreate indexes (skip the default _id_)
    let indexesCreated = 0
    if (!DRY_RUN) {
      for (const idx of indexes) {
        if (!idx.key || idx.name === '_id_') continue
        try {
          await col.createIndex(idx.key, { name: idx.name, unique: idx.unique, sparse: idx.sparse })
          indexesCreated++
        } catch { /* ignore duplicate index */ }
      }
    }

    console.log(`  ${name}: +${inserted} inserted · ${dup} dup · ${indexesCreated} idx · had ${existing}`)
  }

  console.log('\n✅ Restore complete')
  await mongoose.disconnect()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
