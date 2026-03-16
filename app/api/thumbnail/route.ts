import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 10

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ url: null })

  // ── Google Drive — thumbnail API (no extra fetch needed) ──────
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  if (driveMatch) {
    return NextResponse.json(
      { url: `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w480` },
      { headers: { 'Cache-Control': 'public, max-age=86400' } },
    )
  }

  // ── Canva — extract og:image from the public design page ──────
  if (url.includes('canva.com')) {
    try {
      const pageUrl = url.includes('?embed')
        ? url.replace('?embed', '')          // strip embed param for the view page
        : url
      const res = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          Accept: 'text/html',
        },
        signal: AbortSignal.timeout(6000),
      })
      const html = await res.text()

      // try both attribute orders
      const m =
        html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)

      if (m?.[1]) {
        return NextResponse.json(
          { url: m[1] },
          { headers: { 'Cache-Control': 'public, max-age=3600' } },
        )
      }
    } catch {
      // fall through to null
    }
  }

  return NextResponse.json({ url: null })
}
