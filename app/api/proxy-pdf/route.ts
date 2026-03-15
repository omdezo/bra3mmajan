import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get('id')
  if (!fileId || !/^[\w-]+$/.test(fileId)) {
    return new NextResponse('Invalid file id', { status: 400 })
  }

  // Google's usercontent domain serves Drive files directly (no X-Frame-Options)
  const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`

  try {
    const res = await fetch(driveUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      redirect: 'follow',
    })

    if (!res.ok) {
      return new NextResponse('Could not fetch file from Google Drive', { status: 502 })
    }

    const ct = res.headers.get('content-type') ?? 'application/pdf'

    // Stream the body directly to avoid buffering the whole file in memory
    return new NextResponse(res.body, {
      headers: {
        'Content-Type': ct.includes('pdf') ? 'application/pdf' : ct,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Proxy error', { status: 500 })
  }
}
