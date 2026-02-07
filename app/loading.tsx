export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-500 flex items-center justify-center">
      <div className="text-center" dir="rtl">
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Spinning loader */}
          <div className="absolute inset-0 border-8 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-8 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-4xl font-black text-white mb-2">جاري التحميل...</h2>
        <p className="text-xl text-white/80 font-bold">استعد للمغامرة! 🚀</p>
      </div>
    </div>
  );
}
