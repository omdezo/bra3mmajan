import { NextRequest, NextResponse } from 'next/server'
import { createPresignedUpload } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, folder = 'uploads' } = await req.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 })
    }

    const result = await createPresignedUpload(filename, contentType, folder)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Presign error:', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
