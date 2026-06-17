/*  ═══════════════════════════════════════════
     SCRIPTS
═══════════════════════════════════════════ */

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const dot = cursor.querySelector('.cursor-dot');
const ring = cursor.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .activity-card, .project-item, .livestock-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
    ring.style.borderColor = 'var(--green)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = '';
  });
});

/* ── LOADER ── */
const loaderBar = document.getElementById('loaderBar');
const loaderNum = document.getElementById('loaderNum');
const loaderLogo = document.querySelector('.loader-logo');
const loaderLogoImg = document.querySelector('.loader-logo-img');
let progress = 0;
gsap.to(loaderLogo, { opacity: 1, y: 0, from: { y: 20 }, duration: 0.8, ease: 'power3.out', delay: 0.4 });
if (loaderLogoImg) gsap.to(loaderLogoImg, { opacity: 1, y: 0, from: { y: 20 }, duration: 0.8, ease: 'power3.out', delay: 0.2 });
const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) { progress = 100; clearInterval(loadInterval); finishLoad(); }
  loaderBar.style.width = progress + '%';
  loaderNum.textContent = Math.round(progress) + '%';
}, 100);
function finishLoad() {
  setTimeout(() => {
    gsap.to('#loader', {
      yPercent: -100, duration: 1, ease: 'power3.inOut',
      onComplete: () => { document.getElementById('loader').style.display = 'none'; initPage(); }
    });
  }, 300);
}

function initPage() {
  /* Hero entrance */
  gsap.to('#heroEyebrow', { opacity: 1, y: 0, from: { y: 20 }, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.from('#heroTitle .line', {
    yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.3
  });
  gsap.from('#heroSub', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.7 });
  gsap.from('#heroActions', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.9 });

  /* Birds */
  ['#bird1','#bird2','#bird3'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (el) el.style.opacity = '0.6';
  });

  /* Floating leaves */
  function animLeaf(id, delay) {
    const el = document.getElementById(id);
    if (!el) return;
    function loop() {
      gsap.fromTo(el,
        { opacity: 0, x: -20, y: 0, rotation: 0 },
        { opacity: 0.7, x: 40, y: -30, rotation: 25, duration: 4 + Math.random() * 3,
          ease: 'power1.inOut',
          onComplete: () => { gsap.to(el, { opacity: 0, duration: 0.5, onComplete: () => { setTimeout(loop, 2000 + Math.random() * 3000); } }); }
        }
      );
    }
    setTimeout(loop, delay);
  }
  animLeaf('leaf1', 1000); animLeaf('leaf2', 3000); animLeaf('leaf3', 5000);

  /* Progress bar */
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progress-bar').style.width = (st / dh * 100) + '%';
  });

  /* Nav scroll */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  /* GSAP ScrollTrigger reveals */
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Counters */
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to({ val: 0 }, {
        val: target, duration: 2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); }
      })
    });
  });

  /* Horizontal scroll for activities */
  const track = document.getElementById('hScrollTrack');
  if (track) {
    const maxScroll = track.scrollWidth - window.innerWidth + 112;
    gsap.to(track, {
      x: -maxScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: '#activities',
        start: 'top top',
        end: () => '+=' + maxScroll,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });
  }

  /* Parallax hero bg */
  gsap.to('.sun-glow', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.field-rows', {
    y: 60, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* About image parallax */
  gsap.to('#aboutImg', {
    y: -40, ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true }
  });
}

/* ── PARTICLES ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.4 - 0.1,
    o: Math.random() * 0.5 + 0.2,
    color: Math.random() > 0.5 ? '#7CC242' : '#A7E77A'
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.o;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── FORM SUBMIT ── */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = 'Message envoyé ✓';
  btn.style.background = 'var(--green-d)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = 'Envoyer le message <span>→</span>';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}

