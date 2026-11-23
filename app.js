/* Tallu Broq Ki Awaaz — app logic */
"use strict";

const I18N = {
  en: {
    nav_home: "Home", nav_news: "Khabrein", nav_masayil: "Masayil",
    nav_gaon: "Gaon", nav_kamyabi: "Kamyabi", nav_kaam: "Kaam Kaaj",
    nav_elaan: "Elaan Board", nav_rabta: "Rabta Directory",
    nav_sakafat: "Sakafat", nav_gallery: "Gallery",
    cta_submit: "Masla Bhejein",
    footer_tag: "Gaon ki khabrein, masayil, kamyabi aur sakafat — poori duniya ke liye."
  },
  ur: {
    nav_home: "ہوم", nav_news: "خبریں", nav_masayil: "مسائل",
    nav_gaon: "گاؤں", nav_kamyabi: "کامیابی", nav_kaam: "کام کاج",
    nav_elaan: "اعلان بورڈ", nav_rabta: "رابطہ ڈائریکٹری",
    nav_sakafat: "ثقافت", nav_gallery: "گیلری",
    cta_submit: "مسئلہ بھیجیں",
    footer_tag: "گاؤں کی خبریں، مسائل، کامیابی اور ثقافت — پوری دنیا کے لیے۔"
  }
};
let LANG = localStorage.getItem("tbka-lang") || "en";

const CATMETA = {
  news:    { en: "News",        ur: "خبریں",   chip: "" },
  masayil: { en: "Masayil",     ur: "مسائل",   chip: "red" },
  kamyabi: { en: "Kamyabi",     ur: "کامیابی", chip: "gold" },
  sakafat: { en: "Sakafat",     ur: "ثقافت",   chip: "" },
  elaan:   { en: "Elaan",       ur: "اعلان",   chip: "gold" }
};
const STATUS = {
  report:   { en: "● Reported",    ur: "رپورٹ ہوا" },
  progress: { en: "● In Progress", ur: "کام جاری" },
  done:     { en: "● Resolved",    ur: "حل ہو گیا" }
};

const app = document.getElementById("app");
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byCat = cat => POSTS.filter(p => p.cat === cat);

function postCard(p) {
  const meta = CATMETA[p.cat];
  const status = p.status ? `<span class="status ${p.status}">${esc(STATUS[p.status][LANG] || STATUS[p.status].en)}</span>` : "";
  return `<article class="pcard reveal">
    ${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : ""}
    <div class="pcard-body">
      <span class="chip ${meta.chip}">${esc(meta.en)}</span>
      <h3>${esc(p.titleEn)}<span class="ur">${esc(p.titleUr)}</span></h3>
      <p>${esc(LANG === "ur" ? (p.bodyUr || p.bodyEn) : p.bodyEn)}</p>
      <div class="pmeta"><span>${esc(p.date)}</span>${status}</div>
    </div>
  </article>`;
}

function viewHead(en, ur, sub) {
  return `<div class="view-head reveal"><h1>${esc(en)}<span class="ur">${esc(ur)}</span></h1><p>${esc(sub)}</p></div>`;
}

function homeView() {
  const latest = [...POSTS].slice(0, 3);
  const tickerItems = POSTS.map(p => esc(p.titleEn)).join("<span>✦</span>");
  const sections = [
    { route: "news",    ic: "📰", en: "Latest News",        ur: "تازہ خبریں",   txt: "Gaon ki har taaza khabar, sab se pehle yahan.", gold: false },
    { route: "masayil", ic: "⚠",  en: "Village Problems",   ur: "مسائل",       txt: "Masla post karein — status sab ke samne update hoga.", gold: false },
    { route: "kamyabi", ic: "🏆", en: "Success Stories",    ur: "کامیابی",     txt: "Students aur naujawanon ki kamyabi ka jashn.", gold: true },
    { route: "sakafat", ic: "🎭", en: "Culture",            ur: "ثقافت",       txt: "Mele, riwayat aur hamari pehchan — duniya ke liye.", gold: false }
  ];
  return `
  <section class="hero reveal">
    <img class="hero-bg" src="assets/hero.webp" alt="Tallu Broq valley">
    <div class="hero-shade"></div>
    <div class="hero-content">
      <span class="hero-chip">Gilgit-Baltistan · Pakistan</span>
      <h1>Tallu Broq Ki Awaaz — <em>Paharon ki awaaz, gaon ki baat</em></h1>
      <span class="hero-ur ur">پہاڑوں کی آواز، گاؤں کی بات</span>
      <p class="hero-sub">Hamare masayil, hamari kamyabiyan, hamari sakafat — Tallu Broq ki awaaz ab poori duniya tak.</p>
      <div class="hero-btns">
        <a class="btn-gold" href="#/news">Read Latest News</a>
        <a class="btn-ghost" href="#/sakafat">About the Village</a>
      </div>
    </div>
  </section>

  <div class="ticker reveal" aria-label="Latest headlines">
    <span class="ticker-label">TAAZA</span>
    <div class="ticker-track"><div class="ticker-move"><span>${tickerItems}</span><span>${tickerItems}</span></div></div>
  </div>

  <div class="sec-title reveal"><h2>Our Community Sections<span class="ur">ہمارے حصے</span></h2></div>
  <p class="sec-sub reveal">Har section gaon ki zindagi ka aik rang hai — khabar se sakafat tak.</p>
  <div class="cards">
    ${sections.map(s => `<a class="scard ${s.gold ? "gold" : ""} reveal" href="#/${s.route}" data-tilt>
      <span class="scard-ic">${s.ic}</span>
      <h3>${s.en}</h3><span class="ur">${s.ur}</span>
      <p>${s.txt}</p><span class="go">Open</span></a>`).join("")}
  </div>

  <div class="sec-title reveal"><h2>Latest Posts<span class="ur">تازہ پوسٹس</span></h2></div>
  <div class="posts">${latest.map(postCard).join("")}</div>

  <div class="sec-title reveal"><h2>Photo Gallery<span class="ur">گیلری</span></h2></div>
  <div class="gallery">${GALLERY.map(galleryItem).join("")}</div>`;
}

