// enhancements.js — small visual/interaction improvements
(function () {
  "use strict";

  // Respect reduced motion preference
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Orb parallax (mouse-based) — gentle movement
  const orbs = [...document.querySelectorAll(".orb")];
  let lastMouse = { x: 0, y: 0 };
  function onMouseMove(e) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const nx = (e.clientX / w) * 2 - 1;
    const ny = (e.clientY / h) * 2 - 1;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 10; // different intensity
      const tx = nx * depth;
      const ty = ny * depth;
      orb.style.transform = `translate(${tx}px, ${ty}px)`;
    });
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }
  if (!prefersReduced) {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
  }

  // Hero image tilt
  const heroCard = document.querySelector(".hero-image-wrapper");
  if (heroCard && !prefersReduced) {
    heroCard.addEventListener("mousemove", (e) => {
      const rect = heroCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * 6; // rotate X
      const ry = (px - 0.5) * -10; // rotate Y
      heroCard.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform = "";
    });
  }

  const interactiveCards = document.querySelectorAll(
    ".feature-card, .step-card, .integration-card, .testimonial-card, .faq-item",
  );
  if (interactiveCards.length && !prefersReduced) {
    interactiveCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * 3;
        const ry = (px - 0.5) * -3;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Count-up stats when visible
  const counters = [...document.querySelectorAll(".stat-number")];
  const numberObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          const el = ent.target;
          if (!el.dataset.animated) {
            animateCount(el);
            el.dataset.animated = "1";
          }
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => numberObserver.observe(c));

  function animateCount(el) {
    const text = el.textContent.trim();
    const numeric = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
    const isRatio = /\d+\/?\d*/.test(text) && text.includes("/");
    const end = numeric;
    const start = Math.max(0, Math.floor(end * 0.2));
    const duration = 1200;
    const startTime = performance.now();
    requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const value = Math.round(start + (end - start) * easeOutCubic(t));
      el.textContent = text.replace(String(numeric), String(value));
      if (t < 1) requestAnimationFrame(tick);
    });
  }
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Auto-highlight gallery items in loop
  const gallery = document.querySelectorAll(".gallery-item");
  if (gallery.length && !prefersReduced) {
    let gi = 0;
    setInterval(() => {
      gallery.forEach((g, i) => g.classList.remove("gallery-highlight"));
      gallery[gi].classList.add("gallery-highlight");
      // ensure highlight has visual style via box-shadow
      gi = (gi + 1) % gallery.length;
    }, 3500);
  }

  // Add a small CSS tweak for highlight (inject style)
  const s = document.createElement("style");
  s.textContent = `
    .gallery-item.gallery-highlight{
      transform: scale(1.04) translateY(-6px);
      box-shadow: 0 30px 60px rgba(14,90,107,0.12);
      z-index:3;
    }
  `;
  document.head.appendChild(s);

  // Confetti: small canvas-based bursts when success modal opens
  function burstConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 999999;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const pieces = [];
    const colors = ["#f5c842", "#22a7c9", "#e0483a", "#14b8a6", "#0e5a6b"];
    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height / 2 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 6 + 2),
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        drag: 0.99,
      });
    }
    let running = true;
    const start = performance.now();
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.vy += 0.18; // gravity
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      if (performance.now() - start < 2200) requestAnimationFrame(frame);
      else {
        running = false;
        window.removeEventListener("resize", resize);
        document.body.removeChild(canvas);
      }
    }
    requestAnimationFrame(frame);
  }

  // Hook into success modal opening
  const origOpen = window.openSuccessModal;
  if (typeof origOpen === "function") {
    window.openSuccessModal = function () {
      try {
        playSound("success");
      } catch (e) {}
      origOpen();
      setTimeout(() => burstConfetti(), 180);
    };
  }

  // Accessibility: focus trap for modals (basic)
  function trapFocus(modalSelector) {
    const modal = document.querySelector(modalSelector);
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      "a[href], button:not([disabled]), textarea, input, select",
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
  trapFocus("#contactModal");
  trapFocus("#successModal");

  // Small enhancement: highlight nav link on scroll
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((a) =>
      document.getElementById((a.getAttribute("href") || "#").slice(1)),
    )
    .filter(Boolean);
  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active-link"));
            const id = en.target.id;
            const link = navLinks.find(
              (l) => l.getAttribute("href") === `#${id}`,
            );
            if (link) link.classList.add("active-link");
          }
        });
      },
      { threshold: 0.4 },
    );
    sections.forEach((s) => navObserver.observe(s));
    const style = document.createElement("style");
    style.textContent =
      ".nav-link.active-link{ color: var(--ocean-bright); font-weight:800; }";
    document.head.appendChild(style);
  }
})();
