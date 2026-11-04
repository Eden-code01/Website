/* ==========================================================================
   EDEN.OS — kernel
   boot → login → desktop · window manager · terminal · Eden.AI palette
   ========================================================================== */
(() => {
  "use strict";
  const D = window.EDEN;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "ic") => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const chips = (arr, ac = false) => `<div class="chips">${arr.map((t) => `<span class="chip${ac ? " ac" : ""}">${esc(t)}</span>`).join("")}</div>`;
  const MOBILE_Q = "(max-width: 820px), (max-height: 520px)";
  const isMobile = () => matchMedia(MOBILE_Q).matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* noop */ } }
  };
  const t0 = Date.now();

  /* ---------------------------------------------------------------- APPS */
  const APPS = {
    about: {
      title: "Perfil", path: "~/perfil.sys", icon: "user", sub: "perfil.sys",
      render: () => `
        <div class="about-head">
          <div class="avatar"><span>ES</span></div>
          <div>
            <div class="eyebrow">// identidade</div>
            <h2 class="app-h">${esc(D.profile.name)}</h2>
            <p style="color:var(--text-2)">${esc(D.profile.role)}</p>
          </div>
        </div>
        <div class="sec prose">${D.profile.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="sec">
          <dl class="kv">
            <div><dt>Base</dt><dd>${esc(D.profile.location)}</dd></div>
            <div><dt>Formação</dt><dd>${esc(D.profile.education)}</dd></div>
            <div><dt>Foco</dt><dd>IA · Automação · Dados</dd></div>
            <div><dt>Status</dt><dd><span class="status live"><i class="dot"></i></span> ${esc(D.profile.status)}</dd></div>
          </dl>
        </div>
        <div class="sec row">
          <button class="btn primary" data-open="projects">${icon("folder")} Ver projetos</button>
          <button class="btn" data-open="career">${icon("route")} Trajetória</button>
          <button class="btn" data-open="contact">${icon("mail")} Contato</button>
        </div>`
    },

    projects: {
      title: "Projetos", path: "~/projetos", icon: "folder", sub: `${D.projects.length} itens`,
      render: (body) => renderProjects(body)
    },

    career: {
      title: "Trajetória", path: "~/trajetoria.log", icon: "route", sub: "carreira.log",
      render: () => `
        <div class="eyebrow">// trajetória profissional</div>
        <h2 class="app-h">Do atendimento à engenharia de sistemas inteligentes.</h2>
        <p class="app-lead">Cada etapa somou uma camada: pessoas, negócio, tecnologia — e agora IA aplicada a resultado.</p>
        <div class="sec">
          <ol class="timeline">
            ${D.career.map((c) => `
              <li class="tl-item">
                <div class="tl-period">${esc(c.period)}</div>
                <div class="tl-title">${esc(c.title)} <span>· ${esc(c.org)}</span></div>
                <p class="tl-text">${esc(c.text)}</p>
                ${chips(c.tags)}
              </li>`).join("")}
          </ol>
        </div>`
    },

    uplead: {
      title: D.company.name, path: "~/empresa/up-lead", icon: "rocket", sub: "empresa",
      render: () => `
        <div class="company-hero">
          <div class="eyebrow">// empresa</div>
          <div class="company-logo" style="margin-top:10px">${icon("rocket", "")}${esc(D.company.name)}</div>
          <p style="font-size:19px;font-weight:500;margin-top:10px;letter-spacing:-0.01em">${esc(D.company.tagline)}</p>
          <p class="app-lead">${esc(D.company.description)}</p>
          <div class="row" style="margin-top:18px">
            <button class="btn primary" data-open="contact">${icon("arrow")} Falar sobre um projeto</button>
            ${D.company.url ? `<a class="btn" href="${esc(D.company.url)}" target="_blank" rel="noopener">${icon("ext")} Site</a>` : ""}
            <button class="btn" data-open="automations">${icon("flow")} Ver automações</button>
          </div>
        </div>
        <div class="sec">
          <div class="sec-h">pilares</div>
          <div class="pillars">
            ${D.company.pillars.map((p, i) => `
              <div class="pillar"><div class="n">0${i + 1}</div><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p></div>`).join("")}
          </div>
        </div>`
    },

    automations: {
      title: "Automações", path: "~/automacoes/pipelines", icon: "flow", sub: "pipelines",
      render: (body) => {
        body.innerHTML = `
          <div class="eyebrow">// automações</div>
          <h2 class="app-h">Processos que rodam sozinhos.</h2>
          <p class="app-lead">Pipelines que conectam sistemas, aplicam IA no meio do caminho e entregam resultado — sem intervenção manual.</p>
          <div class="sec">
            ${D.automations.map((a) => `
              <article class="auto">
                <div class="auto-head">
                  <h3><span class="status live"><i class="dot"></i></span>${esc(a.name)}</h3>
                  ${chips(a.tags)}
                </div>
                <p>${esc(a.desc)}</p>
                <div class="flow">${a.flow.map((n, i) => `${i ? '<i class="edge"></i>' : ""}<span class="node">${esc(n)}</span>`).join("")}</div>
              </article>`).join("")}
          </div>`;
        // run a "signal" through each pipeline
        const flows = $$(".flow", body);
        let step = 0;
        const tick = () => {
          if (!body.isConnected) return;
          flows.forEach((f) => {
            const nodes = $$(".node", f);
            nodes.forEach((n, i) => n.classList.toggle("on", i === step % nodes.length));
          });
          step++;
          setTimeout(tick, 700);
        };
        if (!reduced) tick();
      }
    },

    stack: {
      title: "Stack", path: "~/sistema/stack", icon: "chip", sub: "skills",
      render: () => `
        <div class="eyebrow">// stack técnica</div>
        <h2 class="app-h">Ferramentas do sistema.</h2>
        <p class="app-lead">O que uso para transformar ideias em sistemas funcionando — e o que estou aprofundando agora.</p>
        <div class="sec stack-grid">
          ${D.stack.map((g) => `<div><h4>${esc(g.group)}</h4>${chips(g.items, g.group.includes("IA"))}</div>`).join("")}
        </div>
        <div class="sec">
          <div class="sec-h">em evolução</div>
          <ul class="hl-list">
            <li>JavaScript avançado e aplicações web completas</li>
            <li>Agentes de IA e automações orientadas a dados</li>
            <li>Arquitetura de sistemas e performance</li>
          </ul>
        </div>`
    },

    terminal: {
      title: "Terminal", path: "guest@eden.os", icon: "term", sub: "shell",
      w: 640, h: 420,
      render: (body) => initTerminal(body)
    },

    contact: {
      title: "Contato", path: "~/contato", icon: "mail", sub: "conectar",
      w: 520, h: 520,
      render: () => `
        <div class="eyebrow">// conexão</div>
        <h2 class="app-h">Vamos construir algo.</h2>
        <p class="app-lead">Projetos de automação, IA aplicada ou uma conversa sobre a Up Lead — me chama.</p>
        <div class="sec contact-list">
          <a class="contact-item" href="mailto:${esc(D.profile.email)}">${icon("mail")}<div><b>E-mail</b><span>${esc(D.profile.email)}</span></div>${icon("ext", "ic ext")}</a>
          ${D.profile.links.map((l) => `
            <a class="contact-item" href="${esc(l.url)}" target="_blank" rel="noopener">${icon(l.icon)}<div><b>${esc(l.label)}</b><span>${esc(l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/%C3%A9/g, "é"))}</span></div>${icon("ext", "ic ext")}</a>`).join("")}
        </div>`
    }
  };
  const ORDER = ["about", "projects", "career", "uplead", "automations", "stack", "terminal", "contact"];
  const DESKTOP_ICONS = ["projects", "career", "uplead", "automations"];

  function renderProjects(body, id) {
    const p = id && D.projects.find((x) => x.id === id);
    if (p) {
      body.innerHTML = `
        <button class="back" data-back>${icon("arrow")} projetos</button>
        <div class="card-top" style="justify-content:flex-start;gap:14px">
          <span class="status ${p.status === "estudo" ? "wip" : "live"}"><i class="dot"></i>${esc(p.status)}</span>
          <span>${esc(p.year)}</span>
        </div>
        <h2 class="app-h">${esc(p.name)}</h2>
        <p style="color:var(--text-3);font-size:13px">${esc(p.kind)}</p>
        <p class="app-lead">${esc(p.summary)}</p>
        <div class="sec"><div class="sec-h">destaques</div><ul class="hl-list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>
        <div class="sec"><div class="sec-h">stack</div>${chips(p.stack, true)}</div>
        <div class="sec row">${p.links.map((l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${icon("ext")} ${esc(l.label)}</a>`).join("")}</div>`;
      $("[data-back]", body).onclick = () => renderProjects(body);
    } else {
      body.innerHTML = `
        <div class="eyebrow">// projetos pessoais</div>
        <h2 class="app-h">Laboratório.</h2>
        <p class="app-lead">Projetos onde testo ideias de IA, automação, hardware e web — do protótipo ao sistema rodando.</p>
        <div class="sec cards">
          ${D.projects.map((x) => `
            <button class="card" data-project="${esc(x.id)}">
              <div class="card-top"><span class="status ${x.status === "estudo" ? "wip" : "live"}"><i class="dot"></i>${esc(x.status)}</span><span>${esc(x.year)}</span></div>
              <h3>${esc(x.name)}</h3>
              <div class="kind">${esc(x.kind)}</div>
              <p>${esc(x.summary)}</p>
              ${chips(x.stack.slice(0, 4))}
              <span class="go">abrir ${icon("arrow")}</span>
            </button>`).join("")}
        </div>`;
      $$("[data-project]", body).forEach((b) => (b.onclick = () => renderProjects(body, b.dataset.project)));
    }
    body.scrollTop = 0;
  }

  /* ---------------------------------------------------------------- BOOT */
  const boot = $("#boot"), login = $("#login"), desktop = $("#desktop");

  function runBoot() {
    const log = $("#boot-log"), bar = $("#boot-progress");
    const lines = [
      ["[ <span class='ok'>OK</span> ] kernel eden-core 2.6 carregado", 0],
      ["[ <span class='ok'>OK</span> ] montando /dev/projetos /dev/automacoes", 0],
      ["[ <span class='ok'>OK</span> ] conectando neural-engine <span class='ac'>· ia.v4</span>", 0],
      ["[ <span class='ok'>OK</span> ] sincronizando dados · up-lead.service", 0],
      ["[ <span class='ok'>OK</span> ] pipelines de automação ativos (" + D.automations.length + ")", 0],
      ["[ <span class='ok'>OK</span> ] otimizando performance · cache quente", 0],
      ["", 0],
      ["<span class='hl'>sistema pronto.</span> bem-vindo ao eden.os", 0]
    ];
    let i = 0, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      bar.style.width = "100%";
      boot.classList.add("fade-out");
      setTimeout(() => { boot.hidden = true; showLogin(); }, 550);
    };
    const step = () => {
      if (done) return;
      if (i < lines.length) {
        log.innerHTML += lines[i][0] + "\n";
        bar.style.width = ((i + 1) / lines.length) * 100 + "%";
        i++;
        setTimeout(step, 180 + Math.random() * 160);
      } else setTimeout(finish, 450);
    };
    boot.addEventListener("click", finish);
    window.addEventListener("keydown", function k() { window.removeEventListener("keydown", k); finish(); });
    step();
  }

  /* --------------------------------------------------------------- LOGIN */
  function fmtTime(d = new Date()) { return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }

  /* gravitational particle field — central well + pointer as a second mass */
  function startGravity() {
    const c = $("#gravity");
    if (!c) return { collapse() {} };
    const ctx = c.getContext("2d");
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, P = [], running = true, collapsing = false, G = 1;
    const ptr = { x: 0, y: 0, on: false, m: 0 };
    const waves = [];
    const COLORS = ["139,123,255", "94,230,200", "236,238,243"];

    const spawn = (p = {}) => {
      const ang = Math.random() * Math.PI * 2;
      const rMax = Math.hypot(w, h) * 0.55;
      const r = 70 + Math.pow(Math.random(), 1.9) * rMax;
      const v = Math.sqrt((1400 * G * r) / (r * r + 900)) * (0.9 + Math.random() * 0.18);
      const dir = Math.random() < 0.85 ? 1 : -1;
      p.x = cx + Math.cos(ang) * r; p.y = cy + Math.sin(ang) * r;
      p.vx = -Math.sin(ang) * v * dir; p.vy = Math.cos(ang) * v * dir;
      p.c = COLORS[Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 2 : 1];
      p.s = Math.random() * 1.2 + 0.5;
      p.a = Math.random() * 0.45 + 0.4;
      return p;
    };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const av = $(".login-card .avatar");
      const r = av && av.getBoundingClientRect();
      cx = r && r.width ? r.left + r.width / 2 : w / 2;
      cy = r && r.width ? r.top + r.height / 2 : h / 2;
      const n = Math.round(Math.min(560, Math.max(160, (w * h) / 3200)));
      P = Array.from({ length: n }, () => spawn());
    };
    resize();
    addEventListener("resize", resize);
    login.addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; });
    login.addEventListener("pointerleave", () => (ptr.on = false));
    login.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      waves.push({ x: e.clientX, y: e.clientY, r: 0 });
    });

    let last = performance.now();
    const frame = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.67, 2.5);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ptr.m += ((ptr.on ? 1 : 0) - ptr.m) * 0.05;
      ctx.globalCompositeOperation = "lighter";

      for (const wv of waves) wv.r += 9 * dt;
      while (waves.length && waves[0].r > Math.max(w, h)) waves.shift();

      for (const p of P) {
        // central well
        let dx = cx - p.x, dy = cy - p.y, d2 = dx * dx + dy * dy, d = Math.sqrt(d2) || 1;
        let f = (1400 * G) / (d2 + 900);
        let ax = (dx / d) * f, ay = (dy / d) * f;
        // pointer mass
        if (ptr.m > 0.01) {
          const ex = ptr.x - p.x, ey = ptr.y - p.y, e2 = ex * ex + ey * ey, e = Math.sqrt(e2) || 1;
          const g = (700 * ptr.m) / (e2 + 1600);
          ax += (ex / e) * g; ay += (ey / e) * g;
        }
        // click shockwaves push outward
        for (const wv of waves) {
          const sx = p.x - wv.x, sy = p.y - wv.y, sd = Math.hypot(sx, sy) || 1;
          if (Math.abs(sd - wv.r) < 40) { const k = 0.9 * (1 - Math.abs(sd - wv.r) / 40); ax += (sx / sd) * k; ay += (sy / sd) * k; }
        }
        p.vx = (p.vx + ax * dt) * (collapsing ? 0.97 : 0.9995);
        p.vy = (p.vy + ay * dt) * (collapsing ? 0.97 : 0.9995);
        const ox = p.x, oy = p.y;
        p.x += p.vx * dt; p.y += p.vy * dt;

        if (!collapsing && (d < 14 || d > Math.hypot(w, h))) { spawn(p); continue; }

        const sp = Math.min(Math.hypot(p.vx, p.vy), 8);
        const alpha = Math.min(0.95, p.a * (0.35 + sp / 3.5));
        ctx.strokeStyle = `rgba(${p.c},${alpha})`;
        ctx.lineWidth = p.s;
        ctx.beginPath();
        ctx.moveTo(ox - p.vx * 5 * dt, oy - p.vy * 5 * dt);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // core glow
      const pulse = 1 + Math.sin(now / 900) * 0.08;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 * pulse * (collapsing ? 1.6 : 1));
      grd.addColorStop(0, "rgba(139,123,255,.20)");
      grd.addColorStop(1, "rgba(139,123,255,0)");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, 200, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(frame);
    };
    if (reduced) { frame(performance.now()); running = false; }
    else requestAnimationFrame(frame);

    return {
      collapse() { collapsing = true; G = 6; },
      stop() { running = false; removeEventListener("resize", resize); }
    };
  }

  function showLogin() {
    login.hidden = false;
    const gravity = startGravity();
    const tick = () => {
      if (login.hidden) return;
      $("#login-time").textContent = fmtTime();
      const ds = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      $("#login-date").textContent = ds.charAt(0).toUpperCase() + ds.slice(1);
      setTimeout(tick, 1000);
    };
    tick();
    const btn = $("#login-btn");
    $$(".login-dots i", btn).forEach((d, i) => d.style.setProperty("--d", (i * 0.09).toFixed(2)));
    let going = false;
    const go = () => {
      if (going) return;
      going = true;
      btn.classList.add("loading");
      gravity.collapse();
      $(".login-label", btn).textContent = "Autenticando…";
      setTimeout(() => {
        $(".login-label", btn).textContent = "Acesso liberado";
        login.classList.add("fade-out");
        setTimeout(() => { login.hidden = true; gravity.stop(); showDesktop(); }, 550);
      }, 750);
    };
    btn.onclick = go;
    const onKey = (e) => { if (e.key === "Enter" || e.key === " ") { document.removeEventListener("keydown", onKey); go(); } };
    setTimeout(() => document.addEventListener("keydown", onKey), 300);
    btn.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------- DESKTOP */
  function showDesktop() {
    store.set("eden.session", "1");
    desktop.hidden = false;

    // icons + dock
    $("#icons").innerHTML = DESKTOP_ICONS.map((id) => `
      <button class="d-icon" data-open="${id}">
        <span class="tile">${icon(APPS[id].icon)}</span>
        <span class="lbl">${esc(APPS[id].title)}</span>
        <span class="sub">${esc(APPS[id].sub)}</span>
      </button>`).join("");
    $("#dock").innerHTML = ORDER.map((id, i) => `
      ${i === 6 ? '<span class="dock-sep"></span>' : ""}
      <button class="dock-btn" data-open="${id}" data-dock="${id}" aria-label="${esc(APPS[id].title)}">
        ${icon(APPS[id].icon)}<span class="tip">${esc(APPS[id].title)}</span>
      </button>`).join("");

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open]");
      if (t) { e.preventDefault(); openApp(t.dataset.open, { fromDock: t.hasAttribute("data-dock") }); }
    });

    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(fitWindows, 80); });

    startClock();
    startWidgets();
    startNeural();
    initPalette();

    const fromHash = location.hash.slice(1);
    if (APPS[fromHash]) openApp(fromHash);
  }

  function startClock() {
    const tick = () => {
      $("#tb-clock").textContent = fmtTime();
      const s = Math.floor((Date.now() - t0) / 1000);
      $("#tb-up").textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
      $("#tb-cpu").textContent = 8 + Math.round(Math.random() * 14) + "%";
    };
    tick();
    setInterval(tick, 1000);
  }

  function startWidgets() {
    $("#w-status").innerHTML = [
      ["projetos", D.projects.length],
      ["automações ativas", D.automations.length],
      ["empresa", D.company.name],
      ["modo", "alta performance"],
      ["latência", "<12ms"]
    ].map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("");

    const feed = $("#w-feed");
    const events = [
      ...D.automations.map((a) => `<b>run</b> ${esc(a.name.toLowerCase().replace(/\s/g, "-"))} · ok`),
      "<b>ia</b> lead classificado · score 0.92",
      "<b>sync</b> crm ↔ whatsapp · ok",
      "<b>data</b> relatório diário gerado",
      "<b>deploy</b> eden.os · build 2.6",
      "<b>vision</b> frame capturado · alerta enviado"
    ];
    let i = 0;
    const push = () => {
      const li = document.createElement("li");
      const ts = new Date().toLocaleTimeString("pt-BR");
      li.innerHTML = `${ts} ${events[i++ % events.length]}`;
      feed.prepend(li);
      while (feed.children.length > 7) feed.lastChild.remove();
    };
    for (let k = 0; k < 4; k++) push();
    setInterval(push, 2600);
  }

  /* neural-network background — lightweight canvas */
  function startNeural() {
    const c = $("#neural"), ctx = c.getContext("2d");
    let w, h, dpr, pts = [];
    const mouse = { x: -999, y: -999 };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor((w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
      }));
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    const R = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < R * R) {
            ctx.strokeStyle = `rgba(139,123,255,${(1 - Math.sqrt(d) / R) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 180) {
          ctx.strokeStyle = `rgba(94,230,200,${(1 - md / 180) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < 180 ? "rgba(94,230,200,.9)" : "rgba(236,238,243,.35)";
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.3, 0, Math.PI * 2); ctx.fill();
      }
      if (!document.hidden) requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !reduced) requestAnimationFrame(draw); });
    reduced ? draw() : requestAnimationFrame(draw);
  }

  /* ------------------------------------------------------ WINDOW MANAGER */
  const wins = new Map();
  let z = 10, cascade = 0;

  function openApp(id, opts = {}) {
    const app = APPS[id];
    if (!app) return;
    closePalette();
    let win = wins.get(id);
    if (win) {
      if (win.hidden) restoreWin(win);
      else if (opts.fromDock && win.classList.contains("focused")) return minimizeWin(id);
      focusWin(win);
      if (opts.project && id === "projects") renderProjects($(".win-body", win), opts.project);
      return win;
    }
    win = document.createElement("section");
    win.className = "win";
    win.dataset.app = id;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", app.title);
    win.innerHTML = `
      <div class="win-bar">
        <div class="win-ctrl">
          <button class="c-close" aria-label="Fechar"></button>
          <button class="c-min" aria-label="Minimizar"></button>
          <button class="c-max" aria-label="Maximizar"></button>
        </div>
        <div class="win-title">${icon(app.icon)}<span>${esc(app.title)}</span><span class="path">${esc(app.path)}</span></div>
      </div>
      <div class="win-body"></div>`;

    const area = $("#windows");
    const k = winScale();
    const W = Math.min((app.w || 780) * k, area.clientWidth - 24);
    const H = Math.min((app.h || 560) * k, area.clientHeight - 96);
    win.style.width = W + "px";
    win.style.height = H + "px";
    const baseX = Math.max(12, (area.clientWidth - W) / 2 - 60);
    const baseY = Math.max(8, (area.clientHeight - H - 76) / 2 - 20);
    win.style.left = Math.min(baseX + (cascade % 5) * 28, Math.max(12, area.clientWidth - W - 12)) + "px";
    win.style.top = Math.min(baseY + (cascade % 5) * 24, Math.max(8, area.clientHeight - H - 84)) + "px";
    cascade++;
    area.appendChild(win);
    wins.set(id, win);

    const body = $(".win-body", win);
    const html = app.render(body, win);
    if (typeof html === "string") body.innerHTML = html;
    if (opts.project && id === "projects") renderProjects(body, opts.project);

    $(".c-close", win).onclick = (e) => { e.stopPropagation(); closeWin(id); };
    $(".c-min", win).onclick = (e) => { e.stopPropagation(); minimizeWin(id); };
    $(".c-max", win).onclick = (e) => { e.stopPropagation(); win.classList.toggle("max"); };
    $(".win-bar", win).ondblclick = (e) => { if (!e.target.closest(".win-ctrl") && !isMobile()) win.classList.toggle("max"); };
    win.addEventListener("pointerdown", () => focusWin(win));
    makeDraggable(win);
    win.addEventListener("animationend", function done(e) {
      if (e.animationName === "winIn") { win.style.animation = "none"; win.removeEventListener("animationend", done); }
    });
    focusWin(win);
    syncDock();
    return win;
  }

  function focusWin(win) {
    $$(".win").forEach((w) => w.classList.remove("focused"));
    win.classList.add("focused");
    win.style.zIndex = ++z;
    const id = win.dataset.app;
    $("#tb-active").textContent = APPS[id].title;
    history.replaceState(null, "", "#" + id);
    if (id === "terminal") setTimeout(() => $("input", win)?.focus({ preventScroll: true }), 30);
  }

  function topVisible() {
    return [...wins.values()].filter((w) => !w.hidden).sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
  }

  function afterHide() {
    const next = topVisible();
    if (next) focusWin(next);
    else { $("#tb-active").textContent = "Desktop"; history.replaceState(null, "", location.pathname + location.search); }
    syncDock();
  }

  function closeWin(id) {
    const win = wins.get(id);
    if (!win) return;
    win.classList.add("closing");
    wins.delete(id);
    setTimeout(() => { win.remove(); afterHide(); }, reduced ? 0 : 180);
  }

  /* transform that sends a window into its dock icon (and back) */
  function dockTransform(win) {
    const btn = $(`.dock-btn[data-dock="${win.dataset.app}"]`);
    const wr = win.getBoundingClientRect();
    if (!btn || !wr.width) return "scale(.5)";
    const br = btn.getBoundingClientRect();
    const dx = br.left + br.width / 2 - (wr.left + wr.width / 2);
    const dy = br.top + br.height / 2 - (wr.top + wr.height / 2);
    const s = Math.max(br.width / wr.width, 0.04);
    return `translate(${dx}px, ${dy}px) scale(${s}, ${Math.max(br.height / wr.height, 0.04)})`;
  }
  function winScale() { return innerWidth >= 2200 && innerHeight >= 1200 ? 1.35 : innerWidth >= 1700 && innerHeight >= 950 ? 1.15 : 1; }
  const MIN_EASE = "cubic-bezier(.4, 0, .2, 1)";

  function minimizeWin(id) {
    const win = wins.get(id);
    if (!win || win.hidden || win.dataset.anim) return;
    win.dataset.anim = "1";
    win.classList.remove("focused");
    const finish = () => { win.hidden = true; delete win.dataset.anim; afterHide(); };
    if (reduced || !win.animate) return finish();
    win.animate(
      [{ transform: "none", opacity: 1, filter: "blur(0)" }, { transform: dockTransform(win), opacity: 0, filter: "blur(2px)" }],
      { duration: 420, easing: MIN_EASE }
    ).onfinish = finish;
    win.style.pointerEvents = "none";
    setTimeout(() => (win.style.pointerEvents = ""), 430);
  }

  function restoreWin(win) {
    win.hidden = false;
    win.style.animation = "none";
    if (reduced || !win.animate) return;
    win.dataset.anim = "1";
    win.animate(
      [{ transform: dockTransform(win), opacity: 0, filter: "blur(2px)" }, { transform: "none", opacity: 1, filter: "blur(0)" }],
      { duration: 420, easing: MIN_EASE }
    ).onfinish = () => delete win.dataset.anim;
  }

  /* keep windows inside the viewport on resize / rotation */
  function fitWindows() {
    const area = $("#windows");
    if (!area || isMobile()) return;
    const aw = area.clientWidth, ah = area.clientHeight;
    for (const win of wins.values()) {
      const app = APPS[win.dataset.app];
      const k = winScale();
      const w = Math.min((app.w || 780) * k, aw - 24), h = Math.min((app.h || 560) * k, ah - 96);
      if (win.offsetWidth > aw - 24 || parseFloat(win.style.width) < w) win.style.width = w + "px";
      if (win.offsetHeight > ah - 96 || parseFloat(win.style.height) < h) win.style.height = h + "px";
      win.style.left = Math.min(Math.max(win.offsetLeft, 8), Math.max(8, aw - win.offsetWidth - 8)) + "px";
      win.style.top = Math.min(Math.max(win.offsetTop, 8), Math.max(8, ah - win.offsetHeight - 84)) + "px";
    }
  }

  function syncDock() {
    $$(".dock-btn").forEach((b) => b.classList.toggle("running", wins.has(b.dataset.dock)));
    desktop.classList.toggle("has-win", [...wins.values()].some((w) => !w.hidden));
  }

  function makeDraggable(win) {
    const bar = $(".win-bar", win);
    let sx, sy, ox, oy, dragging = false;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".win-ctrl") || isMobile() || win.classList.contains("max")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY; ox = win.offsetLeft; oy = win.offsetTop;
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const area = $("#windows");
      const nx = Math.min(Math.max(ox + e.clientX - sx, -win.offsetWidth + 120), area.clientWidth - 120);
      const ny = Math.min(Math.max(oy + e.clientY - sy, 0), area.clientHeight - 60);
      win.style.left = nx + "px";
      win.style.top = ny + "px";
    });
    const end = () => (dragging = false);
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
  }

  /* ------------------------------------------------------------ TERMINAL */
  function initTerminal(body) {
    body.innerHTML = `<div class="term-out"></div><div class="term-line"><span class="term-prompt">guest@eden.os:~$</span><input type="text" aria-label="Comando" autocomplete="off" spellcheck="false" autocapitalize="off"></div>`;
    const out = $(".term-out", body), input = $("input", body);
    const hist = []; let hi = 0;
    const print = (html, cls = "") => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); };
    const appIds = Object.keys(APPS).join(" | ");

    const cmds = {
      help: () => print(
        `<span class="c-ac">comandos disponíveis</span>
  whoami            quem é o Éden
  ls                lista os módulos do sistema
  open &lt;app&gt;        abre um app (${appIds})
  projects          lista projetos pessoais
  automations       lista pipelines ativos
  uplead            sobre a empresa
  stack             tecnologias
  contact           canais de contato
  neofetch          info do sistema
  ask &lt;pergunta&gt;    pergunta ao Eden.AI
  clear             limpa a tela`),
      whoami: () => print(`<span class="c-a2">${esc(D.profile.name)}</span> — ${esc(D.profile.role)}\n${esc(D.profile.bio[0])}`),
      ls: () => print(ORDER.map((id) => `<span class="c-ac">${id}/</span>`).join("  ")),
      open: (a) => { if (APPS[a]) { openApp(a); print(`<span class="c-ok">✓</span> abrindo ${a}…`); } else print(`app não encontrado: ${esc(a || "")}. tente: ${appIds}`, "c-er"); },
      projects: () => D.projects.forEach((p) => print(`<span class="c-ac">${esc(p.id.padEnd(14))}</span> ${esc(p.name)} <span class="c-mu">· ${esc(p.stack.join(", "))}</span>`)),
      automations: () => D.automations.forEach((a) => print(`<span class="c-ok">●</span> ${esc(a.name.padEnd(18))} <span class="c-mu">${esc(a.flow.join(" → "))}</span>`)),
      uplead: () => print(`<span class="c-ac">${esc(D.company.name)}</span> — ${esc(D.company.tagline)}\n${esc(D.company.description)}`),
      stack: () => D.stack.forEach((g) => print(`<span class="c-ac">${esc(g.group.padEnd(18))}</span> ${esc(g.items.join(" · "))}`)),
      contact: () => { print(`email     ${esc(D.profile.email)}`); D.profile.links.forEach((l) => print(`${esc(l.label.toLowerCase().padEnd(9))} <a class="c-a2" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url)}</a>`)); },
      neofetch: () => {
        const s = Math.floor((Date.now() - t0) / 1000);
        print(
`<span class="c-ac"> ______  </span>   <span class="c-a2">guest</span>@<span class="c-a2">eden.os</span>
<span class="c-ac"> |  ____|</span>   ─────────────────
<span class="c-ac"> | |__   </span>   <span class="c-ac">OS</span>       Eden.OS 2.6
<span class="c-ac"> |  __|  </span>   <span class="c-ac">Host</span>     ${esc(D.profile.name)}
<span class="c-ac"> | |____ </span>   <span class="c-ac">Kernel</span>   ia + automação + dados
<span class="c-ac"> |______|</span>   <span class="c-ac">Uptime</span>   ${s}s
<span class="c-ac">         </span>   <span class="c-ac">Empresa</span>  ${esc(D.company.name)}
<span class="c-ac">         </span>   <span class="c-ac">Projetos</span> ${D.projects.length} · <span class="c-ac">Pipelines</span> ${D.automations.length}`);
      },
      ask: (...q) => print(`<span class="c-a2">eden.ai ›</span> ${esc(answer(q.join(" ")).text)}`),
      clear: () => (out.innerHTML = ""),
      sudo: () => print("permissão negada. mas dá pra contratar: <span class='c-ac'>open contact</span> 😉"),
      hire: () => openApp("contact"),
      exit: () => closeWin("terminal")
    };

    print(`<span class="c-mu">Eden.OS shell 2.6 — digite</span> <span class="c-ac">help</span> <span class="c-mu">para começar.</span>`);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const raw = input.value.trim();
        input.value = "";
        print(`<span class="term-prompt">guest@eden.os:~$</span> ${esc(raw)}`);
        if (!raw) return;
        hist.push(raw); hi = hist.length;
        const [c, ...args] = raw.split(/\s+/);
        const fn = cmds[c.toLowerCase()];
        if (fn) fn(...args);
        else print(`comando não encontrado: ${esc(c)} — digite <span class="c-ac">help</span>`, "c-er");
        body.scrollTop = body.scrollHeight;
      } else if (e.key === "ArrowUp") { if (hi > 0) input.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { input.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ""); e.preventDefault(); }
      else if (e.key === "Tab") {
        e.preventDefault();
        const v = input.value, m = Object.keys(cmds).filter((k) => k.startsWith(v));
        const parts = v.split(" ");
        if (parts[0] === "open" && parts.length === 2) { const a = Object.keys(APPS).filter((k) => k.startsWith(parts[1])); if (a.length === 1) input.value = "open " + a[0]; }
        else if (m.length === 1) input.value = m[0] + " ";
      }
    });
    body.addEventListener("click", () => { if (!getSelection().toString()) input.focus(); });
  }

  /* ---------------------------------------------------- EDEN.AI (local) */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const INTENTS = [
    { k: ["up lead", "uplead", "empresa", "negocio", "lead"], app: "uplead", text: () => `${D.company.name}: ${D.company.tagline} ${D.company.description}` },
    { k: ["automac", "automat", "pipeline", "fluxo", "workflow", "n8n", "bot"], app: "automations", text: () => `Tenho ${D.automations.length} pipelines em destaque: ${D.automations.map((a) => a.name).join(", ")}. Abrindo o módulo de automações.` },
    { k: ["projeto", "portfolio", "lab", "esp32", "vision", "opencv"], app: "projects", text: () => `Projetos pessoais: ${D.projects.map((p) => p.name).join(", ")}. Abrindo o laboratório.` },
    { k: ["trajet", "carreira", "experiencia", "trabalh", "curriculo", "cv"], app: "career", text: () => `Trajetória: ${D.career.map((c) => `${c.title} (${c.org})`).join(" → ")}.` },
    { k: ["stack", "skill", "tecnolog", "linguag", "python", "java", "sabe"], app: "stack", text: () => `Principais tecnologias: ${D.stack.flatMap((g) => g.items).slice(0, 10).join(", ")}.` },
    { k: ["contato", "email", "falar", "contratar", "hire", "linkedin", "whats"], app: "contact", text: () => `Você pode falar com o Éden por e-mail ou LinkedIn. Abrindo os canais de contato.` },
    { k: ["terminal", "shell", "comando", "cli"], app: "terminal", text: () => `Abrindo o terminal. Digite "help" para ver os comandos.` },
    { k: ["quem", "sobre", "eden", "perfil", "voce", "idade", "estuda", "facul", "pucpr"], app: "about", text: () => `${D.profile.name} — ${D.profile.role}. ${D.profile.bio[0]}` },
    { k: ["ia", "inteligencia", "ai", "gpt", "llm", "agente"], app: "automations", text: () => `IA é o núcleo do trabalho do Éden: agentes que qualificam leads, resumem dados e tomam decisões dentro de automações.` }
  ];
  function answer(q) {
    const n = norm(q);
    let best = null, score = 0;
    for (const it of INTENTS) {
      const s = it.k.reduce((acc, k) => acc + (new RegExp(`\\b${k}`).test(n) ? k.length : 0), 0);
      if (s > score) { score = s; best = it; }
    }
    return best ? { text: best.text(), app: best.app } : { text: `Ainda não sei responder isso. Tente perguntar sobre projetos, Up Lead, automações, trajetória ou contato.`, app: null };
  }

  let palSel = 0, palItems = [];
  function initPalette() {
    const pal = $("#palette"), q = $("#palette-q");
    $("#tb-search").onclick = openPalette;
    pal.addEventListener("mousedown", (e) => { if (e.target === pal) closePalette(); });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); }
      else if (e.key === "Escape" && !pal.hidden) closePalette();
      else if (e.key === "/" && pal.hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openPalette(); }
    });
    q.addEventListener("input", () => { $("#palette-answer").hidden = true; renderPalette(q.value); });
    q.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { palSel = Math.min(palSel + 1, palItems.length - 1); paintSel(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { palSel = Math.max(palSel - 1, 0); paintSel(); e.preventDefault(); }
      else if (e.key === "Enter") { e.preventDefault(); palItems[palSel]?.run(); }
    });
  }
  function openPalette() {
    const pal = $("#palette"), q = $("#palette-q");
    pal.hidden = false; q.value = ""; $("#palette-answer").hidden = true;
    renderPalette("");
    setTimeout(() => q.focus(), 10);
  }
  function closePalette() { const p = $("#palette"); if (p) p.hidden = true; }

  function renderPalette(query) {
    const n = norm(query.trim());
    const apps = ORDER.filter((id) => !n || norm(APPS[id].title + " " + id + " " + APPS[id].sub).includes(n))
      .map((id) => ({ group: "Apps", label: APPS[id].title, hint: APPS[id].path, icon: APPS[id].icon, run: () => openApp(id) }));
    const projs = D.projects.filter((p) => n && norm(p.name + " " + p.stack.join(" ") + " " + p.kind).includes(n))
      .map((p) => ({ group: "Projetos", label: p.name, hint: p.kind, icon: "folder", run: () => openApp("projects", { project: p.id }) }));
    const ask = n ? [{ group: "Eden.AI", label: `Perguntar: “${query.trim()}”`, hint: "↵", icon: "spark", run: () => askAI(query) }] : [
      { group: "Sugestões", label: "O que é a Up Lead?", hint: "eden.ai", icon: "spark", run: () => askAI("O que é a Up Lead?") },
      { group: "Sugestões", label: "Quais automações você constrói?", hint: "eden.ai", icon: "spark", run: () => askAI("Quais automações você constrói?") }
    ];
    palItems = n && !apps.length && !projs.length ? ask : n ? [...ask, ...projs, ...apps] : [...ask, ...apps];
    palSel = 0;
    let last = "";
    $("#palette-list").innerHTML = palItems.map((it, i) => {
      const g = it.group !== last ? `<li class="palette-group">${esc(it.group)}</li>` : "";
      last = it.group;
      return `${g}<li><button data-i="${i}">${icon(it.icon)}<span>${esc(it.label)}</span><small>${esc(it.hint)}</small></button></li>`;
    }).join("");
    $$("#palette-list [data-i]").forEach((b) => {
      b.onclick = () => palItems[+b.dataset.i].run();
      b.onmousemove = () => { palSel = +b.dataset.i; paintSel(); };
    });
    paintSel();
  }
  function paintSel() { $$("#palette-list [data-i]").forEach((b) => b.classList.toggle("sel", +b.dataset.i === palSel)); }

  function askAI(q) {
    const res = answer(q), box = $("#palette-answer");
    box.hidden = false;
    box.innerHTML = `${icon("spark")}<div><span class="typing"></span></div>`;
    const span = $(".typing", box);
    let i = 0;
    const type = () => {
      if (box.hidden) return;
      span.textContent = res.text.slice(0, i);
      i += 3;
      if (i <= res.text.length + 2) setTimeout(type, 12);
      else {
        span.classList.remove("typing");
        if (res.app) {
          palItems = [{ group: "Ação", label: `Abrir ${APPS[res.app].title}`, hint: "↵", icon: APPS[res.app].icon, run: () => openApp(res.app) }];
          palSel = 0;
          $("#palette-list").innerHTML = `<li class="palette-group">Ação sugerida</li><li><button data-i="0" class="sel">${icon(APPS[res.app].icon)}<span>Abrir ${esc(APPS[res.app].title)}</span><small>↵</small></button></li>`;
          $("#palette-list [data-i]").onclick = () => openApp(res.app);
        }
      }
    };
    type();
  }

  /* --------------------------------------------------------------- START */
  const deepLink = APPS[location.hash.slice(1)];
  if (store.get("eden.session") || deepLink) { boot.hidden = true; showDesktop(); }
  else runBoot();
})();
