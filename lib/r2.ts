import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomBytes } from 'crypto'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
})

export async function createPresignedUpload(
  filename: string,
  contentType: string,
  folder = 'uploads'
): Promise<{ presignedUrl: string; publicUrl: string; key: string }> {
  const ext = filename.split('.').pop() ?? 'bin'
  const key = `${folder}/${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`

  const cmd = new PutObjectCommand({
    Bucket: process.env.CF_R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(r2, cmd, { expiresIn: 3600 })
  const publicUrl = `${process.env.CF_R2_PUBLIC_URL}/${key}`

  return { presignedUrl, publicUrl, key }
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.CF_R2_BUCKET_NAME!,
    Key: key,
  }))
}
