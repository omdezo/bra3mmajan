'use client'

interface Props {
  idx: number
  total: number
  order: number
  busy: boolean
  onUp: () => void
  onDown: () => void
}

export default function OrderButtons({ idx, total, order, busy, onUp, onDown }: Props) {
  const btn = 'w-7 h-7 flex items-center justify-center rounded-lg text-white text-[11px] transition'
  const on  = 'bg-white/10 hover:bg-amber-500/30 hover:text-amber-300 active:scale-90'
  const off = 'opacity-20 cursor-not-allowed'

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      <button
        onClick={e => { e.stopPropagation(); if (!busy && idx > 0) onUp() }}
        disabled={idx === 0 || busy}
        title="للأعلى"
        className={`${btn} ${idx === 0 || busy ? off : on}`}
      >
        {busy ? <span className="animate-spin">⟳</span> : '▲'}
      </button>

      <span className="text-slate-500 text-[10px] font-mono leading-none tabular-nums w-5 text-center">
        {order}
      </span>

      <button
        onClick={e => { e.stopPropagation(); if (!busy && idx < total - 1) onDown() }}
        disabled={idx === total - 1 || busy}
        title="للأسفل"
        className={`${btn} ${idx === total - 1 || busy ? off : on}`}
      >
        {busy ? <span className="animate-spin">⟳</span> : '▼'}
      </button>
    </div>
  )
}
