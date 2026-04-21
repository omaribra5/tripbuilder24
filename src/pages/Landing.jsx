import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Utensils, Hotel, Plane, Headphones,
  Star, CheckCircle, ArrowRight, Smartphone, Globe,
  Zap, Shield, Clock, Users, DollarSign, ChevronDown } from
'lucide-react';
import { LANGUAGES, translations } from '@/lib/i18n';

// Simple translation function for the landing (no context needed)
function lt(lang, key) {
  return translations[lang]?.[key] ?? translations['it'][key] ?? key;
}

// Detect browser language
function detectLang() {
  const nav = navigator.language?.split('-')[0] || 'it';
  return translations[nav] ? nav : 'it';
}

// Landing-specific content (not in i18n since it's marketing copy)
const LANDING_COPY = {
  it: {
    badge: "Pianificazione viaggi potenziata dall'AI",
    title1: 'Il tuo viaggio perfetto,',
    title2: 'generato in secondi',
    subtitle: "TripBuilder24 usa l'intelligenza artificiale per creare itinerari giornalieri personalizzati, suggerire ristoranti, hotel e trasferimenti — tutto in base a te.",
    cta_browser: 'Usa da Browser — Gratis',
    cta_login: 'Accedi',
    cta_start: 'Inizia Gratis →',
    download: "Oppure scarica l'app:",
    dl_ios: 'Scarica su', dl_ios2: 'App Store',
    dl_android: 'Disponibile su', dl_android2: 'Google Play',
    stats: ['Itinerari creati', 'Destinazioni', 'Valutazione media', 'Utenti soddisfatti'],
    how_badge: 'Pronto in meno di 2 minuti',
    how_title: 'Come funziona',
    how_sub: 'Quattro semplici passi per avere il tuo viaggio perfetto',
    steps: [
    { n: '01', title: 'Scegli la destinazione', desc: 'Dove vuoi andare, le date e con chi viaggi.' },
    { n: '02', title: 'Personalizza', desc: "Interessi, budget, cibo, alloggio — tutto su misura." },
    { n: '03', title: "L'AI genera il piano", desc: 'In secondi ricevi un itinerario completo e dettagliato.' },
    { n: '04', title: 'Viaggia e traccia', desc: 'Segna visite, aggiungi spese e consulta la guida AI live.' }],

    feat_title: 'Tutto quello che ti serve',
    feat_sub: "Da un'unica app gestisci ogni aspetto del tuo viaggio",
    mobile_badge: 'Disponibile ovunque',
    mobile_title: 'Con te in ogni momento del viaggio',
    mobile_sub: "Consulta l'itinerario, segna le attrazioni visitate, tieni traccia delle spese e ascolta l'audio tour — anche senza connessione.",
    checklist: ['Funziona anche offline', 'Sincronizzazione su tutti i dispositivi', 'Nessuna pubblicità, nessuna distrazione', 'Export PDF del tuo itinerario'],
    reviews_badge: 'Oltre 10.000 viaggiatori felici',
    reviews_title: 'Cosa dicono i nostri utenti',
    why: [
    { title: 'Velocissimo', desc: 'In 2 minuti hai un itinerario completo per 7 giorni. Nessuna attesa.' },
    { title: 'Sicuro e Privato', desc: 'I tuoi dati e itinerari sono tuoi. Non vendiamo informazioni a nessuno.' },
    { title: 'Per Tutti', desc: 'Solo, coppia, famiglia o gruppo — TripBuilder24 si adatta a ogni tipo di viaggio.' }],

    final_title: 'Pronto per il tuo prossimo viaggio?',
    final_sub: "Gratis, senza carta di credito. Inizia adesso e scopri quanto è facile viaggiare con l'AI.",
    final_cta: 'Inizia da Browser — Gratis',
    privacy: 'Privacy', terms: 'Termini', contact: 'Contatti',
    copyright: '© 2025 TripBuilder24. Tutti i diritti riservati.'
  },
  en: {
    badge: 'AI-powered travel planning',
    title1: 'Your perfect trip,',
    title2: 'generated in seconds',
    subtitle: 'TripBuilder24 uses artificial intelligence to create personalized day-by-day itineraries, suggest restaurants, hotels and transfers — all tailored to you.',
    cta_browser: 'Use in Browser — Free',
    cta_login: 'Sign In',
    cta_start: 'Start Free →',
    download: 'Or download the app:',
    dl_ios: 'Download on', dl_ios2: 'App Store',
    dl_android: 'Get it on', dl_android2: 'Google Play',
    stats: ['Itineraries created', 'Destinations', 'Average rating', 'Satisfied users'],
    how_badge: 'Ready in less than 2 minutes',
    how_title: 'How it works',
    how_sub: 'Four simple steps to get your perfect trip',
    steps: [
    { n: '01', title: 'Choose your destination', desc: 'Where you want to go, dates and who you travel with.' },
    { n: '02', title: 'Customize', desc: 'Interests, budget, food, accommodation — all tailored.' },
    { n: '03', title: 'AI generates your plan', desc: 'In seconds you get a complete, detailed itinerary.' },
    { n: '04', title: 'Travel & track', desc: 'Mark visits, add expenses, consult the live AI guide.' }],

    feat_title: 'Everything you need',
    feat_sub: 'Manage every aspect of your trip from one app',
    mobile_badge: 'Available everywhere',
    mobile_title: 'With you at every moment of your journey',
    mobile_sub: 'Check your itinerary, mark visited attractions, track expenses and listen to the audio tour — even offline.',
    checklist: ['Works offline', 'Sync across all devices', 'No ads, no distractions', 'PDF export of your itinerary'],
    reviews_badge: 'Over 10,000 happy travellers',
    reviews_title: 'What our users say',
    why: [
    { title: 'Lightning fast', desc: 'In 2 minutes you have a complete 7-day itinerary. No waiting.' },
    { title: 'Safe & Private', desc: 'Your data and itineraries are yours. We never sell your information.' },
    { title: 'For Everyone', desc: 'Solo, couple, family or group — TripBuilder24 adapts to every trip.' }],

    final_title: 'Ready for your next adventure?',
    final_sub: 'Free, no credit card required. Start now and discover how easy AI travel planning is.',
    final_cta: 'Start in Browser — Free',
    privacy: 'Privacy', terms: 'Terms', contact: 'Contact',
    copyright: '© 2025 TripBuilder24. All rights reserved.'
  },
  fr: {
    badge: "Planification de voyages par l'IA",
    title1: 'Votre voyage parfait,',
    title2: 'généré en secondes',
    subtitle: "TripBuilder24 utilise l'intelligence artificielle pour créer des itinéraires personnalisés, suggérer des restaurants, hôtels et transferts — tout adapté à vous.",
    cta_browser: 'Utiliser en navigateur — Gratuit',
    cta_login: 'Se connecter',
    cta_start: 'Commencer →',
    download: "Ou télécharger l'app :",
    dl_ios: 'Télécharger sur', dl_ios2: 'App Store',
    dl_android: 'Disponible sur', dl_android2: 'Google Play',
    stats: ['Itinéraires créés', 'Destinations', 'Note moyenne', 'Utilisateurs satisfaits'],
    how_badge: 'Prêt en moins de 2 minutes',
    how_title: 'Comment ça marche',
    how_sub: 'Quatre étapes simples pour avoir votre voyage parfait',
    steps: [
    { n: '01', title: 'Choisissez la destination', desc: 'Où vous voulez aller, les dates et avec qui.' },
    { n: '02', title: 'Personnalisez', desc: 'Intérêts, budget, nourriture, hébergement — tout sur mesure.' },
    { n: '03', title: "L'IA génère le plan", desc: 'En secondes vous recevez un itinéraire complet.' },
    { n: '04', title: 'Voyagez et suivez', desc: 'Marquez les visites, ajoutez des dépenses, consultez le guide.' }],

    feat_title: 'Tout ce dont vous avez besoin',
    feat_sub: "Gérez chaque aspect de votre voyage depuis une seule app",
    mobile_badge: 'Disponible partout',
    mobile_title: 'Avec vous à chaque instant du voyage',
    mobile_sub: "Consultez l'itinéraire, marquez les attractions visitées, suivez les dépenses et écoutez l'audio tour — même hors ligne.",
    checklist: ['Fonctionne hors ligne', 'Synchronisation sur tous les appareils', 'Pas de pub, pas de distraction', 'Export PDF de votre itinéraire'],
    reviews_badge: 'Plus de 10 000 voyageurs heureux',
    reviews_title: 'Ce que disent nos utilisateurs',
    why: [
    { title: 'Ultra rapide', desc: "En 2 minutes vous avez un itinéraire complet de 7 jours." },
    { title: 'Sûr et privé', desc: "Vos données et itinéraires vous appartiennent." },
    { title: 'Pour tous', desc: "Seul, en couple, en famille — TripBuilder24 s'adapte à tout." }],

    final_title: 'Prêt pour votre prochain voyage ?',
    final_sub: "Gratuit, sans carte de crédit. Commencez maintenant.",
    final_cta: 'Commencer dans le navigateur',
    privacy: 'Confidentialité', terms: 'Conditions', contact: 'Contact',
    copyright: '© 2025 TripBuilder24. Tous droits réservés.'
  },
  de: {
    badge: 'KI-gestützte Reiseplanung',
    title1: 'Deine perfekte Reise,',
    title2: 'in Sekunden generiert',
    subtitle: 'TripBuilder24 nutzt künstliche Intelligenz, um personalisierte Tagespläne zu erstellen, Restaurants, Hotels und Transfers vorzuschlagen — alles auf dich zugeschnitten.',
    cta_browser: 'Im Browser nutzen — Kostenlos',
    cta_login: 'Anmelden',
    cta_start: 'Jetzt starten →',
    download: 'Oder lade die App herunter:',
    dl_ios: 'Laden im', dl_ios2: 'App Store',
    dl_android: 'Jetzt bei', dl_android2: 'Google Play',
    stats: ['Erstellte Reisepläne', 'Reiseziele', 'Durchschnittsbewertung', 'Zufriedene Nutzer'],
    how_badge: 'In weniger als 2 Minuten fertig',
    how_title: 'Wie es funktioniert',
    how_sub: 'Vier einfache Schritte für deine perfekte Reise',
    steps: [
    { n: '01', title: 'Reiseziel wählen', desc: 'Wohin, wann und mit wem du reist.' },
    { n: '02', title: 'Personalisieren', desc: 'Interessen, Budget, Essen, Unterkunft — alles nach deinen Wünschen.' },
    { n: '03', title: 'KI erstellt den Plan', desc: 'In Sekunden erhältst du einen vollständigen Reiseplan.' },
    { n: '04', title: 'Reisen und tracken', desc: 'Besuche markieren, Ausgaben hinzufügen, KI-Guide nutzen.' }],

    feat_title: 'Alles was du brauchst',
    feat_sub: 'Verwalte jeden Aspekt deiner Reise aus einer App',
    mobile_badge: 'Überall verfügbar',
    mobile_title: 'Immer an deiner Seite',
    mobile_sub: 'Reiseplan abrufen, Sehenswürdigkeiten abhaken, Ausgaben verfolgen und Audioführung hören — auch offline.',
    checklist: ['Funktioniert offline', 'Synchronisierung auf allen Geräten', 'Keine Werbung, keine Ablenkung', 'PDF-Export deines Reiseplans'],
    reviews_badge: 'Über 10.000 glückliche Reisende',
    reviews_title: 'Was unsere Nutzer sagen',
    why: [
    { title: 'Blitzschnell', desc: 'In 2 Minuten hast du einen vollständigen 7-Tage-Reiseplan.' },
    { title: 'Sicher und privat', desc: 'Deine Daten gehören dir. Wir verkaufen keine Informationen.' },
    { title: 'Für alle', desc: 'Allein, zu zweit, Familie oder Gruppe — TripBuilder24 passt sich an.' }],

    final_title: 'Bereit für deine nächste Reise?',
    final_sub: 'Kostenlos, ohne Kreditkarte. Jetzt starten.',
    final_cta: 'Im Browser starten — Kostenlos',
    privacy: 'Datenschutz', terms: 'AGB', contact: 'Kontakt',
    copyright: '© 2025 TripBuilder24. Alle Rechte vorbehalten.'
  },
  es: {
    badge: 'Planificación de viajes con IA',
    title1: 'Tu viaje perfecto,',
    title2: 'generado en segundos',
    subtitle: 'TripBuilder24 usa inteligencia artificial para crear itinerarios diarios personalizados, sugerir restaurantes, hoteles y traslados — todo adaptado a ti.',
    cta_browser: 'Usar en Navegador — Gratis',
    cta_login: 'Iniciar sesión',
    cta_start: 'Empezar Gratis →',
    download: 'O descarga la app:',
    dl_ios: 'Descargar en', dl_ios2: 'App Store',
    dl_android: 'Disponible en', dl_android2: 'Google Play',
    stats: ['Itinerarios creados', 'Destinos', 'Valoración media', 'Usuarios satisfechos'],
    how_badge: 'Listo en menos de 2 minutos',
    how_title: 'Cómo funciona',
    how_sub: 'Cuatro pasos simples para tener tu viaje perfecto',
    steps: [
    { n: '01', title: 'Elige el destino', desc: 'A dónde ir, las fechas y con quién viajas.' },
    { n: '02', title: 'Personaliza', desc: 'Intereses, presupuesto, comida, alojamiento — todo a medida.' },
    { n: '03', title: 'La IA genera el plan', desc: 'En segundos recibes un itinerario completo y detallado.' },
    { n: '04', title: 'Viaja y sigue', desc: 'Marca visitas, añade gastos y consulta la guía IA.' }],

    feat_title: 'Todo lo que necesitas',
    feat_sub: 'Gestiona cada aspecto de tu viaje desde una sola app',
    mobile_badge: 'Disponible en todas partes',
    mobile_title: 'Contigo en cada momento del viaje',
    mobile_sub: 'Consulta el itinerario, marca atracciones visitadas, sigue los gastos y escucha el audio tour — incluso sin conexión.',
    checklist: ['Funciona sin conexión', 'Sincronización en todos los dispositivos', 'Sin publicidad, sin distracciones', 'Exportar PDF del itinerario'],
    reviews_badge: 'Más de 10.000 viajeros felices',
    reviews_title: 'Lo que dicen nuestros usuarios',
    why: [
    { title: 'Rapidísimo', desc: 'En 2 minutos tienes un itinerario completo de 7 días.' },
    { title: 'Seguro y privado', desc: 'Tus datos son tuyos. No vendemos información a nadie.' },
    { title: 'Para todos', desc: 'Solo, pareja, familia o grupo — TripBuilder24 se adapta a cada viaje.' }],

    final_title: '¿Listo para tu próximo viaje?',
    final_sub: 'Gratis, sin tarjeta de crédito. Empieza ahora.',
    final_cta: 'Empezar en Navegador — Gratis',
    privacy: 'Privacidad', terms: 'Términos', contact: 'Contacto',
    copyright: '© 2025 TripBuilder24. Todos los derechos reservados.'
  }
};

