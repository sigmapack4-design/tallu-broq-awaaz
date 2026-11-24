/* Tallu Broq Ki Awaaz — app logic */
"use strict";

const API_BASE = "https://tallu-broq-api.vercel.app";
let DYN = []; // posts published through the AI system (API)

/* Visitor analytics — counts only, no personal data (shown in the admin panel). */
let VID = localStorage.getItem("tbka-vid");
if (!VID) {
  VID = "v" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem("tbka-vid", VID);
}
function track(page) {
  try {
    const body = JSON.stringify({ v: VID, page });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_BASE + "/api/track", new Blob([body], { type: "text/plain" }));
    } else {
      fetch(API_BASE + "/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch (e) { /* analytics must never break the site */ }
}

const I18N = {
  en: {
    nav_home: "Home", nav_news: "News", nav_masayil: "Masayil",
    nav_gaon: "Village", nav_kamyabi: "Kamyabi", nav_kaam: "Kaam Kaaj",
    nav_elaan: "Elaan Board", nav_rabta: "Rabta Directory",
    nav_sakafat: "Sakafat", nav_gallery: "Gallery", nav_videos: "Videos",
    cta_submit: "＋ Add Post",
    footer_tag: "Village news, problems, success stories and culture — for the whole world."
  },
  ur: {
    nav_home: "ہوم", nav_news: "خبریں", nav_masayil: "مسائل",
    nav_gaon: "گاؤں", nav_kamyabi: "کامیابی", nav_kaam: "کام کاج",
    nav_elaan: "اعلان بورڈ", nav_rabta: "رابطہ ڈائریکٹری",
    nav_sakafat: "ثقافت", nav_gallery: "گیلری", nav_videos: "ویڈیوز",
    cta_submit: "＋ پوسٹ کریں",
    footer_tag: "گاؤں کی خبریں، مسائل، کامیابی اور ثقافت — پوری دنیا کے لیے۔"
  }
};
let LANG = "en"; // site UI is English-only (owner's order 2026-11-24); blog posts stay bilingual

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
    ? `<a class="readmore" href="#/post/${esc(p.id)}">Read Full Blog →</a>`
    : (p.page ? `<a class="readmore" href="${esc(p.page)}">Read Full Blog →</a>` : "");
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
  return `<div class="view-head reveal"><h1>${esc(en)}${ur ? `<span class="ur">${esc(ur)}</span>` : ""}</h1><p>${esc(sub)}</p></div>`;
}

