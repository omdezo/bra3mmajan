/**
 * Reconstruct DB after AWS me-south-1 (Bahrain) outage.
 *
 * Usage:  MONGODB_URI="mongodb+srv://..." node scripts/reconstruct-db.mjs
 *
 * This script populates a FRESH MongoDB cluster with:
 *   1. Default seed data (admin, games, stories, videos, challenges, oasis,
 *      treasures, classes, site settings) — from app/api/seed/route.ts
 *   2. Recent additions that are NOT in the seed file:
 *      - 4 stories (Gemini share links)
 *      - 3 PDFs (existing R2 URLs — files are STILL in R2, safe)
 *      - 8 games (1 educaplay + 7 toy theater / poki / online-stopwatch)
 *
 * Safe to re-run: uses upsert-by-title/key where possible.
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI env var required')
  process.exit(1)
}

// ---------- Schemas (must match lib/models/ exactly) ----------

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'super_admin' },
  lastLogin: { type: Date },
}, { timestamps: true })

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['سهل', 'متوسط', 'صعب'], default: 'سهل' },
  ageGroup: { type: String, enum: ['1-2', '3-4', '1-4'], default: '1-4' },
  icon: { type: String, default: '🎮' },
  color: { type: String, default: '#3B82F6' },
  bgColor: { type: String, default: '#EFF6FF' },
  externalLink: { type: String },
  isExternalLink: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isComingSoon: { type: Boolean, default: false },
  stars: { type: Number, default: 3 },
  playersCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  link: { type: String },
  category: { type: String, enum: ['حكايات عُمانية', 'قصص الأنبياء', 'قصص أخلاقية', 'مغامرات مصورة'], required: true },
  coverImage: { type: String },
  icon: { type: String, default: '📖' },
  color: { type: String, default: '#7C3AED' },
  readTime: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
  isComingSoon: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['رسوم متحركة', 'أناشيد', 'فيديوهات تعليمية', 'برامج أطفال', 'أنشطة تفاعلية', 'أوراق عمل'], required: true },
  contentType: { type: String, enum: ['video', 'pdf'], default: 'video' },
  thumbnailUrl: String, videoUrl: String, youtubeId: String,
  pdfUrl: String, pdfR2Key: String, pageCount: Number,
  duration: { type: Number, default: 0 },
  icon: { type: String, default: '🎬' },
  color: { type: String, default: '#EC4899' },
  ageGroup: { type: String, default: '1-4' },
  isActive: { type: Boolean, default: true },
  isComingSoon: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  viewsCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const ChallengeQuestionSchema = new mongoose.Schema({
  question: String, options: [String], correctAnswer: Number,
  points: { type: Number, default: 100 }, timeLimit: { type: Number, default: 20 },
}, { _id: false })

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  color: { type: String, default: '#3B82F6' },
  difficulty: { type: String, default: 'سهل' },
  allowedModes: [String], basePoints: Number, defaultTimeLimit: Number,
  speedBonus: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isComingSoon: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  questions: [ChallengeQuestionSchema],
  order: { type: Number, default: 0 },
}, { timestamps: true })

const OasisSchema = new mongoose.Schema({
  title: String, arabicText: String, meaning: String, category: String,
  icon: { type: String, default: '🌸' }, color: { type: String, default: '#EC4899' },
  isFeatured: { type: Boolean, default: false }, isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const TreasureSchema = new mongoose.Schema({
  title: String, description: String, category: String,
  icon: { type: String, default: '💎' }, color: { type: String, default: '#F59E0B' },
  isFeatured: { type: Boolean, default: false }, isComingSoon: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const ClassSchema = new mongoose.Schema({
  title: String, subject: String, grade: Number, teacher: String, teamsLink: String,
  description: String, day: String, time: String,
  icon: { type: String, default: '📚' }, color: { type: String, default: '#3B82F6' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const NavItemSchema = new mongoose.Schema({
  label: String, href: String, icon: String, gradient: String,
  order: Number, isActive: { type: Boolean, default: true },
}, { _id: false })

const SiteSettingsSchema = new mongoose.Schema({
  siteName: String, siteTagline: String,
  navbarItems: [NavItemSchema],
}, { timestamps: true })

// ---------- Data ----------

const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || 'admin@baraem.com'
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Baraem2024'

const SEED_GAMES = [
  { title: 'وادي الأرقام', description: 'العمليات الحسابية بطريقة ممتعة', category: 'الحساب', difficulty: 'سهل', icon: '🔢', color: '#3B82F6', stars: 4, playersCount: 1250, order: 0 },
  { title: 'قلعة الحروف', description: 'تعلم الحروف والكلمات العربية', category: 'اللغة العربية', difficulty: 'سهل', icon: '📝', color: '#8B5CF6', stars: 5, playersCount: 980, order: 1 },
  { title: 'واحة الألغاز', description: 'ألغاز وأحاجي ممتعة للأطفال', category: 'الألغاز', difficulty: 'متوسط', icon: '🧩', color: '#EC4899', stars: 4, playersCount: 750, order: 2 },
  { title: 'برج الذاكرة', description: 'اختبر قدرتك على التذكر', category: 'الذاكرة', difficulty: 'متوسط', icon: '🧠', color: '#10B981', stars: 3, playersCount: 600, order: 3 },
]

const RECENT_GAMES = [
  { title: 'أوعية الطعام والشراب', description: 'لعبة تعليمية تفاعلية لتعلم أسماء أوعية الطعام والشراب بالإنجليزية', category: 'اللغة الإنجليزية', icon: '🍽️', color: '#10B981', bgColor: '#ECFDF5', externalLink: 'https://www.educaplay.com/game/26251769-food_and_drink_containers.html', stars: 4 },
  { title: 'البحث في المكتبة', description: 'ابحث عن الأشياء المخفية في المكتبة واختبر قوة ملاحظتك', category: 'الألغاز', icon: '📚', color: '#8B5CF6', bgColor: '#F5F3FF', externalLink: 'https://toytheater.com/hidden-picture-library/', stars: 4 },
  { title: 'مواقف السيارة', description: 'ساعد السيارات في الخروج من الموقف بتحريكها بذكاء', category: 'الألغاز', icon: '🚗', color: '#EF4444', bgColor: '#FEF2F2', externalLink: 'https://toytheater.com/parking/', stars: 4 },
  { title: 'المتاهة', description: 'اعثر على الطريق الصحيح وتجاوز المتاهة بمهارة', category: 'الألغاز', icon: '🔀', color: '#3B82F6', bgColor: '#EFF6FF', externalLink: 'https://toytheater.com/maze/', stars: 3 },
  { title: 'البحث عن الخرزة', description: 'تابع الكوب الذي يخفي الخرزة واختبر تركيزك وسرعة ملاحظتك', category: 'الذاكرة', icon: '🫘', color: '#F59E0B', bgColor: '#FFFBEB', externalLink: 'https://www.online-stopwatch.com/chance-games/shell-game/', stars: 4 },
  { title: 'اوجد الغريب', description: 'ابحث عن الشيء المختلف بين المجموعة واختبر دقة ملاحظتك', category: 'الألغاز', icon: '🔍', color: '#10B981', bgColor: '#ECFDF5', externalLink: 'https://toytheater.com/find-me/', stars: 3 },
  { title: 'لغز الأنابيب', description: 'رتّب السوائل الملونة في الأنابيب حتى يصبح كل أنبوب بلون واحد', category: 'الألغاز', icon: '🧪', color: '#EC4899', bgColor: '#FDF2F8', externalLink: 'https://toytheater.com/liquid-sort/', stars: 4 },
  { title: 'ألعاب الذكاء', description: 'ارسم الخط الصحيح لتوصيل الأسلاك وحل الألغاز الكهربائية', category: 'الألغاز', icon: '🧠', color: '#6366F1', bgColor: '#EEF2FF', externalLink: 'https://poki.com/ar/g/draw-wire', stars: 4 },
]

const SEED_STORIES = [
  { title: 'حكاية الصياد والبحر', description: 'قصة صياد عُماني شجاع', category: 'حكايات عُمانية', icon: '🎣', color: '#3B82F6', isFeatured: true, order: 0 },
  { title: 'أسطورة الجبل الشامخ', description: 'أسطورة من جبال عُمان', category: 'حكايات عُمانية', icon: '⛰️', color: '#10B981', order: 1 },
  { title: 'قصة سيدنا موسى', description: 'قصة نبي الله موسى عليه السلام', category: 'قصص الأنبياء', icon: '🌊', color: '#7C3AED', isFeatured: true, order: 2 },
  { title: 'الأمانة والصدق', description: 'قصة تعلم قيم الأمانة والصدق', category: 'قصص أخلاقية', icon: '⭐', color: '#F59E0B', order: 3 },
  { title: 'مغامرة في الصحراء', description: 'مغامرة مصورة في الصحراء العُمانية', category: 'مغامرات مصورة', icon: '🌵', color: '#EF4444', order: 4 },
]

const RECENT_STORIES = [
  { title: 'بُنْدُقٌ البَارُّ بِأُمِّهِ: حِكَايَةُ الحُبِّ وَالعَطَاءِ', description: 'قصة جميلة عن بر الوالدين والحب والعطاء، يتعلم فيها الأطفال أهمية الإحسان إلى الأم', link: 'https://gemini.google.com/share/3d093f75c237', category: 'قصص أخلاقية', icon: '🐿️', color: '#F59E0B', readTime: 5, isFeatured: true },
  { title: 'سَرِيعٌ وَصَابِرٌ: سِبَاقُ الْعَزِيمَةِ وَالْإِصْرَارِ', description: 'قصة مشوقة عن سباق بين سريع وصابر تعلّم الأطفال أن العزيمة والإصرار أقوى من السرعة', link: 'https://gemini.google.com/share/5cd0e49ccd57', category: 'قصص أخلاقية', icon: '🐢', color: '#10B981', readTime: 5 },
  { title: 'سِرُّ مِيَاهِ الْجَبَلِ', description: 'حكاية عُمانية عن سر مياه الجبل وجمال الطبيعة العُمانية وحكمة الأجداد', link: 'https://gemini.google.com/share/2eaf348156cc', category: 'حكايات عُمانية', icon: '⛰️', color: '#3B82F6', readTime: 5, isFeatured: true },
  { title: 'حِرَاسَةُ التَّارِيخِ', description: 'قصة مغامرة مصورة عن حراسة التاريخ والتراث العُماني العريق واكتشاف أسراره', link: 'https://gemini.google.com/share/f964a84e3b26', category: 'مغامرات مصورة', icon: '🏰', color: '#8B5CF6', readTime: 5 },
]

const SEED_VIDEOS = [
  { title: 'مغامرات فهد', description: 'رسوم متحركة تعليمية', category: 'رسوم متحركة', icon: '🎬', color: '#EC4899', isComingSoon: true, order: 0 },
  { title: 'أنشودة الأرقام', description: 'أنشودة تعليمية للأرقام', category: 'أناشيد', icon: '🎵', color: '#8B5CF6', isComingSoon: true, order: 1 },
  { title: 'العلوم للأطفال', description: 'فيديوهات تعليمية في العلوم', category: 'فيديوهات تعليمية', icon: '🔬', color: '#10B981', isComingSoon: true, order: 2 },
  { title: 'برنامج أطفالنا', description: 'برنامج ترفيهي وتعليمي', category: 'برامج أطفال', icon: '📺', color: '#F59E0B', isComingSoon: true, order: 3 },
]

// These 3 PDFs are STILL IN R2 — URLs are preserved from the previous upload
const RECENT_PDFS = [
  { title: 'فكّر خارج الصندوق', description: 'نشاط تفاعلي ممتع يُحفّز التفكير الإبداعي والخيال عند الأطفال', category: 'أنشطة تفاعلية', contentType: 'pdf', pdfUrl: 'https://pub-f16c0add9a9747b8953bd12c38d37d0e.r2.dev/pdfs/1774506689410-ebbde2f0.pdf', pdfR2Key: 'pdfs/1774506689410-ebbde2f0.pdf', icon: '🧠', color: '#F59E0B', isFeatured: true },
  { title: 'لو خيّروك', description: 'لعبة اختيارات شيّقة تُنمّي مهارات التفكير واتخاذ القرار عند الأطفال', category: 'أنشطة تفاعلية', contentType: 'pdf', pdfUrl: 'https://pub-f16c0add9a9747b8953bd12c38d37d0e.r2.dev/pdfs/1774506691656-e7ed542e.pdf', pdfR2Key: 'pdfs/1774506691656-e7ed542e.pdf', icon: '🤔', color: '#8B5CF6', isFeatured: true },
  { title: 'كن أنت الشرطي', description: 'نشاط مصوّر ممتع يُعلّم الأطفال القيم والمسؤولية من خلال لعب الأدوار', category: 'أنشطة تفاعلية', contentType: 'pdf', pdfUrl: 'https://pub-f16c0add9a9747b8953bd12c38d37d0e.r2.dev/pdfs/1774506695927-77cdaf75.pdf', pdfR2Key: 'pdfs/1774506695927-77cdaf75.pdf', icon: '👮', color: '#3B82F6' },
]

const SEED_CHALLENGES = [
  {
    title: 'تحدي المعلومات العامة', description: 'اختبر معلوماتك العامة حول سلطنة عُمان والعالم',
    category: 'معلومات عامة', icon: '🌍', color: '#3B82F6', difficulty: 'سهل',
    allowedModes: ['solo', '1v1', '2v2', '4v4'], basePoints: 100, defaultTimeLimit: 20, speedBonus: true, isFeatured: true,
    questions: [
      { question: 'ما عاصمة سلطنة عُمان؟', options: ['مسقط', 'دبي', 'الرياض', 'أبوظبي'], correctAnswer: 0, points: 100, timeLimit: 20 },
      { question: 'كم عدد أيام الأسبوع؟', options: ['خمسة', 'ستة', 'سبعة', 'ثمانية'], correctAnswer: 2, points: 100, timeLimit: 15 },
      { question: 'أي من هذه الحيوانات رمز سلطنة عُمان؟', options: ['الأسد', 'المها العربية', 'الفهد', 'النسر'], correctAnswer: 1, points: 100, timeLimit: 20 },
      { question: 'ما اللون الرئيسي في علم سلطنة عُمان؟', options: ['الأزرق', 'الأخضر', 'الأحمر', 'الأصفر'], correctAnswer: 2, points: 100, timeLimit: 15 },
      { question: 'كم عدد شهور السنة؟', options: ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر'], correctAnswer: 2, points: 100, timeLimit: 10 },
    ], order: 0,
  },
  {
    title: 'تحدي الحساب الممتع', description: 'اختبر مهاراتك في الرياضيات بطريقة شيقة',
    category: 'اختبارات ذاتية', icon: '🔢', color: '#10B981', difficulty: 'سهل',
    allowedModes: ['solo', '1v1'], basePoints: 150, defaultTimeLimit: 15, speedBonus: true,
    questions: [
      { question: 'كم يساوي ٣ + ٥ ؟', options: ['٦', '٧', '٨', '٩'], correctAnswer: 2, points: 150, timeLimit: 15 },
      { question: 'كم يساوي ١٠ - ٤ ؟', options: ['٥', '٦', '٧', '٨'], correctAnswer: 1, points: 150, timeLimit: 15 },
      { question: 'كم يساوي ٢ × ٦ ؟', options: ['١٠', '١١', '١٢', '١٣'], correctAnswer: 2, points: 150, timeLimit: 20 },
      { question: 'ما هو العدد الأكبر؟', options: ['١٥', '٢٣', '١٩', '١٧'], correctAnswer: 1, points: 150, timeLimit: 10 },
    ], order: 1,
  },
  {
    title: 'تحدي اللغة العربية', description: 'اختبر معلوماتك في اللغة العربية الجميلة',
    category: 'منافسة الأصدقاء', icon: '📝', color: '#8B5CF6', difficulty: 'متوسط',
    allowedModes: ['solo', '1v1', '2v2'], basePoints: 120, defaultTimeLimit: 25, speedBonus: true,
    questions: [
      { question: 'ما هو جمع كلمة "كتاب"؟', options: ['كتابات', 'كتب', 'كتوب', 'أكتاب'], correctAnswer: 1, points: 120, timeLimit: 25 },
      { question: 'ما هو مفرد كلمة "أشجار"؟', options: ['شجرة', 'شجير', 'شجرتان', 'شيجر'], correctAnswer: 0, points: 120, timeLimit: 20 },
      { question: 'أي من هذه الكلمات مؤنثة؟', options: ['باب', 'كرسي', 'شمس', 'قلم'], correctAnswer: 2, points: 120, timeLimit: 25 },
    ], order: 2,
  },
  {
    title: 'تحدي الأسبوع', description: 'تحدي متجدد كل أسبوع — هل أنت مستعد؟',
    category: 'تحديات أسبوعية', icon: '📅', color: '#F59E0B', difficulty: 'متوسط',
    allowedModes: ['solo', '1v1', '2v2', '4v4'], basePoints: 200, defaultTimeLimit: 20, speedBonus: true,
    isComingSoon: true, questions: [], order: 3,
  },
]

const SEED_OASIS = [
  { title: 'بسم الله الرحمن الرحيم', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', meaning: 'بدأ باسم الله الرحيم', category: 'أدعية إسلامية', icon: '🌸', color: '#EC4899', isFeatured: true, order: 0 },
  { title: 'الحمد لله رب العالمين', arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', meaning: 'الشكر لله على نعمه', category: 'أدعية إسلامية', icon: '💜', color: '#8B5CF6', order: 1 },
  { title: 'ربنا آتنا في الدنيا حسنة', arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', meaning: 'دعاء لخير الدنيا والآخرة', category: 'أدعية إسلامية', icon: '💙', color: '#3B82F6', order: 2 },
  { title: 'وقل رب زدني علماً', arabicText: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', meaning: 'دعاء طلب العلم', category: 'حفظ القرآن', icon: '💚', color: '#10B981', isFeatured: true, order: 3 },
  { title: 'إن مع العسر يسراً', arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', meaning: 'مع الصعوبة يأتي الفرج', category: 'حفظ القرآن', icon: '💛', color: '#F59E0B', order: 4 },
]

const SEED_TREASURES = [
  { title: 'الخنجر العُماني', description: 'رمز التراث العُماني الأصيل', category: 'كنوز عُمانية', icon: '⚔️', color: '#F59E0B', isFeatured: true, order: 0 },
  { title: 'الفخار العُماني', description: 'حرفة الفخار التقليدية', category: 'كنوز عُمانية', icon: '🏺', color: '#EF4444', order: 1 },
  { title: 'قلعة نزوى', description: 'من أشهر القلاع العُمانية', category: 'كنوز عُمانية', icon: '🏰', color: '#8B5CF6', order: 2 },
  { title: 'أغنية الأرجوحة', description: 'أغنية تراثية عُمانية للأطفال', category: 'أغانٍ', icon: '🎵', color: '#EC4899', isComingSoon: true, order: 3 },
  { title: 'رسومي الإبداعية', description: 'ركن الرسم والإبداع للأطفال', category: 'ركن الإبداع', icon: '🎨', color: '#10B981', isComingSoon: true, order: 4 },
]

const SEED_CLASSES = [
  { title: 'حصص الصف الأول', subject: 'جميع المواد', grade: 1, teacher: 'معلمات الصف الأول', teamsLink: 'https://teams.microsoft.com', icon: '1️⃣', color: '#3B82F6', order: 0 },
  { title: 'حصص الصف الثاني', subject: 'جميع المواد', grade: 2, teacher: 'معلمات الصف الثاني', teamsLink: 'https://teams.microsoft.com', icon: '2️⃣', color: '#8B5CF6', order: 1 },
  { title: 'حصص الصف الثالث', subject: 'جميع المواد', grade: 3, teacher: 'معلمات الصف الثالث', teamsLink: 'https://teams.microsoft.com', icon: '3️⃣', color: '#EC4899', order: 2 },
  { title: 'حصص الصف الرابع', subject: 'جميع المواد', grade: 4, teacher: 'معلمات الصف الرابع', teamsLink: 'https://teams.microsoft.com', icon: '4️⃣', color: '#10B981', order: 3 },
]

const SEED_SETTINGS = {
  siteName: 'براعم مجان', siteTagline: 'رحلة التعلم تبدأ هنا',
  navbarItems: [
    { label: 'الرئيسية', href: '/', icon: '🏠', gradient: 'from-blue-400 to-blue-600', order: 0, isActive: true },
    { label: 'الألعاب', href: '/games', icon: '🎮', gradient: 'from-blue-400 to-purple-500', order: 1, isActive: true },
    { label: 'المشاهدة', href: '/watch', icon: '🎬', gradient: 'from-pink-400 to-purple-500', order: 2, isActive: true },
    { label: 'القصص', href: '/stories', icon: '📖', gradient: 'from-yellow-400 to-orange-500', order: 3, isActive: true },
    { label: 'التحديات', href: '/challenges', icon: '🏆', gradient: 'from-sky-400 to-blue-600', order: 4, isActive: true },
    { label: 'الواحة', href: '/oasis', icon: '🌿', gradient: 'from-green-400 to-teal-500', order: 5, isActive: true },
    { label: 'كنوز التراث', href: '/variety', icon: '✨', gradient: 'from-amber-400 to-orange-500', order: 6, isActive: true },
    { label: 'الفصول', href: '/classes', icon: '🎓', gradient: 'from-indigo-400 to-purple-600', order: 7, isActive: true },
  ],
}

// ---------- Insert helper (idempotent by title) ----------

async function insertByTitle(Model, docs, label, startOrder = 0) {
  let inserted = 0, skipped = 0
  for (let i = 0; i < docs.length; i++) {
    const doc = { ...docs[i] }
    if (doc.order === undefined) doc.order = startOrder + i
    const exists = await Model.findOne({ title: doc.title }).lean()
    if (exists) { skipped++; continue }
    await Model.create(doc)
    inserted++
  }
  console.log(`  ${label}: +${inserted} inserted, ${skipped} already existed`)
  return inserted
}

// ---------- Main ----------

async function main() {
  console.log('🔌 Connecting to new MongoDB cluster...')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 20000 })
  console.log('✅ Connected\n')

  const Admin = mongoose.model('Admin', AdminSchema)
  const Game = mongoose.model('Game', GameSchema)
  const Story = mongoose.model('Story', StorySchema)
  const Video = mongoose.model('Video', VideoSchema)
  const Challenge = mongoose.model('Challenge', ChallengeSchema)
  const OasisContent = mongoose.model('OasisContent', OasisSchema)
  const Treasure = mongoose.model('Treasure', TreasureSchema)
  const ClassSession = mongoose.model('ClassSession', ClassSchema)
  const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema)

  console.log('👤 Admin...')
  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL })
  if (!existingAdmin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await Admin.create({ email: ADMIN_EMAIL, password: hash, name: 'المشرف العام' })
    console.log('  ✅ Admin created:', ADMIN_EMAIL)
  } else console.log('  ⏭  Admin exists')

  console.log('\n⚙️  Site settings...')
  const existingSettings = await SiteSettings.findOne()
  if (!existingSettings) { await SiteSettings.create(SEED_SETTINGS); console.log('  ✅ Settings created') }
  else console.log('  ⏭  Settings exist')

  console.log('\n🎮 Games:')
  await insertByTitle(Game, SEED_GAMES, 'seed', 0)
  const added = await insertByTitle(Game, RECENT_GAMES.map((g, i) => ({ ...g, isExternalLink: true, difficulty: 'سهل', ageGroup: '1-4' })), 'recent additions', SEED_GAMES.length)

  console.log('\n📖 Stories:')
  await insertByTitle(Story, SEED_STORIES, 'seed', 0)
  await insertByTitle(Story, RECENT_STORIES, 'recent additions', SEED_STORIES.length)

  console.log('\n🎬 Videos & PDFs:')
  await insertByTitle(Video, SEED_VIDEOS.map(v => ({ ...v, contentType: 'video' })), 'seed videos', 0)
  await insertByTitle(Video, RECENT_PDFS, 'PDF activities (R2 URLs preserved)', SEED_VIDEOS.length)

  console.log('\n🏆 Challenges:')
  await insertByTitle(Challenge, SEED_CHALLENGES, 'seed', 0)

  console.log('\n🌿 Oasis:')
  await insertByTitle(OasisContent, SEED_OASIS, 'seed', 0)

  console.log('\n💎 Treasures:')
  await insertByTitle(Treasure, SEED_TREASURES, 'seed', 0)

  console.log('\n🎓 Classes:')
  await insertByTitle(ClassSession, SEED_CLASSES, 'seed', 0)

  console.log('\n✅ Reconstruction complete!')
  console.log('\nCollection counts:')
  for (const [name, Model] of [['Admin', Admin], ['Game', Game], ['Story', Story], ['Video', Video], ['Challenge', Challenge], ['Oasis', OasisContent], ['Treasure', Treasure], ['Class', ClassSession], ['SiteSettings', SiteSettings]]) {
    const c = await Model.countDocuments()
    console.log(`  ${name}: ${c}`)
  }

  await mongoose.disconnect()
  console.log('\n👋 Done')
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