const LANDING_COPY_EXTRA = {
  ja: {
    badge: 'AIによる旅行プランニング',
    title1: 'あなたの完璧な旅が、',
    title2: '数秒で生成',
    subtitle: 'TripBuilder24はAIを使って日々の旅程を作成し、レストラン・ホテル・送迎を提案します — すべてあなたに合わせて。',
    cta_browser: 'ブラウザで使う — 無料',
    cta_login: 'ログイン',
    cta_start: '無料で始める →',
    download: 'またはアプリをダウンロード：',
    dl_ios: 'ダウンロード', dl_ios2: 'App Store',
    dl_android: '入手', dl_android2: 'Google Play',
    stats: ['作成された旅程', '目的地', '平均評価', '満足したユーザー'],
    how_badge: '2分以内に完成',
    how_title: '使い方',
    how_sub: '完璧な旅のための4つのシンプルなステップ',
    steps: [
    { n: '01', title: '目的地を選ぶ', desc: 'どこへ、いつ、誰と旅するかを入力。' },
    { n: '02', title: 'カスタマイズ', desc: '興味・予算・食事・宿泊 — すべて自分好みに。' },
    { n: '03', title: 'AIがプランを生成', desc: '数秒で完全な旅程が届きます。' },
    { n: '04', title: '旅して記録', desc: '訪問をマーク、支出を追加、AIガイドを参照。' }],

    feat_title: '必要なものがすべて揃う',
    feat_sub: '1つのアプリで旅のすべてを管理',
    mobile_badge: 'どこでも利用可能',
    mobile_title: '旅のあらゆる瞬間に寄り添う',
    mobile_sub: '旅程を確認し、観光地をチェックし、支出を管理し、音声ツアーを聴く — オフラインでも。',
    checklist: ['オフラインで動作', '全デバイスで同期', '広告なし、邪魔なし', '旅程のPDFエクスポート'],
    reviews_badge: '10,000人以上の旅行者が満足',
    reviews_title: 'ユーザーの声',
    why: [
    { title: '超高速', desc: '2分で7日間の完全な旅程が完成。' },
    { title: '安全とプライバシー', desc: 'あなたのデータはあなたのもの。情報は販売しません。' },
    { title: '誰でも使える', desc: '一人旅・カップル・家族・グループ — あらゆる旅に対応。' }],

    final_title: '次の旅の準備はできていますか？',
    final_sub: '無料、クレジットカード不要。今すぐ始めましょう。',
    final_cta: 'ブラウザで始める — 無料',
    privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ',
    copyright: '© 2025 TripBuilder24. All rights reserved.'
  },
  zh: {
    badge: 'AI驱动的旅行规划',
    title1: '您的完美旅行，',
    title2: '几秒内生成',
    subtitle: 'TripBuilder24使用人工智能创建个性化的每日行程，推荐餐厅、酒店和接送服务 — 一切都为您量身定制。',
    cta_browser: '在浏览器中使用 — 免费',
    cta_login: '登录',
    cta_start: '免费开始 →',
    download: '或下载应用：',
    dl_ios: '下载', dl_ios2: 'App Store',
    dl_android: '获取', dl_android2: 'Google Play',
    stats: ['已创建行程', '目的地', '平均评分', '满意用户'],
    how_badge: '不到2分钟即可完成',
    how_title: '如何使用',
    how_sub: '四个简单步骤获得您的完美旅行',
    steps: [
    { n: '01', title: '选择目的地', desc: '去哪里、日期和旅伴。' },
    { n: '02', title: '个性化', desc: '兴趣、预算、饮食、住宿 — 全部定制。' },
    { n: '03', title: 'AI生成计划', desc: '几秒内获得完整详细的行程。' },
    { n: '04', title: '旅行并记录', desc: '标记景点、添加支出、查阅AI导览。' }],

    feat_title: '您所需要的一切',
    feat_sub: '一个应用管理旅行的每个方面',
    mobile_badge: '随处可用',
    mobile_title: '旅途中时刻陪伴您',
    mobile_sub: '查看行程、标记已访问景点、追踪支出、收听语音导览 — 离线也可使用。',
    checklist: ['离线工作', '所有设备同步', '无广告，无干扰', '行程PDF导出'],
    reviews_badge: '超过10,000名旅行者满意',
    reviews_title: '用户怎么说',
    why: [
    { title: '极速', desc: '2分钟内完成7天完整行程。' },
    { title: '安全私密', desc: '您的数据属于您。我们不出售任何信息。' },
    { title: '适合所有人', desc: '独自、情侣、家庭或团体 — 适应每种旅行。' }],

    final_title: '准备好迎接下一次旅行了吗？',
    final_sub: '免费，无需信用卡。现在开始。',
    final_cta: '在浏览器中开始 — 免费',
    privacy: '隐私', terms: '条款', contact: '联系我们',
    copyright: '© 2025 TripBuilder24. 保留所有权利。'
  },
  ar: {
    badge: 'تخطيط السفر بالذكاء الاصطناعي',
    title1: 'رحلتك المثالية،',
    title2: 'تُولد في ثوانٍ',
    subtitle: 'يستخدم TripBuilder24 الذكاء الاصطناعي لإنشاء مسارات يومية مخصصة، واقتراح المطاعم والفنادق والنقل — كل شيء مصمم لك.',
    cta_browser: 'استخدم من المتصفح — مجاناً',
    cta_login: 'تسجيل الدخول',
    cta_start: 'ابدأ مجاناً →',
    download: 'أو حمّل التطبيق:',
    dl_ios: 'حمّل من', dl_ios2: 'App Store',
    dl_android: 'متوفر على', dl_android2: 'Google Play',
    stats: ['مسار تم إنشاؤه', 'وجهة', 'متوسط التقييم', 'مستخدم راضٍ'],
    how_badge: 'جاهز في أقل من دقيقتين',
    how_title: 'كيف يعمل',
    how_sub: 'أربع خطوات بسيطة للحصول على رحلتك المثالية',
    steps: [
    { n: '01', title: 'اختر الوجهة', desc: 'إلى أين ومتى ومع من تسافر.' },
    { n: '02', title: 'خصّص', desc: 'الاهتمامات والميزانية والطعام والإقامة — كل شيء حسب رغبتك.' },
    { n: '03', title: 'الذكاء الاصطناعي يولّد الخطة', desc: 'في ثوانٍ تحصل على مسار كامل ومفصّل.' },
    { n: '04', title: 'سافر وتتبّع', desc: 'ضع علامة على الزيارات، أضف المصاريف، استشر الدليل الذكي.' }],

    feat_title: 'كل ما تحتاجه',
    feat_sub: 'أدر كل جانب من جوانب رحلتك من تطبيق واحد',
    mobile_badge: 'متاح في كل مكان',
    mobile_title: 'معك في كل لحظة من رحلتك',
    mobile_sub: 'اطّلع على المسار، ضع علامة على الأماكن التي زرتها، تتبّع المصاريف، واستمع إلى الجولة الصوتية — حتى بدون إنترنت.',
    checklist: ['يعمل بدون إنترنت', 'مزامنة على جميع الأجهزة', 'بلا إعلانات، بلا إزعاج', 'تصدير PDF للمسار'],
    reviews_badge: 'أكثر من 10,000 مسافر سعيد',
    reviews_title: 'ماذا يقول مستخدمونا',
    why: [
    { title: 'سريع جداً', desc: 'في دقيقتين لديك مسار كامل لـ 7 أيام.' },
    { title: 'آمن وخاص', desc: 'بياناتك ملكك. لا نبيع معلوماتك لأحد.' },
    { title: 'للجميع', desc: 'منفرداً، زوجين، عائلة أو مجموعة — يتكيّف مع كل رحلة.' }],

    final_title: 'هل أنت مستعد لرحلتك القادمة؟',
    final_sub: 'مجاناً، بدون بطاقة ائتمان. ابدأ الآن.',
    final_cta: 'ابدأ من المتصفح — مجاناً',
    privacy: 'الخصوصية', terms: 'الشروط', contact: 'اتصل بنا',
    copyright: '© 2025 TripBuilder24. جميع الحقوق محفوظة.'
  },
  ru: {
    badge: 'Планирование путешествий с ИИ',
    title1: 'Ваше идеальное путешествие,',
    title2: 'готово за секунды',
    subtitle: 'TripBuilder24 использует искусственный интеллект для создания персонализированных маршрутов, подбора ресторанов, отелей и трансферов — всё под вас.',
    cta_browser: 'Использовать в браузере — Бесплатно',
    cta_login: 'Войти',
    cta_start: 'Начать бесплатно →',
    download: 'Или скачайте приложение:',
    dl_ios: 'Загрузить в', dl_ios2: 'App Store',
    dl_android: 'Доступно в', dl_android2: 'Google Play',
    stats: ['Создано маршрутов', 'Направлений', 'Средняя оценка', 'Довольных пользователей'],
    how_badge: 'Готово менее чем за 2 минуты',
    how_title: 'Как это работает',
    how_sub: 'Четыре простых шага к идеальному путешествию',
    steps: [
    { n: '01', title: 'Выберите направление', desc: 'Куда, когда и с кем вы едете.' },
    { n: '02', title: 'Персонализируйте', desc: 'Интересы, бюджет, еда, жильё — всё под вас.' },
    { n: '03', title: 'ИИ создаёт план', desc: 'За секунды вы получаете полный маршрут.' },
    { n: '04', title: 'Путешествуйте и отслеживайте', desc: 'Отмечайте визиты, добавляйте расходы, консультируйтесь с ИИ-гидом.' }],

    feat_title: 'Всё что вам нужно',
    feat_sub: 'Управляйте каждым аспектом поездки из одного приложения',
    mobile_badge: 'Доступно везде',
    mobile_title: 'Рядом с вами в каждый момент поездки',
    mobile_sub: 'Просматривайте маршрут, отмечайте посещённые места, отслеживайте расходы и слушайте аудиотур — даже без интернета.',
    checklist: ['Работает офлайн', 'Синхронизация на всех устройствах', 'Без рекламы, без отвлечений', 'Экспорт PDF маршрута'],
    reviews_badge: 'Более 10 000 довольных путешественников',
    reviews_title: 'Что говорят наши пользователи',
    why: [
    { title: 'Молниеносно', desc: 'За 2 минуты получите полный маршрут на 7 дней.' },
    { title: 'Безопасно и конфиденциально', desc: 'Ваши данные принадлежат вам. Мы не продаём информацию.' },
    { title: 'Для всех', desc: 'Один, пара, семья или группа — TripBuilder24 подходит для любой поездки.' }],

    final_title: 'Готовы к следующему путешествию?',
    final_sub: 'Бесплатно, без кредитной карты. Начните прямо сейчас.',
    final_cta: 'Начать в браузере — Бесплатно',
    privacy: 'Конфиденциальность', terms: 'Условия', contact: 'Контакты',
    copyright: '© 2025 TripBuilder24. Все права защищены.'
  }
};

