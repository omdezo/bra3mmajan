'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { VisitorCounter } from '@/components/VisitorCounter'

/* ─── Types ───────────────────────────────────────────────────── */
interface Challenge {
  _id: string; title: string; description: string; category: string
  icon: string; color: string; difficulty: string; allowedModes: string[]
  questions: unknown[]; basePoints: number; defaultTimeLimit: number
  speedBonus: boolean; participantsCount: number; isComingSoon: boolean
}
interface RoomPlayer { name: string; score: number; team: 'A'|'B'; isReady: boolean; answeredCurrent: boolean; sessionId?: string }
interface RoomQuestion { index: number; total: number; question: string; options: string[]; timeLimit: number; points: number; hint?: string; correctAnswer?: number }
interface RoomState {
  code: string; mode: string; status: 'waiting'|'countdown'|'playing'|'results'
  maxPlayers: number; challengeTitle: string; speedBonus: boolean
  players: RoomPlayer[]; teamScores: {A:number;B:number}
  currentQuestion: RoomQuestion|null
  questionStartedAt?: string; countdownStartedAt?: string
}
interface AnswerResult { correct: boolean; correctAnswer: number; pointsEarned: number; multiplier: number; tier: string; bonus: number; newScore: number }
interface LeaderboardEntry { rank: number; name: string; score: number; team: string; correct: number; total: number }

type Screen = 'hub'|'name'|'mode'|'waiting'|'countdown'|'playing'|'results'

/* ─── Constants ────────────────────────────────────────────────── */
const MODES = [
  { key:'solo', label:'فردي', icon:'👤', desc:'اختبر نفسك' },
  { key:'1v1',  label:'١ ضد ١', icon:'⚔️', desc:'منافسة مباشرة' },
  { key:'2v2',  label:'٢ ضد ٢', icon:'👥', desc:'فريقان من ٢' },
  { key:'4v4',  label:'٤ ضد ٤', icon:'🏟️', desc:'فريقان من ٤' },
]
const DIFF_GRAD: Record<string,string> = {
  'سهل':'from-green-400 to-emerald-500',
  'متوسط':'from-yellow-400 to-orange-500',
  'صعب':'from-red-400 to-rose-600',
}
const OPT_LABELS = ['أ','ب','ج','د']
const OPT_IDLE  = ['border-blue-400/40 bg-blue-500/10','border-pink-400/40 bg-pink-500/10','border-amber-400/40 bg-amber-500/10','border-purple-400/40 bg-purple-500/10']
const TIER_INFO: Record<string,{label:string;color:string}> = {
  blazing:{label:'سرعة مذهلة! ×٢',  color:'text-yellow-300'},
  fast:   {label:'سريع! ×١.٥',       color:'text-blue-300'},
  normal: {label:'ممتاز ×١.٢٥',      color:'text-green-300'},
  slow:   {label:'صحيح ×١',          color:'text-slate-300'},
}

function getSessionId() {
  if (typeof window==='undefined') return ''
  let id = sessionStorage.getItem('baraem_session_id')
  if (!id) { id = Math.random().toString(36).slice(2)+Date.now().toString(36); sessionStorage.setItem('baraem_session_id',id) }
  return id
}

