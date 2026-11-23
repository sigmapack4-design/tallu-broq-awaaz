/* Tallu Broq Ki Awaaz — site content.
   New posts: copy any block in POSTS, change the text, keep the same cat name.
   cat: news | masayil | kamyabi | sakafat | elaan
   status (masayil only): report | progress | done
   page: link to the full blog page (posts/...)                          */

const POSTS = [
  {
    id: 1, cat: "news", img: "assets/road.webp",
    date: "23 Nov 2026", page: "posts/tallu-broq-milyar-road.html",
    titleEn: "Tallu Broq–Milyar Link Road Restored — A Shining Example of Public Unity",
    titleUr: "تلو بروق سے ملیار تک رابطہ سڑک کی بحالی — عوامی اتحاد کی بہترین مثال",
    bodyEn: "The people of the area, on a self-help basis, have reconnected the Tallu Broq–Milyar link road and restored land contact between the two villages. Now the appeal to the authorities: a bridge grant for permanent, safe travel.",
    bodyUr: "اہلِ علاقہ نے اپنی مدد آپ کے تحت تلو بروق تا ملیار لنک روڈ کو منسلک کرکے دونوں گاؤں کے درمیان زمینی رابطہ بحال کر دیا ہے۔ اب حکامِ بالا سے اپیل ہے کہ اس مقام پر پل کی تعمیر کے لیے خصوصی گرانٹ فراہم کی جائے۔"
  },
  {
    id: 2, cat: "sakafat", img: "assets/gathering.webp",
    date: "23 Nov 2026", page: "posts/parha-likha-naujawan-gaon.html",
    titleEn: "When the Educated Serve Their Village, Its Thinking Changes",
    titleUr: "جب پڑھا لکھا شخص اپنے گاؤں کے لیے کام کرتا ہے",
    bodyEn: "A village does not only need roads and buildings — it needs good thinking, good education and good guides. Real success is not leaving for the city; it is bringing your education back to your village.",
    bodyUr: "گاؤں کو صرف سڑکوں اور عمارتوں کی ضرورت نہیں، اسے اچھی سوچ، اچھی تعلیم اور اچھے رہنما کی ضرورت ہے۔ اصل کامیابی شہر جا کر کامیاب ہونا نہیں، اپنی تعلیم واپس اپنے گاؤں لے کر آنا ہے۔"
  },
  {
    id: 3, cat: "news", img: "assets/skardu-family.webp",
    date: "23 Nov 2026", page: "posts/saniha-skardu-insaaf.html",
    titleEn: "The Skardu Tragedy — One Month On, a Family Still Waits for Justice",
    titleUr: "سانحہ سکردو — ایک ماہ گزر گیا، انصاف کب ملے گا؟",
    bodyEn: "One month has passed since Shaheed Muhammad Aslam, his wife Syeda Hania and their two little children were martyred — yet only one main accused has been arrested while the rest remain beyond the law. The public does not want mere assurances; it wants action and justice.",
    bodyUr: "شہید محمد اسلم، ان کی اہلیہ سیدہ ہانیہ اور ان کے دو ننھے معصوم بچوں کی شہادت کو ایک ماہ گزر چکا ہے، مگر تاحال صرف ایک ہی مرکزی ملزم گرفتار ہوا ہے جبکہ باقی ملزمان قانون کی گرفت سے باہر ہیں۔ عوام کو محض یقین دہانیاں نہیں بلکہ عملی اقدامات اور انصاف چاہیے۔"
  }
];

const DIRECTORY = [
  { icon: "🧱", nameEn: "Mistri / Construction", nameUr: "مستری / تعمیرات",
    descEn: "Raj mistri, mazdoor and construction work. Names and numbers of local workers will be listed here — use the Add Post form to get your name added, it is free." },
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
  { img: "assets/road.webp", capEn: "Tallu Broq–Milyar link road — the people at work", capUr: "تلو بروق تا ملیار لنک روڈ — عوام اپنی مدد آپ" },
  { img: "assets/gathering.webp", capEn: "Village gathering — elders and youth together", capUr: "گاؤں کی بیٹھک — بزرگ اور نوجوان ایک ساتھ" },
  { img: "assets/skardu-family.webp", capEn: "Shaheed Muhammad Aslam, Syeda Hania and their children", capUr: "شہید محمد اسلم، سیدہ ہانیہ اور ان کے بچے" }
];

const RABTA = [
  { icon: "🏫", nameEn: "Village School", nameUr: "گاؤں کا اسکول",
    descEn: "School timings, admissions and exam news will be posted in the Elaan Board." },
  { icon: "🏥", nameEn: "Health / Dispensary", nameUr: "صحت / ڈسپنسری",
    descEn: "Health notices and vaccination days will be announced here and on the Elaan Board." },
  { icon: "🤝", nameEn: "Jirga / Committee", nameUr: "جرگہ / کمیٹی",
    descEn: "Village decisions are made by jirga and public consultation. Decisions and meeting announcements appear on the Elaan Board." }
];
