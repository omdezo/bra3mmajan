import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

const CC = 'https://api.cloudconvert.com/v2'

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

export async function POST(req: NextRequest) {
  const { pptUrl } = await req.json()
  const apiKey = process.env.CLOUDCONVERT_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'CLOUDCONVERT_API_KEY not set' }, { status: 500 })

  const outputKey = `presentations/pdf-${Date.now()}.pdf`

  // Import PPT from R2 → convert to PDF → export PDF back to R2
  const jobRes = await fetch(`${CC}/jobs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tasks: {
        'import': {
          operation: 'import/url',
          url: pptUrl,
        },
        'convert': {
          operation: 'convert',
          input: 'import',
          output_format: 'pdf',
          engine: 'libreoffice',
        },
        'export': {
          operation: 'export/s3',
          input: 'convert',
          bucket: process.env.CF_R2_BUCKET_NAME!,
          region: 'auto',
          endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          access_key_id: process.env.CF_R2_ACCESS_KEY_ID!,
          secret_access_key: process.env.CF_R2_SECRET_ACCESS_KEY!,
          key: outputKey,
        },
      },
    }),
  })

  if (!jobRes.ok) {
    return NextResponse.json({ error: `CloudConvert: ${await jobRes.text()}` }, { status: 500 })
  }

  const { data: job } = await jobRes.json()

  // Poll until done (max ~3 min)
  for (let i = 0; i < 60; i++) {
    await sleep(3000)
    const { data } = await (await fetch(`${CC}/jobs/${job.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })).json()

    if (data.status === 'finished') {
      return NextResponse.json({ pdfUrl: `${process.env.CF_R2_PUBLIC_URL}/${outputKey}` })
    }
    if (data.status === 'error') {
      const failed = data.tasks?.find((t: { status: string }) => t.status === 'error')
      return NextResponse.json({ error: failed?.message ?? 'Conversion failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Conversion timed out' }, { status: 408 })
}
