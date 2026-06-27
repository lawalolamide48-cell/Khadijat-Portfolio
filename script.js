// ── Year
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

// ── Reduced motion
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── Mobile nav
const menuBtn = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  });
}

// ── Carousel
const track = document.getElementById("carousel-track");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
const dots = document.querySelectorAll(".dot");

if (track && prevBtn && nextBtn && dots.length) {
  let current = 0;
  const total = dots.length;
  let startX = 0;
  let isDragging = false;

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  // Touch / swipe support
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    isDragging = false;
  }, { passive: true });

  // Mouse drag support for desktop
  track.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.cursor = "grabbing";
  });
  track.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    isDragging = false;
    track.style.cursor = "";
  });
  track.addEventListener("mouseleave", () => {
    isDragging = false;
    track.style.cursor = "";
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // Initialize
  goTo(0);
}
