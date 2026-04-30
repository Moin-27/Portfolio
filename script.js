    // PARTICLE CANVAS
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function getParticleRGB() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? '0,85,204' : '0,242,254';
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.25; this.vy = (Math.random() - 0.5) * 0.25;
        this.r = Math.random() * 1.5 + 0.3; this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${getParticleRGB()},${this.alpha})`; ctx.fill();
      }
    }

    const numParticles = window.innerWidth < 600 ? 50 : 130;
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());

    let mouseX = -999, mouseY = -999;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animate() {
      ctx.clearRect(0, 0, W, H);
      const rgb = getParticleRGB();
      // Draw connections to mouse
      particles.forEach(p => {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(${rgb},${0.3 * (1 - dist / 130)})`; ctx.lineWidth = 0.7; ctx.stroke();
        }
      });
      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${rgb},${0.1 * (1 - d / 100)})`; ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();

    // CUSTOM CURSOR
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let rx = 0, ry = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    });

    function animRing() {
      rx += (cx - rx) * 0.08;
      ry += (cy - ry) * 0.08;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button, .skill-card, .proj-card, .cert-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; ring.style.width = '52px'; ring.style.height = '52px'; });
      el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '36px'; ring.style.height = '36px'; });
    });

    // SQL TYPING ANIMATION
    const sqlText = [
      { text: "SELECT ", class: "sql-keyword" },
      { text: "skills", class: "sql-column" },
      { text: ", ", class: "" },
      { text: "passion\n", class: "sql-column" },
      { text: "FROM ", class: "sql-keyword" },
      { text: "portfolio\n", class: "sql-table" },
      { text: "WHERE ", class: "sql-keyword" },
      { text: "role ", class: "sql-column" },
      { text: "= ", class: "" },
      { text: "'Data Analyst'\n", class: "sql-string" },
      { text: "ORDER BY ", class: "sql-keyword" },
      { text: "impact ", class: "sql-column" },
      { text: "DESC", class: "sql-keyword" },
      { text: ";", class: "" }
    ];

    const sqlCodeEl = document.getElementById('sqlCode');
    if (sqlCodeEl) {
      let currentChunk = 0;
      let currentChar = 0;

      setTimeout(() => {
        function typeSql() {
          if (currentChunk < sqlText.length) {
            let chunk = sqlText[currentChunk];
            if (currentChar === 0) {
              let span = document.createElement('span');
              if (chunk.class) span.className = chunk.class;
              sqlCodeEl.appendChild(span);
            }

            let currentSpan = sqlCodeEl.lastChild;
            currentSpan.textContent += chunk.text[currentChar];
            currentChar++;

            if (currentChar >= chunk.text.length) {
              currentChunk++;
              currentChar = 0;
            }
            setTimeout(typeSql, Math.random() * 40 + 30);
          }
        }
        typeSql();
      }, 1500);
    }

    // SCROLL REVEAL
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));

    // STATS COUNTER
    const counters = document.querySelectorAll('.counter');
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target, target = +el.dataset.target;
          let cur = 0;
          const interval = setInterval(() => {
            cur++;
            el.textContent = cur;
            if (cur >= target) clearInterval(interval);
          }, 80);
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));

    // STATS BAR REVEAL
    const statItems = document.querySelectorAll('.stat-item');
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
        }
      });
    }, { threshold: 0.3 });
    statItems.forEach(s => sObs.observe(s));

    // SKILL BAR FILL
    const fills = document.querySelectorAll('.skill-fill');
    const fObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          fObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => fObs.observe(f));
    /* ── THEME TOGGLE ── */
    (function () {
      const html = document.documentElement;
      const btn = document.getElementById('themeToggle');
      const thumb = document.getElementById('toggleThumb');

      function applyTheme(theme) {
        if (theme === 'light') {
          html.setAttribute('data-theme', 'light');
          thumb.textContent = '☀️';
        } else {
          html.removeAttribute('data-theme');
          thumb.textContent = '🌙';
        }
      }

      // Restore preference
      const saved = localStorage.getItem('portfolio-theme') || 'dark';
      applyTheme(saved);

      btn.addEventListener('click', function () {
        const current = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(current);
        localStorage.setItem('portfolio-theme', current);
      });
    })();
