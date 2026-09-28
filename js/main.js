/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'free-style-via-meda',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si prenota per telefono (02 8951 6068)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026), come l'adesivo sulla porta: martedì–venerdì 8:30–12:30 e 14:30–19:30, sabato 8:30–19:30 */
    hours: {
      0: [],
      1: [],
      2: [['08:30', '12:30'], ['14:30', '19:30']],
      3: [['08:30', '12:30'], ['14:30', '19:30']],
      4: [['08:30', '12:30'], ['14:30', '19:30']],
      5: [['08:30', '12:30'], ['14:30', '19:30']],
      6: [['08:30', '19:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Free Style Milano, back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "m.sotto": "Hairdresser · Via Meda 53",
      "n.salone": "The salon",
      "n.poltrona": "In the chair",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.orariDove": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "h.sopra": "Hairdresser · Via Giuseppe Meda 53, Milan",
      "h.titolo": "Excellence, done with scissors.",
      "h.chi": "Francesco Basile, in a review on Google («L’eccellenza fatta a forbice»)",
      "h.testo": "An old-style salon on the southern stretch of Via Meda, between Tibaldi and Famagosta: the stucco work, a fresco, the chequered floor, and a haircut done well. Appointments by phone.",
      "h.voto": "119 reviews on Google",
      "h.chiama": "Call and book",
      "h.indicazioni": "Directions",
      "po.titolo": "The door of Free Style, at Via Giuseppe Meda 53",
      "po.desc": "The glass door of the salon, drawn: on the glass the words Free Style in white script and the opening hours sticker, Tuesday to Friday from 8.30 to 12.30 and from 14.30 to 19.30, Saturday open all day, closed on Mondays, air-conditioned. Through the glass you can see the chequered floor.",
      "po.orario": "HOURS",
      "po.giorni": "Tuesday to Friday",
      "po.ore": "8.30 - 12.30 / 14.30 - 19.30",
      "po.sabato": "Saturday open all day",
      "po.lunedi": "Closed on Mondays",
      "po.clima": "Air-conditioned",
      "po.nota": "Their door, drawn: the lettering and the hours are the ones on the glass.",
      "s.etichetta": "The salon",
      "s.titolo": "Stucco, a fresco and the chequerboard",
      "s.testo": "Inside, the salon has stayed the barber’s of old: peach walls, stucco columns and cartouches, a Pompeian-style fresco with dancers, the ceiling with painted panels and the crystal chandelier, the chequered floor of red and cream marble laid on the diagonal. The stations have mirrors with little lights; whoever is waiting sits on the black leather sofas. And, as the door says, the salon is air-conditioned.",
      "a.salone": "The salon: the stations with mirrors and little lights, the product shelves, the chairs, the chequered floor; at the back, beyond the arch, the fresco.",
      "c.salone": "The stations, and beyond the arch the fresco.",
      "a.affresco": "The Pompeian-style fresco: two dancers on a red background, next to an Ionic stucco column.",
      "c.affresco": "The fresco, between the columns.",
      "a.soffitto": "The ceiling with peach painted panels and the crystal chandelier.",
      "c.soffitto": "The ceiling and the chandelier.",
      "a.stucchi": "The arch with scrolled corbels and the stucco cartouche; below, the top of the fresco.",
      "c.stucchi": "The cartouche above the arch.",
      "a.attesa": "The waiting area: the black leather sofas, the long mirror, the decorative plates on the wall.",
      "c.attesa": "The sofas of the waiting area.",
      "a.pavimento": "The chequered floor of red and cream marble, laid on the diagonal, with the base of a chair.",
      "c.pavimento": "Red and cream marble, on the diagonal.",
      "p.etichetta": "In the chair",
      "p.titolo": "What they do, by appointment",
      "p.testo": "Before cutting, they listen to how you want it.",
      "p.taglio": "The haircut",
      "p.taglioT": "For men, made to measure, done with scissors.",
      "p.lavaggio": "The wash",
      "p.lavaggioT": "Shampoo and conditioner, before the cut.",
      "p.bambini": "Children",
      "p.bambiniT": "Even the youngest, calmly.",
      "p.appuntamento": "The appointment",
      "p.appuntamentoT": "You book it by phone, and you come on time.",
      "r.etichetta": "Reviews",
      "r.titolo": "While you wait",
      "r.voto": "on Google, 119 reviews",
      "r.a8": "Google, 8 years ago",
      "r.a9": "Google, 9 years ago",
      "r.a1": "Google, a year ago",
      "r.a3": "Google, 3 years ago",
      "r.a4": "Google, 4 years ago",
      "r.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […].",
      "r.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Closed on Mondays",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.prenota": "Appointments <b>by phone</b>, on <a href=\"tel:+390289516068\" class=\"intero\">+39 02 8951 6068</a>.",
      "a.porta": "The real door, from the street: the glass with the words Free Style, the sign and the hours sticker.",
      "c.porta": "The real door, from the street.",
      "o.dove": "Via Giuseppe Meda 53, 20141 Milan, on the stretch towards Viale Da Cermenate. The bus stops at <b>Via Montegani – Viale Da Cermenate</b> are 120 metres away; <b>M2 Famagosta</b> is about 800 metres away, <b>Abbiategrasso</b> 950.",
      "o.mappa": "Map: Free Style Milano, Via Giuseppe Meda 53, Milan",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.1": "How do I book?",
      "q.1r": "By phone, on +39 02 8951 6068.",
      "q.2": "When are you open?",
      "q.2r": "Tuesday to Friday from 8.30 am to 12.30 pm and from 2.30 pm to 7.30 pm, Saturday all day from 8.30 am to 7.30 pm. On Mondays and Sundays we are closed.",
      "q.3": "Do you do children too?",
      "q.3r": "Yes, even the youngest.",
      "q.4": "Where are you?",
      "q.4r": "At Via Giuseppe Meda 53, on the stretch towards Viale Da Cermenate: the bus stops at Via Montegani are 120 metres away, M2 Famagosta about 800 metres.",
      "q.5": "Is the salon air-conditioned?",
      "q.5r": "Yes, the door says so too: air-conditioned.",
      "z.sotto": "Hairdresser · Via Giuseppe Meda 53, Milan",
      "z.frase": "Next, please!",
      "z.orario": "Tuesday to Saturday, closed on Mondays",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are the customers’, from the Google listing (two are 360° panoramas); hours and reviews from Google (September 2026). The door at the top is a drawing.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FREE STYLE MILANO — «L'eccellenza fatta a forbice.» ══════════
     La pagina è il loro salone all'antica: il telaio scuro della porta, i riquadri di stucco, la scacchiera per soglia.
     la FIRMA — la porta: sul vetro «Free Style» si scrive da sinistra a destra, in corsivo bianco; poi l'adesivo dell'orario
     compare riga per riga (le loro parole); alla fine scende il cartellino appeso alla ventosa e dondola fino a fermarsi su
     APERTO o CHIUSO, secondo l'ora vera, e poi cambia col tempo.
     Stato finale = l'HTML/SVG (la scritta e l'adesivo); il cartellino c'è solo col JS (l'ora la sa solo il JS). Senza JS: lo
     stato finale senza cartellino. Con reduced-motion: lo stato finale col cartellino subito. L'attesa è la classe
     firma-attesa dell'head (il vetro vuoto, via CSS, solo dentro .porta__svg), tolta dall'head dopo 2,5 s se il codice non
     arriva. Un rAF a tempo: la firma non dipende da GSAP. I dati vengono da _fsm_porta.mjs. */
  var DATI = {"tempi":{"inizio":250,"scritta":1500,"righe":1830,"passoRiga":170,"riga":380,"cartello":3120,"dondolo":1300,"fine":4620},"perno":{"x":420,"y":236},"righe":6};
  var figuraP = document.getElementById('porta');
  var svgP = figuraP ? figuraP.querySelector('.porta__svg') : null;
  var scrittaEl = document.getElementById('scritta');
  var adesivoEl = document.getElementById('adesivo');
  var righeEl = adesivoEl ? [].slice.call(adesivoEl.querySelectorAll('.porta__riga')) : [];
  var filettoEl = adesivoEl ? adesivoEl.querySelector('.porta__filetto') : null;
  var cartelloEl = document.getElementById('cartello');
  var cartelloTesto = document.getElementById('cartelloTesto');
  var TP = DATI.tempi, PERNO = DATI.perno;
  var faseP = 'fatta', rafP = 0, guardiaP = 0, larghezzaAvvioP = 0, corseP = 0;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PAROLE = { it: { aperto: 'APERTO', chiuso: 'CHIUSO' }, en: { aperto: 'OPEN', chiuso: 'CLOSED' } };
  function lingua() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  /* il cartellino: lo stato dell'ora vera; p = quanto è sceso e dondolato (1 = fermo) */
  function mostraCartello(p) {
    if (!cartelloEl) return;
    var aperto = !!hoursState().open;
    cartelloEl.setAttribute('class', 'porta__cartello ' + (aperto ? 'cartello--aperto' : 'cartello--chiuso'));
    cartelloTesto.textContent = PAROLE[lingua()][aperto ? 'aperto' : 'chiuso'];
    cartelloEl.removeAttribute('display');
    if (p < 1) {
      var ang = -26 * Math.exp(-3.4 * p) * Math.cos(2 * Math.PI * 2.1 * p);
      var cade = -34 * (1 - esce(c01(p * 3)));
      cartelloEl.setAttribute('transform', 'translate(0 ' + r3(cade) + ') rotate(' + r3(ang) + ' ' + PERNO.x + ' ' + PERNO.y + ')');
      cartelloEl.style.opacity = r3(c01(p * 4));
    } else { cartelloEl.removeAttribute('transform'); cartelloEl.style.removeProperty('opacity'); if (!cartelloEl.getAttribute('style')) cartelloEl.removeAttribute('style'); }
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la porta va allo stato finale; si
     riarma a ogni fotogramma (#229) */
  function sorvegliaP() { clearTimeout(guardiaP); guardiaP = setTimeout(chiudiPorta, 1500); }
  function pulisci(el) { if (!el) return; el.style.removeProperty('opacity'); el.style.removeProperty('transform'); el.style.removeProperty('clip-path'); if (!el.getAttribute('style')) el.removeAttribute('style'); }
  function chiudiPorta() {
    cancelAnimationFrame(rafP); rafP = 0;
    clearTimeout(guardiaP);
    pulisci(scrittaEl); pulisci(filettoEl); righeEl.forEach(pulisci);
    figuraP.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseP = 'fatta';
    mostraCartello(1);
  }
  function fotogrammaP(t) {
    /* la scritta: il pennello scopre il corsivo da sinistra */
    var ps = c01((t - TP.inizio) / TP.scritta);
    if (ps < 1) scrittaEl.style.clipPath = 'inset(0 ' + r3((1 - ps) * 100) + '% 0 0)'; else scrittaEl.style.removeProperty('clip-path');
    /* l'adesivo: riga per riga (il filetto con la prima) */
    for (var i = 0; i < righeEl.length; i++) {
      var pr = c01((t - TP.righe - i * TP.passoRiga) / TP.riga);
      var el = righeEl[i];
      if (pr < 1) { el.style.opacity = r3(pr); el.style.transform = 'translateY(' + r3(6 * (1 - esce(pr))) + 'px)'; }
      else { el.style.removeProperty('opacity'); el.style.removeProperty('transform'); }
      if (i === 0 && filettoEl) { if (pr < 1) filettoEl.style.opacity = r3(pr); else filettoEl.style.removeProperty('opacity'); }
    }
    /* il cartellino scende e dondola */
    if (t >= TP.cartello) mostraCartello(c01((t - TP.cartello) / TP.dondolo));
  }
  function avviaPorta() {
    cancelAnimationFrame(rafP); rafP = 0;
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: il vetro vuoto */
    scrittaEl.style.clipPath = 'inset(0 100% 0 0)';
    righeEl.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; });
    if (filettoEl) filettoEl.style.opacity = '0';
    if (cartelloEl) { cartelloEl.setAttribute('display', 'none'); cartelloEl.removeAttribute('transform'); cartelloEl.style.removeProperty('opacity'); }
    root.classList.remove('firma-attesa');
    faseP = 'corre'; figuraP.setAttribute('data-firma', 'corre');
    larghezzaAvvioP = window.innerWidth;
    var t0 = null, corsa = ++corseP;
    function fotogramma(ts) {
      rafP = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseP !== 'corre' || corsa !== corseP) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaP(t);
      if (t >= TP.fine) { chiudiPorta(); return; }
      sorvegliaP();
      rafP = requestAnimationFrame(fotogramma);
    }
    sorvegliaP();
    rafP = requestAnimationFrame(fotogramma);
  }
  /* la porta è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra);
     l'altezza è quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaP() {
    if (!svgP) return false;
    var r = svgP.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche nella sezione degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);

  if (figuraP && svgP && scrittaEl && adesivoEl && righeEl.length === DATI.righe && cartelloEl && cartelloTesto) {
    try { clearTimeout(window.__attesaPorta); } catch (e) {}
    window.__porta = {
      stato: function () { return { fase: faseP, corse: corseP, cartello: cartelloEl.getAttribute('display') === 'none' ? null : cartelloTesto.textContent }; },
      tempi: TP,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaP();
    /* perché la firma è partita o no (lo legge il check) */
    window.__porta.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgP.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiPorta();
    else if (inVista) avviaPorta();
    else if ('IntersectionObserver' in window) {
      /* la porta sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora il vetro è vuoto */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioP = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioP.disconnect();
        if (faseP === 'fatta' && root.classList.contains('firma-attesa')) avviaPorta();
      }, { threshold: soglie });
      ioP.observe(svgP);
      window.__porta.avvio.aspetta = true;
    } else chiudiPorta();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseP !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioP) <= 1) return;
      chiudiPorta();
    });
    /* il cartellino segue l'ora vera e la lingua */
    setInterval(function () { if (faseP === 'fatta' && !root.classList.contains('firma-attesa')) mostraCartello(1); }, 60000);
    new MutationObserver(function () { copiaStato(); if (faseP === 'fatta' && !root.classList.contains('firma-attesa')) mostraCartello(1); }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }
})();
