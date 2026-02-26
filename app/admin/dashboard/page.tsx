'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import StatCard from '@/components/admin/StatCard'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

interface DashboardStats {
  content: {
    games: number; stories: number; videos: number;
    challenges: number; oasis: number; treasures: number; classes: number; total: number
  }
  visitors: {
    total: number; unique: number; recentWeek: number
    byPage: Array<{ page: string; pageName: string; totalVisits: number; uniqueVisitors: number }>
    dailyChart: Array<{ _id: string; count: number }>
  }
}

const CONTENT_CARDS = [
  { key: 'games', label: 'الألعاب', icon: '🎮', gradient: 'from-blue-500 to-purple-600', href: '/admin/games' },
  { key: 'stories', label: 'القصص', icon: '📖', gradient: 'from-yellow-500 to-orange-500', href: '/admin/stories' },
  { key: 'videos', label: 'الفيديوهات', icon: '🎬', gradient: 'from-pink-500 to-rose-500', href: '/admin/watch' },
  { key: 'challenges', label: 'التحديات', icon: '🏆', gradient: 'from-sky-500 to-blue-600', href: '/admin/challenges' },
  { key: 'oasis', label: 'الواحة', icon: '🌿', gradient: 'from-green-500 to-teal-600', href: '/admin/oasis' },
  { key: 'treasures', label: 'كنوز التراث', icon: '💎', gradient: 'from-amber-500 to-orange-500', href: '/admin/variety' },
  { key: 'classes', label: 'الفصول', icon: '🎓', gradient: 'from-indigo-500 to-purple-600', href: '/admin/classes' },
]

const PAGE_COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d: string) => {
    const dt = new Date(d)
    return `${dt.getDate()}/${dt.getMonth() + 1}`
  }

  return (
    <AdminShell title="لوحة التحكم" subtitle="نظرة عامة على المنصة">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <svg className="animate-spin h-8 w-8 ml-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          جاري تحميل الإحصائيات...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Seed Banner */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">تهيئة البيانات الأولية</p>
              <p className="text-xs text-slate-400">إذا كانت قاعدة البيانات فارغة، اضغط لتعبئتها ببيانات ابتدائية</p>
            </div>
            <button
              onClick={() => fetch('/api/seed?secret=baraem_seed_2024', { method: 'POST' }).then(() => window.location.reload())}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex-shrink-0"
            >
              🌱 تهيئة البيانات
            </button>
          </div>

          {/* Visitor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="إجمالي الزيارات"
              value={stats?.visitors.total.toLocaleString('ar') ?? '٠'}
              icon="👁️"
              gradient="from-purple-500 to-indigo-600"
              subtitle="منذ بداية التشغيل"
            />
            <StatCard
              title="الزوار الفريدون"
              value={stats?.visitors.unique.toLocaleString('ar') ?? '٠'}
              icon="👤"
              gradient="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="زيارات هذا الأسبوع"
              value={stats?.visitors.recentWeek.toLocaleString('ar') ?? '٠'}
              icon="📈"
              gradient="from-green-500 to-teal-600"
              change="آخر ٧ أيام"
              changeType="neutral"
            />
          </div>

          {/* Daily Chart */}
          {stats?.visitors.dailyChart && stats.visitors.dailyChart.length > 0 && (
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">الزيارات اليومية (آخر ٧ أيام)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.visitors.dailyChart} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="_id"
                    tickFormatter={formatDate}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    labelFormatter={(l) => formatDate(String(l))}
                    formatter={(v) => [v, 'زيارات']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.visitors.dailyChart.map((_, i) => (
                      <Cell key={i} fill={PAGE_COLORS[i % PAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Content Cards */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">إدارة المحتوى</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {CONTENT_CARDS.map(card => (
                <Link key={card.key} href={card.href}
                  className="bg-slate-800/50 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition group hover:shadow-lg"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-0.5">
                    {stats?.content[card.key as keyof typeof stats.content] ?? 0}
                  </div>
                  <div className="text-xs text-slate-400">{card.label}</div>
                </Link>
              ))}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-lg mb-3">
                  📦
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">
                  {stats?.content.total ?? 0}
                </div>
                <div className="text-xs text-slate-400">إجمالي المحتوى</div>
              </div>
            </div>
          </div>

          {/* Pages Visitors */}
          {stats?.visitors.byPage && stats.visitors.byPage.length > 0 && (
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">الزيارات حسب الصفحة</h3>
              <div className="space-y-3">
                {stats.visitors.byPage.slice(0, 8).map((p, i) => {
                  const maxVisits = Math.max(...stats.visitors.byPage.map(x => x.totalVisits))
                  const pct = maxVisits > 0 ? (p.totalVisits / maxVisits) * 100 : 0
                  return (
                    <div key={p.page} className="flex items-center gap-3">
                      <div className="w-20 text-xs text-slate-400 truncate text-left">{p.pageName || p.page}</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: PAGE_COLORS[i % PAGE_COLORS.length] }}
                        />
                      </div>
                      <div className="w-12 text-xs text-slate-300 text-left">{p.totalVisits}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}
