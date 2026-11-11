/**
 * Breaking Brats | BootstrapMade Instant adaptation
 * Maintains navigation, dynamic release cards, and CTA analytics.
 *
 * CONFIGURE HERE WHEN READY:
 *  - PREMIUM_URL: public channel's paid account or membership landing page
 *  - RELEASES: only actual, published previews and release URLs
 *
 * The Formspark talent form submits through the page-scoped handler in index.html.
 * All images are flat assets/img/*.png, no nested image folders.
 */
(() => {
  'use strict';

  const PREMIUM_URL = '';
  const RELEASES = [
    // Uncomment only when a *real* preview or full release is published:
    // {
    //   title: 'Release title',
    //   label: 'New release',
    //   description: 'A short description of this actual scene.',
    //   image: 'assets/img/bb-release-001.png',
    //   previewUrl: 'https://example.com/real-free-preview',
    //   fullUrl: 'https://example.com/real-full-release'
    // }
  ];

  const body = document.body;
  const header = document.querySelector('#header');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = [...document.querySelectorAll('#navmenu-links a')];
  const scrollTop = document.querySelector('#scroll-top');
  const yearEl = document.querySelector('#copyright-year');

  const validLink = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'https:' ? parsed.href : '';
    } catch {
      return '';
    }
  };

  const track = (label) => {
    if (typeof window.gtag === 'function' && label) {
      window.gtag('event', 'cta_click', { cta_name: label });
    }
  };

  function setScrolled() {
    if (header) body.classList.toggle('scrolled', window.scrollY > 100);
    if (scrollTop) scrollTop.classList.toggle('active', window.scrollY > 100);
  }

  function setMenuOpen(isOpen) {
    body.classList.toggle('mobile-nav-active', isOpen);
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = isOpen ? 'bi bi-x' : 'bi bi-list';
    }
  }

  function updateScrollspy() {
    const position = window.scrollY + 185;
    let activeId = '';
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section && position >= section.offsetTop) activeId = link.hash;
    });
    navLinks.forEach((link) => {
      const isActive = link.hash === activeId;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function cardAction(label, url, kind, index) {
    const a = document.createElement('a');
    a.className = `bb-release-link ${kind}`;
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.track = `${kind}_release_${index + 1}`;
    a.textContent = label;
    return a;
  }

  function appendReleaseCards() {
    const grid = document.querySelector('#release-grid');
    const emptyState = document.querySelector('#releases-empty');
    if (!grid) return;
    grid.replaceChildren();

    const published = RELEASES.filter((r) => r && (validLink(r.previewUrl) || validLink(r.fullUrl)));
    if (!published.length) {
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;

    published.forEach((release, index) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6';
      const article = document.createElement('article');
      article.className = 'bb-release-card';

      const media = document.createElement('div');
      media.className = 'bb-release-media';
      if (typeof release.image === 'string' && /^assets\/img\/[a-z0-9_.-]+\.(?:png|webp|jpe?g)$/i.test(release.image)) {
        const img = document.createElement('img');
        img.src = release.image;
        img.alt = release.title ? `Promotional image: ${release.title}` : 'Breaking Brats promotional artwork';
        img.loading = 'lazy';
        media.appendChild(img);
      }
      const pill = document.createElement('span');
      pill.className = 'bb-release-play';
      pill.textContent = 'NEW DROP';
      media.appendChild(pill);

      const info = document.createElement('div');
      info.className = 'bb-release-card-body';
      const tag = document.createElement('span');
      tag.className = 'bb-card-tag';
      tag.textContent = release.label || 'OFFICIAL RELEASE';
      const h3 = document.createElement('h3');
      h3.textContent = release.title || `Release ${index + 1}`;
      const p = document.createElement('p');
      p.textContent = release.description || 'Watch the preview and find the complete release through official links.';
      const actions = document.createElement('div');
      actions.className = 'bb-release-actions';
      const previewUrl = validLink(release.previewUrl);
      const fullUrl = validLink(release.fullUrl);
      if (previewUrl) actions.appendChild(cardAction('Watch Preview', previewUrl, 'preview', index));
      if (fullUrl) actions.appendChild(cardAction('Full Release', fullUrl, 'secondary', index));
      info.append(tag, h3, p, actions);
      article.append(media, info);
      col.appendChild(article);
      grid.appendChild(col);
    });
  }

  function configurePremiumCTA() {
    const button = document.querySelector('#premium-cta');
    const url = validLink(PREMIUM_URL);
    if (!button || !url) return;
    button.href = url;
    button.dataset.track = 'premium_account';
    button.innerHTML = 'Unlock Full Access <i class="bi bi-arrow-up-right" aria-hidden="true"></i>';
  }

  // Delegation catches both static links and release cards created later.
  document.addEventListener('click', (event) => {
    const tracked = event.target.closest('[data-track]');
    if (tracked) track(tracked.dataset.track);
  });

  navToggle?.addEventListener('click', () => {
    setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  scrollTop?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let scheduled = false;
  document.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      setScrolled();
      updateScrollspy();
      scheduled = false;
    });
  }, { passive: true });

  window.addEventListener('load', () => {
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    setScrolled();
    updateScrollspy();
    appendReleaseCards();
    configurePremiumCTA();
    if (window.AOS && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    } else {
      // Avoid invisible content if AOS is missing or motion is reduced.
      document.querySelectorAll('[data-aos]').forEach((el) => el.removeAttribute('data-aos'));
    }
  });
})();
