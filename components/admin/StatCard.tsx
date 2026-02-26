'use client'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  gradient: string
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  subtitle?: string
}

export default function StatCard({ title, value, icon, gradient, change, changeType, subtitle }: StatCardProps) {
  return (
    <div className="relative bg-slate-800/50 border border-white/5 rounded-2xl p-5 overflow-hidden group hover:border-white/10 transition-all">
      {/* Gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              changeType === 'up' ? 'text-green-400' : changeType === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              <span>{changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
