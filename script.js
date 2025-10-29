(function () {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const hamburger = qs('.hamburger');
  const mobileMenu = qs('#mobileMenu');

  // Initialize top banner ticker: duplicate text and animate via rAF (no CSS keyframes)
  function setupTopBannerTicker() {
    const banner = qs('.top-banner');
    if (!banner) return;
    const wrapper = qs('.scroll-wrapper', banner);
    if (!wrapper) return;

    banner.setAttribute('dir', 'rtl');

    // Determine base text: prefer first .scroll-text, fallback to wrapper text
    const existing = qsa('.scroll-text', wrapper);
    let baseText = existing[0]?.textContent?.trim() || wrapper.textContent.trim();
    if (!baseText) return;

    // Build two sentence-block copies for seamless loop
    function buildCopies(text) {
      wrapper.innerHTML = '';
      for (let i = 0; i < 2; i++) {
        const item = document.createElement('div');
        item.className = 'scroll-text';
        item.textContent = text;
        wrapper.appendChild(item);
      }
    }

    // If navigated with ?openMenu=1, open the mobile menu automatically
    (function autoOpenMenuFromFlag(){
      try{
        const params = new URLSearchParams(location.search);
        if (params.get('openMenu') === '1') {
          if (typeof toggleMobileMenu === 'function') toggleMobileMenu(true);
          else {
            mobileMenu?.removeAttribute('hidden');
            mobileMenu?.classList.add('open');
          }
          // Clean the URL so the menu doesn't auto-open on refresh
          params.delete('openMenu');
          const newUrl = location.pathname + (params.toString() ? ('?' + params.toString()) : '') + location.hash;
          history.replaceState(null, '', newUrl);
        }
      } catch(_){}
    })();
    buildCopies(baseText);

    // rAF loop vars
    let lastTs = 0;
    let x = 0; // current translateX in px (negative as it moves left)
    let itemWidth = 0;
    let paused = false;
    // Speed control: pixels per second (default ~60px/s). Allow data attribute override.
    function getSpeed() {
      const px = Number(banner.getAttribute('data-ticker-speed'));
      if (Number.isFinite(px) && px > 0) return px; // explicit px/s
      const factor = Number(banner.getAttribute('data-ticker-factor'));
      if (Number.isFinite(factor) && factor > 0) return factor * 60; // ~60px/s per 1.0
      return 60; // default px/s
    }
    let speed = getSpeed();

    function measure() {
      // width of a single copy
      const first = wrapper.firstElementChild;
      if (!first) return;
      itemWidth = first.getBoundingClientRect().width;
      // Normalize x to avoid drift when resizing
      if (itemWidth > 0) {
        x = x % -itemWidth; // keep in [-itemWidth, 0)
      }
    }
    measure();
    // Start so that the last part of the sentence is visible first at the right edge
    // Align end of first copy (itemWidth) with banner's right edge (banner.clientWidth)
    x = banner.clientWidth - itemWidth;
    wrapper.style.transform = `translateX(${x}px)`;

    // Pause on hover
    banner.addEventListener('mouseenter', () => { paused = true; });
    banner.addEventListener('mouseleave', () => { paused = false; });

    // Recalculate on resize and update speed if changed
    window.addEventListener('resize', () => { measure(); speed = getSpeed(); });

    function step(ts) {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000; // seconds
      lastTs = ts;

      if (!paused && itemWidth > 0) {
        // advance by speed px per second
        x -= speed * dt;
        // when first copy fully exits, wrap instantly with no flicker
        if (x <= -itemWidth) {
          x += itemWidth;
        }
        wrapper.style.transform = `translateX(${x}px)`;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Toggle mobile menu with smooth animation
  function toggleMobileMenu(forceState) {
    const isHidden = mobileMenu.hasAttribute('hidden');
    const willOpen = forceState !== undefined ? forceState : isHidden;
    if (willOpen) {
      // Prepare for animation: show element then add class to transition
      mobileMenu.removeAttribute('hidden');
      // Force reflow to ensure transition kicks in
      void mobileMenu.offsetHeight;
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      // Start closing animation
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      // After transition ends, hide to improve a11y
      const onEnd = (e) => {
        if (e.target !== mobileMenu) return;
        mobileMenu.setAttribute('hidden', '');
        mobileMenu.removeEventListener('transitionend', onEnd);
      };
      mobileMenu.addEventListener('transitionend', onEnd);
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => toggleMobileMenu());

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMobileMenu(false);
    });

    // Close when clicking outside on small screens
    document.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        const insideMenu = mobileMenu.contains(e.target) || hamburger.contains(e.target);
        if (!insideMenu) toggleMobileMenu(false);
      }
    });

    // Ensure correct state on resize
    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        // Ensure menu is fully hidden and reset when leaving mobile
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('hidden', '');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Close mobile menu when clicking a nav link and smooth scroll to section
  function setupNavLinksClose() {
    const allLinks = qsa('.nav-list a, .mobile-nav-list a');
    allLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) {
          const target = qs(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          // Explicitly navigate for non-hash links to ensure it works on mobile
          // Prevent default to avoid any interference from other listeners
          e.preventDefault();
          const url = a.getAttribute('href');
          if (url) window.location.href = url;
        }
        if (window.matchMedia('(max-width: 768px)').matches) {
          toggleMobileMenu(false);
          hamburger?.focus();
        }
      });
    });
  }
  setupNavLinksClose();

  // Apply the ticker once DOM is parsed (script is defer-loaded)
  setupTopBannerTicker();

  // Hide top banner on scroll down, show on scroll up
  (function setupHideOnScrollBanner(){
    const banner = qs('.top-banner');
    if (!banner) return;
    let lastY = window.scrollY || 0;
    let ticking = false;

    function handle(){
      const y = window.scrollY || 0;
      if (y <= 4) {
        banner.classList.remove('hide');
      } else if (y > lastY + 2) {
        // scrolling down
        banner.classList.add('hide');
      } else if (y < lastY - 2) {
        // scrolling up
        banner.classList.remove('hide');
      }
      lastY = y;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { handle(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    // Ensure it shows if user hovers near the top edge
    banner.addEventListener('mouseenter', () => banner.classList.remove('hide'));
  })();

  // Reveal on scroll for product cards and any .reveal elements
  const revealEls = qsa('.reveal');
  function revealNow(el) {
    el.classList.add('visible');
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: simple scroll check
    function onScroll() {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85) revealNow(el);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Language dropdowns (desktop and mobile)
  function setupLangDropdown(scope) {
    const wrapper = scope;
    if (!wrapper) return;
    const toggleBtn = qs('.lang-toggle', wrapper);
    const list = qs('.lang-list', wrapper);
    if (!toggleBtn || !list) return;

    function openList() {
      list.classList.add('show');
      toggleBtn.setAttribute('aria-expanded', 'true');
      list.focus();
    }
    function closeList() {
      list.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = list.classList.contains('show');
      if (isOpen) closeList(); else openList();
    });

    // Select language
    qsa('li', list).forEach((li) => {
      li.addEventListener('click', (e) => {
        qsa('li', list).forEach((n) => n.removeAttribute('aria-selected'));
        li.setAttribute('aria-selected', 'true');
        toggleBtn.textContent = li.textContent + ' ▼';
        closeList();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) closeList();
    });

    // Keyboard handling
    wrapper.addEventListener('keydown', (e) => {
      const items = qsa('li', list);
      const current = items.findIndex((el) => el.getAttribute('aria-selected') === 'true');
      let idx = current >= 0 ? current : 0;
      switch (e.key) {
        case 'Escape':
          closeList();
          toggleBtn.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          idx = (idx + 1) % items.length;
          items[idx].focus?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          idx = (idx - 1 + items.length) % items.length;
          items[idx].focus?.();
          break;
        case 'Enter':
        case ' ': // Space
          if (document.activeElement && list.contains(document.activeElement)) {
            document.activeElement.click();
          }
          break;
      }
    });
  }

  setupLangDropdown(qs('.lang'));
  setupLangDropdown(qs('.lang-mobile'));

  // =============================
  // Cart logic with localStorage
  // =============================
  const stickyCart = qs('#stickyCart');
  const cartBadge = qs('#cartBadge');
  const overlay = qs('#overlay');
  const cartPanel = qs('#cartPanel');
  const closeCartBtn = qs('#closeCart');
  const cartContent = qs('#cartContent');
  const cartTotalEl = qs('#cartTotal');
  const checkoutBtn = qs('#checkoutBtn');
  const clearBtn = qs('#clearBtn');
  const buyNowBtn = qs('#buyNowBtn'); // single CTA when cart is empty

  const LS_KEY = 'fortydash_cart';
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveCart() {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }
  function cartCount() {
    return Object.values(cart).reduce((sum, it) => sum + it.qty, 0);
  }
  function cartTotal() {
    return Object.values(cart).reduce((sum, it) => sum + it.qty * it.price, 0);
  }
  function formatEGP(v) { return v.toLocaleString('ar-EG') + ' جنيه'; }

  // Show/hide the footer buttons depending on cart state
  function updateCartButtons() {
    const isEmpty = cartCount() === 0;
    if (checkoutBtn) checkoutBtn.style.display = isEmpty ? 'none' : '';
    if (clearBtn) clearBtn.style.display = isEmpty ? 'none' : '';
    if (buyNowBtn) buyNowBtn.style.display = isEmpty ? 'block' : 'none';
  }

  function renderCart() {
    if (cartBadge) cartBadge.textContent = cartCount();
    if (!cartContent) return;
    cartContent.innerHTML = '';
    const items = Object.values(cart);
    if (items.length === 0) {
      cartContent.innerHTML = '<div class="cart-empty">سلتك فارغة</div>';
    } else {
      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <img src="${item.img || ''}" alt="${item.name}" onerror="this.style.background='#f5efe8';this.src='';" />
          <div>
            <p class="item-name">${item.name}</p>
            <p class="item-price">${formatEGP(item.price)}</p>
          </div>
          <div class="qty" data-id="${item.id}">
            <button type="button" class="dec" aria-label="تقليل">-</button>
            <span class="q">${item.qty}</span>
            <button type="button" class="inc" aria-label="زيادة">+</button>
          </div>`;
        cartContent.appendChild(row);
      });
    }
    if (cartTotalEl) cartTotalEl.textContent = formatEGP(cartTotal());
    updateCartButtons();
  }

  function addToCart({ id, name, price, img }) {
    if (!cart[id]) cart[id] = { id, name, price: Number(price) || 0, img: img || '', qty: 0 };
    cart[id].qty += 1;
    saveCart();
    renderCart();
  }

  if (cartContent) {
    cartContent.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const wrap = e.target.closest('.qty');
      if (!wrap) return;
      const id = wrap.getAttribute('data-id');
      if (!cart[id]) return;
      if (btn.classList.contains('inc')) cart[id].qty += 1;
      if (btn.classList.contains('dec')) cart[id].qty -= 1;
      if (cart[id].qty <= 0) delete cart[id];
      saveCart();
      renderCart();
    });
  }

  // Hook add buttons (event delegation to support dynamically rendered products)
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.product-card .add-btn');
    if (!addBtn) return;
    const card = addBtn.closest('.product-card');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = Number(card.getAttribute('data-price')) || 0;
    const img = card.getAttribute('data-img') || '';
    addToCart({ id, name, price, img });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = {};
      saveCart();
      renderCart();
    });
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartCount() === 0) { alert('سلتك فارغة'); return; }
      // Validate payment method fields
      const method = (document.querySelector('input[name="payMethod"]:checked')?.value) || 'vodafone';
      if (method === 'vodafone') {
        const phone = (document.getElementById('vfPhone')?.value || '').replace(/\D+/g,'');
        if (phone.length !== 11 || !phone.startsWith('01')) {
          alert('الرجاء إدخال رقم فودافون كاش صحيح (11 رقم يبدأ بـ 01).');
          return;
        }
      } else if (method === 'visa') {
        const numRaw = (document.getElementById('cardNumber')?.value || '').replace(/\s+/g,'').replace(/-/g,'');
        if (numRaw.length < 13 || numRaw.length > 19 || !/^[0-9]+$/.test(numRaw) || !luhn(numRaw)) {
          alert('رقم البطاقة غير صالح.');
          return;
        }
        const exp = (document.getElementById('cardExpiry')?.value || '').trim();
        if (!/^\d{2}\/\d{2}$/.test(exp)) { alert('تاريخ الانتهاء غير صالح. استخدم MM/YY'); return; }
        const [mm, yy] = exp.split('/').map(x=>parseInt(x,10));
        if (mm < 1 || mm > 12) { alert('شهر الانتهاء غير صالح'); return; }
        const now = new Date();
        const year = 2000 + yy;
        const end = new Date(year, mm, 0, 23, 59, 59);
        if (end < now) { alert('تاريخ الانتهاء قد مضى'); return; }
        const cvv = (document.getElementById('cardCvv')?.value || '').trim();
        if (!/^\d{3,4}$/.test(cvv)) { alert('CVV غير صالح'); return; }
      }
      alert('تمت محاكاة إتمام الشراء بنجاح.');
    });
  }
  // Buy Now button: visible only when cart is empty, redirects to home/products
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      // Close cart panel if open
      closeCart();
      // Navigate directly to Turkish products page
      window.location.href = 'turkish.html';
    });
  }

  function openCart() {
    // Default payment method to Vodafone Cash on open
    try{
      const vodafone = document.querySelector('input[name="payMethod"][value="vodafone"]');
      if (vodafone) {
        vodafone.checked = true;
        vodafone.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch(_){}
    overlay?.classList.add('show');
    cartPanel?.classList.add('show');
    stickyCart?.setAttribute('aria-expanded', 'true');
    overlay?.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    overlay?.classList.remove('show');
    cartPanel?.classList.remove('show');
    stickyCart?.setAttribute('aria-expanded', 'false');
    overlay?.setAttribute('aria-hidden', 'true');
  }
  stickyCart?.addEventListener('click', () => openCart());
  overlay?.addEventListener('click', () => closeCart());
  closeCartBtn?.addEventListener('click', () => closeCart());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

  // Initial render
  renderCart();
  updateCartButtons();

  // Payment method toggling
  document.addEventListener('change', (e) => {
    const r = e.target.closest('input[name="payMethod"]');
    if (!r) return;
    const val = r.value;
    document.querySelectorAll('.payment-fields .pf').forEach(sec => {
      const show = sec.getAttribute('data-for') === val;
      sec.toggleAttribute('hidden', !show);
      sec.querySelectorAll('input').forEach(inp => {
        inp.disabled = !show;
      });
    });
  });

  // Helpers
  function luhn(number) {
    let sum = 0, dbl = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let d = parseInt(number[i], 10);
      if (dbl) { d *= 2; if (d > 9) d -= 9; }
      sum += d; dbl = !dbl;
    }
    return sum % 10 === 0;
  }

  // Always open Messenger in a new unique tab (avoid browser reusing same tab)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a.messenger-fab');
    if (!link) return;
    e.preventDefault();
    try{
      const u = new URL(link.href, window.location.origin);
      u.searchParams.set('ref', Date.now().toString());
      window.open(u.toString(), '_blank', 'noopener');
    } catch(_){
      window.open(link.href, '_blank', 'noopener');
    }
  });
})();
