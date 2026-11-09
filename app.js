(function () {
  'use strict';

  /* ---- Edit these ---- */
  var CONFIG = {
    // Put your CV file next to index.html and set its name here (PDF or DOCX).
    cvFile: 'Md-Masud-Rana-CV.pdf'
  };

  var root = document.documentElement;
  root.classList.add('js');

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---- Toast ---- */
  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3600);
  }

  /* ---- Year ---- */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  var menuBtn = $('#menuBtn'), mobileNav = $('#mobileNav');
  function setMenu(open) {
    if (!menuBtn || !mobileNav) return;
    mobileNav.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(mobileNav.hidden); });
    $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* ---- Reveal on scroll, ruler fills ---- */
  var revealEls = $$('.reveal');
  function reveal(el) { el.classList.add('in'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    setTimeout(function () { revealEls.forEach(reveal); }, 4000);
  } else {
    revealEls.forEach(reveal);
  }

  /* ---- Count-up ---- */
  var counters = $$('[data-count]');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var start = null, dur = 900;
    el.textContent = '0';
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step); else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Active nav link ---- */
  var links = {};
  $$('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        var l = links[e.target.id];
        if (l) l.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) nio.observe(s);
    });
  }

  /* ---- Project cards ---- */
  $$('.proj-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.proj');
      var open = !card.classList.contains('open');
      card.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---- Copy buttons ---- */
  function selectText(el) {
    try {
      var r = document.createRange();
      r.selectNodeContents(el);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    } catch (err) { /* ignore */ }
  }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var target = document.getElementById(btn.getAttribute('data-target'));
      var fallback = function () {
        if (target) selectText(target);
        showToast('Selected. Press Ctrl+C (or Cmd+C) to copy.');
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { showToast('Copied: ' + text); },
            fallback
          );
        } else { fallback(); }
      } catch (err) { fallback(); }
    });
  });

  /* ---- CV download ---- */
  function triggerDownload() {
    var a = document.createElement('a');
    a.href = CONFIG.cvFile;
    a.download = CONFIG.cvFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  $$('[data-cv]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!window.fetch || location.protocol === 'file:') { triggerDownload(); return; }
      fetch(CONFIG.cvFile, { method: 'HEAD' }).then(function (res) {
        if (res.ok) triggerDownload();
        else showToast('CV file not found. Add ' + CONFIG.cvFile + ' next to index.html.');
      }).catch(function () {
        showToast('CV file not found. Add ' + CONFIG.cvFile + ' next to index.html.');
      });
    });
  });
})();
