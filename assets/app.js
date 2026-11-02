/* Carnet de recherche — moteur de l'application (vanilla JS, aucune dépendance). */
(function () {
  "use strict";
  const D = window.RQ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const chap = (id) => D.chapters.find((c) => c.id === id) || { code: "", title: "", short: "" };
  const fmt = (n, d = 2) => { const r = Math.round(n * 10 ** d) / 10 ** d; return String(r).replace(".", ","); };
  const TYPE = { qcm: "QCM", multi: "Plusieurs réponses", vf: "Vrai ou faux", open: "Réponse écrite", list: "Énumération", match: "Associer", order: "Remettre en ordre", num: "Calcul", write: "Rédaction", grid: "Tableau à compléter" };
  const SRC = { C25: "★ Contrôle 2025", TD: "TD", EX: "Exercice du cours" };
  const srcTag = (s) => (s ? `<span class="tag ${s === "C25" ? "c25" : s === "TD" ? "td" : ""}">${SRC[s] || s}</span>` : "");
  const view = () => $("#view");
  let uid = 0;
  const nid = (p) => p + "-" + ++uid;

  /* ─────────── Stockage local (facultatif : tout marche sans) ─────────── */
  const KEY = "carnet-recherche-v1";
  const defaults = () => ({ q: {}, fiche: {}, cas: {}, exams: [], days: [], theme: null });
  let S = (function () {
    try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(defaults(), JSON.parse(raw)); } catch (e) {}
    return defaults();
  })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = () => new Date().toISOString().slice(0, 10);
  function markDay() { const t = today(); if (!S.days.includes(t)) { S.days.push(t); S.days = S.days.slice(-90); } }
  function record(id, ok) {
    const r = S.q[id] || { n: 0, ok: 0, box: 0, last: 0 };
    r.n++; if (ok) { r.ok++; r.box = Math.min(5, r.box + 1); } else r.box = 0;
    r.last = Date.now(); r.lastOk = !!ok; S.q[id] = r; markDay(); save();
  }
  const mastered = (id) => (S.q[id] && S.q[id].box >= 2);
  const weak = (id) => (S.q[id] && S.q[id].n > 0 && S.q[id].box === 0);
  // Une même tentative peut être re-notée (auto-correction, grille cochée) : on annule l'enregistrement précédent avant de réenregistrer.
  function recorder(id) {
    let first = true, snap = null;
    return (ok) => {
      if (!id) return;
      if (first) { snap = S.q[id] ? Object.assign({}, S.q[id]) : null; first = false; }
      else if (snap) S.q[id] = Object.assign({}, snap); else delete S.q[id];
      record(id, ok); updateBadge();
    };
  }
  // Toutes les questions jouables (banque, exercices des cas pratiques, sujets d'examen) avec un identifiant stable.
  D.cas.forEach((k) => k.exercise.forEach((q, i) => { if (!q.id) q.id = `cas-${k.id}-${i + 1}`; if (!q.ch) q.ch = k.ch; }));
  D.examens.forEach((e) => (e.parts || []).forEach((p, pi) => p.qs.forEach((q, qi) => { if (!q.id) q.id = `exam-${e.id}-${pi + 1}-${qi + 1}`; })));
  const ALLQ = (() => { const seen = new Set(); const out = []; [D.questions, ...D.cas.map((k) => k.exercise), ...D.examens.map((e) => (e.parts || []).flatMap((p) => p.qs))].forEach((arr) => arr.forEach((q) => { if (!seen.has(q.id)) { seen.add(q.id); out.push(q); } })); return out; })();
  const toReview = () => ALLQ.filter((q) => weak(q.id));
  function updateBadge() {
    const n = toReview().length;
    $$('.nav a[data-k="quiz"], .tabbar a[data-k="quiz"]').forEach((a) => { let b = $(".badge", a); if (!n) { if (b) b.remove(); return; } if (!b) { b = document.createElement("span"); b.className = "badge"; a.appendChild(b); } b.textContent = n; b.title = n + " à revoir"; });
  }

  /* ─────────── Thème ─────────── */
  function applyTheme() { if (S.theme) document.documentElement.setAttribute("data-theme", S.theme); else document.documentElement.removeAttribute("data-theme"); $$(".theme-label").forEach((e) => (e.textContent = S.theme === "dark" ? "Thème sombre" : S.theme === "light" ? "Thème clair" : "Thème auto")); }
  function cycleTheme() { S.theme = S.theme === null ? "dark" : S.theme === "dark" ? "light" : null; save(); applyTheme(); }

  /* ─────────── Correction par mots-clés ─────────── */
  function norm(s) {
    return " " + String(s).toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[’'`]/g, " ").replace(/[^a-z0-9²]+/g, " ").trim() + " ";
  }
  function altMatch(alt, nt, raw) {
    if (alt[0] === "=") { const w = norm(alt.slice(1)).trim(); return !!w && nt.includes(" " + w + " "); }
    const na = norm(alt).trim();
    if (!na) return raw.includes(alt);
    return na.split(" ").every((t) => nt.includes(t));
  }
  const groupMatch = (alts, nt, raw) => alts.some((a) => altMatch(a, nt, raw));
  function gradeList(q, text) {
    const segs = String(text).split(/\n|;|•|,/).map((s) => s.replace(/^\s*([-*–·>]|\d+\s*[.)/-])\s*/, "").trim()).filter((s) => s.length > 1);
    const found = q.items.map(() => false);
    const order = q.items.map((it, i) => ({ i, it, spec: Math.max(...it.k.map((a) => a.length)) })).sort((a, b) => b.spec - a.spec);
    const used = new Set();
    const single = segs.length === 1;
    order.forEach(({ i, it }) => {
      if (single) { if (groupMatch(it.k, norm(segs[0]), segs[0])) found[i] = true; return; }
      for (let s = 0; s < segs.length; s++) { if (used.has(s)) continue; if (groupMatch(it.k, norm(segs[s]), segs[s])) { found[i] = true; used.add(s); break; } }
    });
    const n = found.filter(Boolean).length;
    return { found, n, need: q.need, ok: n >= q.need, score: Math.min(1, n / q.need) };
  }
  function gradeOpen(q, text) {
    const nt = norm(text);
    const hits = q.kw.map((g) => groupMatch(g, nt, text));
    const n = hits.filter(Boolean).length;
    const need = q.min || Math.ceil(q.kw.length * 0.6);
    return { hits, n, need, ok: n >= need, score: Math.min(1, n / need) };
  }
  const parseNum = (s) => { const v = parseFloat(String(s).replace(/\s| /g, "").replace(",", ".")); return isNaN(v) ? null : v; };

  /* ─────────── Carte question (tous les types) ─────────── */
  // opts: { mode: "practice"|"exam", num, total, pts, onChecked(res), next(res), nextLabel }
  function QCard(q, opts) {
    opts = opts || {};
    const exam = opts.mode === "exam";
    const el = document.createElement("article");
    el.className = "qcard fade-in";
    const st = { sel: null, multi: new Set(), order: [], res: null, checked: false };
    const meta = [];
    if (opts.num) meta.push(`<span class="num">${opts.total ? `Q${opts.num}/${opts.total}` : `Q${opts.num}`}</span>`);
    if (q.ch) meta.push(`<span class="tag">${chap(q.ch).code}</span>`);
    meta.push(`<span class="tag">${TYPE[q.t] || q.t}</span>`);
    if (q.src) meta.push(srcTag(q.src));
    if (opts.pts != null) meta.push(`<span class="pts">${fmt(opts.pts)} pt${opts.pts > 1 ? "s" : ""}</span>`);
    const lid = nid("q");
    meta.push(`<button type="button" class="listen-ic" data-listen="${lid}" data-label="Écouter la question" aria-label="Écouter la question"><span class="ico">${IC.speaker}</span></button>`);
    el.innerHTML = `<div class="qmeta">${meta.join("")}</div>${opts.intro ? `<div class="qintro">${esc(opts.intro)}</div>` : ""}<p class="qtext">${esc(q.q)}</p><div class="qbody"></div><div class="qfb"></div><div class="qact"></div>`;
    const body = $(".qbody", el), fbox = $(".qfb", el), act = $(".qact", el);
    $(".listen-ic", el).addEventListener("click", () => toggleListen(lid, () => Reader.play(blocks(el), { owner: lid })));
    const letters = "ABCDEFGH";
    let data = {};

    /* --- construction du corps --- */
    if (q.t === "qcm" || q.t === "vf") {
      data.choices = q.t === "vf" ? [{ text: "Vrai", v: true }, { text: "Faux", v: false }] : shuffle(q.c.map((text, i) => ({ text, v: i })));
      body.innerHTML = `<div class="choices ${q.t === "vf" ? "vf" : ""}">${data.choices.map((c, i) => `<button type="button" class="choice" data-i="${i}">${q.t === "vf" ? "" : `<span class="letter">${letters[i]}</span>`}<span>${esc(c.text)}</span></button>`).join("")}</div>`;
      $$(".choice", body).forEach((b) => b.addEventListener("click", () => {
        if (st.checked) return;
        st.sel = +b.dataset.i;
        $$(".choice", body).forEach((x) => x.classList.toggle("sel", x === b));
        if (!exam) check();
      }));
    } else if (q.t === "multi") {
      data.choices = shuffle(q.c.map((text, i) => ({ text, v: i })));
      body.innerHTML = `<p class="hint-line">Plusieurs réponses possibles. Coche toutes les bonnes.</p><div class="choices">${data.choices.map((c, i) => `<button type="button" class="choice" data-i="${i}" aria-pressed="false"><span class="letter">${letters[i]}</span><span>${esc(c.text)}</span></button>`).join("")}</div>`;
      $$(".choice", body).forEach((b) => b.addEventListener("click", () => {
        if (st.checked) return; const i = +b.dataset.i;
        if (st.multi.has(i)) st.multi.delete(i); else st.multi.add(i);
        b.classList.toggle("sel", st.multi.has(i)); b.setAttribute("aria-pressed", st.multi.has(i));
      }));
    } else if (q.t === "open" || q.t === "list" || q.t === "write") {
      const id = nid("ta");
      const hint = q.t === "list" ? `Un élément par ligne. ${q.need < q.items.length ? `Au moins ${q.need} attendus.` : `${q.need} attendus.`}` : q.t === "write" ? "Rédige comme sur ta copie, puis compare avec le corrigé." : "Écris ta réponse avec tes mots : les mots-clés comptent.";
      body.innerHTML = `<label class="hint-line" for="${id}">${hint}</label><textarea class="answer" id="${id}" rows="${q.t === "list" ? Math.min(8, Math.max(4, q.need + 1)) : 5}" placeholder="${q.t === "list" ? "1re idée\n2e idée\n…" : "Ta réponse…"}"></textarea>`;
      data.ta = $("textarea", body);
    } else if (q.t === "match") {
      data.rights = shuffle(q.pairs.map((p) => p[1]));
      body.innerHTML = `<div class="match-rows">${q.pairs.map((p, i) => { const id = nid("m"); return `<div class="match-row" data-i="${i}"><label class="l" for="${id}">${esc(p[0])}</label><select id="${id}"><option value="">— choisir —</option>${data.rights.map((r) => `<option>${esc(r)}</option>`).join("")}</select></div>`; }).join("")}</div>`;
    } else if (q.t === "order") {
      data.pool = shuffle(q.items.map((t, i) => ({ t, i })));
      if (data.pool.every((x, k) => x.i === k) && data.pool.length > 1) data.pool.reverse();
      body.innerHTML = `<div class="order-box"><span class="order-label">Ton ordre (touche pour retirer)</span><div class="order-list"></div><span class="order-label">Éléments (touche dans l'ordre)</span><div class="order-pool"></div></div>`;
      const drawOrder = () => {
        const list = $(".order-list", body), pool = $(".order-pool", body);
        list.innerHTML = st.order.length ? st.order.map((x, k) => `<button type="button" class="ochip" data-k="${k}">${esc(x.t)}</button>`).join("") : `<span class="order-empty">Rien pour l'instant.</span>`;
        pool.innerHTML = data.pool.filter((x) => !st.order.includes(x)).map((x) => `<button type="button" class="ochip" data-i="${x.i}">${esc(x.t)}</button>`).join("");
        $$(".ochip", list).forEach((b) => b.addEventListener("click", () => { if (st.checked) return; st.order.splice(+b.dataset.k, 1); drawOrder(); }));
        $$(".ochip", pool).forEach((b) => b.addEventListener("click", () => { if (st.checked) return; st.order.push(data.pool.find((x) => x.i === +b.dataset.i)); drawOrder(); }));
      };
      data.drawOrder = drawOrder; drawOrder();
    } else if (q.t === "num") {
      const id = nid("n");
      body.innerHTML = `<label class="hint-line" for="${id}">Réponse numérique (virgule ou point acceptés).</label><input class="answer" id="${id}" inputmode="decimal" autocomplete="off" placeholder="ex. 12,5">`;
      data.inp = $("input", body);
    } else if (q.t === "grid") {
      data.opts = q.cols.map((_, c) => shuffle(q.anyOrder ? q.rows.flatMap((r) => r.vals) : q.rows.map((r) => r.vals[c])));
      body.innerHTML = `<div class="grid-scroll"><table class="grid-table"><thead><tr><th>Section</th>${q.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${q.rows.map((r, ri) => `<tr><td class="lab">${esc(r.label)}</td>${q.cols.map((_, c) => `<td data-r="${ri}" data-c="${c}"><select aria-label="${esc(r.label)} — ${esc(q.cols[c])}"><option value="">—</option>${data.opts[c].map((o) => `<option>${esc(o)}</option>`).join("")}</select></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }

    /* --- notation --- */
    function grade() {
      let r = { score: 0, ok: false };
      if (q.t === "qcm") { const ok = st.sel != null && data.choices[st.sel].v === q.a; r = { ok, score: ok ? 1 : 0, answered: st.sel != null }; }
      else if (q.t === "vf") { const ok = st.sel != null && data.choices[st.sel].v === q.a; r = { ok, score: ok ? 1 : 0, answered: st.sel != null }; }
      else if (q.t === "multi") {
        const good = new Set(q.a); let hit = 0, bad = 0;
        st.multi.forEach((i) => { if (good.has(data.choices[i].v)) hit++; else bad++; });
        const ok = hit === good.size && bad === 0;
        r = { ok, score: Math.max(0, (hit - bad) / good.size), answered: st.multi.size > 0 };
      }
      else if (q.t === "open") { r = gradeOpen(q, data.ta.value); r.answered = data.ta.value.trim().length > 0; }
      else if (q.t === "list") { r = gradeList(q, data.ta.value); r.answered = data.ta.value.trim().length > 0; }
      else if (q.t === "write") { r = { ok: false, score: 0, self: true, answered: data.ta.value.trim().length > 0 }; }
      else if (q.t === "match") {
        const rows = $$(".match-row", body); let n = 0;
        const ans = rows.map((row, i) => { const v = $("select", row).value; if (v === q.pairs[i][1]) n++; return v; });
        r = { ok: n === q.pairs.length, score: n / q.pairs.length, ans, n, answered: ans.some(Boolean) };
      }
      else if (q.t === "order") {
        let n = 0; st.order.forEach((x, k) => { if (x.i === k) n++; });
        r = { ok: n === q.items.length && st.order.length === q.items.length, score: n / q.items.length, n, answered: st.order.length > 0 };
      }
      else if (q.t === "num") {
        const v = parseNum(data.inp.value); const ok = v != null && Math.abs(v - q.a) <= (q.tol || 0) + 1e-9;
        r = { ok, score: ok ? 1 : 0, v, answered: v != null };
      }
      else if (q.t === "grid") {
        let n = 0, tot = 0; const cells = [];
        q.rows.forEach((row, ri) => {
          const seen = new Set();
          q.cols.forEach((_, c) => {
            const td = $(`td[data-r="${ri}"][data-c="${c}"]`, body); const v = $("select", td).value; tot++;
            const good = q.anyOrder ? (v && row.vals.includes(v) && !seen.has(v)) : v === row.vals[c];
            if (q.anyOrder && v) seen.add(v);
            if (good) n++; cells.push({ td, good, v, want: row.vals[c] });
          });
        });
        r = { ok: n === tot, score: n / tot, n, tot, cells, answered: cells.some((c) => c.v) };
      }
      return r;
    }

    function lock() {
      $$("button.choice, .ochip, select, textarea, input", body).forEach((x) => { if (x.tagName === "TEXTAREA" || x.tagName === "INPUT") x.readOnly = true; else x.disabled = true; });
    }

    /* --- affichage de la correction --- */
    function verdict(res) {
      if (res.self && res.selfDone == null) return { cls: "part", txt: "Auto-correction : coche ce que ta réponse contient" };
      if (res.ok) return { cls: "good", txt: "Juste" };
      if (res.score > 0) return { cls: "part", txt: "Partiellement juste" };
      return { cls: "miss", txt: res.answered === false ? "Sans réponse" : "À revoir" };
    }
    function showFeedback(res) {
      st.res = res;
      // marquage visuel
      if (q.t === "qcm" || q.t === "vf") {
        $$(".choice", body).forEach((b, i) => { const v = data.choices[i].v; if (v === q.a) b.classList.add("right"); else if (i === st.sel) b.classList.add("wrong"); b.classList.remove("sel"); });
      } else if (q.t === "multi") {
        const good = new Set(q.a);
        $$(".choice", body).forEach((b, i) => { const v = data.choices[i].v; b.classList.remove("sel"); if (good.has(v)) b.classList.add("right"); else if (st.multi.has(i)) b.classList.add("wrong"); });
      } else if (q.t === "match") {
        $$(".match-row", body).forEach((row, i) => { const good = res.ans[i] === q.pairs[i][1]; row.classList.add(good ? "right" : "wrong"); if (!good) row.insertAdjacentHTML("beforeend", `<span class="fix">✔ ${esc(q.pairs[i][1])}</span>`); });
      } else if (q.t === "order") {
        $$(".order-list .ochip", body).forEach((b, k) => b.classList.add(st.order[k] && st.order[k].i === k ? "right" : "wrong"));
      } else if (q.t === "grid") {
        res.cells.forEach((c) => { c.td.classList.add(c.good ? "right" : "wrong"); if (!c.good && !q.anyOrder) c.td.insertAdjacentHTML("beforeend", `<span class="fix">✔ ${esc(c.want)}</span>`); });
        if (q.anyOrder) $$("tbody tr", body).forEach((tr, ri) => { const tds = $$("td[data-c]", tr); if (tds.some((td) => td.classList.contains("wrong"))) tds[tds.length - 1].insertAdjacentHTML("beforeend", `<span class="fix">✔ ${q.rows[ri].vals.map(esc).join(" · ")}</span>`); });
      }
      drawFb();
    }
    function drawFb() {
      const res = st.res; const v = verdict(res);
      let inner = "";
      if (q.t === "open") {
        inner += `<div class="lab">Mots-clés retrouvés : ${res.n} sur ${res.need} attendus</div><div class="lab">Réponse modèle</div><div class="model">${esc(q.a)}</div>`;
      } else if (q.t === "list") {
        inner += `<div class="lab">${res.n} élément${res.n > 1 ? "s" : ""} reconnu${res.n > 1 ? "s" : ""} · ${res.need} attendu${res.need > 1 ? "s" : ""}</div><ul class="items-check">${q.items.map((it, i) => `<li class="${res.found[i] ? "hit" : ""}">${esc(it.t)}</li>`).join("")}</ul>`;
      } else if (q.t === "order") {
        inner += `<div class="lab">Ordre correct</div><ol style="margin:0;padding-left:1.3em">${q.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>`;
      } else if (q.t === "num") {
        inner += `<div class="lab">Bonne réponse</div><div class="model mono">${fmt(q.a, 4)}${q.unit ? " " + esc(q.unit) : ""}</div>`;
      } else if (q.t === "write") {
        inner += `<div class="lab">Corrigé</div><div class="model">${q.model}</div><div class="lab">Grille d'auto-correction</div><div class="checklist">${q.checklist.map((c, i) => `<label><input type="checkbox" data-i="${i}" ${res.checks && res.checks[i] ? "checked" : ""}> <span>${esc(c)}</span></label>`).join("")}</div>`;
      }
      if (q.exp) inner += `<p class="exp">💡 ${esc(q.exp)}</p>`;
      const canOverride = !exam && (q.t === "open" || q.t === "list");
      if (canOverride) inner += `<div class="selfgrade">La correction automatique se trompe ? <button type="button" class="btn sm quiet" data-ov="1">Compter juste</button><button type="button" class="btn sm quiet" data-ov="0">Compter faux</button></div>`;
      const scoreTxt = opts.pts != null ? `${fmt(res.score * opts.pts)} / ${fmt(opts.pts)}` : (q.t === "list" || q.t === "open" || q.t === "match" || q.t === "grid" || q.t === "order" || q.t === "write") ? `${Math.round(res.score * 100)} %` : "";
      fbox.innerHTML = `<div class="fb ${v.cls}"><div class="fb-head"><span>${v.cls === "good" ? "✔" : v.cls === "miss" ? "✗" : "◐"}</span><span>${v.txt}</span>${scoreTxt ? `<span class="score">${scoreTxt}</span>` : ""}</div>${inner ? `<div class="fb-body">${inner}</div>` : ""}</div>`;
      if (q.t === "write") {
        $$(".checklist input", fbox).forEach((cb) => cb.addEventListener("change", () => {
          const checks = $$(".checklist input", fbox).map((x) => x.checked);
          res.checks = checks; res.selfDone = true;
          res.score = checks.filter(Boolean).length / checks.length; res.ok = res.score >= 0.75;
          const head = $(".fb", fbox); const vv = verdict(res);
          head.className = "fb " + vv.cls; $(".fb-head span:nth-child(2)", fbox).textContent = vv.txt;
          $(".fb-head span:first-child", fbox).textContent = vv.cls === "good" ? "✔" : vv.cls === "miss" ? "✗" : "◐";
          const sc = $(".score", fbox); if (sc) sc.textContent = opts.pts != null ? `${fmt(res.score * opts.pts)} / ${fmt(opts.pts)}` : `${Math.round(res.score * 100)} %`;
          if (opts.onScore) opts.onScore(res);
        }));
      }
      $$("[data-ov]", fbox).forEach((b) => b.addEventListener("click", () => {
        res.ok = b.dataset.ov === "1"; res.score = res.ok ? 1 : 0; res.overridden = true; drawFb(); if (opts.onScore) opts.onScore(res);
      }));
    }

    function check() {
      if (st.checked) return st.res;
      const res = grade();
      if (!exam && !res.answered && q.t !== "write") { flashHint(); return null; }
      st.checked = true; lock(); showFeedback(res); drawActions();
      if (opts.onChecked) opts.onChecked(res);
      return res;
    }
    function flashHint() {
      fbox.innerHTML = `<p class="hint-line" style="color:var(--bad)">Réponds d'abord : choisis, écris ou range au moins un élément.</p>`;
    }
    function drawActions() {
      if (exam) { act.innerHTML = ""; return; }
      if (!st.checked) {
        const needBtn = !(q.t === "qcm" || q.t === "vf");
        act.innerHTML = needBtn ? `<button type="button" class="btn" data-a="check">${q.t === "write" ? "Voir le corrigé" : "Valider"}</button>${q.t === "order" ? `<button type="button" class="btn quiet" data-a="reset">Recommencer</button>` : ""}` : `<span class="hint-line">Touche une réponse.</span>`;
      } else {
        act.innerHTML = opts.next ? `<span class="spacer"></span><button type="button" class="btn" data-a="next">${opts.nextLabel || "Question suivante →"}</button>` : "";
      }
      $$("[data-a]", act).forEach((b) => b.addEventListener("click", () => {
        const a = b.dataset.a;
        if (a === "check") check();
        else if (a === "reset") { st.order = []; data.drawOrder(); }
        else if (a === "next") opts.next(st.res);
      }));
    }
    drawActions();
    if (data.ta && !exam) data.ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) check(); });
    if (data.inp && !exam) data.inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });

    return {
      el,
      grade, check,
      examCorrect() { const r = grade(); st.checked = true; lock(); showFeedback(r); return r; },
      get result() { return st.res; }
    };
  }

  /* ─────────── Icônes ─────────── */
  const IC = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    fiches: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="15" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v13M7 10h6M7 14h6"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.8M12 17h.01"/></svg>',
    cas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/></svg>',
    exam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/></svg>',
    prog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    stop: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>'
  };
  const NAV = [["accueil", "Accueil", "home"], ["fiches", "Fiches", "fiches"], ["quiz", "Quiz", "quiz"], ["cas", "Cas pratiques", "cas"], ["examens", "Examens", "exam"], ["progres", "Progrès", "prog"]];

  /* ─────────── Lecteur audio : lit à voix haute et surligne ce qui est lu ─────────── */
  // Le texte est découpé en passages (titres, paragraphes, puces, choix…). Le passage lu est surligné,
  // le mot prononcé aussi (quand le navigateur le permet), et la barre du bas affiche la phrase en sous-titre.
  const SAY = [[/→/g, ", puis "], [/←/g, " "], [/÷/g, " divisé par "], [/≈/g, " environ "], [/²/g, " au carré"], [/√/g, "racine de "], [/×/g, " fois "], [/±/g, " plus ou moins "], [/≠/g, " différent de "], [/≤/g, " inférieur ou égal à "], [/≥/g, " supérieur ou égal à "], [/[★✔✗✎◐○↻]/gu, " "]];
  const sayable = (t) => SAY.reduce((a, [re, by]) => a.replace(re, by), t);
  const SKIP = ".tag, .badge, .no, .qmeta, .qact, .step-dots, .flash-hint, .listen, .listen-ic, .speed, .listen-wrap, button:not(.choice):not(.ochip), select, textarea, input, svg, script, style, [hidden], [aria-hidden='true']";
  const SEG = "h1, h2, h3, p, li, blockquote, tr, .choice, .ochip, .memo, .warnbox, .tip, .qintro, .calc, .fb-head, .order-label";
  const WORD = /[\p{L}\p{N}’'-]/u;
  function blocks(root) {
    const out = [];
    const walk = (el) => {
      if (el.matches(SKIP)) return;
      if (el.matches(SEG) || Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) { if (el.textContent.trim()) out.push(el); return; }
      Array.from(el.children).forEach(walk);
    };
    if (root) walk(root);
    return out;
  }
  function textOf(el) {
    const pieces = []; let text = "";
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { const k = n.parentElement && n.parentElement.closest(SKIP); return k && el.contains(k) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    let n, prev = null;
    while ((n = tw.nextNode())) {
      const raw = n.textContent;
      if (!raw.trim()) { if (text && !/\s$/.test(text)) text += " "; continue; }
      if (prev && prev.parentElement.closest(".letter")) text += ". ";
      else if (text && !/\s$/.test(text) && !/^\s/.test(raw) && prev && prev.parentElement !== n.parentElement && !prev.parentElement.contains(n) && !n.parentElement.contains(prev) && /^(TD|TH|LI)$/.test(n.parentElement.tagName)) text += ", ";
      const said = sayable(raw);
      pieces.push({ node: n, start: text.length, len: said.length, raw });
      text += said; prev = n;
    }
    return { text, pieces };
  }
  // Le mot prononcé dans un passage : on retrouve le nœud de texte d'origine (position g dans le texte complet).
  function rangeAt(seg, g) {
    const p = seg.pieces.find((x) => g >= x.start && g < x.start + x.len); if (!p) return null;
    const t = p.raw; let o = p.len === t.length ? g - p.start : Math.round(((g - p.start) / p.len) * t.length);
    o = Math.min(Math.max(0, o), t.length - 1);
    while (o < t.length && !WORD.test(t[o])) o++;
    if (o >= t.length) return null;
    let a = o, b = o; while (a > 0 && WORD.test(t[a - 1])) a--; while (b < t.length && WORD.test(t[b])) b++;
    const r = document.createRange(); r.setStart(p.node, a); r.setEnd(p.node, b); return r;
  }

  // Tout le contenu à lire forme un seul texte G. Il est confié d'avance à la voix en longues phrases mises en file,
  // pour qu'elle enchaîne sans blanc ; le surlignage suit la voix (position donnée par la voix, sinon estimée).
  const Reader = (() => {
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    const HL = window.CSS && CSS.highlights && typeof Highlight === "function" ? new Highlight() : null;
    if (HL) CSS.highlights.set("reading-word", HL);
    const RATES = [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
    const CPS = 14.5; // caractères par seconde à vitesse 1, pour suivre le texte quand la voix ne donne pas sa position
    let segs = [], G = "", groups = [], opts = {}, token = 0, playing = false, started = -1, retries = 0;
    let pos = 0, curSeg = -1, tick = null, queuedTo = 0, chainedAt = -1;
    // Voix en ligne trop lente ou en panne (connexion faible) : on passe sur une voix installée sur l'appareil.
    let preferLocal = false; const avoid = new Set();
    const rate = () => RATES.reduce((a, b) => (Math.abs(b - (S.rate || 1)) < Math.abs(a - (S.rate || 1)) ? b : a), 1);
    const rateLabel = () => String(rate()).replace(".", ",") + "×";
    function voice() {
      let vs = synth ? synth.getVoices().filter((v) => /^fr/i.test(v.lang) && !avoid.has(v.name)) : [];
      if (preferLocal) { const loc = vs.filter((v) => v.localService); if (loc.length) vs = loc; }
      if (!vs.length) return null;
      const sc = (v) => (/natural|online|neural/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (/fr-FR/i.test(v.lang) ? 1 : 0);
      return vs.slice().sort((a, b) => sc(b) - sc(a))[0];
    }
    // Les voix Google de Chrome se coupent au-delà d'environ 15 s : phrases plus courtes pour elles.
    const maxLen = () => { const v = voice(); return v && /google/i.test(v.name) ? 220 : 900; };
    function init() {
      delete S.voice; // l'ancien choix manuel de voix pouvait bloquer le son
      if (synth && synth.addEventListener) synth.addEventListener("voiceschanged", () => {});
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && segs.length) stop(); });
      document.addEventListener("click", (e) => { const b = e.target.closest("[data-speed]"); if (b) setRate(+b.dataset.speed); });
    }
    const notify = () => document.dispatchEvent(new CustomEvent("reader"));

    /* --- texte et positions --- */
    function addItems(items, enter) {
      const from = segs.length;
      items.filter(Boolean).forEach((it) => {
        const el = it.el || it; const cfg = it.el ? it : {}; const t = textOf(el); if (!t.text.trim()) return;
        // Entre deux passages : un point si la phrase n'est pas terminée, pour une respiration naturelle.
        if (G) G += /[.!?:;…]\s*$/.test(G) ? (/\s$/.test(G) ? "" : " ") : ". ";
        const start = G.length; t.pieces.forEach((p) => (p.start += start)); G += t.text;
        segs.push({ el, start, end: G.length, pieces: t.pieces, it: cfg, barrier: !!(cfg.pause || cfg.before), passed: false });
      });
      if (enter && segs.length > from) groups.push({ from, enter, done: false });
      return from;
    }
    const segAt = (g) => { let i = 0; while (i + 1 < segs.length && segs[i + 1].start <= g) i++; return i; };
    const isEnd = (i) => /[.!?\n…]/.test(G[i - 1] || "") && /\s/.test(G[i] || " ");
    function sentenceStart(g) { const s = segs[segAt(g)]; let a = Math.min(g, G.length); while (a > s.start && !isEnd(a)) a--; return a; }
    function units(f, to) {
      const out = []; const max = maxLen();
      while (f < to) {
        while (f < to && /\s/.test(G[f])) f++; if (f >= to) break;
        let e = Math.min(to, f + max);
        if (e < to) {
          const w = G.slice(f, e);
          let cut = Math.max(w.lastIndexOf(". "), w.lastIndexOf("? "), w.lastIndexOf("! "), w.lastIndexOf(": "), w.lastIndexOf("\n"));
          if (cut < max * 0.3) cut = w.lastIndexOf(", "); if (cut < max * 0.3) cut = w.lastIndexOf(" ");
          if (cut > 0) e = f + cut + 1;
        }
        out.push({ start: f, text: G.slice(f, e) }); f = e;
      }
      return out;
    }
    const stopAt = (f) => { const s = segs.find((x) => x.barrier && !x.passed && x.start >= f); return s ? s.start : G.length; };

    /* --- surlignage dans la page --- */
    const clearMarks = () => { if (HL) HL.clear(); $$(".reading").forEach((e) => e.classList.remove("reading")); };
    function reveal(el) {
      const r = el.getBoundingClientRect(); const bottom = window.innerHeight - (window.matchMedia("(max-width: 860px)").matches ? 90 : 24);
      if (r.top < 76 || r.bottom > bottom) window.scrollTo({ top: window.scrollY + r.top - Math.max(84, (bottom - Math.min(r.height, bottom - 84)) / 2), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    function setPos(g) {
      pos = g; const i = segAt(g); const s = segs[i]; if (!s) return;
      if (i !== curSeg) {
        curSeg = i;
        groups.forEach((gr) => { if (!gr.done && i >= gr.from) { gr.done = true; gr.enter(); } });
        $$(".reading").forEach((e) => e.classList.remove("reading"));
        if (document.body.contains(s.el)) { s.el.classList.add("reading"); reveal(s.el); }
      }
      if (HL) { HL.clear(); const r = rangeAt(s, g); if (r) HL.add(r); }
    }

    /* --- voix --- */
    function halt() { token++; clearInterval(tick); tick = null; try { if (synth) { synth.cancel(); if (synth.paused) synth.resume(); } } catch (e) {} }
    function follow(u, my) {
      clearInterval(tick); u.t0 = Date.now(); u.got = false;
      tick = setInterval(() => { if (my !== token || u.got) return; setPos(u.start + Math.min(u.text.length - 1, Math.floor(((Date.now() - u.t0) / 1000) * CPS * rate()))); }, 120);
    }
    function fallback(v) { if (v && !v.localService) { avoid.add(v.name); preferLocal = true; return true; } return false; }
    // Met en file la lecture de f jusqu'à la prochaine pause prévue (ou la fin), sans interrompre ce qui est déjà en file.
    function enqueue(f, my) {
      const to = stopAt(f); const us = units(f, to); queuedTo = to;
      if (!us.length) { onBlockEnd(my, to); return; }
      const v = voice(); const asked = Date.now();
      us.forEach((u, k) => {
        const last = k === us.length - 1;
        const onStart = () => {
          if (my !== token) return;
          if (started !== my && Date.now() - asked > 2500) fallback(v); // trop lent à démarrer : voix locale la prochaine fois
          started = my; follow(u, my); setPos(u.start); if (last) chainMore(my);
        };
        const ended = () => { if (my !== token || !last || queuedTo !== to) return; clearInterval(tick); onBlockEnd(my, to); };
        if (!synth) { const dur = Math.max(700, (u.text.length / (CPS * rate())) * 1000); setTimeout(onStart, 0); setTimeout(ended, dur); return; }
        const ut = new SpeechSynthesisUtterance(u.text); ut.lang = "fr-FR"; ut.rate = rate(); if (v) ut.voice = v;
        ut.onstart = onStart;
        ut.onboundary = (e) => { if (my !== token || (e.name && e.name !== "word")) return; u.got = true; setPos(u.start + e.charIndex); };
        ut.onend = ended;
        ut.onerror = (e) => {
          if (my !== token || e.error === "interrupted" || e.error === "canceled") return;
          if (retries < 2 && fallback(v)) { retries++; speakFrom(sentenceStart(pos)); return; } // voix en ligne en panne : on reprend avec une voix locale
          ended();
        };
        synth.speak(ut);
      });
    }
    // Contenu suivant (ex. étape suivante d'un cas) préparé pendant la dernière phrase : la voix enchaîne sans blanc.
    function chainMore(my) {
      if (!opts.chain || chainedAt === segs.length || queuedTo < G.length) return;
      chainedAt = segs.length; const r = opts.chain(); if (!r) return;
      const from = addItems(r.items, r.enter); chainedAt = segs.length;
      if (segs.length > from) enqueue(segs[from].start, my);
    }
    function onBlockEnd(my, to) {
      if (to >= G.length) { finish(); return; }
      const s = segs[segAt(to)]; // passage avec pause prévue (ex. temps pour réciter avant de retourner la carte)
      setTimeout(() => { if (my !== token || !playing) return; s.passed = true; if (s.it.before) s.it.before(); enqueue(s.start, my); }, s.it.pause || 0);
    }
    function speakFrom(f) {
      halt(); playing = true; const my = token;
      setPos(f); enqueue(f, my);
      // Si la voix ne démarre pas du tout, on réessaie avec une voix installée sur l'appareil (jamais de lecture muette).
      setTimeout(() => { if (my === token && playing && started !== my && retries < 2 && fallback(voice())) { retries++; speakFrom(f); } }, 6000);
    }

    /* --- commandes --- */
    function play(items, o) {
      o = o || {};
      if (segs.length && opts.onStop && opts.owner !== o.owner) opts.onStop();
      halt(); clearMarks();
      segs = []; G = ""; groups = []; opts = o; curSeg = -1; chainedAt = -1; retries = 0;
      addItems(items);
      if (!segs.length) { playing = false; notify(); return; }
      const want = items[o.start || 0]; const si = Math.max(0, segs.findIndex((s) => s.el === (want && (want.el || want))));
      speakFrom(segs[si].start); notify();
    }
    function finish() { const f = opts.onEnd; halt(); clearMarks(); playing = false; segs = []; G = ""; opts = {}; notify(); if (f) f(); }
    function stop() { const f = opts.onStop; halt(); clearMarks(); playing = false; segs = []; G = ""; opts = {}; notify(); if (f) f(); }
    function setRate(dir) {
      const i = RATES.indexOf(rate()); S.rate = RATES[Math.max(0, Math.min(RATES.length - 1, i + dir))]; save();
      $$(".speed-val").forEach((e) => (e.textContent = rateLabel()));
      if (playing && segs.length) speakFrom(sentenceStart(pos));
    }
    return { init, play, stop, owner: () => (playing ? opts.owner : null), rateLabel };
  })();
  // Bouton « Écouter » (devient « Arrêter » pendant la lecture) et réglage de vitesse juste à côté.
  const speedCtl = () => `<span class="speed" role="group" aria-label="Vitesse de lecture"><button type="button" data-speed="-1" aria-label="Ralentir">−</button><span class="speed-val">${Reader.rateLabel()}</span><button type="button" data-speed="1" aria-label="Accélérer">+</button></span>`;
  const listenBtn = (id, owner, label) => `<span class="listen-wrap"><button type="button" class="btn sm ghost listen" id="${id}" data-listen="${owner}" data-label="${label}" aria-pressed="false"><span class="ico">${IC.speaker}</span><span class="lab">${label}</span></button>${speedCtl()}</span>`;
  function syncListen() {
    const on = Reader.owner();
    $$("[data-listen]").forEach((b) => {
      const me = on === b.dataset.listen; b.setAttribute("aria-pressed", me);
      const ico = $(".ico", b); if (ico) ico.innerHTML = me ? IC.stop : IC.speaker;
      const lab = $(".lab", b); if (lab) lab.textContent = me ? "Arrêter" : b.dataset.label;
      b.setAttribute("aria-label", me ? "Arrêter la lecture" : b.dataset.label || "Écouter");
    });
  }
  document.addEventListener("reader", syncListen);
  // Lance la lecture, ou l'arrête si ce même bouton est déjà en train de lire.
  function toggleListen(owner, start) { if (Reader.owner() === owner) Reader.stop(); else start(); }

  /* ─────────── Rendu commun ─────────── */
  function render(html, wide) { Reader.stop(); clearTimer(); view().innerHTML = `<div class="wrap ${wide ? "wide" : ""} fade-in">${html}</div>`; window.scrollTo(0, 0); }
  function setNav(h) {
    const key = h.startsWith("cas") ? "cas" : h.startsWith("examen") ? "examens" : h || "accueil";
    $$(".nav a, .tabbar a").forEach((a) => a.setAttribute("aria-current", a.dataset.k === key ? "page" : "false"));
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  function chapStats(ch) { const qs = D.questions.filter((q) => !ch || q.ch === ch); const m = qs.filter((q) => mastered(q.id)).length; const seen = qs.filter((q) => S.q[q.id]).length; return { tot: qs.length, m, seen }; }
  function dailyFiche() { const withMemo = D.fiches.filter((f) => f.memo); const d = new Date(); const k = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate(); return withMemo[k % withMemo.length]; }

  /* ─────────── Accueil ─────────── */
  function viewHome() {
    const all = chapStats(); const f = dailyFiche();
    const weakN = toReview().length;
    const c25 = D.questions.filter((q) => q.src === "C25").length;
    render(`
      <section class="hero">
        <div class="hero-text">
          <span class="eyebrow">Initiation à la recherche · Master Informatique</span>
          <h1>Révise la méthodo, <mark>une question à la fois</mark>.</h1>
          <p>Des définitions courtes, ${D.questions.length} questions de cours en QCM ou à l'écrit, des cas pratiques expliqués pas à pas et des sujets chronométrés comme le jour du devoir.</p>
          <div class="counts"><span><b>${D.fiches.length}</b> fiches</span><span><b>${D.questions.length}</b> questions</span><span><b>${D.cas.length}</b> cas pratiques</span><span><b>${D.examens.length}</b> sujets</span></div>
        </div>
        <aside class="daily" aria-label="Mémo du jour">
          <div class="row" style="justify-content:space-between"><span class="eyebrow">Mémo du jour · ${chap(f.ch).code}</span><button type="button" class="listen-ic" id="daily-listen" data-listen="daily" data-label="Écouter le mémo du jour" aria-label="Écouter le mémo du jour"><span class="ico">${IC.speaker}</span></button></div>
          <h3>${esc(f.term)}</h3>
          <p class="def">${esc(f.def)}</p>
          <p class="memo">${esc(f.memo)}</p>
          <a class="btn sm ghost" href="#fiches" style="align-self:flex-start">Toutes les fiches</a>
        </aside>
      </section>
      ${weakN ? `<section class="review-banner"><div><span class="eyebrow">À revoir</span><b>${weakN} question${weakN > 1 ? "s" : ""} ratée${weakN > 1 ? "s" : ""}</b><span>Chaque question ratée (quiz, cas pratiques, examens) arrive ici. Réussis-la une fois et elle sort de la liste.</span></div><button type="button" class="btn" data-go="review">Réviser maintenant</button></section>` : ""}
      <section class="actions-grid">
        <button type="button" class="action primary" data-go="smart"><span class="k">${weakN ? weakN + " à revoir" : "15 questions"}</span><b>Révision intelligente</b><span>Tes points faibles d'abord, puis les questions jamais vues.</span></button>
        <button type="button" class="action" data-go="c25"><span class="k">${c25} questions</span><b>Déjà tombé au contrôle</b><span>Les notions du contrôle d'octobre 2025, en QCM et à l'écrit.</span></button>
        <a class="action" href="#examen-eclair"><span class="k">20 minutes</span><b>Examen éclair</b><span>15 questions au hasard, chronométrées, notées sur 20.</span></a>
      </section>
      <section class="panel stack">
        <div class="row" style="justify-content:space-between"><h2 class="section-title">Ta maîtrise par chapitre</h2><a href="#progres" class="small">Détails</a></div>
        <div class="chap-rows">
          ${D.chapters.map((c) => { const s = chapStats(c.id); return `<div class="chap-row"><span class="code">${c.code}</span><span class="t">${esc(c.title)}<span class="bar"><i style="width:${pct(s.m, s.tot)}%"></i></span></span><span class="pct">${s.m}/${s.tot}</span></div>`; }).join("")}
        </div>
        <p class="small">Une question est « maîtrisée » quand tu l'as réussie deux fois de suite.${all.seen ? "" : " Commence par un quiz pour voir ta progression."}</p>
      </section>
      <section class="panel stack">
        <h2 class="section-title">La démarche en un coup d'œil</h2>
        <div class="flow"><span>Observation</span><span>Problème</span><span>Question</span><span>Hypothèse</span><span>Objectif</span><span>Méthode</span><span>Résultats</span><span>Discussion</span></div>
        <p class="small">Le cheminement du chapitre 3. Le cas pratique « Le parcours complet » le déroule sur l'exercice 9 du TD.</p>
        <a class="btn sm ghost" href="#cas-parcours" style="align-self:flex-start">Voir le cas pratique</a>
      </section>`);
    $("#daily-listen").addEventListener("click", () => toggleListen("daily", () => Reader.play(blocks($(".daily")), { owner: "daily" })));
    $$("[data-go]", view()).forEach((b) => b.addEventListener("click", () => {
      quizCfg = Object.assign(defaultCfg(), b.dataset.go === "smart" ? { mode: "smart", n: 15 } : b.dataset.go === "review" ? { mode: "review", n: 0 } : { mode: "c25", n: 0 });
      startQuiz(); location.hash = "quiz";
    }));
  }

  /* ─────────── Fiches ─────────── */
  let fState = { ch: "all", q: "", mode: "list", i: 0, deck: null, flipped: false, audio: false };
  function viewFiches() {
    render(`
      <header class="page-head"><span class="eyebrow">${D.fiches.length} définitions</span><h1>Fiches mémo</h1><p>Les définitions courtes à savoir réciter, avec un moyen mnémotechnique quand il existe. Les fiches surlignées en jaune sont tombées au contrôle 2025.</p></header>
      <div class="chips" role="group" aria-label="Filtrer par chapitre">
        ${[["all", "Tout"], ...D.chapters.map((c) => [c.id, c.code + " · " + c.short]), ["C25", "★ Contrôle 2025"]].map(([k, l]) => `<button type="button" class="chip" data-ch="${k}" aria-pressed="${fState.ch === k}">${esc(l)}</button>`).join("")}
      </div>
      <div class="toolbar">
        <input class="search" id="fiche-search" type="search" placeholder="Chercher un mot (ex. hypothèse, Zotero…)" value="${esc(fState.q)}">
        ${listenBtn("fiche-listen", "fiches", "Écouter")}
        <div class="seg" role="group" aria-label="Affichage"><button type="button" data-m="list" aria-pressed="${fState.mode === "list"}">Liste</button><button type="button" data-m="cards" aria-pressed="${fState.mode === "cards"}">Cartes</button></div>
      </div>
      <div id="fiche-out"></div>`);
    $$("[data-ch]", view()).forEach((b) => b.addEventListener("click", () => { fState.ch = b.dataset.ch; fState.i = 0; fState.deck = null; $$("[data-ch]", view()).forEach((x) => x.setAttribute("aria-pressed", x === b)); drawFiches(); }));
    $$("[data-m]", view()).forEach((b) => b.addEventListener("click", () => { fState.mode = b.dataset.m; fState.i = 0; fState.deck = null; $$("[data-m]", view()).forEach((x) => x.setAttribute("aria-pressed", x === b)); drawFiches(); }));
    $("#fiche-listen").addEventListener("click", () => toggleListen("fiches", () => {
      if (fState.mode === "cards") { fState.audio = true; cardAudio(); return; }
      const segs = blocks($("#fiche-out")); const first = segs.findIndex((x) => x.getBoundingClientRect().bottom > 90);
      Reader.play(segs, { owner: "fiches", start: Math.max(0, first) });
    }));
    $("#fiche-search").addEventListener("input", (e) => { fState.q = e.target.value; fState.i = 0; fState.deck = null; drawFiches(); });
    drawFiches();
  }
  function filteredFiches() {
    const nq = norm(fState.q).trim();
    return D.fiches.filter((f) => (fState.ch === "all" || f.ch === fState.ch || (fState.ch === "C25" && f.src === "C25")) &&
      (!nq || norm([f.term, f.def, (f.pts || []).join(" "), f.memo || ""].join(" ")).includes(nq)));
  }
  function ficheBody(f) {
    return `${f.pts ? `<ul>${f.pts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}${f.memo ? `<p class="memo">${esc(f.memo)}</p>` : ""}${f.warn ? `<div class="warnbox"><b>Attention.</b> ${esc(f.warn)}</div>` : ""}${f.note ? `<p class="note">${esc(f.note)}</p>` : ""}`;
  }
  // Cartes en audio : lit le terme, laisse le temps de réciter, retourne la carte, lit la réponse, puis passe à la suivante.
  function cardAudio() {
    const card = $("#fiche-out .flash"); if (!card) { fState.audio = false; return; }
    const flipTo = () => { if (!fState.flipped) { fState.flipped = true; card.classList.add("flipped"); } };
    const back = blocks($(".flash-face.back", card)).filter((el) => el.tagName !== "H3"); // le terme vient d'être lu au recto
    Reader.play([$(".flash-face.front h2", card), ...back.map((el, j) => (j ? el : { el, pause: 2000, before: flipTo }))], {
      owner: "fiches",
      onStop: () => { fState.audio = false; },
      onEnd: () => { if (!fState.deck || fState.i >= fState.deck.length - 1) { fState.audio = false; return; } fState.i++; fState.flipped = false; drawFiches(); }
    });
  }
  function drawFiches() {
    if (!(fState.mode === "cards" && fState.audio)) Reader.stop();
    const out = $("#fiche-out"); const list = filteredFiches();
    if (!list.length) { out.innerHTML = `<div class="panel empty">Aucune fiche ne correspond. Essaie un autre mot.</div>`; return; }
    if (fState.mode === "list") {
      out.innerHTML = `<div class="fiche-list">${list.map((f) => `<div class="fiche"><span class="no">${chap(f.ch).code}</span><h3>${esc(f.term)} ${srcTag(f.src)}</h3><p class="def">${esc(f.def)}</p>${ficheBody(f)}</div>`).join("")}</div>`;
      return;
    }
    if (!fState.deck) fState.deck = shuffle(list);
    const deck = fState.deck; const i = Math.min(fState.i, deck.length - 1); const f = deck[i];
    if (!S.fiche[f.id]) { S.fiche[f.id] = true; markDay(); save(); }
    const last = i === deck.length - 1;
    out.innerHTML = `<div class="flash-wrap">
      <div class="row" style="justify-content:space-between"><span class="small">Carte <b>${i + 1}</b> sur ${deck.length}</span><span class="small">Touche la carte pour la retourner</span></div>
      <div class="bar okc"><i style="width:${pct(i + 1, deck.length)}%"></i></div>
      <div class="flash ${fState.flipped ? "flipped" : ""}" tabindex="0" role="button" aria-label="Retourner la carte">
        <div class="flash-inner">
          <div class="flash-face front"><span class="tag">${chap(f.ch).code}</span><h2>${esc(f.term)}</h2>${f.src ? srcTag(f.src) : ""}<span class="flash-hint">Récite la définition, puis touche la carte</span></div>
          <div class="flash-face back"><h3>${esc(f.term)}</h3><p>${esc(f.def)}</p>${ficheBody(f)}</div>
        </div>
      </div>
      <div class="flash-nav">
        <button type="button" class="btn quiet" data-f="prev" ${i === 0 ? "disabled" : ""} aria-label="Carte précédente"><span aria-hidden="true">←</span> Précédente</button>
        ${last ? `<button type="button" class="btn" data-f="again">Mélanger et recommencer ↻</button>` : `<button type="button" class="btn" data-f="next" aria-label="Carte suivante">Suivante <span aria-hidden="true">→</span></button>`}
      </div></div>`;
    const card = $(".flash", out);
    const flip = () => { fState.flipped = !fState.flipped; card.classList.toggle("flipped", fState.flipped); };
    card.addEventListener("click", flip);
    card.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    const move = (a) => {
      if (a === "prev") { if (i === 0) return; fState.i = i - 1; }
      else if (a === "next") { if (last) return; fState.i = i + 1; }
      else { fState.i = 0; fState.deck = null; }
      fState.flipped = false; drawFiches();
    };
    $$("[data-f]", out).forEach((b) => b.addEventListener("click", () => move(b.dataset.f)));
    // Flèches du clavier et balayage sur téléphone
    flashKeys = (e) => { if (!document.body.contains(card) || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === "ArrowLeft") move("prev"); else if (e.key === "ArrowRight") move("next"); };
    if (fState.audio) cardAudio();
    let x0 = null;
    card.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    card.addEventListener("touchend", (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60) { e.preventDefault(); move(dx < 0 ? "next" : "prev"); } });
  }

  let flashKeys = null;
  document.addEventListener("keydown", (e) => { if (flashKeys) flashKeys(e); });

  /* ─────────── Quiz ─────────── */
  const defaultCfg = () => ({ chs: D.chapters.map((c) => c.id), kind: "mix", n: 20, mode: "all" });
  let quizCfg = defaultCfg();
  let session = null;
  const KINDS = { mix: null, choice: ["qcm", "multi", "vf", "match", "order"], write: ["open", "list"] };
  function pickQuestions(cfg) {
    if (cfg.mode === "review") { const r = shuffle(toReview()); return cfg.n ? r.slice(0, cfg.n) : r; }
    let qs = D.questions.filter((q) => cfg.chs.includes(q.ch) && (!KINDS[cfg.kind] || KINDS[cfg.kind].includes(q.t)));
    if (cfg.mode === "c25") qs = qs.filter((q) => q.src === "C25");
    if (cfg.mode === "td") qs = qs.filter((q) => q.src === "TD" || q.src === "EX");
    if (cfg.mode === "weak") qs = qs.filter((q) => weak(q.id) || (S.q[q.id] && S.q[q.id].box < 2));
    if (cfg.mode === "smart") {
      const pr = (q) => { const r = S.q[q.id]; if (!r) return 1; if (r.box === 0) return 0; return 1 + r.box; };
      qs = shuffle(qs).sort((a, b) => pr(a) - pr(b));
    } else qs = shuffle(qs);
    return cfg.n ? qs.slice(0, cfg.n) : qs;
  }
  function startQuiz() { const list = pickQuestions(quizCfg); session = list.length ? { list, i: 0, res: [] } : { list: [], i: 0, res: [], empty: true }; }
  function viewQuiz() {
    if (session && !session.empty && session.i < session.list.length) return drawSession();
    if (session && !session.empty && session.i >= session.list.length) return drawSessionEnd();
    const avail = (cfg) => pickQuestions(Object.assign({}, cfg, { n: 0 })).length;
    render(`
      <header class="page-head"><span class="eyebrow">Questions de cours</span><h1>Quiz</h1><p>Un mélange de QCM et de réponses écrites. Pour les réponses écrites, la correction repère les mots-clés du cours ; tu peux toujours la corriger toi-même.</p></header>
      ${session && session.empty ? `<div class="warnbox"><b>Aucune question</b> ne correspond à ces réglages. Élargis les chapitres ou change de mode.</div>` : ""}
      <section class="panel setup-grid">
        <div class="setup-block"><span class="lab">Chapitres</span><div class="chips">${D.chapters.map((c) => `<button type="button" class="chip" data-chq="${c.id}" aria-pressed="${quizCfg.chs.includes(c.id)}">${c.code} · ${esc(c.short)}</button>`).join("")}</div></div>
        <div class="setup-block"><span class="lab">Type de questions</span><div class="chips">${[["mix", "Mélange"], ["choice", "QCM et associations"], ["write", "Réponses écrites"]].map(([k, l]) => `<button type="button" class="chip" data-kind="${k}" aria-pressed="${quizCfg.kind === k}">${l}</button>`).join("")}</div></div>
        <div class="setup-block"><span class="lab">Sélection</span><div class="chips">${[["all", "Toutes"], ["review", `À revoir (${toReview().length})`], ["smart", "Révision intelligente"], ["c25", "★ Tombé au contrôle"], ["td", "TD et exercices"], ["weak", "Pas encore maîtrisées"]].map(([k, l]) => `<button type="button" class="chip" data-mode="${k}" aria-pressed="${quizCfg.mode === k}">${l}</button>`).join("")}</div></div>
        <div class="setup-block"><span class="lab">Nombre de questions</span><div class="chips">${[[10, "10"], [20, "20"], [40, "40"], [0, "Toutes"]].map(([k, l]) => `<button type="button" class="chip" data-n="${k}" aria-pressed="${quizCfg.n === k}">${l}</button>`).join("")}</div></div>
        <div class="row"><button type="button" class="btn" id="go-quiz">Commencer</button><span class="small" id="avail"></span></div>
      </section>`);
    const upd = () => { const a = avail(quizCfg); $("#avail").textContent = `${a} question${a > 1 ? "s" : ""} disponible${a > 1 ? "s" : ""} avec ces réglages`; $("#go-quiz").disabled = a === 0; };
    $$("[data-chq]", view()).forEach((b) => b.addEventListener("click", () => { const id = b.dataset.chq; if (quizCfg.chs.includes(id)) { if (quizCfg.chs.length > 1) quizCfg.chs = quizCfg.chs.filter((x) => x !== id); } else quizCfg.chs.push(id); $$("[data-chq]", view()).forEach((x) => x.setAttribute("aria-pressed", quizCfg.chs.includes(x.dataset.chq))); upd(); }));
    [["kind", "kind", (v) => v], ["mode", "mode", (v) => v], ["n", "n", (v) => +v]].forEach(([attr, key, cast]) => $$(`[data-${attr}]`, view()).forEach((b) => b.addEventListener("click", () => { quizCfg[key] = cast(b.dataset[attr]); $$(`[data-${attr}]`, view()).forEach((x) => x.setAttribute("aria-pressed", x === b)); upd(); })));
    $("#go-quiz").addEventListener("click", () => { startQuiz(); viewQuiz(); });
    upd();
  }
  function drawSession() {
    const s = session; const q = s.list[s.i];
    render(`<div class="session-head"><button type="button" class="btn sm quiet" id="quit">✕ Quitter</button><button type="button" class="btn sm ${S.autoRead ? "" : "quiet"}" id="auto" aria-pressed="${!!S.autoRead}" title="Lire chaque question et sa correction à voix haute">${IC.speaker}<span>Auto</span></button>${speedCtl()}<div class="bar"><i style="width:${pct(s.i, s.list.length)}%"></i></div><span class="count">${s.i + 1} / ${s.list.length} · ✔ ${s.res.filter((r) => r.ok).length}</span></div><div id="qslot"></div>`);
    const rec = recorder(q.id);
    const card = QCard(q, {
      mode: "practice", num: s.i + 1, total: s.list.length,
      onChecked: (res) => { if (q.t !== "write") rec(res.ok); if (S.autoRead) Reader.play(blocks($(".qfb", card.el)), { owner: "quiz" }); },
      onScore: (res) => rec(res.ok),
      next: (res) => { rec(res.ok); s.res.push({ id: q.id, ok: res.ok }); s.i++; viewQuiz(); },
      nextLabel: s.i + 1 < s.list.length ? "Question suivante →" : "Voir mon résultat →"
    });
    $("#qslot").appendChild(card.el);
    const ta = $("textarea, input.answer", card.el); if (ta && window.matchMedia("(min-width: 861px)").matches) ta.focus();
    $("#quit").addEventListener("click", () => { session = null; viewQuiz(); });
    $("#auto").addEventListener("click", (e) => {
      S.autoRead = !S.autoRead; save(); const b = e.currentTarget; b.setAttribute("aria-pressed", S.autoRead); b.classList.toggle("quiet", !S.autoRead);
      if (S.autoRead) Reader.play(blocks(card.el), { owner: "quiz" }); else Reader.stop();
    });
    if (S.autoRead) Reader.play(blocks(card.el), { owner: "quiz" });
  }
  function drawSessionEnd() {
    const s = session; const ok = s.res.filter((r) => r.ok).length; const n = s.res.length;
    const missed = s.res.filter((r) => !r.ok).map((r) => ALLQ.find((q) => q.id === r.id)).filter(Boolean);
    render(`
      <section class="panel result-hero"><span class="eyebrow">Résultat</span><div class="big-score">${ok}<small> / ${n}</small></div><p>${n ? (ok / n >= 0.8 ? "Très solide. Passe à un examen chronométré." : ok / n >= 0.5 ? "Bonne base. Refais les questions manquées tout de suite pour les fixer." : "Relis les fiches du chapitre, puis relance les questions manquées.") : ""}</p>
        <div class="row" style="justify-content:center">${missed.length ? `<button type="button" class="btn" id="redo">Refaire les ${missed.length} manquée${missed.length > 1 ? "s" : ""}</button>` : ""}<button type="button" class="btn quiet" id="again">Nouveau quiz</button></div></section>
      ${missed.length ? `<section class="panel stack"><h2 class="section-title">À retravailler</h2><p class="small">Ces questions ont été ajoutées automatiquement à ta liste « À revoir ».</p><div class="review-list">${missed.map((q) => `<div><span class="ico no">✗</span><span><b>${esc(q.q)}</b><br><span class="small">${chap(q.ch).code} · ${TYPE[q.t]}</span></span></div>`).join("")}</div></section>` : ""}`);
    const r = $("#redo"); if (r) r.addEventListener("click", () => { session = { list: shuffle(missed), i: 0, res: [] }; viewQuiz(); });
    $("#again").addEventListener("click", () => { session = null; viewQuiz(); });
  }

  /* ─────────── Cas pratiques ─────────── */
  function viewCasList() {
    render(`
      <header class="page-head"><span class="eyebrow">${D.cas.length} cas</span><h1>Cas pratiques</h1><p>Chaque cas est expliqué étape par étape (tu peux te le faire lire à voix haute avec la lecture guidée), puis tu t'entraînes sur un exercice du même type, comme au devoir.</p></header>
      ${D.chapters.map((c) => { const list = D.cas.filter((k) => k.ch === c.id); return list.length ? `<h2 class="group-title">${c.code} · ${esc(c.title)}</h2><div class="cas-grid">${list.map((k) => `<a class="cas-card" href="#cas-${k.id}"><div class="top"><span class="tag">${k.steps.length} étapes</span><span class="tag">≈ ${k.min} min</span>${srcTag(k.src)}${S.cas[k.id] ? `<span class="done">✔ fait</span>` : ""}</div><h3>${esc(k.title)}</h3><p>${esc(k.sub)}</p></a>`).join("")}</div>` : ""; }).join("")}`, true);
  }
  function viewCas(id) {
    const k = D.cas.find((x) => x.id === id); if (!k) { location.hash = "cas"; return; }
    let cur = 0; const seen = new Set([0]); let guided = false;
    render(`
      <a href="#cas" class="small">← Tous les cas pratiques</a>
      <header class="page-head"><span class="eyebrow">${chap(k.ch).code} · Cas pratique</span><h1>${esc(k.title)}</h1><p>${esc(k.sub)}</p><div class="row">${srcTag(k.src)}<span class="tag">${k.steps.length} étapes</span><span class="tag">≈ ${k.min} min</span></div></header>
      <section class="stack" aria-label="Explication pas à pas">
        <div class="row" style="justify-content:space-between"><div class="step-dots" id="dots"></div>${listenBtn("guide", "cas", "Écouter les étapes")}</div>
        <div id="step"></div>
        <div class="step-nav"><button type="button" class="btn quiet" id="prev">← Étape précédente</button><button type="button" class="btn" id="next"></button></div>
      </section>
      <section class="stack" id="train" aria-label="Entraînement">
        <h2 class="group-title">À toi de jouer</h2>
        <p class="small">Fais l'exercice sans regarder l'explication, comme au devoir. ${k.exercise.some((q) => q.t === "write") ? "Pour les rédactions, compare ensuite avec le corrigé et coche la grille honnêtement." : ""}</p>
        <div id="ex" class="stack"></div>
      </section>`);
    const stepEl = (i) => { const s = k.steps[i]; const d = document.createElement("div"); d.innerHTML = `<article class="step fade-in"><span class="step-k">Étape ${i + 1} sur ${k.steps.length}</span><h2>${esc(s.t)}</h2><div class="step-body">${s.b}</div></article>`; return d.firstElementChild; };
    const drawStep = (art) => {
      $("#dots").innerHTML = k.steps.map((_, i) => `<button type="button" class="step-dot ${i === cur ? "cur" : seen.has(i) ? "seen" : ""}" data-i="${i}" aria-label="Étape ${i + 1}">${i + 1}</button>`).join("");
      $$("#dots .step-dot").forEach((b) => b.addEventListener("click", () => { go(+b.dataset.i); }));
      $("#step").replaceChildren(art || stepEl(cur));
      $("#prev").disabled = cur === 0;
      $("#next").textContent = cur < k.steps.length - 1 ? "Étape suivante →" : "Passer à l'exercice ↓";
      drawGuide();
    };
    const drawGuide = syncListen;
    const go = (i) => { cur = Math.max(0, Math.min(k.steps.length - 1, i)); seen.add(cur); drawStep(); if (guided) narrate(); };
    // L'étape suivante est préparée pendant la fin de la lecture et s'affiche quand la voix l'attaque : aucun blanc.
    let ahead = 0;
    const narrate = () => { ahead = cur; Reader.play(blocks($("#step")), {
      owner: "cas",
      chain: () => { if (ahead >= k.steps.length - 1) return null; const i = ++ahead; const art = stepEl(i); return { items: blocks(art), enter: () => { cur = i; seen.add(i); drawStep(art); } }; },
      onStop: () => { guided = false; drawGuide(); },
      onEnd: () => { guided = false; drawGuide(); }
    }); };
    const stopGuide = () => { if (guided) Reader.stop(); };
    $("#prev").addEventListener("click", () => go(cur - 1));
    $("#next").addEventListener("click", () => { if (cur < k.steps.length - 1) go(cur + 1); else { stopGuide(); $("#train").scrollIntoView({ behavior: "smooth", block: "start" }); } });
    $("#guide").addEventListener("click", () => { if (guided) stopGuide(); else { guided = true; drawGuide(); narrate(); } });
    drawStep();
    const ex = $("#ex");
    if (k.special === "stats") ex.appendChild(StatsTrainer());
    let done = 0;
    k.exercise.forEach((q, i) => {
      const rec = recorder(q.id);
      const card = QCard(q, { mode: "practice", num: i + 1, total: k.exercise.length, onScore: (res) => rec(res.ok), onChecked: (res) => { if (q.t !== "write") rec(res.ok); done++; if (done >= Math.ceil(k.exercise.length / 2)) { S.cas[k.id] = true; markDay(); save(); } } });
      ex.appendChild(card.el);
    });
  }

  /* --- Générateur de séries statistiques --- */
  function statsOf(xs) {
    const s = xs.slice().sort((a, b) => a - b); const n = s.length; const sum = s.reduce((a, b) => a + b, 0); const mean = sum / n;
    const med = (arr) => { const m = arr.length; return m % 2 ? arr[(m - 1) / 2] : (arr[m / 2 - 1] + arr[m / 2]) / 2; };
    const counts = {}; s.forEach((v) => (counts[v] = (counts[v] || 0) + 1)); const maxc = Math.max(...Object.values(counts)); const mode = +Object.keys(counts).find((k) => counts[k] === maxc);
    const dev = s.map((v) => v - mean); const sq = dev.map((d) => d * d); const ss = sq.reduce((a, b) => a + b, 0);
    const lower = s.slice(0, Math.floor(n / 2)); const upper = s.slice(Math.ceil(n / 2));
    return { s, n, sum, mean, median: med(s), mode, range: s[n - 1] - s[0], dev, sq, ss, varP: ss / n, sdP: Math.sqrt(ss / n), varS: ss / (n - 1), sdS: Math.sqrt(ss / (n - 1)), lower, upper, q1: med(lower), q3: med(upper) };
  }
  function newSeries() {
    const n = 7 + Math.floor(Math.random() * 4); const mode = 8 + Math.floor(Math.random() * 25);
    const pool = shuffle(Array.from({ length: 36 }, (_, i) => i + 5).filter((v) => v !== mode));
    const xs = [mode, mode, mode, ...pool.slice(0, n - 3)];
    return shuffle(xs);
  }
  function StatsTrainer() {
    const box = document.createElement("article"); box.className = "qcard stats-box";
    const fields = [["mean", "Moyenne"], ["median", "Médiane"], ["mode", "Mode"], ["range", "Étendue"], ["var", "Variance"], ["sd", "Écart-type"], ["q1", "Q1"], ["q3", "Q3"]];
    let xs, st;
    const draw = () => {
      xs = newSeries(); st = statsOf(xs);
      box.innerHTML = `<div class="qmeta"><span class="tag">CH 2</span><span class="tag">Calcul</span><span class="tag td">TD</span><span class="pts">Série aléatoire</span></div>
        <p class="qtext">Temps d'exécution mesurés (ms), n = ${st.n} :</p><p class="stats-series">${xs.join(" · ")}</p>
        <p class="hint-line">Arrondis au centième. Variance et écart-type : divise par n (la version n − 1 est aussi acceptée).</p>
        <div class="stats-inputs">${fields.map(([k, l]) => `<label for="st-${k}">${l}<input id="st-${k}" data-k="${k}" inputmode="decimal" autocomplete="off"></label>`).join("")}</div>
        <div class="qact"><button type="button" class="btn" data-s="check">Corriger</button><button type="button" class="btn quiet" data-s="new">Nouvelle série</button></div><div class="qfb"></div>`;
      $("[data-s=check]", box).addEventListener("click", correct);
      $("[data-s=new]", box).addEventListener("click", draw);
    };
    const correct = () => {
      const want = { mean: [st.mean], median: [st.median], mode: [st.mode], range: [st.range], var: [st.varP, st.varS], sd: [st.sdP, st.sdS], q1: [st.q1], q3: [st.q3] };
      let good = 0;
      $$(".stats-inputs input", box).forEach((inp) => {
        const k = inp.dataset.k; const v = parseNum(inp.value); const ok = v != null && want[k].some((w) => Math.abs(v - w) <= 0.051);
        if (ok) good++; inp.classList.remove("right", "wrong"); inp.classList.add(ok ? "right" : "wrong");
        const lab = inp.parentElement; const old = $(".sol", lab); if (old) old.remove();
        if (!ok) lab.insertAdjacentHTML("beforeend", `<span class="sol">✔ ${fmt(want[k][0])}</span>`);
      });
      const t = st;
      const cls = good === 8 ? "good" : good >= 4 ? "part" : "miss";
      $(".qfb", box).innerHTML = `<div class="fb ${cls}"><div class="fb-head"><span>${good === 8 ? "✔" : "◐"}</span><span>${good} / 8 justes</span></div><div class="fb-body">
        <div class="lab">Correction détaillée</div>
        <div class="model mono" style="line-height:1.9">
        Série rangée : ${t.s.join(" · ")}<br>
        Somme = ${t.sum} → moyenne = ${t.sum} ÷ ${t.n} = <b>${fmt(t.mean)}</b><br>
        Médiane : n = ${t.n} ${t.n % 2 ? `impair → ${(t.n + 1) / 2}ᵉ valeur` : `pair → moyenne des ${t.n / 2}ᵉ et ${t.n / 2 + 1}ᵉ valeurs`} = <b>${fmt(t.median)}</b><br>
        Mode : ${t.mode} revient 3 fois → <b>${t.mode}</b><br>
        Étendue = ${t.s[t.n - 1]} − ${t.s[0]} = <b>${t.range}</b><br>
        Écarts² : ${t.sq.map((x) => fmt(x)).join(" + ")} = ${fmt(t.ss)}<br>
        Variance = ${fmt(t.ss)} ÷ ${t.n} = <b>${fmt(t.varP)}</b> (÷ ${t.n - 1} : ${fmt(t.varS)})<br>
        Écart-type = √${fmt(t.varP)} = <b>${fmt(t.sdP)}</b> (n − 1 : ${fmt(t.sdS)})<br>
        Moitié basse ${t.lower.join(" · ")} → Q1 = <b>${fmt(t.q1)}</b><br>
        Moitié haute ${t.upper.join(" · ")} → Q3 = <b>${fmt(t.q3)}</b> · IQR = ${fmt(t.q3 - t.q1)}
        </div></div></div>`;
    };
    draw();
    return box;
  }

  /* ─────────── Examens ─────────── */
  let examS = null; let timerId = null;
  function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function viewExams() {
    render(`
      <header class="page-head"><span class="eyebrow">Conditions réelles</span><h1>Examens chronométrés</h1><p>Aucune correction pendant l'épreuve : tu rédiges tout, tu remets ta copie, puis tu vois ta note sur 20 et le corrigé question par question.</p></header>
      <div class="exam-list">${D.examens.map((e) => { const best = S.exams.filter((x) => x.id === e.id).reduce((m, x) => Math.max(m, x.note), -1); return `<a class="exam-card" href="#examen-${e.id}"><span class="row"><span class="tag ${e.id === "controle-2025" ? "c25" : ""}">${esc(e.tag)}</span>${best >= 0 ? `<span class="best">meilleure note ${fmt(best, 1)}/20</span>` : ""}</span><h3>${esc(e.title)}</h3><p>${esc(e.info)}</p><span class="dur">${e.min >= 60 ? e.min / 60 + " h" : e.min + " min"}</span></a>`; }).join("")}</div>`);
  }
  function buildExamQuestions(e) {
    if (e.random) return [{ title: `${e.random} questions tirées au hasard`, qs: shuffle(D.questions).slice(0, e.random).map((q) => Object.assign({}, q, { pts: 1 })) }];
    return e.parts;
  }
  function viewExam(id) {
    const e = D.examens.find((x) => x.id === id); if (!e) { location.hash = "examens"; return; }
    if (examS && examS.id === id && !examS.done) return drawExam();
    render(`
      <a href="#examens" class="small">← Tous les sujets</a>
      <section class="panel stack">
        <span class="eyebrow">${esc(e.tag)}</span><h1 style="font-size:1.8rem">${esc(e.title)}</h1><p>${esc(e.info)}</p>
        <p class="small">Durée officielle : ${e.min >= 60 ? e.min / 60 + " heure" + (e.min > 60 ? "s" : "") : e.min + " minutes"}. Pas de correction avant la remise. À la fin du temps, la copie est remise automatiquement.</p>
        <div class="chips" role="group" aria-label="Chronomètre">${[[e.min, "Durée officielle"], [Math.round(e.min / 2), "Moitié du temps"], [0, "Sans chrono"]].map(([m, l], i) => `<button type="button" class="chip" data-t="${m}" aria-pressed="${i === 0}">${l}${m ? ` · ${m} min` : ""}</button>`).join("")}</div>
        <div class="row"><button type="button" class="btn" id="start">Commencer l'épreuve</button></div>
      </section>`);
    let mins = e.min;
    $$("[data-t]", view()).forEach((b) => b.addEventListener("click", () => { mins = +b.dataset.t; $$("[data-t]", view()).forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    $("#start").addEventListener("click", () => { examS = { id, e, parts: buildExamQuestions(e), end: mins ? Date.now() + mins * 60000 : 0, done: false, cards: [] }; drawExam(); });
  }
  function drawExam() {
    const x = examS; const e = x.e;
    render(`
      <div class="timer" id="timer"><span class="clock" id="clock">${x.end ? "" : "Sans chrono"}</span><button type="button" class="btn sm" id="hand">Remettre ma copie</button></div>
      <header class="copy-head"><span class="eyebrow">${esc(e.tag)}</span><h1>${esc(e.title)}</h1><span class="small">${esc(e.info)}</span></header>
      <div id="copy" class="stack"></div>
      <div id="endzone" class="stack"><div class="row"><button type="button" class="btn" id="hand2">Remettre ma copie</button></div></div>`);
    const copy = $("#copy"); x.cards = []; let num = 0;
    x.parts.forEach((p) => {
      copy.insertAdjacentHTML("beforeend", `<h2 class="part-title">${esc(p.title)}</h2>${p.intro ? `<div class="qintro">${esc(p.intro)}</div>` : ""}`);
      p.qs.forEach((q) => { num++; const c = QCard(q, { mode: "exam", num, pts: q.pts }); x.cards.push({ c, q }); copy.appendChild(c.el); });
    });
    const askHand = () => {
      const z = $("#endzone");
      z.innerHTML = `<div class="confirm"><span>Remettre ta copie maintenant ? Tu ne pourras plus modifier tes réponses.</span><button type="button" class="btn" id="yes">Oui, remettre</button><button type="button" class="btn quiet" id="no">Continuer</button></div>`;
      z.scrollIntoView({ behavior: "smooth", block: "center" });
      $("#yes").addEventListener("click", submitExam);
      $("#no").addEventListener("click", () => { z.innerHTML = `<div class="row"><button type="button" class="btn" id="hand2">Remettre ma copie</button></div>`; $("#hand2").addEventListener("click", askHand); });
    };
    $("#hand").addEventListener("click", askHand); $("#hand2").addEventListener("click", askHand);
    if (x.end) {
      const tick = () => {
        const left = Math.max(0, x.end - Date.now()); const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
        const el = $("#clock"); if (!el) return clearTimer();
        el.textContent = `${String(Math.floor(m / 60)).padStart(1, "0")}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        $("#timer").classList.toggle("low", left < 5 * 60000);
        if (left <= 0) { clearTimer(); submitExam(); }
      };
      tick(); timerId = setInterval(tick, 1000);
    }
  }
  function submitExam() {
    clearTimer(); const x = examS; if (!x || x.done) return; x.done = true;
    const total = x.cards.reduce((s, k) => s + (k.q.pts || 1), 0);
    const results = x.cards.map((k) => ({ k, r: k.c.examCorrect() }));
    const hasSelf = x.cards.some((k) => k.q.t === "write");
    const compute = () => results.reduce((s, o) => s + o.r.score * (o.k.q.pts || 1), 0);
    $("#timer").remove();
    const hdr = document.createElement("section"); hdr.className = "panel result-hero";
    $(".wrap", view()).insertBefore(hdr, $(".copy-head", view()));
    const entry = { id: x.id, date: today(), note: 0 }; S.exams.push(entry); S.exams = S.exams.slice(-40);
    const upd = () => {
      const pts = compute(); const note = (pts / total) * 20; entry.note = Math.round(note * 10) / 10; markDay(); save();
      hdr.innerHTML = `<span class="eyebrow">Copie corrigée</span><div class="big-score">${fmt(note, 1)}<small> / 20</small></div><p class="small mono">${fmt(pts)} points sur ${fmt(total)}</p>${hasSelf ? `<p>Les rédactions sont notées par toi : coche la grille sous chaque corrigé, ta note se met à jour.</p>` : ""}<div class="row" style="justify-content:center"><a class="btn" href="#examens">Autres sujets</a><button type="button" class="btn quiet" id="retry">Refaire ce sujet</button></div>`;
      $("#retry").addEventListener("click", () => { examS = null; viewExam(x.id); });
    };
    results.forEach((o) => { o.rec = recorder(o.k.q.id); o.rec(o.r.ok); });
    results.forEach((o) => { o.k.c.el.addEventListener("change", () => setTimeout(() => { if (o.k.q.t === "write") o.rec(o.r.ok); upd(); }, 0)); });
    upd();
    $("#endzone").innerHTML = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ─────────── Progrès ─────────── */
  function viewProgress() {
    const all = chapStats(); const weakN = toReview().length;
    const fk = Object.values(S.fiche).filter(Boolean).length;
    render(`
      <header class="page-head"><span class="eyebrow">Suivi</span><h1>Progrès</h1><p>Tes résultats restent sur cet appareil, dans ce navigateur.</p></header>
      <div class="stat-tiles">
        <div class="tile"><b>${all.m}<span class="small"> / ${all.tot}</span></b><span>questions maîtrisées</span></div>
        <div class="tile"><b>${all.seen}</b><span>questions déjà vues</span></div>
        <div class="tile"><b>${weakN}</b><span>à revoir (dernière réponse fausse)</span></div>
        <div class="tile"><b>${fk}</b><span>fiches consultées</span></div>
        <div class="tile"><b>${Object.keys(S.cas).length}<span class="small"> / ${D.cas.length}</span></b><span>cas pratiques faits</span></div>
        <div class="tile"><b>${S.days.length}</b><span>jours de révision</span></div>
      </div>
      <section class="panel stack"><h2 class="section-title">Par chapitre</h2><div class="chap-rows">${D.chapters.map((c) => { const s = chapStats(c.id); return `<div class="chap-row"><span class="code">${c.code}</span><span class="t">${esc(c.title)}<span class="bar"><i style="width:${pct(s.m, s.tot)}%"></i></span><span class="small">${s.seen} vues · ${s.m} maîtrisées</span></span><span class="pct">${pct(s.m, s.tot)} %</span></div>`; }).join("")}</div>
        ${weakN ? `<button type="button" class="btn" id="weak" style="align-self:flex-start">Réviser les ${weakN} questions ratées</button>` : ""}</section>
      <section class="panel stack"><h2 class="section-title">Historique des examens</h2>${S.exams.length ? `<div class="grid-scroll"><table class="hist"><thead><tr><th>Date</th><th>Sujet</th><th style="text-align:right">Note</th></tr></thead><tbody>${S.exams.slice().reverse().map((x) => { const e = D.examens.find((y) => y.id === x.id); return `<tr><td class="mono">${x.date}</td><td>${esc(e ? e.title : x.id)}</td><td class="n">${fmt(x.note, 1)} / 20</td></tr>`; }).join("")}</tbody></table></div>` : `<p class="small">Aucun examen passé pour l'instant.</p>`}</section>
      <section class="panel stack"><h2 class="section-title">Remettre à zéro</h2><p class="small">Efface toute ta progression sur cet appareil.</p><div id="reset-zone"><button type="button" class="btn bad" id="reset">Effacer ma progression</button></div></section>`);
    const w = $("#weak"); if (w) w.addEventListener("click", () => { quizCfg = Object.assign(defaultCfg(), { mode: "smart", n: weakN }); session = { list: toReview(), i: 0, res: [] }; session.list = shuffle(session.list); location.hash = "quiz"; });
    $("#reset").addEventListener("click", () => {
      $("#reset-zone").innerHTML = `<div class="confirm"><span>Tout effacer ? Cette action est définitive.</span><button type="button" class="btn bad" id="reset-yes">Oui, effacer</button><button type="button" class="btn quiet" id="reset-no">Annuler</button></div>`;
      $("#reset-yes").addEventListener("click", () => { const th = S.theme; S = defaults(); S.theme = th; save(); viewProgress(); });
      $("#reset-no").addEventListener("click", viewProgress);
    });
  }

  /* ─────────── Routeur ─────────── */
  function route() {
    const h = (location.hash || "").replace(/^#/, "");
    flashKeys = null;
    setNav(h); updateBadge();
    if (!h || h === "accueil") return viewHome();
    if (h === "fiches") return viewFiches();
    if (h === "quiz") return viewQuiz();
    if (h === "cas") return viewCasList();
    if (h.startsWith("cas-")) return viewCas(h.slice(4));
    if (h === "examens") return viewExams();
    if (h.startsWith("examen-")) return viewExam(h.slice(7));
    if (h === "progres") return viewProgress();
    viewHome();
  }

  /* ─────────── Démarrage ─────────── */
  function shell() {
    const navHtml = NAV.map(([k, l, ic]) => `<a href="#${k}" data-k="${k}">${IC[ic]}<span>${l}</span></a>`).join("");
    $("#nav").innerHTML = navHtml;
    $("#tabbar").innerHTML = NAV.filter((n) => n[0] !== "progres").map(([k, l, ic]) => `<a href="#${k}" data-k="${k}">${IC[ic]}<span>${l === "Cas pratiques" ? "Cas" : l}</span></a>`).join("");
    $$(".theme-btn").forEach((b) => { b.innerHTML = `${IC.moon}<span class="theme-label"></span>`; b.addEventListener("click", cycleTheme); });
    applyTheme();
    Reader.init();
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", shell); else shell();
})();
