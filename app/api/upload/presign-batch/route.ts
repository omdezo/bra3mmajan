import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { files } = await req.json() as { files: { path: string; contentType: string }[] }

  const packageId = `${Date.now()}-${randomBytes(4).toString('hex')}`
  const basePath = `presentations/pkg-${packageId}`

  const results = await Promise.all(
    files.map(async ({ path, contentType }) => {
      const key = `${basePath}/${path}`
      const cmd = new PutObjectCommand({
        Bucket: process.env.CF_R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
      })
      const presignedUrl = await getSignedUrl(r2, cmd, {
        expiresIn: 3600,
        unhoistableHeaders: new Set(['x-amz-checksum-crc32', 'x-amz-sdk-checksum-algorithm']),
      })
      return { path, presignedUrl }
    })
  )

  return NextResponse.json({
    success: true,
    indexUrl: `${process.env.CF_R2_PUBLIC_URL}/${basePath}/index.html`,
    files: results,
  })
}
