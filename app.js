/* Tallu Broq Ki Awaaz — app logic */
"use strict";

const API_BASE = "https://tallu-broq-api.vercel.app";
let DYN = []; // posts published through the AI system (API)

const I18N = {
  en: {
    nav_home: "Home", nav_news: "Khabrein", nav_masayil: "Masayil",
    nav_gaon: "Gaon", nav_kamyabi: "Kamyabi", nav_kaam: "Kaam Kaaj",
    nav_elaan: "Elaan Board", nav_rabta: "Rabta Directory",
    nav_sakafat: "Sakafat", nav_gallery: "Gallery",
    cta_submit: "＋ Add Post",
    footer_tag: "Gaon ki khabrein, masayil, kamyabi aur sakafat — poori duniya ke liye."
  },
  ur: {
    nav_home: "ہوم", nav_news: "خبریں", nav_masayil: "مسائل",
    nav_gaon: "گاؤں", nav_kamyabi: "کامیابی", nav_kaam: "کام کاج",
    nav_elaan: "اعلان بورڈ", nav_rabta: "رابطہ ڈائریکٹری",
    nav_sakafat: "ثقافت", nav_gallery: "گیلری",
    cta_submit: "＋ پوسٹ کریں",
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
const allPosts = () => [...DYN, ...POSTS];
const byCat = cat => allPosts().filter(p => p.cat === cat);
const dynImg = p => p.img ? `${API_BASE}/api/img?id=${encodeURIComponent(p.img)}` : "";

function postCard(p) {
  const meta = CATMETA[p.cat] || CATMETA.news;
  const status = p.status ? `<span class="status ${p.status}">${esc(STATUS[p.status][LANG] || STATUS[p.status].en)}</span>` : "";
  const img = p.dyn ? dynImg(p) : p.img;
  const excerpt = LANG === "ur" ? (p.bodyUr || p.bodyEn) : p.bodyEn;
  const read = p.dyn
    ? `<a class="readmore" href="#/post/${esc(p.id)}">Read Full Blog <span class="ur" style="font-size:.82rem">— مکمل بلاگ پڑھیں</span> →</a>`
    : (p.page ? `<a class="readmore" href="${esc(p.page)}">Read Full Blog <span class="ur" style="font-size:.82rem">— مکمل بلاگ پڑھیں</span> →</a>` : "");
  return `<article class="pcard reveal">
    ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ""}
    <div class="pcard-body">
      <span class="chip ${meta.chip}">${esc(meta.en)}</span>
      <h3>${esc(p.titleEn)}<span class="ur">${esc(p.titleUr)}</span></h3>
      <p>${esc(String(excerpt || "").split("\n\n")[0])}</p>
      ${read}
      <div class="pmeta"><span>${esc(p.date)}</span>${status}</div>
    </div>
  </article>`;
}

function viewHead(en, ur, sub) {
  return `<div class="view-head reveal"><h1>${esc(en)}<span class="ur">${esc(ur)}</span></h1><p>${esc(sub)}</p></div>`;
}

function homeView() {
  const posts = allPosts();
  const latest = posts.slice(0, 3);
  const tickerItems = posts.map(p => esc(p.titleEn)).join("<span>✦</span>");
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
        <a class="btn-ghost" href="#/submit" data-addpost>Add a Post ＋</a>
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
   <div class="empty-note reveal">Apna naam aur hunar is list mein add karwane ke liye <a href="#/submit" style="color:var(--green);font-weight:700">Add Post form</a> bharein — bilkul muft hai.</div>`;
}

function galleryView() {
  return viewHead("Photo Gallery", "گیلری", "Tallu Broq ki khoobsurati — pahar, khet, mele aur log.") +
  `<div class="gallery">${GALLERY.map(galleryItem).join("")}</div>
   <div class="empty-note reveal">Gaon ki asal photos ke liye <a href="#/submit" style="color:var(--green);font-weight:700">Add Post</a> se apni photo bhejein — AI system usay post bana kar laga dega.</div>`;
}

function rabtaView() {
  return viewHead("Rabta Directory", "رابطہ", "Gaon ke aham idare aur rabte ki maloomat.") +
  `<div class="dir-grid">${RABTA.map(d => `<div class="dcard reveal">
      <h3><span>${d.icon}</span>${esc(d.nameEn)}<span class="ur" style="margin-left:auto;font-size:.85rem;color:var(--gold)">${esc(d.nameUr)}</span></h3>
      <p>${esc(d.descEn)}</p></div>`).join("")}</div>`;
}

const GUIDE_HTML = `
  <div class="guide-box">
    <h3>📋 Posting ke Usool <span class="ur">پوسٹنگ کے اصول</span></h3>
    <div class="guide-cols">
      <div>
        <p class="guide-h good">✅ Ye post ho sakti hai:</p>
        <ul>
          <li>Gaon ki khabrein <span class="ur">گاؤں کی خبریں</span></li>
          <li>Masayil — pani, bijli, sarak, school, sehat <span class="ur">مسائل</span></li>
          <li>Kamyabi — students, naujawan <span class="ur">کامیابی</span></li>
          <li>Sakafat aur elanaat <span class="ur">ثقافت و اعلانات</span></li>
        </ul>
      </div>
      <div>
        <p class="guide-h bad">🚫 Ye bilkul nahi:</p>
        <ul>
          <li>Kharid-o-farokht, dukaan ya cheezon ki advertisement</li>
          <li>Gandi, badtameez ya ghair-akhlaqi baat ya photo</li>
          <li>Kisi shakhs par ilzaam ya larai jhagra</li>
          <li>Jhooti khabar ya spam</li>
        </ul>
      </div>
    </div>
    <p class="guide-note">🤖 <strong>System kaisa kaam karta hai:</strong> Aap title, tafseel aur photo bhejte hain → <strong>AI pehle check karta hai</strong> → saaf post ko AI khud behtar bana kar <strong>English + Urdu blog</strong> ki shakal mein SEO ke saath publish kar deta hai. Jo post usool ke khilaf ho, wo <strong>wahin decline</strong> ho jati hai — site par nahi lagti. Photo khud-ba-khud compress ho jati hai taake site tez chale.</p>
  </div>`;

function submitView() {
  return viewHead("Add Post", "پوسٹ کریں", "Khabar, masla, kamyabi ya elaan — likh kar bhejein, AI usay check karke blog bana kar publish kar dega.") +
  GUIDE_HTML +
  `<form class="form-card reveal" id="submitForm">
     <label for="fName">Aap ka naam / Your name <span class="opt">(ikhtiyari — optional)</span></label>
     <input id="fName" placeholder="e.g. Muhammad Ali" maxlength="60">
     <label for="fCat">Qisam / Category</label>
     <select id="fCat">
       <option value="masayil">Masla (Problem) — مسئلہ</option>
       <option value="news">Khabar (News) — خبر</option>
       <option value="kamyabi">Kamyabi (Success) — کامیابی</option>
       <option value="elaan">Elaan (Announcement) — اعلان</option>
       <option value="sakafat">Sakafat (Culture) — ثقافت</option>
     </select>
     <label for="fTitle">Unwaan / Title</label>
     <input id="fTitle" required placeholder="Short title — mukhtasar unwaan" maxlength="160">
     <label for="fBody">Tafseel / Details</label>
     <textarea id="fBody" rows="5" required placeholder="Poori tafseel likhein — kya hua, kahan hua, kab hua... (kam az kam 20 haroof)"></textarea>
     <label for="fPhoto">Photo <span class="opt">(ikhtiyari — lekin post achi lagegi)</span></label>
     <input id="fPhoto" type="file" accept="image/*">
     <img id="photoPrev" class="photo-prev" alt="" hidden>
     <button class="btn-gold" type="submit" id="submitBtn">Publish Karein →</button>
     <p class="form-note">Submit karne par AI pehle post check karega — is mein 30 se 60 second lag sakte hain. Saaf post foran publish ho jayegi.</p>
     <div id="submitResult"></div>
   </form>`;
}

function paras(text) {
  return String(text || "").split(/\n\s*\n/).map(t => t.trim()).filter(Boolean)
    .map(t => `<p>${esc(t)}</p>`).join("");
}

function postView(id) {
  const p = DYN.find(x => x.id === id);
  if (!p) return viewHead("Post", "پوسٹ", "") +
    `<div class="empty-note reveal">Ye post nahi mili — shayad delete ho gayi hai. <a href="#/home" style="color:var(--green);font-weight:700">Home par wapas</a></div>`;
  const meta = CATMETA[p.cat] || CATMETA.news;
  const status = p.status ? `<span class="status ${p.status}">${esc(STATUS[p.status].en)}</span>` : "";
  const img = dynImg(p);
  const url = location.href;
  return `<article class="blog-wrap reveal">
    <a class="back-link" href="#/${esc(p.cat === "masayil" ? "masayil" : p.cat)}">← Back / <span class="ur">واپس</span></a>
    <div style="margin-top:14px"><span class="chip ${meta.chip}">${esc(meta.en)}</span> ${status}</div>
    <h1 class="blog-h1">${esc(p.titleEn)}</h1>
    ${p.titleUr ? `<h1 class="blog-h1ur ur">${esc(p.titleUr)}</h1>` : ""}
    <p class="post-date">${esc(p.date)} · Tallu Broq Ki Awaaz</p>
    ${img ? `<figure class="post-hero"><img src="${esc(img)}" alt=""></figure>` : ""}
    ${p.bodyUr ? `<div class="ur-block">${paras(p.bodyUr)}</div>` : ""}
    <div class="en-block"><h2>In English</h2>${paras(p.bodyEn)}</div>
    <div class="share-row">
      <a class="share-btn share-fb" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">Share on Facebook</a>
      <button class="share-btn share-copy" type="button" id="copyLinkBtn">Copy Link</button>
    </div>
  </article>`;
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

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1100;
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * s));
      const h = Math.max(1, Math.round(img.height * s));
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.78));
    };
    img.onerror = reject;
    img.src = url;
  });
}

let photoData = null;

function bindSubmitForm() {
  const form = document.getElementById("submitForm");
  if (!form) return;
  photoData = null;
  const photoInput = document.getElementById("fPhoto");
  photoInput.addEventListener("change", async () => {
    const f = photoInput.files && photoInput.files[0];
    const prev = document.getElementById("photoPrev");
    if (!f) { photoData = null; prev.hidden = true; return; }
    try {
      photoData = await compressImage(f);
      prev.src = photoData;
      prev.hidden = false;
    } catch (e) { photoData = null; }
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    const box = document.getElementById("submitResult");
    const payload = {
      name: document.getElementById("fName").value.trim(),
      cat: document.getElementById("fCat").value,
      title: document.getElementById("fTitle").value.trim(),
      desc: document.getElementById("fBody").value.trim(),
      image: photoData || undefined
    };
    btn.disabled = true;
    btn.textContent = "AI check kar raha hai... ⏳";
    box.innerHTML = `<div class="result-wait">🤖 AI aap ki post parh kar check kar raha hai — 30 se 60 second intezar karein, page band na karein.</div>`;
    try {
      const r = await fetch(API_BASE + "/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (j.ok && j.post) {
        DYN.unshift({ ...j.post, dyn: true });
        box.innerHTML = `<div class="result-ok">✅ <strong>Mubarak! Aap ki post publish ho gayi hai.</strong><br>
          AI ne usay blog ki shakal di hai: “${esc(j.post.titleEn)}”<br>
          <a href="#/post/${esc(j.post.id)}">👉 Apni post dekhein</a></div>`;
        form.reset();
        photoData = null;
        document.getElementById("photoPrev").hidden = true;
      } else if (j.declined) {
        box.innerHTML = `<div class="result-bad">🚫 <strong>Ye post publish nahi ho sakti.</strong><br>${esc(j.reasonEn || "")}<br><span class="ur">${esc(j.reasonUr || "")}</span><br>Post theek karke dobara koshish karein.</div>`;
      } else {
        box.innerHTML = `<div class="result-bad">⚠️ ${esc(j.error || "Kuch masla ho gaya")} — dobara koshish karein.</div>`;
      }
    } catch (err) {
      box.innerHTML = `<div class="result-bad">⚠️ Server se rabta nahi ho saka. Internet check karke dobara koshish karein.</div>`;
    }
    btn.disabled = false;
    btn.textContent = "Publish Karein →";
  });
}

function currentRoute() {
  const parts = (location.hash.replace(/^#\/?/, "") || "home").split("/");
  return { name: parts[0] || "home", arg: parts[1] || "" };
}

function render() {
  const { name, arg } = currentRoute();
  let html, nav = "";
  if (name === "post" && arg) { html = postView(arg); }
  else {
    const r = ROUTES[name] || ROUTES.home;
    html = r.render();
    nav = r.nav;
  }
  app.innerHTML = html;
  document.querySelectorAll("[data-nav]").forEach(a =>
    a.classList.toggle("active", a.getAttribute("data-nav") === nav));
  closeAllMenus();
  bindReveals();
  bindTilt();
  bindSubmitForm();
  const cp = document.getElementById("copyLinkBtn");
  if (cp) cp.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); cp.textContent = "Link Copy Ho Gaya ✓"; }
    catch (e) { cp.textContent = location.href; }
  });
  app.querySelectorAll("[data-addpost]").forEach(a =>
    a.addEventListener("click", e => { e.preventDefault(); openGuide(); }));
  window.scrollTo({ top: 0 });
  applyLang();
}

/* ----- Guidelines popup ----- */
function openGuide() {
  const m = document.getElementById("guideModal");
  if (m) m.classList.add("show");
}
function closeGuide() {
  const m = document.getElementById("guideModal");
  if (m) m.classList.remove("show");
}
document.querySelectorAll('a[href="#/submit"]').forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); closeAllMenus(); openGuide(); });
});
const guideGo = document.getElementById("guideGo");
if (guideGo) guideGo.addEventListener("click", () => { closeGuide(); location.hash = "#/submit"; });
const guideClose = document.getElementById("guideClose");
if (guideClose) guideClose.addEventListener("click", closeGuide);
const guideModal = document.getElementById("guideModal");
if (guideModal) guideModal.addEventListener("click", e => { if (e.target === guideModal) closeGuide(); });

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
  /* Clicks on the burger or inside the mobile panel must NOT be treated as
     "outside" clicks — otherwise this handler instantly closes the panel
     that the burger click just opened (the "menu click does nothing" bug). */
  if (e.target.closest("[data-drop]") || e.target.closest("#burger") || e.target.closest("#mobilePanel")) return;
  closeAllMenus();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeAllMenus(); closeGuide(); }
});

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

/* ----- Load AI-system posts, then render ----- */
async function loadDynamic() {
  try {
    const r = await fetch(API_BASE + "/api/posts");
    const j = await r.json();
    if (j.ok && Array.isArray(j.posts)) {
      DYN = j.posts.map(p => ({ ...p, dyn: true }));
      if (currentRoute().name !== "submit") render();
    }
  } catch (e) { /* site works with the static posts alone */ }
}

/* ----- Site settings from admin panel: custom logo + social links ----- */
async function loadSettings() {
  try {
    const r = await fetch(API_BASE + "/api/settings");
    const j = await r.json();
    if (!j.ok) return;
    if (j.logo) {
      const src = `${API_BASE}/api/img?id=logo&v=${Math.floor(Date.now() / 3600000)}`;
      document.querySelectorAll("[data-sitelogo]").forEach(img => { img.src = src; });
      const fav = document.querySelector('link[rel="icon"]');
      if (fav) fav.href = src;
    }
    const labels = { facebook: "Facebook", youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram" };
    const row = document.getElementById("socialRow");
    if (row && j.socials) {
      row.innerHTML = Object.keys(labels)
        .filter(k => j.socials[k])
        .map(k => `<a class="social-pill" href="${esc(j.socials[k])}" target="_blank" rel="noopener">${labels[k]}</a>`)
        .join("");
    }
  } catch (e) { /* defaults stay */ }
}

window.addEventListener("hashchange", render);
render();
loadDynamic();
loadSettings();
