/* Tallu Broq Ki Awaaz — site content.
   New posts: copy any block in POSTS, change the text, keep the same cat name.
   cat: news | masayil | kamyabi | sakafat | elaan
   status (masayil only): report | progress | done                     */

const POSTS = [
  {
    id: 1, cat: "news", img: "assets/hero.webp",
    date: "23 Nov 2026",
    titleEn: "Tallu Broq Ki Awaaz website launched",
    titleUr: "تلو بروق کی آواز ویب سائٹ کا آغاز",
    bodyEn: "Our village now has its own voice on the internet. News, problems, success stories and our culture — everything from Tallu Broq will be shared here with the whole world.",
    bodyUr: "اب ہمارے گاؤں کی اپنی آواز انٹرنیٹ پر موجود ہے۔ تلو بروق کی خبریں، مسائل، کامیابیاں اور ثقافت — سب کچھ یہاں سے پوری دنیا تک پہنچے گا۔"
  },
  {
    id: 2, cat: "elaan", img: "",
    date: "23 Nov 2026",
    titleEn: "Send your news, problem or success story",
    titleUr: "اپنی خبر، مسئلہ یا کامیابی بھیجیں",
    bodyEn: "Anyone from the village can send a news item, a problem or a success story through the 'Masla Bhejein' form. After a quick check it will be published here with your name.",
    bodyUr: "گاؤں کا کوئی بھی فرد 'مسئلہ بھیجیں' والے فارم سے خبر، مسئلہ یا کامیابی بھیج سکتا ہے۔ جانچ کے بعد وہ آپ کے نام کے ساتھ یہاں شائع ہو جائے گی۔"
  },
  {
    id: 3, cat: "masayil", img: "", status: "progress",
    date: "23 Nov 2026",
    titleEn: "How the Masayil board works",
    titleUr: "مسائل بورڈ کیسے کام کرتا ہے",
    bodyEn: "Every problem posted here gets a public status: Reported, In Progress, or Resolved. When a problem is sent, it appears here — and its status keeps updating until it is solved, so the whole village can see the progress.",
    bodyUr: "یہاں شائع ہونے والے ہر مسئلے کی حالت سب کے سامنے ہوتی ہے: رپورٹ ہوا، کام جاری، یا حل ہو گیا۔ مسئلہ بھیجتے ہی یہاں آ جائے گا اور حل ہونے تک اس کی حالت بدلتی رہے گی، تاکہ پورا گاؤں پیش رفت دیکھ سکے۔"
  },
  {
    id: 4, cat: "kamyabi", img: "assets/craft.webp",
    date: "23 Nov 2026",
    titleEn: "Our students' success will shine here",
    titleUr: "ہمارے طلبہ کی کامیابی یہاں چمکے گی",
    bodyEn: "Exam results, admissions, jobs and every achievement of our youth will be celebrated on this page. Send a success story with a photo and it will be published with pride.",
    bodyUr: "امتحانی نتائج، داخلے، نوکریاں اور نوجوانوں کی ہر کامیابی اس صفحے پر منائی جائے گی۔ کامیابی کی خبر تصویر کے ساتھ بھیجیں، فخر کے ساتھ شائع ہو گی۔"
  },
  {
    id: 5, cat: "sakafat", img: "assets/polo.webp",
    date: "23 Nov 2026",
    titleEn: "Polo — the pride of our mountains",
    titleUr: "پولو — ہمارے پہاڑوں کا فخر",
    bodyEn: "In Gilgit-Baltistan, polo is not just a game, it is a centuries-old tradition of our valleys. Festivals, music, dress and handicrafts — our culture section will carry all of it to the world.",
    bodyUr: "گلگت بلتستان میں پولو صرف کھیل نہیں، ہماری وادیوں کی صدیوں پرانی روایت ہے۔ میلے، موسیقی، لباس اور دستکاری — ثقافت کا یہ خزانہ اس حصے سے دنیا تک پہنچے گا۔"
  }
];

const DIRECTORY = [
  { icon: "🧱", nameEn: "Mistri / Construction", nameUr: "مستری / تعمیرات",
    descEn: "Raj mistri, mazdoor and construction work. Names and numbers of local workers will be listed here — send yours on WhatsApp to get added." },
  { icon: "💡", nameEn: "Electrician", nameUr: "الیکٹریشن",
    descEn: "Bijli ka kaam — wiring, repair and fitting. Local electricians can add their name and number here for free." },
  { icon: "🚗", nameEn: "Driver / Transport", nameUr: "ڈرائیور / گاڑی",
    descEn: "Gaari for Skardu trips, loading and local travel. Drivers can register their vehicle and number here." },
  { icon: "🛒", nameEn: "Shops / Kiryana", nameUr: "دکانیں / کریانہ",
    descEn: "Village shops and their timings. Shopkeepers can list their shop so everyone knows where to find daily items." },
  { icon: "🧵", nameEn: "Darzi / Handicrafts", nameUr: "درزی / دستکاری",
    descEn: "Silai, karhai and local handicrafts — the skilled hands of our village, especially our women artisans." },
  { icon: "📱", nameEn: "Mobile / Repair", nameUr: "موبائل / مرمت",
    descEn: "Mobile repair, recharge and accessories. Local repair shops can add their details here." }
];

const GALLERY = [
  { img: "assets/hero.webp", capEn: "Our valley — Tallu Broq", capUr: "ہماری وادی — تلو بروق" },
  { img: "assets/polo.webp", capEn: "Polo Festival", capUr: "پولو میلہ" },
  { img: "assets/craft.webp", capEn: "Handicrafts of our women", capUr: "ہماری خواتین کی دستکاری" }
];

const RABTA = [
  { icon: "🏫", nameEn: "Village School", nameUr: "گاؤں کا اسکول",
    descEn: "School timings, admissions and exam news will be posted in the Elaan Board." },
  { icon: "🏥", nameEn: "Health / Dispensary", nameUr: "صحت / ڈسپنسری",
    descEn: "Health notices and vaccination days will be announced here and on the Elaan Board." },
  { icon: "🤝", nameEn: "Jirga / Committee", nameUr: "جرگہ / کمیٹی",
    descEn: "Village decisions are made by jirga and public consultation. Decisions and meeting announcements appear on the Elaan Board." }
];
