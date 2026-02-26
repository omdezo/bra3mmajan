'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { FormField, Input, Textarea, Toggle } from '@/components/admin/FormField'

interface NavbarItem {
  label: string; href: string; icon: string; gradient: string; order: number; isActive: boolean
}

interface SiteSettings {
  siteName: string; siteTagline: string; footerText: string
  maintenanceMode: boolean; navbarItems: NavbarItem[]
  announcements: Array<{ text: string; color: string; isActive: boolean }>
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [tab, setTab] = useState<'general' | 'navbar' | 'announcements'>('general')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.data) })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!settings) return
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    const data = await res.json()
    showToast(data.success ? 'تم حفظ الإعدادات' : 'خطأ في الحفظ')
    setSaving(false)
  }

  const upd = (k: keyof SiteSettings, v: unknown) => setSettings(s => s ? { ...s, [k]: v } : s)

  const updNavbar = (idx: number, k: keyof NavbarItem, v: unknown) => {
    setSettings(s => {
      if (!s) return s
      const items = [...s.navbarItems]
      items[idx] = { ...items[idx], [k]: v }
      return { ...s, navbarItems: items }
    })
  }

  const updAnnouncement = (idx: number, k: string, v: unknown) => {
    setSettings(s => {
      if (!s) return s
      const items = [...s.announcements]
      items[idx] = { ...items[idx], [k]: v }
      return { ...s, announcements: items }
    })
  }

  if (loading) return <AdminShell title="إعدادات الموقع"><div className="flex items-center justify-center h-48 text-slate-400">جاري التحميل...</div></AdminShell>
  if (!settings) return <AdminShell title="إعدادات الموقع"><div className="text-red-400 p-4">خطأ في تحميل الإعدادات</div></AdminShell>

  return (
    <AdminShell
      title="إعدادات الموقع"
      subtitle="التحكم في إعدادات المنصة"
      actions={
        <button onClick={save} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
          {saving ? 'جاري الحفظ...' : '💾 حفظ الإعدادات'}
        </button>
      }
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'general', label: 'عام' },
          { key: 'navbar', label: 'شريط التنقل' },
          { key: 'announcements', label: 'الإعلانات' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.key ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6" dir="rtl">
        {tab === 'general' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="اسم الموقع">
                <Input value={settings.siteName} onChange={e => upd('siteName', e.target.value)} />
              </FormField>
              <FormField label="الشعار (tagline)">
                <Input value={settings.siteTagline} onChange={e => upd('siteTagline', e.target.value)} />
              </FormField>
            </div>
            <FormField label="نص التذييل (Footer)">
              <Textarea value={settings.footerText} onChange={e => upd('footerText', e.target.value)} rows={2} />
            </FormField>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <Toggle
                checked={settings.maintenanceMode}
                onChange={v => upd('maintenanceMode', v)}
                label="وضع الصيانة (يخفي الموقع عن الزوار)"
              />
            </div>
          </div>
        )}

        {tab === 'navbar' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-4">قم بتعديل عناصر شريط التنقل — العنوان، الرابط، والأيقونة</p>
            {settings.navbarItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3">
                <div className="w-8 text-center">
                  <Input value={item.icon} onChange={e => updNavbar(i, 'icon', e.target.value)} className="text-center w-12" />
                </div>
                <Input value={item.label} onChange={e => updNavbar(i, 'label', e.target.value)} className="w-32" placeholder="التسمية" />
                <Input value={item.href} onChange={e => updNavbar(i, 'href', e.target.value)} className="flex-1" placeholder="/الرابط" />
                <Toggle checked={item.isActive} onChange={v => updNavbar(i, 'isActive', v)} />
              </div>
            ))}
          </div>
        )}

        {tab === 'announcements' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-400">إعلانات تظهر في الموقع</p>
              <button
                onClick={() => upd('announcements', [...settings.announcements, { text: '', color: '#EF4444', isActive: false }])}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition"
              >
                + إضافة إعلان
              </button>
            </div>
            {settings.announcements.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">لا توجد إعلانات</p>
            ) : settings.announcements.map((ann, i) => (
              <div key={i} className="bg-slate-900/50 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <Input value={ann.text} onChange={e => updAnnouncement(i, 'text', e.target.value)} className="flex-1" placeholder="نص الإعلان..." />
                  <input type="color" value={ann.color} onChange={e => updAnnouncement(i, 'color', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                  <Toggle checked={ann.isActive} onChange={v => updAnnouncement(i, 'isActive', v)} />
                  <button
                    onClick={() => upd('announcements', settings.announcements.filter((_, j) => j !== i))}
                    className="w-8 h-8 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center text-xs hover:bg-red-500/20"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
