import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function generateStaticParams() {
    return [
        { slug: "games" },
        { slug: "watch" },
        { slug: "stories" },
        { slug: "challenges" },
        { slug: "oasis" },
        { slug: "variety" },
    ];
}

const SECTION_DATA: Record<string, { title: string; color: string; description: string }> = {
    games: { title: "حديقة الألعاب", color: "bg-red-500", description: "أهلاً بك في عالم فهد! هنا ستجد أمتع الألعاب." },
    watch: { title: "شاشة البراعم", color: "bg-teal-500", description: "عالم لؤلؤة المليء بالفيديوهات الممتعة." },
    stories: { title: "مكتبة مجان", color: "bg-amber-500", description: "جلسة حكايات ممتعة مع الجد سالم." },
    challenges: { title: "ساحة التحدي", color: "bg-orange-600", description: "هل أنت مستعد لمنافسة سيف في الأذكياء؟" },
    oasis: { title: "واحة نور", color: "bg-purple-600", description: "تعلم القيم والأخلاق مع نور." },
    variety: { title: "قسم المنوعات", color: "bg-green-600", description: "استكشف كنوز عمان مع مها." },
};

export default function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const data = SECTION_DATA[slug];

    if (!data) {
        return notFound();
    }

    return (
        <main className={`min-h-screen flex flex-col items-center justify-center text-white ${data.color}`}>
            <div className="text-center p-8 bg-black/20 rounded-3xl backdrop-blur-md max-w-2xl">
                <h1 className="text-6xl font-bold mb-6">{data.title}</h1>
                <p className="text-2xl mb-10">{data.description}</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowRight />
                    العودة للرئيسية
                </Link>
            </div>
        </main>
    );
}
