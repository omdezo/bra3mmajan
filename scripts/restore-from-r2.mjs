/**
 * Restore DB from an R2 backup file.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." \
 *   BACKUP_URL="https://pub-f16c0add9a9747b8953bd12c38d37d0e.r2.dev/backups/2026-04-05.json" \
 *   node scripts/restore-from-r2.mjs
 *
 * OR:
 *   MONGODB_URI="mongodb+srv://..." \
 *   BACKUP_FILE="./backup.json" \
 *   node scripts/restore-from-r2.mjs
 */
import mongoose from 'mongoose'
import fs from 'fs'

const MONGODB_URI = process.env.MONGODB_URI
const BACKUP_URL = process.env.BACKUP_URL
const BACKUP_FILE = process.env.BACKUP_FILE

if (!MONGODB_URI || (!BACKUP_URL && !BACKUP_FILE)) {
  console.error('❌ Need MONGODB_URI + (BACKUP_URL or BACKUP_FILE)')
  process.exit(1)
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
  console.log(`✅ Loaded backup from ${backup.createdAt}`)
  console.log(`   Collections: ${Object.keys(backup.collections).length}`)

  console.log('\n🔌 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 20000 })
  const db = mongoose.connection.db
  console.log('✅ Connected\n')

  for (const [name, docs] of Object.entries(backup.collections)) {
    if (!Array.isArray(docs) || docs.length === 0) continue
    const col = db.collection(name)
    const existing = await col.countDocuments()

    // For each doc in backup, upsert by _id if present
    let inserted = 0, skipped = 0
    for (const doc of docs) {
      const { _id, ...rest } = doc
      try {
        // Try inserting with original _id; if conflict, skip
        if (_id) {
          await col.insertOne({ _id, ...rest })
          inserted++
        } else {
          await col.insertOne(rest)
          inserted++
        }
      } catch (err) {
        if (err.code === 11000) skipped++
        else throw err
      }
    }
    console.log(`  ${name}: +${inserted}  (${skipped} dup, had ${existing})`)
  }

  console.log('\n✅ Restore complete')
  await mongoose.disconnect()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
