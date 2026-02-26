'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PageStat {
  page: string
  pageName: string
  totalVisits: number
  uniqueVisitors: number
  lastVisit: string
}

const COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6']

export default function VisitorsAdminPage() {
  const [stats, setStats] = useState<PageStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/visitors')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const total = stats.reduce((s, p) => s + p.totalVisits, 0)
  const unique = stats.reduce((s, p) => s + p.uniqueVisitors, 0)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ar-OM', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <AdminShell title="إحصائيات الزوار" subtitle="بيانات الزيارات لجميع الصفحات">
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">جاري التحميل...</div>
      ) : (
        <div className="space-y-6">
          {/* Totals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'إجمالي الزيارات', value: total, icon: '👁️', gradient: 'from-purple-500 to-indigo-600' },
              { label: 'زوار فريدون', value: unique, icon: '👤', gradient: 'from-blue-500 to-cyan-600' },
              { label: 'الصفحات المتتبعة', value: stats.length, icon: '📄', gradient: 'from-green-500 to-teal-600' },
            ].map(card => (
              <div key={card.label} className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{card.label}</span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-base`}>{card.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white">{card.value.toLocaleString('ar')}</div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          {stats.length > 0 && (
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">الزيارات حسب الصفحة</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
                  <XAxis dataKey="pageName" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    formatter={(v, name) => [v, name === 'totalVisits' ? 'زيارات' : 'فريدون']}
                  />
                  <Bar dataKey="totalVisits" radius={[4, 4, 0, 0]}>
                    {stats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">الصفحة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">إجمالي الزيارات</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">زوار فريدون</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">آخر زيارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">لا توجد بيانات زوار بعد</td></tr>
                ) : stats.map((p, i) => (
                  <tr key={p.page} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-white font-medium">{p.pageName || p.page}</span>
                        <span className="text-slate-500 text-xs">{p.page}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.totalVisits.toLocaleString('ar')}</td>
                    <td className="px-4 py-3 text-slate-300">{p.uniqueVisitors.toLocaleString('ar')}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.lastVisit ? formatDate(p.lastVisit) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