function galleryItem(g) {
  return `<figure class="gitem reveal"><img src="${esc(g.img)}" alt="" loading="lazy">
    <figcaption>${esc(g.capEn)}<span class="ur">${esc(g.capUr)}</span></figcaption></figure>`;
}

function listView(cat, en, ur, sub) {
  const items = byCat(cat);
  return viewHead(en, ur, sub) +
    (items.length ? `<div class="posts">${items.map(postCard).join("")}</div>`
                  : `<div class="empty-note reveal">Abhi is section mein koi post nahi — pehli post aap bhejein!</div>`);
}

function kaamView() {
  return viewHead("Kaam Kaaj", "کام کاج", "Gaon ke hunarmand log aur rozgar — kis ko kya kaam aata hai, sab yahan milega.") +
  `<div class="dir-grid">${DIRECTORY.map(d => `<div class="dcard reveal">
      <h3><span>${d.icon}</span>${esc(d.nameEn)}<span class="ur" style="margin-left:auto;font-size:.85rem;color:var(--gold)">${esc(d.nameUr)}</span></h3>
      <p>${esc(d.descEn)}</p></div>`).join("")}</div>
   <div class="empty-note reveal">Apna naam aur hunar is list mein add karwane ke liye <a href="#/submit" style="color:var(--green);font-weight:700">form bharein</a> — bilkul muft hai.</div>`;
}

function galleryView() {
  return viewHead("Photo Gallery", "گیلری", "Tallu Broq ki khoobsurati — pahar, khet, mele aur log.") +
  `<div class="gallery">${GALLERY.map(galleryItem).join("")}</div>
   <div class="empty-note reveal">Gaon ki apni asal photos jald aa rahi hain — aap ke paas achi photo hai to <a href="#/submit" style="color:var(--green);font-weight:700">bhej dein</a>, naam ke saath lagegi.</div>`;
}

function rabtaView() {
  return viewHead("Rabta Directory", "رابطہ", "Gaon ke aham idare aur rabte ki maloomat.") +
  `<div class="dir-grid">${RABTA.map(d => `<div class="dcard reveal">
      <h3><span>${d.icon}</span>${esc(d.nameEn)}<span class="ur" style="margin-left:auto;font-size:.85rem;color:var(--gold)">${esc(d.nameUr)}</span></h3>
      <p>${esc(d.descEn)}</p></div>`).join("")}</div>`;
}

function submitView() {
  return viewHead("Masla Bhejein", "مسئلہ بھیجیں", "Khabar, masla, kamyabi ya elaan — form bharein, WhatsApp par seedha ham tak pahunch jayega.") +
  `<form class="form-card reveal" id="submitForm">
     <label for="fName">Aap ka naam / Your name</label>
     <input id="fName" required placeholder="e.g. Muhammad Ali">
     <label for="fCat">Qisam / Category</label>
     <select id="fCat">
       <option value="Masla">Masla (Problem)</option>
       <option value="Khabar">Khabar (News)</option>
       <option value="Kamyabi">Kamyabi (Success)</option>
       <option value="Elaan">Elaan (Announcement)</option>
       <option value="Kaam Kaaj">Kaam Kaaj (Directory add)</option>
     </select>
     <label for="fTitle">Unwaan / Title</label>
     <input id="fTitle" required placeholder="Short title">
     <label for="fBody">Tafseel / Details</label>
     <textarea id="fBody" rows="5" required placeholder="Poori tafseel likhein..."></textarea>
     <button class="btn-gold" type="submit">WhatsApp Par Bhejein →</button>
     <p class="form-note">Form submit karne se WhatsApp khulega — wahan Send dabate hi aap ki post ham tak pahunch jayegi.</p>
   </form>`;
}

