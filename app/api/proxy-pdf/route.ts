import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get('id')
  if (!fileId || !/^[\w-]+$/.test(fileId)) {
    return new NextResponse('Invalid file id', { status: 400 })
  }

  // Use the standard uc?export=download URL — follows redirects and returns raw file bytes
  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

  try {
    const res = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
      redirect: 'follow',
    })

    if (!res.ok) {
      return new NextResponse('Could not fetch file', { status: 502 })
    }

    // Buffer fully so we control every response header (no passthrough from Google)
    const bytes = await res.arrayBuffer()

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="document.pdf"',
        'Content-Length': bytes.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse('Proxy error', { status: 500 })
  }
}
