// Dans chaque écran : pose les zones à toucher (par texte visible) et parle au cadre parent.
(function () {
  const root = document.documentElement;
  const id = root.dataset.state;
  const F = (window.FLOWS || {})[id] || {};
  const P = window.parent !== window ? window.parent : null;
  if (P && P.PROTO_PHONE) root.classList.add("on-phone");
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const CLICK = ".btn, .chip, .row, .opt, .tabbar .t, .card, .circ, .rec, .mic, .field";
  const all = [...document.querySelectorAll(".screen *")];
  for (const [key, act] of Object.entries(F.hot || {})) {
    const k = key.replace(/^~/, "");
    let m = key[0] === "~" ? [] : all.filter((e) => norm(e.textContent) === k);
    if (!m.length) m = all.filter((e) => norm(e.textContent).includes(k)).sort((a, b) => a.textContent.length - b.textContent.length).slice(0, 1);
    m = m.filter((e) => !m.some((o) => o !== e && o.contains(e)));
    if (!m.length) { console.warn("proto: aucune zone pour", id, key); root.dataset.missing = (root.dataset.missing || "") + key + " | "; }
    for (const e of m) {
      const t = e.closest(CLICK) || e;
      if (t.dataset.hot && t.dataset.hot !== "x") continue; // la première règle gagne
      root.dataset.nhot = (+(root.dataset.nhot || 0)) + 1;
      t.dataset.hot = typeof act === "string" ? act : "x";
      if (typeof act !== "string") t._act = act;
    }
  }
  const send = (m) => (P ? P.postMessage(m, "*") : null);
  let timer = null, longDone = false;
  document.addEventListener("pointerdown", (e) => {
    longDone = false;
    if (e.target.closest("[data-hot]")) return;
    timer = setTimeout(() => { longDone = true; send({ t: "menu" }); }, 650);
  });
  const stop = () => clearTimeout(timer);
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);
  document.addEventListener("click", (e) => {
    if (longDone) { longDone = false; return; }
    const h = e.target.closest("[data-hot]");
    if (h) {
      const a = h._act || h.dataset.hot;
      if (a === "toggle") return h.classList.toggle("on");
      if (a === "radio") { [...h.parentElement.children].forEach((c) => c.classList.remove("on")); return h.classList.add("on"); }
      return send({ t: "act", a });
    }
    if (F.any) return send({ t: "act", a: F.any });
    root.classList.remove("flash"); void root.offsetWidth; root.classList.add("flash");
    setTimeout(() => root.classList.remove("flash"), 900);
  });
  window.addEventListener("message", (e) => {
    if (e.data && e.data.t === "hints") root.classList.toggle("hints", !!e.data.on);
  });
  if (P && P.PROTO_HINTS) root.classList.add("hints");
})();