/* ─── Main ─────────────────────────────────────────────────────── */
export default function ChallengesPage() {
  const [screen,       setScreen]       = useState<Screen>('hub')
  const [challenges,   setChallenges]   = useState<Challenge[]>([])
  const [selected,     setSelected]     = useState<Challenge|null>(null)
  const [playerName,   setPlayerName]   = useState('')
  const [mode,         setMode]         = useState('solo')
  const [roomCode,     setRoomCode]     = useState('')
  const [joinCode,     setJoinCode]     = useState('')
  const [room,         setRoom]         = useState<RoomState|null>(null)
  const [myAnswer,     setMyAnswer]     = useState<number|null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult|null>(null)
  const [timeLeft,     setTimeLeft]     = useState(0)
  const [countdown,    setCountdown]    = useState(3)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [results,      setResults]      = useState<{leaderboard:LeaderboardEntry[];teamScores:{A:number;B:number};winner:string;mode:string}|null>(null)

  const pollRef    = useRef<ReturnType<typeof setInterval>|null>(null)
  const timerRef   = useRef<ReturnType<typeof setInterval>|null>(null)
  const lastQIdx   = useRef(-1)
  const sessionId  = useRef(getSessionId())

  /* Load challenges */
  useEffect(() => {
    fetch('/api/challenges?limit=50').then(r=>r.json()).then(d=>{ if(d.success) setChallenges(d.data) })
    const saved = sessionStorage.getItem('baraem_player_name')
    if (saved) setPlayerName(saved)
  }, [])

  /* Polling */
  const poll = useCallback(async () => {
    if (!roomCode) return
    try {
      const r = await fetch(`/api/challenges/rooms/${roomCode}`)
      const d = await r.json()
      if (!d.success) return
      const rs = d.data as RoomState
      setRoom(rs)
      if (rs.status==='countdown' && screen==='waiting') setScreen('countdown')
      if (rs.status==='playing'   && (screen==='countdown'||screen==='waiting')) { setScreen('playing'); lastQIdx.current=-1; setMyAnswer(null); setAnswerResult(null) }
      if (rs.status==='results'   && screen!=='results') fetchResults(roomCode)
      if (rs.status==='playing' && rs.currentQuestion && rs.currentQuestion.index!==lastQIdx.current) {
        lastQIdx.current=rs.currentQuestion.index; setMyAnswer(null); setAnswerResult(null)
        if (rs.questionStartedAt) { const el=(Date.now()-new Date(rs.questionStartedAt).getTime())/1000; setTimeLeft(Math.max(0,rs.currentQuestion.timeLimit-el)) }
      }
    } catch { /* noop */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, screen])

  useEffect(() => {
    if (roomCode && ['waiting','countdown','playing'].includes(screen)) {
      pollRef.current = setInterval(poll, 1500)
      return () => { if (pollRef.current) clearInterval(pollRef.current) }
    }
  }, [roomCode, screen, poll])

  /* Countdown animation → call /start */
  useEffect(() => {
    if (screen!=='countdown') return
    setCountdown(3)
    let c = 3
    const t = setInterval(() => {
      c--; setCountdown(c)
      if (c<=0) {
        clearInterval(t)
        fetch(`/api/challenges/rooms/${roomCode}/start`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:sessionId.current})})
          .then(()=>{ setScreen('playing'); lastQIdx.current=-1 })
      }
    }, 1000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  /* Per-question countdown timer */
  useEffect(() => {
    if (screen!=='playing' || !room?.currentQuestion || myAnswer!==null) return
    const tl = room.currentQuestion.timeLimit
    if (room.questionStartedAt) { const el=(Date.now()-new Date(room.questionStartedAt).getTime())/1000; setTimeLeft(Math.max(0,tl-el)) }
    else setTimeLeft(tl)
    timerRef.current = setInterval(()=>{
      setTimeLeft(prev=>{
        if (prev<=0.1) { clearInterval(timerRef.current!); submitAnswer(-1); return 0 }
        return prev-0.1
      })
    }, 100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.currentQuestion?.index, screen, myAnswer])

  /* ── Helpers ── */
  const fetchResults = async (code: string) => {
    const r = await fetch(`/api/challenges/rooms/${code}/results`)
    const d = await r.json()
    if (d.success) { setResults(d.data); setScreen('results') }
  }

  const createRoom = async (overrideMode?: string) => {
    setLoading(true); setError('')
    const m = overrideMode ?? mode
    try {
      const r = await fetch('/api/challenges/rooms', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({challengeId:selected!._id, mode:m, playerName, sessionId:sessionId.current})
      })
      const d = await r.json()
      if (d.success) { setRoomCode(d.data.code); setScreen(m==='solo'?'countdown':'waiting') }
      else setError(d.error)
    } catch { setError('خطأ في الاتصال') }
    setLoading(false)
  }

  const joinRoom = async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch(`/api/challenges/rooms/${joinCode.toUpperCase()}/join`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({playerName, sessionId:sessionId.current})
      })
      const d = await r.json()
      if (d.success||d.data?.rejoined) { setRoomCode(joinCode.toUpperCase()); setScreen('waiting') }
      else setError(d.error)
    } catch { setError('خطأ في الاتصال') }
    setLoading(false)
  }

  const markReady = async () => {
    await fetch(`/api/challenges/rooms/${roomCode}/ready`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({sessionId:sessionId.current})
    })
  }

  const submitAnswer = async (answerIndex: number) => {
    if (myAnswer!==null) return
    setMyAnswer(answerIndex)
    if (timerRef.current) clearInterval(timerRef.current)
    const r = await fetch(`/api/challenges/rooms/${roomCode}/answer`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({sessionId:sessionId.current, answerIndex})
    })
    const d = await r.json()
    if (d.success) setAnswerResult(d.data)
  }

  const reset = () => {
    setScreen('hub'); setRoomCode(''); setRoom(null); setSelected(null)
    setMyAnswer(null); setAnswerResult(null); setResults(null); setError('')
    if (pollRef.current) clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const myPlayer = room?.players.find(p => p.sessionId===sessionId.current || p.name===playerName)

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden" dir="rtl">
      <Navbar />

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length:40}).map((_,i)=>(
          <motion.div key={i} className="absolute rounded-full bg-white"
            style={{left:`${(i*37+13)%100}%`,top:`${(i*47+23)%100}%`,width:i%3===0?3:2,height:i%3===0?3:2}}
            animate={{opacity:[0.2,1,0.2]}} transition={{duration:(i%3)+2,repeat:Infinity,delay:i*0.1}} />
        ))}
      </div>

      <div className="relative z-10 pt-20 pb-16 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">

          {/* ══════════ HUB ══════════ */}
          {screen==='hub' && (
            <motion.div key="hub" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex-1 max-w-5xl mx-auto w-full px-4">
              <div className="text-center mb-10">
                <motion.div animate={{y:[0,-10,0]}} transition={{duration:3,repeat:Infinity}}>
                  <div className="w-28 h-28 mx-auto mb-3 relative">
                    <Image src="/assets/سيف.png" alt="سيف" fill className="object-contain drop-shadow-2xl" />
                  </div>
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black">
                  <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">ساحة التحديات</span>
                </h1>
                <p className="text-slate-300 mt-2 text-lg">اختر تحدياً وانطلق في المنافسة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map(c=>{
                  const hasQ = c.questions?.length>0
                  const disabled = c.isComingSoon || !hasQ
                  return (
                    <motion.div key={c._id} whileHover={!disabled?{scale:1.02}:{}} whileTap={!disabled?{scale:0.98}:{}}
                      onClick={()=>{ if(!disabled){setSelected(c);setScreen('name')} }}
                      className={`relative bg-slate-800/50 border border-white/10 rounded-2xl p-5 transition group ${disabled?'opacity-50 cursor-not-allowed':'cursor-pointer hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10'}`}
                    >
                      <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r text-white ${DIFF_GRAD[c.difficulty]??'from-slate-500 to-slate-600'}`}>{c.difficulty}</div>
                      {disabled && <div className="absolute top-3 right-3 bg-yellow-400/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-400/30">{c.isComingSoon?'قريباً':'لا أسئلة'}</div>}
                      <div className="flex gap-4 mt-2">
                        <span className="text-4xl leading-none">{c.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition truncate">{c.title}</h3>
                          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{c.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">❓{c.questions?.length??0}</span>
                            <span className="text-xs text-slate-500">⭐{c.basePoints}ن</span>
                            <span className="text-xs text-slate-500">⏱{c.defaultTimeLimit}ث</span>
                            {(c.allowedModes??[]).map(m=>{ const mo=MODES.find(x=>x.key===m); return mo?<span key={m} className="text-xs px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">{mo.icon}{mo.label}</span>:null })}
                          </div>
                        </div>
                      </div>
                      {!disabled && <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition text-amber-400 text-xs font-semibold">ابدأ التحدي ←</div>}
                    </motion.div>
                  )
                })}
                {challenges.length===0 && (
                  <div className="col-span-2 text-center text-slate-400 py-20"><div className="text-5xl mb-4">🏆</div><p>لا توجد تحديات متاحة بعد</p></div>
                )}
              </div>
              <div className="mt-8 text-center"><Link href="/" className="text-slate-400 hover:text-white text-sm transition">← الرئيسية</Link></div>
            </motion.div>
          )}

          {/* ══════════ NAME ══════════ */}
          {screen==='name' && (
            <motion.div key="name" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center px-4">
              <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-8 text-center w-full max-w-sm">
                <div className="text-5xl mb-3">{selected?.icon}</div>
                <h2 className="text-xl font-bold text-white mb-1">{selected?.title}</h2>
                <p className="text-slate-400 text-sm mb-5">{selected?.description}</p>
                <p className="text-sm text-slate-300 text-right mb-1">اسمك في اللعبة</p>
                <input type="text" maxLength={20} value={playerName} onChange={e=>setPlayerName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&playerName.trim()&&(sessionStorage.setItem('baraem_player_name',playerName.trim()),setScreen('mode'))}
                  placeholder="مثال: سيف الشجاع" autoFocus
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-amber-500 mb-4"/>
                <motion.button whileTap={{scale:0.95}} disabled={!playerName.trim()}
                  onClick={()=>{sessionStorage.setItem('baraem_player_name',playerName.trim());setScreen('mode')}}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:brightness-110">
                  التالي →
                </motion.button>
                <button onClick={()=>setScreen('hub')} className="mt-3 text-slate-400 text-sm hover:text-white">← رجوع</button>
              </div>
            </motion.div>
          )}

          {/* ══════════ MODE ══════════ */}
          {screen==='mode' && (
            <motion.div key="mode" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="flex-1 flex items-center justify-center px-4">
              <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold text-white text-center mb-1">اختر وضع اللعب</h2>
                <p className="text-center text-amber-400 font-bold mb-5">مرحباً {playerName}!</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {MODES.filter(m=>selected?.allowedModes?.includes(m.key)).map(m=>(
                    <motion.button key={m.key} whileTap={{scale:0.95}} onClick={()=>setMode(m.key)}
                      className={`p-4 rounded-2xl border-2 text-center transition ${mode===m.key?'border-amber-500 bg-amber-500/20':'border-white/10 hover:border-white/20'}`}>
                      <div className="text-3xl mb-1">{m.icon}</div>
                      <div className="text-white font-semibold text-sm">{m.label}</div>
                      <div className="text-slate-400 text-xs">{m.desc}</div>
                    </motion.button>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
                {mode==='solo' ? (
                  <motion.button whileTap={{scale:0.95}} onClick={()=>createRoom()} disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-60">
                    {loading?'جاري الإعداد...':'🚀 ابدأ التحدي'}
                  </motion.button>
                ) : (
                  <div className="space-y-2">
                    <motion.button whileTap={{scale:0.95}} onClick={()=>createRoom()} disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-60">
                      {loading?'جاري الإنشاء...':'🏠 إنشاء غرفة'}
                    </motion.button>
                    <div className="relative flex items-center gap-3">
                      <input type="text" maxLength={6} value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="كود الغرفة"
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-center tracking-widest font-mono uppercase focus:outline-none focus:border-amber-500"/>
                      <motion.button whileTap={{scale:0.95}} onClick={joinRoom} disabled={joinCode.length<6||loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl disabled:opacity-50 whitespace-nowrap">
                        انضمام
                      </motion.button>
                    </div>
                  </div>
                )}
                <button onClick={()=>setScreen('name')} className="mt-3 text-slate-400 text-sm hover:text-white w-full text-center">← رجوع</button>
              </div>
            </motion.div>
          )}

          {/* ══════════ WAITING ══════════ */}
          {screen==='waiting' && (
            <motion.div key="waiting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center px-4">
              <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 text-center w-full max-w-md">
                <motion.div animate={{rotate:[0,10,-10,0]}} transition={{duration:2,repeat:Infinity}} className="text-5xl mb-3">⏳</motion.div>
                <h2 className="text-xl font-bold text-white mb-1">انتظار اللاعبين</h2>
                <p className="text-slate-400 text-sm mb-4">{room?.challengeTitle}</p>
                <div className="bg-slate-900/60 rounded-2xl p-4 mb-5">
                  <p className="text-slate-400 text-xs mb-1">كود الغرفة — شاركه مع أصدقائك</p>
                  <div className="text-4xl font-mono font-black text-amber-400 tracking-widest">{roomCode}</div>
                </div>
                <div className="space-y-2 mb-5">
                  {room?.players.map((p,i)=>(
                    <div key={i} className="flex items-center gap-3 bg-slate-900/40 rounded-xl px-4 py-2">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.isReady?'bg-green-400':'bg-slate-600'}`}/>
                      <span className="text-white text-sm flex-1 text-right">{p.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.team==='A'?'bg-blue-500/20 text-blue-300':'bg-red-500/20 text-red-300'}`}>فريق {p.team==='A'?'أ':'ب'}</span>
                      {p.isReady && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                  ))}
                  {Array.from({length:(room?.maxPlayers??2)-(room?.players.length??0)}).map((_,i)=>(
                    <div key={i} className="flex items-center gap-3 bg-slate-900/20 border border-dashed border-white/10 rounded-xl px-4 py-2">
                      <div className="w-2.5 h-2.5 rounded-full border border-slate-600 flex-shrink-0"/>
                      <span className="text-slate-500 text-sm">في انتظار لاعب...</span>
                    </div>
                  ))}
                </div>
                <motion.button whileTap={{scale:0.95}} onClick={markReady}
                  disabled={myPlayer?.isReady}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:brightness-110">
                  {myPlayer?.isReady?'✓ أنا مستعد!':'✅ أنا مستعد'}
                </motion.button>
                <button onClick={reset} className="mt-3 text-slate-400 text-sm hover:text-white">مغادرة</button>
              </div>
            </motion.div>
          )}

          {/* ══════════ COUNTDOWN ══════════ */}
          {screen==='countdown' && (
            <motion.div key="countdown" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.div key={countdown} initial={{scale:2.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.5,opacity:0}} transition={{duration:0.4}}
                    className="text-[120px] font-black leading-none text-amber-400 drop-shadow-2xl">
                    {countdown>0?countdown:'🚀'}
                  </motion.div>
                </AnimatePresence>
                <p className="text-white text-2xl font-bold mt-4">{countdown>0?'استعد للتحدي!':'انطلق!'}</p>
                <p className="text-slate-400 mt-2">{room?.challengeTitle}</p>
              </div>
            </motion.div>
          )}

          {/* ══════════ PLAYING ══════════ */}
          {screen==='playing' && room?.currentQuestion && (
            <motion.div key={`playing-${room.currentQuestion.index}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 max-w-2xl mx-auto w-full px-4">
              {/* HUD Bar */}
              <div className="flex items-center gap-3 mb-4">
                {/* Circular timer */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#1E293B" strokeWidth="5"/>
                    <circle cx="28" cy="28" r="24" fill="none"
                      stroke={timeLeft<5?'#EF4444':timeLeft<10?'#F59E0B':'#10B981'} strokeWidth="5"
                      strokeDasharray={`${2*Math.PI*24}`}
                      strokeDashoffset={`${2*Math.PI*24*(1-timeLeft/(room.currentQuestion.timeLimit))}`}
                      strokeLinecap="round" className="transition-all duration-100"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">{Math.ceil(timeLeft)}</div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>سؤال {room.currentQuestion.index+1}/{room.currentQuestion.total}</span>
                    <span>⭐ {room.currentQuestion.points} نقطة{room.speedBonus?' (×مكافأة)':''}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full transition-all" style={{width:`${((room.currentQuestion.index+1)/room.currentQuestion.total)*100}%`}}/>
                  </div>
                </div>

                {/* Live scores */}
                <div className="flex gap-2 flex-shrink-0">
                  {room.players.slice(0,4).map((p,i)=>(
                    <div key={i} className="text-center min-w-[36px]">
                      <div className="text-[10px] text-slate-300 font-semibold truncate">{p.name.slice(0,5)}</div>
                      <div className="text-amber-400 text-xs font-black">{p.score}</div>
                      {p.answeredCurrent && <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-0.5"/>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question */}
              <motion.div key={room.currentQuestion.index} initial={{x:60,opacity:0}} animate={{x:0,opacity:1}}
                className="bg-slate-800/80 border border-white/10 rounded-3xl p-6 mb-4 text-center">
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">{room.currentQuestion.question}</p>
                {room.currentQuestion.hint && myAnswer===null && (
                  <p className="text-slate-400 text-xs mt-2">💡 {room.currentQuestion.hint}</p>
                )}
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {room.currentQuestion.options.map((opt,oi)=>{
                  const chose = myAnswer===oi
                  const revealed = answerResult!==null
                  const isCorrect = revealed && oi===answerResult!.correctAnswer
                  const isWrong   = revealed && chose && !answerResult!.correct
                  return (
                    <motion.button key={oi} whileHover={!revealed?{scale:1.03}:{}} whileTap={!revealed?{scale:0.97}:{}}
                      onClick={()=>{ if(myAnswer===null) submitAnswer(oi) }}
                      disabled={myAnswer!==null}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        isCorrect ?'border-green-400 bg-green-500/25 shadow-lg shadow-green-500/20':
                        isWrong  ?'border-red-400   bg-red-500/20':
                        chose&&!revealed?'border-white/40 bg-white/10':
                        OPT_IDLE[oi]
                      } ${myAnswer!==null?'cursor-default':''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition ${isCorrect?'bg-green-500 text-white':isWrong?'bg-red-500 text-white':'bg-white/10 text-white'}`}>
                          {isCorrect?'✓':isWrong?'✗':OPT_LABELS[oi]}
                        </span>
                        <span className="text-white text-sm leading-tight">{opt}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answerResult && (
                  <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} className={`mt-4 p-4 rounded-2xl text-center border ${answerResult.correct?'bg-green-500/20 border-green-500/30':'bg-red-500/20 border-red-500/30'}`}>
                    <div className="text-3xl mb-1">{answerResult.correct?'🎉':'💔'}</div>
                    {answerResult.correct?(
                      <>
                        <p className="text-green-300 font-bold text-lg">أحسنت!</p>
                        <p className={`text-sm font-semibold ${TIER_INFO[answerResult.tier]?.color}`}>{TIER_INFO[answerResult.tier]?.label}</p>
                        <p className="text-white text-xl font-black mt-1">+{answerResult.pointsEarned} نقطة</p>
                        <p className="text-slate-400 text-xs mt-1">مجموعك: {answerResult.newScore}</p>
                      </>
                    ):(
                      <p className="text-red-300 font-bold text-lg">{myAnswer===-1?'انتهى الوقت! ⏰':'خاطئة'}</p>
                    )}
                    <p className="text-slate-500 text-xs mt-2">في انتظار السؤال التالي...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ══════════ RESULTS ══════════ */}
          {screen==='results' && results && (
            <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 max-w-lg mx-auto w-full px-4">
              {/* Winner */}
              <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',bounce:0.4}}
                className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-center mb-4 shadow-2xl shadow-amber-500/30">
                <motion.div animate={{rotate:[0,15,-15,0]}} transition={{duration:0.6,delay:0.5}} className="text-5xl mb-2">🏆</motion.div>
                <p className="text-white/80 text-sm font-semibold mb-1">الفائز</p>
                <p className="text-3xl font-black text-white">{results.winner}</p>
                {results.mode!=='solo' && (
                  <div className="flex justify-center gap-8 mt-3 text-white/80 text-sm">
                    <span>فريق أ: <strong>{results.teamScores.A}</strong></span>
                    <span>فريق ب: <strong>{results.teamScores.B}</strong></span>
                  </div>
                )}
              </motion.div>

              {/* Leaderboard */}
              <div className="bg-slate-800/80 border border-white/10 rounded-3xl p-4 mb-4">
                <h3 className="text-white font-bold text-center mb-3">ترتيب اللاعبين</h3>
                <div className="space-y-2">
                  {results.leaderboard.map((p,i)=>(
                    <motion.div key={i} initial={{x:50,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*0.08}}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 ${p.name===playerName?'bg-amber-500/10 border border-amber-500/30':'bg-slate-900/50'}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${i===0?'bg-amber-400 text-black':i===1?'bg-slate-300 text-black':i===2?'bg-amber-700 text-white':'bg-slate-600 text-white'}`}>
                        {i===0?'🥇':i===1?'🥈':i===2?'🥉':p.rank}
                      </div>
                      <span className={`font-semibold flex-1 ${p.name===playerName?'text-amber-300':'text-white'}`}>{p.name}</span>
                      <span className="text-xs text-slate-400">{p.correct}/{p.total}✓</span>
                      {results.mode!=='solo' && <span className={`text-xs px-2 py-0.5 rounded-full ${p.team==='A'?'bg-blue-500/20 text-blue-300':'bg-red-500/20 text-red-300'}`}>{p.team==='A'?'أ':'ب'}</span>}
                      <span className="text-amber-400 font-black min-w-[40px] text-left">{p.score}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button whileTap={{scale:0.95}} onClick={()=>{ setScreen('mode'); setMyAnswer(null); setAnswerResult(null); setRoomCode('') }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:brightness-110">
                  🔄 العب مجدداً
                </motion.button>
                <motion.button whileTap={{scale:0.95}} onClick={reset}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl">
                  🏠 الرئيسية
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {screen==='hub' && (
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto flex justify-center">
            <VisitorCounter pageName="التحديات" pageRoute="/challenges" />
          </div>
        </section>
      )}
    </main>
  )
}
