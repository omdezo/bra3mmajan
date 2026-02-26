'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '/admin/dashboard', icon: '📊' },
  { label: 'الألعاب', href: '/admin/games', icon: '🎮' },
  { label: 'القصص', href: '/admin/stories', icon: '📖' },
  { label: 'المشاهدة', href: '/admin/watch', icon: '🎬' },
  { label: 'التحديات', href: '/admin/challenges', icon: '🏆' },
  { label: 'الواحة', href: '/admin/oasis', icon: '🌿' },
  { label: 'كنوز التراث', href: '/admin/variety', icon: '💎' },
  { label: 'الفصول الافتراضية', href: '/admin/classes', icon: '🎓' },
  { label: 'الزوار', href: '/admin/visitors', icon: '👁️' },
  { label: 'إعدادات الموقع', href: '/admin/settings', icon: '⚙️' },
]

interface AdminShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function AdminShell({ children, title, subtitle, actions }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState('المشرف')
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.success) setAdminName(d.data.name) })
      .catch(() => {})
  }, [])

  const handleLogout = useCallback(async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }, [router])

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-slate-900 border-l border-white/5 z-50 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Image src="/assets/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">براعم مجان</div>
            <div className="text-xs text-slate-400">لوحة التحكم</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin/dashboard')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${
                  active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="mr-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Admin User */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {adminName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-white truncate">{adminName}</div>
              <div className="text-xs text-slate-400">مشرف عام</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl py-2 text-sm transition"
          >
            <span>🚪</span>
            <span>{loggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
          </button>
        </div>

        {/* Site Link */}
        <div className="px-4 pb-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl py-2 text-xs transition"
          >
            <span>🌐</span>
            <span>عرض الموقع</span>
            <span>↗</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
