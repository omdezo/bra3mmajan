/**
 * Seed Route - Initializes the database with default data
 * POST /api/seed - Run once to populate initial content
 */
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import { Admin } from '@/lib/models/Admin'
import { Game } from '@/lib/models/Game'
import { Story } from '@/lib/models/Story'
import { Video } from '@/lib/models/Video'
import { Challenge } from '@/lib/models/Challenge'
import { OasisContent } from '@/lib/models/OasisContent'
import { Treasure } from '@/lib/models/Treasure'
import { ClassSession } from '@/lib/models/ClassSession'
import { SiteSettings } from '@/lib/models/SiteSettings'
import { AuthService } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api'

const SEED_SECRET = process.env.SEED_SECRET ?? 'baraem_seed_2024'

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== SEED_SECRET) {
    return errorResponse('غير مصرح به', 401)
  }

  try {
    await connectDB()

    // Admin
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_DEFAULT_EMAIL })
    if (!existingAdmin) {
      await Admin.create({
        email: process.env.ADMIN_DEFAULT_EMAIL ?? 'admin@baraem.com',
        password: await AuthService.hashPassword(process.env.ADMIN_DEFAULT_PASSWORD ?? 'Admin@Baraem2024'),
        name: 'المشرف العام',
      })
    }

    // Games
    const gamesCount = await Game.countDocuments()
    if (gamesCount === 0) {
      await Game.insertMany([
        { title: 'وادي الأرقام', description: 'العمليات الحسابية بطريقة ممتعة', category: 'الحساب', difficulty: 'سهل', icon: '🔢', color: '#3B82F6', stars: 4, playersCount: 1250, order: 0 },
        { title: 'قلعة الحروف', description: 'تعلم الحروف والكلمات العربية', category: 'اللغة العربية', difficulty: 'سهل', icon: '📝', color: '#8B5CF6', stars: 5, playersCount: 980, order: 1 },
        { title: 'واحة الألغاز', description: 'ألغاز وأحاجي ممتعة للأطفال', category: 'الألغاز', difficulty: 'متوسط', icon: '🧩', color: '#EC4899', stars: 4, playersCount: 750, order: 2 },
        { title: 'برج الذاكرة', description: 'اختبر قدرتك على التذكر', category: 'الذاكرة', difficulty: 'متوسط', icon: '🧠', color: '#10B981', stars: 3, playersCount: 600, order: 3 },
      ])
    }

    // Stories
    const storiesCount = await Story.countDocuments()
    if (storiesCount === 0) {
      await Story.insertMany([
        { title: 'حكاية الصياد والبحر', description: 'قصة صياد عُماني شجاع', category: 'حكايات عُمانية', icon: '🎣', color: '#3B82F6', isFeatured: true, order: 0 },
        { title: 'أسطورة الجبل الشامخ', description: 'أسطورة من جبال عُمان', category: 'حكايات عُمانية', icon: '⛰️', color: '#10B981', order: 1 },
        { title: 'قصة سيدنا موسى', description: 'قصة نبي الله موسى عليه السلام', category: 'قصص الأنبياء', icon: '🌊', color: '#7C3AED', isFeatured: true, order: 2 },
        { title: 'الأمانة والصدق', description: 'قصة تعلم قيم الأمانة والصدق', category: 'قصص أخلاقية', icon: '⭐', color: '#F59E0B', order: 3 },
        { title: 'مغامرة في الصحراء', description: 'مغامرة مصورة في الصحراء العُمانية', category: 'مغامرات مصورة', icon: '🌵', color: '#EF4444', order: 4 },
      ])
    }

    // Videos
    const videosCount = await Video.countDocuments()
    if (videosCount === 0) {
      await Video.insertMany([
        { title: 'مغامرات فهد', description: 'رسوم متحركة تعليمية', category: 'رسوم متحركة', icon: '🎬', color: '#EC4899', isComingSoon: true, order: 0 },
        { title: 'أنشودة الأرقام', description: 'أنشودة تعليمية للأرقام', category: 'أناشيد', icon: '🎵', color: '#8B5CF6', isComingSoon: true, order: 1 },
        { title: 'العلوم للأطفال', description: 'فيديوهات تعليمية في العلوم', category: 'فيديوهات تعليمية', icon: '🔬', color: '#10B981', isComingSoon: true, order: 2 },
        { title: 'برنامج أطفالنا', description: 'برنامج ترفيهي وتعليمي', category: 'برامج أطفال', icon: '📺', color: '#F59E0B', isComingSoon: true, order: 3 },
      ])
    }

    // Challenges
    const challengesCount = await Challenge.countDocuments()
    if (challengesCount === 0) {
      await Challenge.insertMany([
        {
          title: 'تحدي المعلومات العامة',
          description: 'اختبر معلوماتك العامة حول سلطنة عُمان والعالم',
          category: 'معلومات عامة',
          icon: '🌍',
          color: '#3B82F6',
          difficulty: 'سهل',
          allowedModes: ['solo', '1v1', '2v2', '4v4'],
          basePoints: 100,
          defaultTimeLimit: 20,
          speedBonus: true,
          isFeatured: true,
          questions: [
            {
              question: 'ما عاصمة سلطنة عُمان؟',
              options: ['مسقط', 'دبي', 'الرياض', 'أبوظبي'],
              correctAnswer: 0,
              points: 100,
              timeLimit: 20,
            },
            {
              question: 'كم عدد أيام الأسبوع؟',
              options: ['خمسة', 'ستة', 'سبعة', 'ثمانية'],
              correctAnswer: 2,
              points: 100,
              timeLimit: 15,
            },
            {
              question: 'أي من هذه الحيوانات رمز سلطنة عُمان؟',
              options: ['الأسد', 'المها العربية', 'الفهد', 'النسر'],
              correctAnswer: 1,
              points: 100,
              timeLimit: 20,
            },
            {
              question: 'ما اللون الرئيسي في علم سلطنة عُمان؟',
              options: ['الأزرق', 'الأخضر', 'الأحمر', 'الأصفر'],
              correctAnswer: 2,
              points: 100,
              timeLimit: 15,
            },
            {
              question: 'كم عدد شهور السنة؟',
              options: ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر'],
              correctAnswer: 2,
              points: 100,
              timeLimit: 10,
            },
          ],
          order: 0,
        },
        {
          title: 'تحدي الحساب الممتع',
          description: 'اختبر مهاراتك في الرياضيات بطريقة شيقة',
          category: 'اختبارات ذاتية',
          icon: '🔢',
          color: '#10B981',
          difficulty: 'سهل',
          allowedModes: ['solo', '1v1'],
          basePoints: 150,
          defaultTimeLimit: 15,
          speedBonus: true,
          questions: [
            {
              question: 'كم يساوي ٣ + ٥ ؟',
              options: ['٦', '٧', '٨', '٩'],
              correctAnswer: 2,
              points: 150,
              timeLimit: 15,
            },
            {
              question: 'كم يساوي ١٠ - ٤ ؟',
              options: ['٥', '٦', '٧', '٨'],
              correctAnswer: 1,
              points: 150,
              timeLimit: 15,
            },
            {
              question: 'كم يساوي ٢ × ٦ ؟',
              options: ['١٠', '١١', '١٢', '١٣'],
              correctAnswer: 2,
              points: 150,
              timeLimit: 20,
            },
            {
              question: 'ما هو العدد الأكبر؟',
              options: ['١٥', '٢٣', '١٩', '١٧'],
              correctAnswer: 1,
              points: 150,
              timeLimit: 10,
            },
          ],
          order: 1,
        },
        {
          title: 'تحدي اللغة العربية',
          description: 'اختبر معلوماتك في اللغة العربية الجميلة',
          category: 'منافسة الأصدقاء',
          icon: '📝',
          color: '#8B5CF6',
          difficulty: 'متوسط',
          allowedModes: ['solo', '1v1', '2v2'],
          basePoints: 120,
          defaultTimeLimit: 25,
          speedBonus: true,
          questions: [
            {
              question: 'ما هو جمع كلمة "كتاب"؟',
              options: ['كتابات', 'كتب', 'كتوب', 'أكتاب'],
              correctAnswer: 1,
              points: 120,
              timeLimit: 25,
            },
            {
              question: 'ما هو مفرد كلمة "أشجار"؟',
              options: ['شجرة', 'شجير', 'شجرتان', 'شيجر'],
              correctAnswer: 0,
              points: 120,
              timeLimit: 20,
            },
            {
              question: 'أي من هذه الكلمات مؤنثة؟',
              options: ['باب', 'كرسي', 'شمس', 'قلم'],
              correctAnswer: 2,
              points: 120,
              timeLimit: 25,
            },
          ],
          order: 2,
        },
        {
          title: 'تحدي الأسبوع',
          description: 'تحدي متجدد كل أسبوع — هل أنت مستعد؟',
          category: 'تحديات أسبوعية',
          icon: '📅',
          color: '#F59E0B',
          difficulty: 'متوسط',
          allowedModes: ['solo', '1v1', '2v2', '4v4'],
          basePoints: 200,
          defaultTimeLimit: 20,
          speedBonus: true,
          isComingSoon: true,
          questions: [],
          order: 3,
        },
      ])
    }

    // Oasis
    const oasisCount = await OasisContent.countDocuments()
    if (oasisCount === 0) {
      await OasisContent.insertMany([
        { title: 'بسم الله الرحمن الرحيم', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', meaning: 'بدأ باسم الله الرحيم', category: 'أدعية إسلامية', icon: '🌸', color: '#EC4899', isFeatured: true, order: 0 },
        { title: 'الحمد لله رب العالمين', arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', meaning: 'الشكر لله على نعمه', category: 'أدعية إسلامية', icon: '💜', color: '#8B5CF6', order: 1 },
        { title: 'ربنا آتنا في الدنيا حسنة', arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', meaning: 'دعاء لخير الدنيا والآخرة', category: 'أدعية إسلامية', icon: '💙', color: '#3B82F6', order: 2 },
        { title: 'وقل رب زدني علماً', arabicText: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', meaning: 'دعاء طلب العلم', category: 'حفظ القرآن', icon: '💚', color: '#10B981', isFeatured: true, order: 3 },
        { title: 'إن مع العسر يسراً', arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', meaning: 'مع الصعوبة يأتي الفرج', category: 'حفظ القرآن', icon: '💛', color: '#F59E0B', order: 4 },
      ])
    }

    // Treasures
    const treasuresCount = await Treasure.countDocuments()
    if (treasuresCount === 0) {
      await Treasure.insertMany([
        { title: 'الخنجر العُماني', description: 'رمز التراث العُماني الأصيل', category: 'كنوز عُمانية', icon: '⚔️', color: '#F59E0B', isFeatured: true, order: 0 },
        { title: 'الفخار العُماني', description: 'حرفة الفخار التقليدية', category: 'كنوز عُمانية', icon: '🏺', color: '#EF4444', order: 1 },
        { title: 'قلعة نزوى', description: 'من أشهر القلاع العُمانية', category: 'كنوز عُمانية', icon: '🏰', color: '#8B5CF6', order: 2 },
        { title: 'أغنية الأرجوحة', description: 'أغنية تراثية عُمانية للأطفال', category: 'أغانٍ', icon: '🎵', color: '#EC4899', isComingSoon: true, order: 3 },
        { title: 'رسومي الإبداعية', description: 'ركن الرسم والإبداع للأطفال', category: 'ركن الإبداع', icon: '🎨', color: '#10B981', isComingSoon: true, order: 4 },
      ])
    }

    // Classes
    const classesCount = await ClassSession.countDocuments()
    if (classesCount === 0) {
      await ClassSession.insertMany([
        { title: 'حصص الصف الأول', subject: 'جميع المواد', grade: 1, teacher: 'معلمات الصف الأول', teamsLink: 'https://teams.microsoft.com', icon: '1️⃣', color: '#3B82F6', order: 0 },
        { title: 'حصص الصف الثاني', subject: 'جميع المواد', grade: 2, teacher: 'معلمات الصف الثاني', teamsLink: 'https://teams.microsoft.com', icon: '2️⃣', color: '#8B5CF6', order: 1 },
        { title: 'حصص الصف الثالث', subject: 'جميع المواد', grade: 3, teacher: 'معلمات الصف الثالث', teamsLink: 'https://teams.microsoft.com', icon: '3️⃣', color: '#EC4899', order: 2 },
        { title: 'حصص الصف الرابع', subject: 'جميع المواد', grade: 4, teacher: 'معلمات الصف الرابع', teamsLink: 'https://teams.microsoft.com', icon: '4️⃣', color: '#10B981', order: 3 },
      ])
    }

    // Site Settings
    const settingsCount = await SiteSettings.countDocuments()
    if (settingsCount === 0) {
      await SiteSettings.create({
        siteName: 'براعم مجان',
        siteTagline: 'رحلة التعلم تبدأ هنا',
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
      })
    }

    return successResponse({ message: 'تم تهيئة قاعدة البيانات بنجاح' }, 'البيانات جاهزة')
  } catch (err) {
    console.error(err)
    return errorResponse('خطأ في تهيئة البيانات', 500)
  }
}