function homeView() {
  const posts = allPosts();
  const latest = posts.slice(0, 3);
  const tickerItems = posts.map(p => esc(p.titleEn)).join("<span>✦</span>");
  const sections = [
    { route: "news",    ic: "📰", en: "Latest News",        txt: "Every latest update from the village, here first.", gold: false },
    { route: "masayil", ic: "⚠",  en: "Village Problems",   txt: "Post a problem — its status updates in front of everyone.", gold: false },
    { route: "kamyabi", ic: "🏆", en: "Success Stories",    txt: "Celebrating the success of our students and youth.", gold: true },
    { route: "sakafat", ic: "🎭", en: "Culture",            txt: "Festivals, traditions and our identity — for the world.", gold: false }
  ];
  return `
  <section class="hero reveal">
    <img class="hero-bg" src="assets/hero.webp" alt="Tallu Broq valley">
    <div class="hero-shade"></div>
    <div class="hero-content">
      <span class="hero-chip">Gilgit-Baltistan · Pakistan</span>
      <h1>Tallu Broq Ki Awaaz — <em>The voice of the mountains, the talk of the village</em></h1>
      <p class="hero-sub">Our problems, our achievements, our culture — the voice of Tallu Broq, now reaching the whole world.</p>
      <div class="hero-btns">
        <a class="btn-gold" href="#/news">Read Latest News</a>
        <a class="btn-ghost" href="#/submit" data-addpost>Add a Post ＋</a>
      </div>
    </div>
  </section>

  <div class="ticker reveal" aria-label="Latest headlines">
    <span class="ticker-label">LATEST</span>
    <div class="ticker-track"><div class="ticker-move"><span>${tickerItems}</span><span>${tickerItems}</span></div></div>
  </div>

  <div class="sec-title reveal"><h2>Our Community Sections</h2></div>
  <p class="sec-sub reveal">Every section is a colour of village life — from news to culture.</p>
  <div class="cards">
    ${sections.map(s => `<a class="scard ${s.gold ? "gold" : ""} reveal" href="#/${s.route}" data-tilt>
      <span class="scard-ic">${s.ic}</span>
      <h3>${s.en}</h3>
      <p>${s.txt}</p><span class="go">Open</span></a>`).join("")}
  </div>

  <div class="sec-title reveal"><h2>Latest Posts</h2></div>
  <div class="posts">${latest.map(postCard).join("")}</div>

  ${VIDS.length ? `
  <div class="sec-title reveal"><h2>Videos</h2></div>
  <p class="sec-sub reveal">Village videos — watch, like and share your views.</p>
  <div class="vgrid">${VIDS.slice(0, 3).map(videoCard).join("")}</div>
  <p style="text-align:center;margin-top:14px"><a class="mini-link" href="#/videos" style="color:var(--green);font-weight:700">View All Videos →</a></p>` : ""}

  <div class="sec-title reveal"><h2>Photo Gallery</h2></div>
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
                  : `<div class="empty-note reveal">No posts in this section yet — send the first one!</div>`);
}

function kaamView() {
  return viewHead("Kaam Kaaj", "", "Skilled people and work in the village — who does what, all in one place.") +
  `<div class="dir-grid">${DIRECTORY.map(d => `<div class="dcard reveal">
      <h3><span>${d.icon}</span>${esc(d.nameEn)}<span class="ur" style="margin-left:auto;font-size:.85rem;color:var(--gold)">${esc(d.nameUr)}</span></h3>
      <p>${esc(d.descEn)}</p></div>`).join("")}</div>
   <div class="empty-note reveal">To add your name and skill to this list, fill the <a href="#/submit" style="color:var(--green);font-weight:700">Add Post form</a> — it is completely free.</div>`;
}

function galleryView() {
  return viewHead("Photo Gallery", "", "The beauty of Tallu Broq — mountains, fields, festivals and people.") +
  `<div class="gallery">${GALLERY.map(galleryItem).join("")}</div>
   <div class="empty-note reveal">To share a real photo of the village, send it through <a href="#/submit" style="color:var(--green);font-weight:700">Add Post</a> — the AI system will turn it into a post.</div>`;
}

function rabtaView() {
  return viewHead("Rabta Directory", "", "Important institutions and contact information of the village.") +
  `<div class="dir-grid">${RABTA.map(d => `<div class="dcard reveal">
      <h3><span>${d.icon}</span>${esc(d.nameEn)}<span class="ur" style="margin-left:auto;font-size:.85rem;color:var(--gold)">${esc(d.nameUr)}</span></h3>
      <p>${esc(d.descEn)}</p></div>`).join("")}</div>`;
}

const GUIDE_HTML = `
  <div class="guide-box">
    <h3>📋 Posting Guidelines</h3>
    <div class="guide-cols">
      <div>
        <p class="guide-h good">✅ What you can post:</p>
        <ul>
          <li>Village news</li>
          <li>Problems — water, electricity, roads, school, health</li>
          <li>Success stories — students and youth</li>
          <li>Culture and announcements</li>
        </ul>
      </div>
      <div>
        <p class="guide-h bad">🚫 Strictly not allowed:</p>
        <ul>
          <li>Buying and selling, shop or product advertisements</li>
          <li>Rude, abusive or immoral words or photos</li>
          <li>Blaming or attacking any person, or fights</li>
          <li>Fake news or spam</li>
        </ul>
      </div>
    </div>
    <p class="guide-note">🤖 <strong>How the system works:</strong> You send a title, details and a photo → <strong>the AI checks it first</strong> → a clean post is polished by the AI and published as an <strong>English + Urdu blog</strong> with SEO. A post against the rules is <strong>declined on the spot</strong> — it never appears on the site. Photos are compressed automatically so the site stays fast.</p>
  </div>`;

function submitView() {
  return viewHead("Add Post", "", "News, a problem, a success story or an announcement — write it and send it. The AI checks it, turns it into a blog and publishes it.") +
  GUIDE_HTML +
  `<form class="form-card reveal" id="submitForm">
     <label for="fName">Your name <span class="opt">(optional)</span></label>
     <input id="fName" placeholder="e.g. Muhammad Ali" maxlength="60">
     <label for="fCat">Category</label>
     <select id="fCat">
       <option value="masayil">Problem (Masayil)</option>
       <option value="news">News</option>
       <option value="kamyabi">Success Story (Kamyabi)</option>
       <option value="elaan">Announcement (Elaan)</option>
       <option value="sakafat">Culture (Sakafat)</option>
     </select>
     <label for="fTitle">Title</label>
     <input id="fTitle" required placeholder="A short, clear title" maxlength="160">
     <label for="fBody">Details</label>
     <textarea id="fBody" rows="5" required placeholder="Write the full details — what happened, where, and when… (at least 20 characters)"></textarea>
     <label for="fPhoto">Photo <span class="opt">(optional — but the post looks better with one)</span></label>
     <input id="fPhoto" type="file" accept="image/*">
     <img id="photoPrev" class="photo-prev" alt="" hidden>
     <button class="btn-gold" type="submit" id="submitBtn">Publish →</button>
     <p class="form-note">When you submit, the AI checks your post first — it usually takes 5 to 15 seconds. A clean post is published right away.</p>
     <div id="submitResult"></div>
   </form>`;
}

function paras(text) {
  return String(text || "").split(/\n\s*\n/).map(t => t.trim()).filter(Boolean)
    .map(t => `<p>${esc(t)}</p>`).join("");
}

function postView(id) {
  const p = DYN.find(x => x.id === id);
  if (!p) return viewHead("Post", "", "") +
    `<div class="empty-note reveal">This post was not found — it may have been deleted. <a href="#/home" style="color:var(--green);font-weight:700">Back to Home</a></div>`;
  const meta = CATMETA[p.cat] || CATMETA.news;
  const status = p.status ? `<span class="status ${p.status}">${esc(STATUS[p.status].en)}</span>` : "";
  const img = dynImg(p);
  const url = location.href;
  return `<article class="blog-wrap reveal">
    <a class="back-link" href="#/${esc(p.cat === "masayil" ? "masayil" : p.cat)}">← Back</a>
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

/* ----- Videos (managed from the admin panel, stored via the API) ----- */
let VIDS = [];
const likedSet = () => { try { return new Set(JSON.parse(localStorage.getItem("tbka-liked") || "[]")); } catch (e) { return new Set(); } };
const saveLiked = s => localStorage.setItem("tbka-liked", JSON.stringify([...s]));
function videoCard(v) {
  const th = v.type === "youtube" ? `https://i.ytimg.com/vi/${esc(v.yt)}/hqdefault.jpg` : "";
  return `<a class="vcard reveal" href="#/video/${esc(v.id)}">
    <span class="vthumb">${th ? `<img src="${th}" alt="" loading="lazy">` : `<span class="vthumb-file">🎬</span>`}<span class="vplay">▶</span></span>
    <span class="vmeta"><b>${esc(v.title)}</b><span>❤️ ${v.likes || 0} · 💬 ${(v.comments || []).length}</span></span>
  </a>`;
}
function videosView() {
  return viewHead("Videos", "", "Village videos — watch, like, comment and share.") +
    (VIDS.length ? `<section class="section"><div class="vgrid">${VIDS.map(videoCard).join("")}</div></section>`
      : `<section class="section"><div class="empty-note reveal">No videos yet — the first video is coming soon.</div></section>`);
}
function videoView(id) {
  const v = VIDS.find(x => x.id === id);
  if (!v) return `<section class="section"><div class="empty-note">Video not found — <a href="#/videos" style="color:var(--green);font-weight:700">view all videos</a>.</div></section>`;
  const liked = likedSet().has(v.id);
  const player = v.type === "youtube"
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${esc(v.yt)}?rel=0" title="${esc(v.title)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    : `<video src="${esc(v.url)}" controls playsinline preload="metadata"></video>`;
  const comments = (v.comments || []).map(c => `
    <div class="cmt"><b>${esc(c.name)}</b><span>${new Date(c.ts).toLocaleDateString("en-GB")}</span><p>${esc(c.text)}</p></div>`).join("");
  return `<article class="post-wrap video-wrap">
    <a class="back-link" href="#/videos">← All Videos</a>
    <h1 class="post-title">${esc(v.title)}</h1>
    <div class="player-wrap">${player}</div>
    <div class="v-actions">
      <button class="like-btn ${liked ? "on" : ""}" id="likeBtn" type="button">❤️ <span id="likeCount">${v.likes || 0}</span></button>
      <button class="share-btn share-copy" id="shareVideoBtn" type="button">↗ Share</button>
    </div>
    <h2 class="cmt-head">Comments (${(v.comments || []).length})</h2>
    <div id="cmtList">${comments || '<p class="cmt-none">No comments yet — be the first to comment.</p>'}</div>
    <form class="cmt-form" id="cmtForm">
      <input type="text" id="cmtName" maxlength="40" placeholder="Your name" value="${esc(localStorage.getItem("tbka-name") || "")}">
      <textarea id="cmtText" rows="3" maxlength="500" placeholder="Write your comment…"></textarea>
      <button class="btn-gold" type="submit">Post Comment →</button>
      <p class="cmt-msg" id="cmtMsg"></p>
    </form>
  </article>`;
}
function bindVideoView() {
  const { name, arg } = currentRoute();
  if (name !== "video" || !arg) return;
  const v = VIDS.find(x => x.id === arg);
  if (!v) return;
  const shareBtn = document.getElementById("shareVideoBtn");
  if (shareBtn) shareBtn.addEventListener("click", async () => {
    if (navigator.share) { try { await navigator.share({ title: v.title, url: location.href }); } catch (e) { /* dismissed */ } }
    else {
      try { await navigator.clipboard.writeText(location.href); shareBtn.textContent = "Link Copied ✓"; }
      catch (e) { shareBtn.textContent = location.href; }
    }
  });
  const likeBtn = document.getElementById("likeBtn");
  if (likeBtn) likeBtn.addEventListener("click", async () => {
    const set = likedSet();
    const want = !set.has(v.id);
    if (want) set.add(v.id); else set.delete(v.id);
    saveLiked(set);
    likeBtn.classList.toggle("on", want);
    try {
      const r = await fetch(API_BASE + "/api/videos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", id: v.id, v: VID, liked: want })
      });
      const j = await r.json();
      if (j.ok) { v.likes = j.likes; const lc = document.getElementById("likeCount"); if (lc) lc.textContent = j.likes; }
    } catch (e) { /* optimistic UI stays */ }
  });
  const form = document.getElementById("cmtForm");
  if (form) form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nm = document.getElementById("cmtName").value.trim();
    const tx = document.getElementById("cmtText").value.trim();
    const m = document.getElementById("cmtMsg");
    if (nm.length < 2 || tx.length < 2) { m.textContent = "❌ Please write your name and a comment"; return; }
    localStorage.setItem("tbka-name", nm);
    m.textContent = "⏳ Posting…";
    try {
      const cid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const r = await fetch(API_BASE + "/api/videos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", id: v.id, name: nm, text: tx, v: VID, cid })
      });
      const j = await r.json();
      if (j.ok) {
        v.comments = v.comments || [];
        v.comments.push(j.comment);
        render();
      } else m.textContent = "❌ " + (j.error || "Comment could not be posted");
    } catch (err) { m.textContent = "❌ Could not reach the server"; }
  });
}
async function loadVideos() {
  try {
    const r = await fetch(API_BASE + "/api/videos");
    const j = await r.json();
    if (j.ok && Array.isArray(j.videos)) {
      VIDS = j.videos;
      const n = currentRoute().name;
      if (n === "home" || n === "videos" || n === "video") render();
    }
  } catch (e) { /* site works without videos */ }
}

