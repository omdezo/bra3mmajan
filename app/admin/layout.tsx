import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم | براعم مجان',
  description: 'لوحة إدارة منصة براعم مجان التعليمية',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
