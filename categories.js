(function(){
  const CATEGORIES = {
    turkish: [
      { id:'t1', name:'قهوة تركي فاخرة', desc:'مطحنة ناعمة بطعم أصيل', price:89.00, img:'https://picsum.photos/seed/t1/500/375' },
      { id:'t2', name:'قهوة تركي محوجة', desc:'مزيج حبهان ومستيكا', price:95.00, img:'https://picsum.photos/seed/t2/500/375' },
      { id:'t3', name:'قهوة تركي داكنة', desc:'تحميص عميق بنكهة قوية', price:99.00, img:'https://picsum.photos/seed/t3/500/375' },
      { id:'t5', name:'قهوة تركي خفيفة', desc:'مناسبة لكل يوم', price:79.00, img:'https://picsum.photos/seed/t5/500/375' },
      { id:'t6', name:'قهوة تركي سادة', desc:'اختيار عشاق القهوة', price:85.00, img:'https://picsum.photos/seed/t6/500/375' },
      { id:'t7', name:'قهوة تركي مدخنة', desc:'طابع عطري قوي', price:115.00, img:'https://picsum.photos/seed/t7/500/375' },
      { id:'t8', name:'قهوة تركي وسط', desc:'توازن مثالي', price:92.00, img:'https://picsum.photos/seed/t8/500/375' },
      { id:'t9', name:'قهوة تركي هيل', desc:'حبهان عطري', price:118.00, img:'https://picsum.photos/seed/t9/500/375' },
      { id:'t10', name:'قهوة تركي مميزة', desc:'مزيج محمص بعناية', price:122.00, img:'https://picsum.photos/seed/t10/500/375' },
      { id:'t11', name:'قهوة تركي ذهبية', desc:'طعم متوازن ونظيف', price:105.00, img:'https://picsum.photos/seed/t11/500/375' },
      { id:'t12', name:'قهوة تركي خاصة', desc:'انتقاء محاصيل فريش', price:129.00, img:'https://picsum.photos/seed/t12/500/375' },
      { id:'t13', name:'قهوة تركي كلاسيك', desc:'نكهة أصلية لكل الأوقات', price: 109.00, img:'https://picsum.photos/seed/t13/500/375' },
      { id:'t14', name:'قهوة تركي بريميوم', desc:'اختيار محبي القهوة', price:139.00, img:'https://picsum.photos/seed/t14/500/375' }
    ],
    espresso: [
      { id:'e1', name:'بن اسبريسو كلاسيك', desc:'مزيج عربيكا وروبوستا', price:150.00, img:'https://picsum.photos/seed/e1/500/375' },
      { id:'e2', name:'اسبريسو دارك روست', desc:'نكهة شوكولاتة مرة', price:165.00, img:'https://picsum.photos/seed/e2/500/375' },
      { id:'e3', name:'اسبريسو سموث', desc:'قوام كريمي متوازن', price:155.00, img:'https://picsum.photos/seed/e3/500/375' },
      { id:'e4', name:'كبسولات اسبريسو', desc:'متوافقة مع أغلب الماكينات', price:120.00, img:'https://picsum.photos/seed/e4/500/375' },
      { id:'e5', name:'اسبريسو اورجانيك', desc:'محصول عالي الجودة', price:175.00, img:'https://picsum.photos/seed/e5/500/375' },
      { id:'e6', name:'اسبريسو إيطالي', desc:'نكهة عميقة وغنية', price:169.00, img:'https://picsum.photos/seed/e6/500/375' },
      { id:'e7', name:'اسبريسو سبشياليتي', desc:'محمص بعناية', price:185.00, img:'https://picsum.photos/seed/e7/500/375' },
      { id:'e8', name:'اسبريسو منزلي', desc:'خيار موفّر', price:140.00, img:'https://picsum.photos/seed/e8/500/375' },
      { id:'e9', name:'اسبريسو سوبر', desc:'حلاوة متوازنة', price:172.00, img:'https://picsum.photos/seed/e9/500/375' },
      { id:'e10', name:'اسبريسو مكثف', desc:'قوام ثقيل', price:178.00, img:'https://picsum.photos/seed/e10/500/375' },
      { id:'e11', name:'اسبريسو محمص هوائياً', desc:'روائح نظيفة', price:188.00, img:'https://picsum.photos/seed/e11/500/375' },
      { id:'e12', name:'اسبريسو مع فلتر', desc:'خيار متعدد الاستخدام', price:159.00, img:'https://picsum.photos/seed/e12/500/375' }
    ],
    flavors: [
      { id:'f1', name:'قهوة فانيليا', desc:'نكهة حلوة وخفيفة', price:120.00, img:'https://picsum.photos/seed/f1/500/375' },
      { id:'f2', name:'قهوة كراميل', desc:'طعم سكّري غني', price:120.00, img:'https://picsum.photos/seed/f2/500/375' },
      { id:'f4', name:'قهوة شوكولاتة', desc:'لمسة كاكاو ناعمة', price:130.00, img:'https://picsum.photos/seed/f4/500/375' },
      { id:'f5', name:'قهوة قرفة', desc:'دفء ونكهة مميزة', price:120.00, img:'https://picsum.photos/seed/f5/500/375' },
      { id:'f6', name:'قهوة لوز', desc:'طابع عطري ناعم', price:135.00, img:'https://picsum.photos/seed/f6/500/375' },
      { id:'f7', name:'قهوة فستق', desc:'لمسة مكسرات فاخرة', price:139.00, img:'https://picsum.photos/seed/f7/500/375' },
      { id:'f8', name:'قهوة توفي', desc:'حلاوة متوازنة', price:132.00, img:'https://picsum.photos/seed/f8/500/375' },
      { id:'f9', name:'قهوة جوز الهند', desc:'نسمة استوائية', price:138.00, img:'https://picsum.photos/seed/f9/500/375' },
      { id:'f10', name:'قهوة توت', desc:'حمضية لطيفة', price:141.00, img:'https://picsum.photos/seed/f10/500/375' },
      { id:'f11', name:'قهوة عسل', desc:'حلاوة طبيعية', price:144.00, img:'https://picsum.photos/seed/f11/500/375' },
      { id:'f12', name:'قهوة تمر', desc:'طابع عربي محبب', price:147.00, img:'https://picsum.photos/seed/f12/500/375' }
    ],
    bundles: [
      { id:'b1', name:'باقة القهوة اليومية', desc:'3 نكهات مختلفة', price:299.00, img:'https://picsum.photos/seed/b1/500/375' },
      { id:'b2', name:'باقة العاشق', desc:'تحميص داكن + شوكولاتة', price:349.00, img:'https://picsum.photos/seed/b2/500/375' },
      { id:'b3', name:'باقة الموظف', desc:'تركي + اسبريسو + فانيليا', price:329.00, img:'https://picsum.photos/seed/b3/500/375' },
      { id:'b4', name:'باقة الضيافة', desc:'كمية أكبر بسعر أوفر', price:399.00, img:'https://picsum.photos/seed/b4/500/375' },
      { id:'b5', name:'باقة المذاقات', desc:'نكهات متعددة للتجربة', price:359.00, img:'https://picsum.photos/seed/b5/500/375' },
      { id:'b6', name:'باقة المبتدئ', desc:'خيارات متوازنة', price:279.00, img:'https://picsum.photos/seed/b6/500/375' },
      { id:'b7', name:'باقة العائلة', desc:'وفّر أكثر لعائلتك', price:449.00, img:'https://picsum.photos/seed/b7/500/375' },
      { id:'b8', name:'باقة المسافر', desc:'حجم صغير للسفر', price:259.00, img:'https://picsum.photos/seed/b8/500/375' },
      { id:'b9', name:'باقة الذواقة', desc:'اختيارات مميزة', price:489.00, img:'https://picsum.photos/seed/b9/500/375' },
      { id:'b10', name:'باقة المكتب', desc:'تكفي الفريق', price:559.00, img:'https://picsum.photos/seed/b10/500/375' },
      { id:'b11', name:'باقة الضيافة الفاخرة', desc:'مظهر راقٍ', price:629.00, img:'https://picsum.photos/seed/b11/500/375' },
      { id:'b12', name:'باقة التجربة', desc:'أنواع متعددة صغيرة', price:299.00, img:'https://picsum.photos/seed/b12/500/375' }
    ],
    tools: [
      { id:'o1', name:'مطحنة يدويّة', desc:'مصنوعة من الستانلس', price:220.00, img:'https://picsum.photos/seed/o1/500/375' },
      { id:'o2', name:'فرنش بريس', desc:'زجاج مقوّى', price:199.00, img:'https://picsum.photos/seed/o2/500/375' },
      { id:'o3', name:'إبريق ترشيح', desc:'عنق إوزة تحكم مثالي', price:240.00, img:'https://picsum.photos/seed/o3/500/375' },
      { id:'o4', name:'ميزان قهوة', desc:'قياس دقيق بالجرام', price:180.00, img:'https://picsum.photos/seed/o4/500/375' },
      { id:'o5', name:'ثيرمومتر حليب', desc:'قراءة سريعة', price:120.00, img:'https://picsum.photos/seed/o5/500/375' },
      { id:'o6', name:'تامبر اسبريسو', desc:'مقبض مريح', price:160.00, img:'https://picsum.photos/seed/o6/500/375' },
      { id:'o7', name:'فرشاة تنظيف', desc:'لماكينة القهوة', price:75.00, img:'https://picsum.photos/seed/o7/500/375' },
      { id:'o8', name:'مخاط عصا تبخير', desc:'تنظيف فوري', price:55.00, img:'https://picsum.photos/seed/o8/500/375' },
      { id:'o9', name:'فلتر ورقي', desc:'100 قطعة', price:49.00, img:'https://picsum.photos/seed/o9/500/375' },
      { id:'o10', name:'حامل فلتر', desc:'تنظيم المطبخ', price:95.00, img:'https://picsum.photos/seed/o10/500/375' },
      { id:'o11', name:'مقياس توقيت', desc:'لتخمير أدق', price:135.00, img:'https://picsum.photos/seed/o11/500/375' },
      { id:'o12', name:'موزع قهوة', desc:'لتوزيع متساوٍ', price:210.00, img:'https://picsum.photos/seed/o12/500/375' }
    ]
  };

  function highlightActiveNav(){
    const raw = location.pathname.split('/').pop() || 'index.html';
    const path = decodeURIComponent(raw);
    document.querySelectorAll('.nav-list a').forEach(a => {
      const hrefRaw = a.getAttribute('href');
      const href = hrefRaw ? decodeURIComponent(hrefRaw) : '';
      if (href && href === path) {
        a.setAttribute('aria-current','page');
        a.classList.add('active');
      }
    });
  }

  function renderCategoryPage(){
    const el = document.getElementById('productsGrid');
    if (!el) return;
    const key = document.body.getAttribute('data-category');
    let items = CATEGORIES[key] || [];

    // Parse filters from URL
    const params = new URLSearchParams(location.search);
    const type = params.get('type');       // light|medium|mahog|colombian
    const blend = params.get('blend');     // classico|intenso
    const size = params.get('size');       // quarter|eighth|half
    const kind = params.get('kind');       // machines|grinders (tools)

    // Helper: classify an item with pseudo-tags (no data change required)
    function classify(item){
      const id = item.id || '';
      const num = parseInt(id.replace(/[^0-9]/g,'')) || 0;
      const meta = {};
      if (key === 'turkish'){
        // Cycle types by number for a simple, even distribution
        const cycle = num % 4;
        meta.type = cycle === 1 ? 'light' : cycle === 2 ? 'medium' : cycle === 3 ? 'mahog' : 'colombian';
        meta.size = (num % 2) ? 'quarter' : 'eighth';
      } else if (key === 'espresso'){
        meta.blend = (num % 2) ? 'classico' : 'intenso';
        meta.size = (num % 2) ? 'quarter' : 'half';
      } else if (key === 'tools'){
        // Simple split: alternate between machines and grinders
        meta.kind = (num % 2) ? 'machines' : 'grinders';
      }
      return meta;
    }

    // Apply filters if present
    items = items.filter(p => {
      const m = classify(p);
      if (key === 'turkish'){
        if (type && m.type !== type) return false;
        if (size && m.size !== size) return false;
      } else if (key === 'espresso'){
        if (blend && m.blend !== blend) return false;
        if (size && m.size !== size) return false;
      } else if (key === 'tools'){
        if (kind && m.kind !== kind) return false;
      }
      return true;
    });
    const cards = items.map(p => {
      const meta = classify(p);
      let imgSrc = p.img;
      if (key === 'espresso'){
        imgSrc = meta.blend === 'classico' ? 'images/Classico_coffee.jpg' : 'images/Intenso_Coffee.jpg';
      }
      return `
      <div class="product-card reveal" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${imgSrc}">
        <div class="product-image"><img src="${imgSrc}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;object-position:center;border-radius:12px;" /></div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-meta">
          <span class="product-price">${p.price.toFixed(2)} جنيه</span>
          <button class="add-btn">أضف إلى السلة</button>
        </div>
      </div>`;
    }).join('');
    el.innerHTML = cards;
    // trigger reveal animation if present in main script
    document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));

    // Highlight selected chips if present
    try{
      document.querySelectorAll('[data-chip-group="type"] [data-type]').forEach(btn => {
        btn.classList.toggle('chip-active', btn.dataset.type === type);
      });
      document.querySelectorAll('[data-chip-group="blend"] [data-blend]').forEach(btn => {
        btn.classList.toggle('chip-active', btn.dataset.blend === blend);
      });
      document.querySelectorAll('[data-chip-group="size"] [data-size]').forEach(btn => {
        btn.classList.toggle('chip-active', btn.dataset.size === size);
      });
      document.querySelectorAll('[data-chip-group="kind"] [data-kind]').forEach(btn => {
        btn.classList.toggle('chip-active', btn.dataset.kind === kind);
      });
    }catch(_){}
  }

  window.CategoryPages = { renderCategoryPage, highlightActiveNav };
})();
