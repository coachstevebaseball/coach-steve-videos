/* Coach Steve Baseball — Film Room */
(function () {
  'use strict';

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const SUN =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const MOON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  let theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const applyTheme = () => {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? SUN : MOON;
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    }
  };
  applyTheme();
  if (toggle)
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
    });

  /* ---------------- Helpers ---------------- */
  const page = document.body.dataset.page;
  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const thumbEl = (id, alt) => {
    const img = document.createElement('img');
    img.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 640;
    img.height = 360;
    img.addEventListener('error', function fallback() {
      img.removeEventListener('error', fallback);
      img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    });
    return img;
  };
  const PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg>';

  /* ---------------- Scroll reveal ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
  );
  const watchReveal = (el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', (i % 4) * 70 + 'ms');
    revealObserver.observe(el);
  };
  document.querySelectorAll('[data-reveal]').forEach((el, i) => watchReveal(el, i));

  if (!page) return; // index page stops here

  /* ---------------- Data ---------------- */
  const DATA = page === 'cage' ? CAGE_VIDEOS : GAME_VIDEOS;
  const featuredId = document.body.dataset.featured;
  let visible = DATA.filter((v) => v.id !== featuredId);

  /* ---------------- Grid ---------------- */
  const grid = document.getElementById('video-grid');
  const empty = document.getElementById('empty-state');

  function card(v, i) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-card' + (i === 0 && page === 'cage' ? ' is-feature' : '');
    btn.setAttribute('aria-label', 'Play video: ' + v.title);
    btn.dataset.id = v.id;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.appendChild(thumbEl(v.id, ''));
    if (v.result) {
      const tag = document.createElement('span');
      tag.className = 'result-tag';
      tag.textContent = v.result;
      thumb.appendChild(tag);
    }
    const play = document.createElement('span');
    play.className = 'thumb-play';
    play.innerHTML = PLAY;
    thumb.appendChild(play);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const date = document.createElement('span');
    date.textContent = fmtDate(v.date);
    meta.appendChild(date);
    if (v.players && v.players.length) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      const who = document.createElement('span');
      who.textContent = v.players.join(' · ');
      meta.appendChild(dot);
      meta.appendChild(who);
    }

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = v.title;

    btn.appendChild(thumb);
    btn.appendChild(meta);
    btn.appendChild(title);
    btn.addEventListener('click', () => openLightbox(v.id));
    return btn;
  }

  function renderGrid() {
    grid.innerHTML = '';
    visible.forEach((v, i) => {
      const c = card(v, i);
      watchReveal(c, i);
      grid.appendChild(c);
    });
    if (empty) empty.classList.toggle('is-active', visible.length === 0);
    const count = document.getElementById('visible-count');
    if (count) count.textContent = visible.length;
  }

  /* ---------------- Filters (cage) ---------------- */
  const chipsWrap = document.getElementById('chips');
  if (chipsWrap) {
    const counts = {};
    DATA.forEach((v) => (v.players || []).forEach((p) => (counts[p] = (counts[p] || 0) + 1)));
    const players = Object.keys(counts).sort();
    let active = 'All';

    const mkChip = (label, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('aria-pressed', label === active ? 'true' : 'false');
      b.innerHTML = label + (n != null ? ' <small>' + n + '</small>' : '');
      b.addEventListener('click', () => {
        active = label;
        chipsWrap.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        visible = DATA.filter(
          (v) => v.id !== featuredId && (label === 'All' || (v.players || []).includes(label))
        );
        renderGrid();
      });
      return b;
    };
    chipsWrap.appendChild(mkChip('All', DATA.filter((v) => v.id !== featuredId).length));
    players.forEach((p) => chipsWrap.appendChild(mkChip(p, counts[p])));
  }

  renderGrid();

  /* ---------------- Lightbox ---------------- */
  const lb = document.getElementById('lightbox');
  const lbFrame = lb.querySelector('.lightbox-frame');
  const lbTitle = lb.querySelector('.lightbox-title');
  const lbDesc = lb.querySelector('.lightbox-desc');
  const lbMeta = lb.querySelector('.lightbox-meta');
  const btnClose = lb.querySelector('[data-lb-close]');
  const btnPrev = lb.querySelector('[data-lb-prev]');
  const btnNext = lb.querySelector('[data-lb-next]');
  let currentList = [];
  let currentIdx = -1;
  let lastFocus = null;

  function lightboxList() {
    const feat = DATA.find((v) => v.id === featuredId);
    return feat ? [feat].concat(visible) : visible.slice();
  }

  function show(idx) {
    currentIdx = idx;
    const v = currentList[idx];
    lbFrame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' +
      v.id +
      '?autoplay=1&rel=0&modestbranding=1" title="' +
      v.title.replace(/"/g, '&quot;') +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    lbTitle.textContent = v.title;
    lbDesc.textContent = v.desc || '';
    lbDesc.style.display = v.desc ? '' : 'none';
    let meta = fmtDate(v.date);
    if (v.players && v.players.length) meta += ' &nbsp;·&nbsp; ' + v.players.join(', ');
    lbMeta.innerHTML =
      '<span>' + meta + '</span>' + (v.result ? '<span class="result">' + v.result + '</span>' : '');
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= currentList.length - 1;
  }

  function openLightbox(id) {
    currentList = lightboxList();
    const idx = currentList.findIndex((v) => v.id === id);
    if (idx < 0) return;
    lastFocus = document.activeElement;
    lb.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    show(idx);
    btnClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    lbFrame.innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }

  btnClose.addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-scrim').addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => currentIdx > 0 && show(currentIdx - 1));
  btnNext.addEventListener('click', () => currentIdx < currentList.length - 1 && show(currentIdx + 1));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentIdx > 0) show(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < currentList.length - 1) show(currentIdx + 1);
  });

  const featBtn = document.getElementById('featured-btn');
  if (featBtn) featBtn.addEventListener('click', () => openLightbox(featuredId));
})();