const ROUTES = {
  home:    { nav: "home",    render: homeView },
  news:    { nav: "news",    render: () => listView("news", "News", "", "The latest news from Tallu Broq.") },
  masayil: { nav: "masayil", render: () => listView("masayil", "Masayil", "", "Village problems and their status — Reported, In Progress or Resolved.") },
  kamyabi: { nav: "kamyabi", render: () => listView("kamyabi", "Kamyabi", "", "Success stories of our people.") },
  kaam:    { nav: "kaam",    render: kaamView },
  sakafat: { nav: "sakafat", render: () => listView("sakafat", "Sakafat", "", "Festivals, traditions, language and our identity.") },
  gallery: { nav: "gallery", render: galleryView },
  videos:  { nav: "videos",  render: videosView },
  elaan:   { nav: "elaan",   render: () => listView("elaan", "Elaan Board", "", "Jirga decisions, meetings and important announcements.") },
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
  document.documentElement.lang = "en";
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
    btn.textContent = "AI is checking... ⏳";
    box.innerHTML = `<div class="result-wait">🤖 The AI is reading and checking your post — please wait a few seconds, do not close the page.</div>`;
    try {
      const r = await fetch(API_BASE + "/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (j.ok && j.post) {
        DYN.unshift({ ...j.post, dyn: true });
        box.innerHTML = `<div class="result-ok">✅ <strong>Congratulations! Your post has been published.</strong><br>
          The AI shaped it into a blog: “${esc(j.post.titleEn)}”<br>
          <a href="#/post/${esc(j.post.id)}">👉 View your post</a></div>`;
        form.reset();
        photoData = null;
        document.getElementById("photoPrev").hidden = true;
      } else if (j.declined) {
        box.innerHTML = `<div class="result-bad">🚫 <strong>This post cannot be published.</strong><br>${esc(j.reasonEn || "")}<br>Please fix the post and try again.</div>`;
      } else {
        box.innerHTML = `<div class="result-bad">⚠️ ${esc(j.error || "Something went wrong")} — please try again.</div>`;
      }
    } catch (err) {
      box.innerHTML = `<div class="result-bad">⚠️ Could not reach the server. Check your internet connection and try again.</div>`;
    }
    btn.disabled = false;
    btn.textContent = "Publish →";
  });
}

function currentRoute() {
  const parts = (location.hash.replace(/^#\/?/, "") || "home").split("/");
  return { name: parts[0] || "home", arg: parts[1] || "" };
}

function render() {
  track(location.hash || "#/home");
  const { name, arg } = currentRoute();
  let html, nav = "";
  if (name === "post" && arg) { html = postView(arg); }
  else if (name === "video" && arg) { html = videoView(arg); nav = "videos"; }
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
  bindVideoView();
  const cp = document.getElementById("copyLinkBtn");
  if (cp) cp.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); cp.textContent = "Link Copied ✓"; }
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
loadVideos();
loadSettings();
