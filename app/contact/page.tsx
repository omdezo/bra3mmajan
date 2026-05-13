"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  workingHours?: string;
}

const FALLBACK: ContactInfo = {
  email: 'contact@baraemmajan.om',
  phone: '+968 9000 0000',
  whatsapp: '',
  address: 'سلطنة عُمان',
  workingHours: 'من الأحد إلى الخميس · 8 صباحاً - 4 مساءً',
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.contact) {
          setContact({ ...FALLBACK, ...d.data.contact });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: '📧', label: 'البريد الإلكتروني', value: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null,
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-700',
      action: 'أرسل بريداً',
    },
    {
      icon: '📞', label: 'الهاتف', value: contact.phone,
      href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : null,
      gradient: 'from-emerald-400 to-green-500',
      bg: 'bg-emerald-50', border: 'border-emerald-200', textColor: 'text-emerald-700',
      action: 'اتصل الآن',
    },
    ...(contact.whatsapp ? [{
      icon: '💬', label: 'واتساب', value: '+' + contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
      gradient: 'from-green-400 to-emerald-600',
      bg: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-700',
      action: 'تواصل عبر واتساب',
    }] : []),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-orange-50" dir="rtl">
      <Navbar />

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{ left: `${(i * 37 + 13) % 90 + 5}%`, top: `${(i * 47 + 23) % 70 + 10}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: (i % 3) + 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {['💌', '📞', '✉️', '💝', '🌟', '✨', '📮', '🎈', '🌸', '💐'][i]}
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-700 font-bold mb-6 hover:gap-4 transition-all">
            <span>→</span><span>العودة للرئيسية</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="text-7xl md:text-8xl drop-shadow-lg">💌</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                اتصل بنا
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-purple-700 font-bold leading-relaxed">
              نحن سعداء بسماع آرائكم واقتراحاتكم! 🌟
              <br />
              <span className="text-pink-600 text-base md:text-xl">تواصلوا معنا في أي وقت</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white/70 rounded-3xl p-8 animate-pulse">
                  <div className="h-16 w-16 bg-purple-100 rounded-2xl mb-4" />
                  <div className="h-4 w-24 bg-purple-100 rounded-full mb-3" />
                  <div className="h-5 w-40 bg-purple-100 rounded-full mb-5" />
                  <div className="h-10 bg-purple-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${cards.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {cards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                >
                  <div className={`${card.bg} rounded-3xl p-8 border-2 ${card.border} shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-5`}>
                      {card.icon}
                    </div>
                    <p className={`text-sm font-bold ${card.textColor} opacity-70 mb-1`}>{card.label}</p>
                    <p className="text-lg md:text-xl font-black text-gray-800 mb-5 break-all" dir="ltr">
                      {card.value}
                    </p>
                    {card.href && (
                      <a
                        href={card.href}
                        target={card.label === 'واتساب' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className={`mt-auto block w-full text-center px-4 py-3 bg-gradient-to-r ${card.gradient} text-white rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95`}
                      >
                        {card.action}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Extra Info */}
          {(contact.workingHours || contact.address) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-lg"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {contact.workingHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🕒
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-700 mb-1">ساعات العمل</p>
                      <p className="text-base text-gray-700 leading-relaxed">{contact.workingHours}</p>
                    </div>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-700 mb-1">العنوان</p>
                      <p className="text-base text-gray-700 leading-relaxed">{contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Friendly note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl border-4 border-white"
          >
            <span className="text-5xl block mb-3">🌟</span>
            <h3 className="text-2xl md:text-3xl font-black mb-3">رأيك يهمّنا!</h3>
            <p className="text-base md:text-lg font-bold leading-relaxed opacity-95">
              نسعد بتلقي اقتراحاتكم وآرائكم لتطوير منصة براعم مجان
              <br />
              <span className="text-pink-100">معاً نصنع تجربة تعليمية أفضل لأطفالنا 💝</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="اتصل بنا" pageRoute="/contact" />
        </div>
      </section>
    </main>
  );
}