// Fallback to English for languages not in LANDING_COPY
function lc(lang, key) {
  return LANDING_COPY[lang]?.[key] ?? LANDING_COPY_EXTRA[lang]?.[key] ?? LANDING_COPY['en']?.[key] ?? LANDING_COPY['it'][key];
}

const FEATURES = (lang) => [
{ icon: MapPin, title: lt(lang, 'feat_itinerary'), desc: lt(lang, 'feat_itinerary_desc'), color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
{ icon: Utensils, title: lt(lang, 'feat_restaurants'), desc: lt(lang, 'feat_restaurants_desc'), color: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
{ icon: Hotel, title: lt(lang, 'feat_hotels'), desc: lt(lang, 'feat_hotels_desc'), color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
{ icon: Plane, title: lt(lang, 'feat_airport'), desc: lt(lang, 'feat_airport_desc'), color: 'bg-violet-500/20 text-violet-300 border border-violet-500/30' },
{ icon: Headphones, title: lt(lang, 'feat_audio'), desc: lt(lang, 'feat_audio_desc'), color: 'bg-pink-500/20 text-pink-300 border border-pink-500/30' },
{ icon: DollarSign, title: lt(lang, 'feat_pdf'), desc: lt(lang, 'feat_pdf_desc'), color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }];


const TESTIMONIALS = {
  it: [
  { name: 'Giulia R.', location: 'Milano', avatar: 'GR', text: 'Avevo paura di organizzare una settimana a Tokyo da sola. TripBuilder24 ha fatto tutto in 30 secondi. Perfetto!', stars: 5 },
  { name: 'Marco & Sofia', location: 'Roma', avatar: 'MS', text: "L'itinerario per Barcellona era così dettagliato che non abbiamo perso nemmeno un minuto. I ristoranti erano incredibili.", stars: 5 },
  { name: 'Luca F.', location: 'Torino', avatar: 'LF', text: "Le istruzioni per l'aeroporto ci hanno salvato all'arrivo a Bangkok.", stars: 5 }],

  en: [
  { name: 'Sarah K.', location: 'London', avatar: 'SK', text: 'I was scared to plan a solo week in Tokyo. TripBuilder24 did everything in 30 seconds. Amazing!', stars: 5 },
  { name: 'James & Emma', location: 'Manchester', avatar: 'JE', text: 'The Barcelona itinerary was so detailed we didn\'t waste a single minute. Restaurants were incredible.', stars: 5 },
  { name: 'Tom H.', location: 'Edinburgh', avatar: 'TH', text: 'The airport transfer instructions saved us on arrival in Bangkok. Could not have done it without!', stars: 5 }]

};

const STATS = [
{ value: '10,000+', key: 0 },
{ value: '150+', key: 1 },
{ value: '4.9★', key: 2 },
{ value: '98%', key: 3 }];


const APP_SCREENSHOTS = (lang) => [
{
  bg: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
  label: lt(lang, 'tab_itinerary'),
  items: ['09:00 — Sagrada Família', '12:30 — 🍽️ Bodega Sepúlveda', '15:00 — Park Güell', '20:00 — 🍽️ El Nacional'],
  color: 'from-indigo-600 to-indigo-900'
},
{
  bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop',
  label: lt(lang, 'feat_restaurants'),
  items: ['⭐ 4.8 — Cervecería Catalana', '💰 €€ — Palo Cortao', '🌱 Vegano — Green Spot'],
  color: 'from-orange-600 to-orange-900'
},
{
  bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop',
  label: lt(lang, 'feat_hotels'),
  items: ['Hotel Arts ⭐⭐⭐⭐⭐', '10 min dal centro', '€180/notte · Booking.com →'],
  color: 'from-cyan-600 to-cyan-900'
}];


const AppleIcon = () =>
<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>;


const PlayIcon = () =>
<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.18 23.76c.3.17.65.19.96.07l12.12-6.97-2.59-2.59-10.49 9.49zM.4 1.81C.15 2.12 0 2.56 0 3.13v17.74c0 .57.15 1.01.4 1.32l.07.07L10.14 12.5v-.23L.47 1.74.4 1.81zM20.45 10.03l-2.53-1.45-2.84 2.84 2.84 2.84 2.56-1.47c.73-.42.73-1.34-.03-1.76zM3.18.24L15.3 7.21l-2.59 2.59L2.22.31c.3-.12.65-.1.96.07v-.14z" />
  </svg>;


export default function Landing() {
  const [lang, setLang] = useState(detectLang);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();

  const copy = lc.bind(null, lang);
  const features = FEATURES(lang);
  const screenshots = APP_SCREENSHOTS(lang);
  const testimonials = TESTIMONIALS[lang] || TESTIMONIALS['en'];
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const handleUseBrowser = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6fcf1be7c_Gemini_Generated_Image_5i31ad5i31ad5i31.png"

          alt="TripBuilder24" className="h-9 w-auto object-contain" />

          
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white bg-white/5 border border-white/15 px-3 py-2 rounded-lg transition-colors">
                
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLang.label}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showLangMenu &&
              <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-white/15 rounded-xl shadow-2xl py-1 w-44 z-50">
                  {LANGUAGES.map((l) =>
                <button
                  key={l.code}
                  onClick={() => {setLang(l.code);setShowLangMenu(false);}}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/10 transition-colors ${lang === l.code ? 'text-indigo-300 font-semibold' : 'text-slate-200'}`}>
                  
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                )}
                </div>
              }
            </div>
            <button
              onClick={handleUseBrowser}
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 font-medium">
              
              {copy('cta_login')}
            </button>
            <button
              onClick={handleUseBrowser}
              className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/30">
              
              {copy('cta_start')}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-400/40 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4" />
              {copy('badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              {copy('title1')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400">
                {copy('title2')}
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              {copy('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={handleUseBrowser}
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base shadow-xl shadow-indigo-500/30">
                
                <Globe className="w-5 h-5" />
                {copy('cta_browser')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-sm text-slate-400 font-medium">{copy('download')}</p>
              <div className="flex gap-3">
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/15 transition-colors px-4 py-2.5 rounded-xl">
                  <AppleIcon />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">{copy('dl_ios')}</div>
                    <div className="text-sm font-bold text-white">{copy('dl_ios2')}</div>
                  </div>
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/15 transition-colors px-4 py-2.5 rounded-xl">
                  <PlayIcon />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">{copy('dl_android')}</div>
                    <div className="text-sm font-bold text-white">{copy('dl_android2')}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* App screenshot mockups */}
          <div className="mt-20 flex gap-6 justify-center items-end overflow-x-auto pb-4">
            {screenshots.map((s, i) =>
            <div
              key={i}
              className={`flex-shrink-0 w-56 rounded-3xl overflow-hidden border border-white/15 shadow-2xl ${i === 1 ? 'scale-110 z-10' : 'opacity-80'} transition-all`}
              style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
              
                <div className="bg-slate-900 px-4 pt-3 pb-1 flex justify-center">
                  <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                </div>
                <div className={`bg-gradient-to-br ${s.color} px-4 py-3`}>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-0.5">TripBuilder24</div>
                  <div className="text-sm font-bold text-white">{s.label}</div>
                </div>
                <div className="relative h-28 overflow-hidden">
                  <img src={s.bg} alt={s.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <div className="bg-slate-900 px-3 py-3 space-y-2">
                  {s.items.map((item, j) =>
                <div key={j} className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      <span className="text-xs text-slate-200 leading-tight">{item}</span>
                    </div>
                )}
                </div>
                <div className="bg-slate-900 px-4 pb-4 pt-1 flex justify-center gap-4">
                  {['🗺️', '🏨', '✈️', '💰'].map((icon, j) => <span key={j} className="text-base opacity-60">{icon}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 px-6 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) =>
          <div key={s.key}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-400 font-medium">{lc(lang, 'stats')[s.key]}</div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4" />
              {copy('how_badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{copy('how_title')}</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">{copy('how_sub')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {lc(lang, 'steps').map((step, i) =>
            <div key={i} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-400/50 hover:bg-white/8 transition-all">
                <div className="text-5xl font-black text-indigo-400/40 mb-3 leading-none">{step.n}</div>
                <h3 className="font-bold text-white mb-2 text-base">{step.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{copy('feat_title')}</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">{copy('feat_sub')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) =>
            <div key={i} className="bg-white/4 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/7 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-pink-300 bg-pink-500/15 border border-pink-400/40 px-4 py-2 rounded-full mb-6">
                <Smartphone className="w-4 h-4" />
                {copy('mobile_badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">{copy('mobile_title')}</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">{copy('mobile_sub')}</p>
              <div className="space-y-3">
                {lc(lang, 'checklist').map((item, i) =>
                <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">{item}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
              { img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop', label: lt(lang, 'tab_itinerary'), icon: '🗺️' },
              { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=400&fit=crop', label: lt(lang, 'tab_map'), icon: '📍' },
              { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=400&fit=crop', label: lt(lang, 'feat_restaurants'), icon: '🍽️' },
              { img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=400&fit=crop', label: lt(lang, 'feat_hotels'), icon: '🏨' }].
              map((item, i) =>
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group border border-white/10">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-bold text-white">{item.label}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-300 bg-yellow-500/15 border border-yellow-400/40 px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 fill-yellow-300" />
              {copy('reviews_badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{copy('reviews_title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) =>
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.location}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
            { icon: Zap, color: 'text-yellow-400 bg-yellow-500/15 border-yellow-400/30' },
            { icon: Shield, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-400/30' },
            { icon: Users, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-400/30' }].
            map((item, i) => {
              const why = lc(lang, 'why')[i];
              return (
                <div key={i} className="text-center p-8 bg-white/4 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-white text-lg mb-2">{why.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{why.desc}</p>
                </div>);

            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-indigo-600/20 via-indigo-500/10 to-cyan-500/10 border border-indigo-400/30 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{copy('final_title')}</h2>
              <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">{copy('final_sub')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={handleUseBrowser}
                  className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-xl transition-colors text-base shadow-xl shadow-indigo-500/40">
                  
                  <Globe className="w-5 h-5" />
                  {copy('final_cta')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-6">
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors font-medium">
                  <AppleIcon /> {copy('dl_ios2')}
                </a>
                <span className="text-slate-600">·</span>
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors font-medium">
                  <PlayIcon /> {copy('dl_android2')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="https://media.base44.com/images/public/69d2b459265164ba16bfc871/6c9d959b6_pikes_1776257498690.jpg"
            alt="TripBuilder24"
            className="h-8 w-auto object-contain" />
          
          <p className="text-sm text-slate-500">{copy('copyright')}</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">{copy('privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{copy('terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{copy('contact')}</a>
          </div>
        </div>
      </footer>
    </div>);

}