const ROUTES = {
  home:    { nav: "home",    render: homeView },
  news:    { nav: "news",    render: () => listView("news", "Khabrein", "خبریں", "Tallu Broq ki taaza tareen khabrein.") },
  masayil: { nav: "masayil", render: () => listView("masayil", "Masayil", "مسائل", "Gaon ke masayil aur un ki halat — Report, Kaam Jari ya Hal.") },
  kamyabi: { nav: "kamyabi", render: () => listView("kamyabi", "Kamyabi", "کامیابی", "Hamare logon ki kamyabi ki khabrein.") },
  kaam:    { nav: "kaam",    render: kaamView },
  sakafat: { nav: "sakafat", render: () => listView("sakafat", "Sakafat", "ثقافت", "Mele, riwayat, zaban aur hamari pehchan.") },
  gallery: { nav: "gallery", render: galleryView },
  elaan:   { nav: "elaan",   render: () => listView("elaan", "Elaan Board", "اعلان بورڈ", "Jirga ke faislay, meetings aur aham elanaat.") },
  rabta:   { nav: "rabta",   render: rabtaView },
  submit:  { nav: "",        render: submitView }
};

function applyLang() {
  const dict = I18N[LANG] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (dict[k]) el.textContent = dict[k];
    el.classList.toggle("ur", LANG === "ur");
  });
  document.getElementById("langBtn").textContent = LANG === "ur" ? "EN" : "اردو";
  document.documentElement.lang = LANG === "ur" ? "ur" : "en";
}

function bindReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

function bindTilt() {
  if (!window.matchMedia("(pointer:fine)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

function render() {
  const route = (location.hash.replace("#/", "") || "home").split("?")[0];
  const r = ROUTES[route] || ROUTES.home;
  app.innerHTML = r.render();
  document.querySelectorAll("[data-nav]").forEach(a =>
    a.classList.toggle("active", a.getAttribute("data-nav") === r.nav));
  closeAllMenus();
  bindReveals();
  bindTilt();
  const form = document.getElementById("submitForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("fName").value.trim();
    const cat = document.getElementById("fCat").value;
    const title = document.getElementById("fTitle").value.trim();
    const body = document.getElementById("fBody").value.trim();
    const text = `Tallu Broq Ki Awaaz — New Post%0A%0AName: ${encodeURIComponent(name)}%0ACategory: ${encodeURIComponent(cat)}%0ATitle: ${encodeURIComponent(title)}%0A%0A${encodeURIComponent(body)}`;
    window.open(`https://wa.me/923379742452?text=${text}`, "_blank");
  });
  window.scrollTo({ top: 0 });
  applyLang();
}

/* ----- Dropdown (arrow) menus ----- */
function closeAllMenus() {
  document.querySelectorAll("[data-drop].open").forEach(d => {
    d.classList.remove("open");
    d.querySelector("[data-drop-btn]").setAttribute("aria-expanded", "false");
  });
  const panel = document.getElementById("mobilePanel");
  panel.classList.remove("show");
  const burger = document.getElementById("burger");
  burger.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}
document.querySelectorAll("[data-drop-btn]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const drop = btn.closest("[data-drop]");
    const wasOpen = drop.classList.contains("open");
    closeAllMenus();
    if (!wasOpen) {
      drop.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
document.addEventListener("click", e => {
  if (!e.target.closest("[data-drop]")) closeAllMenus();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllMenus(); });

/* ----- Mobile menu + accordions ----- */
const burger = document.getElementById("burger");
burger.addEventListener("click", () => {
  const panel = document.getElementById("mobilePanel");
  const show = !panel.classList.contains("show");
  panel.classList.toggle("show", show);
  burger.classList.toggle("open", show);
  burger.setAttribute("aria-expanded", String(show));
});
document.querySelectorAll("[data-acc]").forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const show = !panel.classList.contains("show");
    panel.classList.toggle("show", show);
    btn.classList.toggle("open", show);
    btn.setAttribute("aria-expanded", String(show));
  });
});
document.querySelectorAll("#mobilePanel a").forEach(a =>
  a.addEventListener("click", closeAllMenus));

/* ----- Language toggle ----- */
document.getElementById("langBtn").addEventListener("click", () => {
  LANG = LANG === "ur" ? "en" : "ur";
  localStorage.setItem("tbka-lang", LANG);
  render();
});

window.addEventListener("hashchange", render);
render();