/* ── TILT EFFECT on activity cards ── */
document.querySelectorAll('.activity-card, .agro-card, .project-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ── AGRO-INDUSTRY CAROUSEL ── */
(function initAgroCarousel() {
  const track = document.getElementById('agroCarouselTrack');
  const prevBtn = document.getElementById('agroPrevBtn');
  const nextBtn = document.getElementById('agroNextBtn');
  const dotsContainer = document.getElementById('agroDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
  
  const cards = track.querySelectorAll('.agro-card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let cardWidth = 380 + 24; // card width + gap
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  
  // Responsive card width
  function updateCardWidth() {
    if (window.innerWidth <= 500) {
      cardWidth = Math.min(320, window.innerWidth - 80);
    } else if (window.innerWidth <= 900) {
      cardWidth = Math.min(380, window.innerWidth - 80);
    } else {
      cardWidth = 404; // 380 + 24 gap
    }
  }
  updateCardWidth();
  window.addEventListener('resize', updateCardWidth);
  
  // Create dots
  const visibleCount = window.innerWidth <= 500 ? 1 : (window.innerWidth <= 900 ? 2 : 3);
  const totalDots = Math.max(1, totalCards - visibleCount + 1);
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'agro-carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.agro-carousel-dot');
  
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalCards - visibleCount;
  }
  
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - visibleCount));
    currentTranslate = -currentIndex * cardWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateButtons();
    updateDots();
  }
  
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // Drag support
  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].pageX;
  }, { passive: true });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const currentX = e.pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const currentX = e.touches[0].pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }, { passive: true });
  
  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });
  
  // Initialize
  goToSlide(0);
})();

/* ── SUBSIDIARIES CAROUSEL ── */
(function initSubsidiariesCarousel() {
  const track = document.getElementById('subsidiariesTrack');
  if (!track) return;
  
  const prevBtn = document.getElementById('subsidiariesPrevBtn');
  const nextBtn = document.getElementById('subsidiariesNextBtn');
  const dotsContainer = document.getElementById('subsidiariesDots');
  
  const cards = track.querySelectorAll('.subsidiary-card');
  const totalCards = cards.length;
  
  if (totalCards === 0) return;
  
  let currentIndex = 0;
  let cardWidth = 320 + 24; // card width + gap
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  
  // Responsive card width
  function updateCardWidth() {
    if (window.innerWidth <= 500) {
      cardWidth = 280 + 16;
    } else {
      cardWidth = 320 + 24;
    }
  }
  updateCardWidth();
  window.addEventListener('resize', updateCardWidth);
  
  // Create dots
  const totalDots = totalCards;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'subsidiaries-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.subsidiaries-dot');
  
  function updateButtons() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= totalCards - 1;
  }
  
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    currentTranslate = -currentIndex * cardWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateButtons();
    updateDots();
  }
  
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // Drag support
  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].pageX;
  }, { passive: true });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const currentX = e.pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const currentX = e.touches[0].pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }, { passive: true });
  
  // Initialize
  goToSlide(0);
})();

/* ── PROJECTS CAROUSEL ── */
(function initProjectsCarousel() {
  const track = document.getElementById('projectsCarouselTrack');
  const prevBtn = document.getElementById('projectsPrevBtn');
  const nextBtn = document.getElementById('projectsNextBtn');
  const dotsContainer = document.getElementById('projectsDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
  
  const cards = track.querySelectorAll('.projects-carousel-card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let cardWidth = 300 + 24; // card width + gap
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  
  // Responsive card width
  function updateCardWidth() {
    if (window.innerWidth <= 500) {
      cardWidth = Math.min(280, window.innerWidth - 80) + 24;
    } else {
      cardWidth = 324; // 300 + 24 gap
    }
  }
  updateCardWidth();
  window.addEventListener('resize', updateCardWidth);
  
  // Create dots
  const totalDots = totalCards;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'projects-carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.projects-carousel-dot');
  
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalCards - 1;
  }
  
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    currentTranslate = -currentIndex * cardWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateButtons();
    updateDots();
  }
  
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // Drag support
  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].pageX;
  }, { passive: true });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -60) goToSlide(currentIndex + 1);
    else if (movedBy > 60) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
    prevTranslate = currentTranslate;
  });
  
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const currentX = e.pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const currentX = e.touches[0].pageX;
    currentTranslate = prevTranslate + currentX - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }, { passive: true });
  
  // Initialize
  goToSlide(0);
})();
