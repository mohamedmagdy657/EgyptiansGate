const state = {
  page: 'home',
  param: undefined,
  searchQuery: '',
  compareTab: 'scholarships',
  compareItems: {
    scholarships: [],
    universities: [],
    countries: [],
  },
  savedScholarships: [],
};

const SECTION_IMAGES = {
  home: 'assets/images/hero-image.svg',
  scholarships: 'assets/images/section-scholarships.svg',
  universities: 'assets/images/section-universities.svg',
  countries: 'assets/images/section-countries.svg',
  articles: 'assets/images/section-articles.svg',
  about: 'assets/images/section-about.svg',
};

const dom = {
  app: document.getElementById('app'),
  navLinks: Array.from(document.querySelectorAll('.nav-link')),
  searchOverlay: document.getElementById('search-overlay'),
  searchInput: document.getElementById('global-search'),
  searchResults: document.getElementById('search-results'),
  themeToggle: document.getElementById('theme-toggle'),
  mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
  navbarMenu: document.getElementById('navbar-menu'),
};

function initApp() {
  bindEvents();
  applyPreferredTheme();
  resolveRoute();
  renderPage();
}

function bindEvents() {
  window.addEventListener('hashchange', () => {
    resolveRoute();
    renderPage();
  });

  dom.searchOverlay.querySelector('#search-close').addEventListener('click', closeSearchOverlay);
  dom.searchInput.addEventListener('input', handleGlobalSearch);
  dom.searchInput.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearchOverlay();
  });

  document.getElementById('search-open').addEventListener('click', openSearchOverlay);

  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  document.addEventListener('click', event => {
    if (!dom.navbarMenu.contains(event.target) && event.target !== dom.mobileMenuToggle) {
      dom.navbarMenu.classList.remove('open');
      dom.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function applyPreferredTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  const shouldUseDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (shouldUseDark) document.documentElement.classList.add('dark');
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
}

function toggleMobileMenu() {
  const isOpen = dom.navbarMenu.classList.toggle('open');
  dom.mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
}

function resolveRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  const [page, param] = hash.split('/');
  state.page = page;
  state.param = param;
}

function renderPage() {
  highlightActiveLink();
  const pageContent = getPageContent(state.page, state.param);
  dom.app.innerHTML = pageContent;
  dom.app.focus();
  bindPageEvents();
  observeFadeIns();
}

function highlightActiveLink() {
  dom.navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').slice(1);
    link.classList.toggle('active', linkPage === state.page);
  });
}

function getPageContent(page, param) {
  switch (page) {
    case 'scholarships':
      return renderScholarshipsPage();
    case 'scholarship-detail':
      return renderScholarshipDetailPage(param);
    case 'universities':
      return renderUniversitiesPage();
    case 'university-detail':
      return renderUniversityDetailPage(param);
    case 'countries':
      return renderCountriesPage();
    case 'country-detail':
      return renderCountryDetailPage(param);
    case 'articles':
      return renderArticlesPage();
    case 'article-detail':
      return renderArticleDetailPage(param);
    case 'compare':
      return renderComparePage();
    case 'about':
      return renderAboutPage();
    default:
      return renderHomePage();
  }
}

function renderHomePage() {
  const featured = SCHOLARSHIPS.slice(0, 3);
  return `
    <section class="page-section hero" id="home">
      <div class="container hero-inner">
        <div class="hero-copy fade-in">
          <p class="tag">أفضل بوابة للطلاب المصريين</p>
          <h1 class="hero-title">اكتشف فرص الدراسة بالخارج بثقة</h1>
          <p class="hero-text">منصة عربية توفر لك معلومات محدثة عن المنح، الجامعات، والدول الدراسية بطريقة سهلة ومباشرة.</p>
          <div class="hero-actions">
            <a class="primary-button" href="#scholarships">المنح</a>
            <a class="secondary-button" href="#articles">المقالات</a>
          </div>
        </div>
        <div class="hero-visual fade-in"></div>
      </div>
    </section>
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">أحدث الفرص</h2>
            <p class="section-description">استعرض بعض المنح الدراسية الأكثر طلباً في بوابة المصريين.</p>
          </div>
          <a class="secondary-button" href="#scholarships">عرض جميع المنح</a>
        </div>
        <div class="card-grid">
          ${featured.map(renderScholarshipCard).join('')}
        </div>
      </div>
    </section>
    <section class="page-section" style="background: var(--surface);">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">كيف تعمل المنصة؟</h2>
            <p class="section-description">ثلاث خطوات بسيطة لتعرف على فرصك وتبدأ التقديم.</p>
          </div>
        </div>
        <div class="grid-3">
          ${renderFeatureCard('ابحث', 'ابحث عن المنح، الجامعات، والدول التي تتوافق مع طموحك.')}
          ${renderFeatureCard('قارن', 'قارن بين الخيارات المختلفة واختر الأنسب لطموحك.')}
          ${renderFeatureCard('قدّم', 'الوصول إلى الروابط الرسمية للتقديم مباشرةً من المنصة.')}
        </div>
      </div>
    </section>
  `;
}

function renderScholarshipsPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">المنح الدراسية</h2>
            <p class="section-description">اعثر على منح دراسية تدعم طموحك الأكاديمي.</p>
          </div>
        </div>
        <div class="full-width-card">
          <div class="filter-row">
            <input id="scholarship-search" type="search" class="search-input" placeholder="ابحث عن منحة..." aria-label="بحث في المنح">
            <select id="filter-country" class="select-field" aria-label="فلترة حسب الدولة">
              <option value="">كل الدول</option>
              ${getCountryOptions()}
            </select>
            <select id="filter-degree" class="select-field" aria-label="فلترة حسب الدرجة">
              <option value="">كل الدرجات</option>
              <option value="بكالوريوس">بكالوريوس</option>
              <option value="ماجستير">ماجستير</option>
              <option value="دكتوراه">دكتوراه</option>
              <option value="جميع الدرجات">جميع الدرجات</option>
            </select>
          </div>
        </div>
        <div id="scholarships-grid" class="card-grid">${SCHOLARSHIPS.map(renderScholarshipCard).join('')}</div>
        <div id="no-results" class="no-results hidden">لا توجد نتائج مطابقة</div>
      </div>
    </section>
  `;
}

function renderScholarshipDetailPage(id) {
  const scholarship = SCHOLARSHIPS.find(item => String(item.id) === String(id));
  if (!scholarship) {
    return renderNotFound('لم يتم العثور على هذه المنحة');
  }
  const related = SCHOLARSHIPS.filter(item => item.id !== scholarship.id).slice(0, 3);
  return `
    <section class="page-section">
      <div class="container">
        <a class="secondary-button" href="#scholarships">← العودة إلى المنح</a>
        <div class="full-width-card">
          <div class="page-heading" style="margin-bottom: 1.5rem;">
            <div>
              <h2 class="section-title">${scholarship.name}</h2>
              <p class="section-description">${scholarship.desc}</p>
            </div>
            <span class="badge">${scholarship.flag} ${scholarship.country}</span>
          </div>
          <div class="grid-2">
            <div class="info-card">
              <h3>الدرجة</h3>
              <p>${scholarship.degree}</p>
            </div>
            <div class="info-card">
              <h3>التمويل</h3>
              <p>${scholarship.funding}</p>
            </div>
            <div class="info-card">
              <h3>الموعد النهائي</h3>
              <p>${scholarship.deadline}</p>
            </div>
            <div class="info-card">
              <h3>الرابط الرسمي</h3>
              <p><a href="${scholarship.officialLink}" target="_blank" rel="noopener noreferrer">زيارة الموقع</a></p>
            </div>
          </div>
          <div class="vstack" style="margin-top:1.5rem;">
            <div class="full-width-card">
              <h3>المتطلبات الأساسية</h3>
              <ul class="highlight-list">${scholarship.requirements.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="full-width-card">
              <h3>المزايا</h3>
              <ul class="highlight-list">${scholarship.benefits.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="grid-3" style="margin-top:1.5rem;">
            ${renderInfoCard('تفاصيل التمويل', scholarship.fundingDetails)}
            ${renderInfoCard('متطلبات اللغة', scholarship.languageReq)}
            ${renderInfoCard('عن الدولة', scholarship.countryInfo)}
          </div>
          <div class="grid-2" style="margin-top:1.5rem; gap:1.5rem; align-items:flex-start;">
            ${renderDetailList('المميزات', scholarship.advantages || [])}
            ${renderDetailList('العيوب', scholarship.disadvantages || [])}
          </div>
          <div class="full-width-card" style="margin-top:1.5rem;">
            <h3>خطوات التقديم</h3>
            <ul class="highlight-list">${scholarship.timeline.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="full-width-card" style="margin-top:1.5rem;">
            <h3>الأسئلة الشائعة</h3>
            ${scholarship.faqs.map(faq => `
              <div class="info-card" style="margin-top:0.75rem;">
                <h4>${faq.q}</h4>
                <p>${faq.a}</p>
              </div>
            `).join('')}
          </div>
          <div class="card-actions" style="margin-top:1.5rem;">
            <button class="primary-button" type="button" onclick="toggleSaveScholarship(${scholarship.id})">${state.savedScholarships.includes(scholarship.id) ? '✓ محفوظ' : 'حفظ المنحة'}</button>
            <button class="outline-button-sm" type="button" onclick="toggleCompare('scholarships', ${scholarship.id})">إضافة للمقارنة</button>
          </div>
          <div style="margin-top:1.5rem;">
            <h3>منح ذات صلة</h3>
            <div class="card-grid">${related.map(renderScholarshipCard).join('')}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderUniversitiesPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">الجامعات</h2>
            <p class="section-description">استعرض الجامعات العالمية والمعلومات الأساسية عنها.</p>
          </div>
        </div>
        <div class="full-width-card" style="margin:1.5rem 0; padding:0; overflow:hidden; border-radius:1.5rem;">
          <img src="${SECTION_IMAGES.universities}" alt="جامعات عالمية" loading="lazy" style="width:100%;display:block;object-fit:cover;max-height:320px;" />
        </div>
        <input id="university-search" type="search" class="search-input" placeholder="ابحث عن جامعة..." aria-label="بحث في الجامعات">
        <div id="universities-grid" class="card-grid" style="margin-top:1.5rem;">${UNIVERSITIES.map(renderUniversityCard).join('')}</div>
      </div>
    </section>
  `;
}

function renderUniversityDetailPage(id) {
  const university = UNIVERSITIES.find(item => String(item.id) === String(id));
  if (!university) {
    return renderNotFound('لم يتم العثور على هذه الجامعة');
  }
  return `
    <section class="page-section">
      <div class="container">
        <a class="secondary-button" href="#universities">← العودة إلى الجامعات</a>
        <div class="full-width-card" style="margin-top:1.5rem;">
          <div class="page-heading" style="margin-bottom:1rem;">
            <div>
              <h2 class="section-title">${university.name}</h2>
              <p class="section-description">${university.desc}</p>
            </div>
            <span class="badge">${university.flag} ${university.country}</span>
          </div>
          <div class="grid-2">
            <div class="info-card"><h3>التصنيف</h3><p>${university.ranking}</p></div>
            <div class="info-card"><h3>الموقع الرسمي</h3><p><a href="${university.website}" target="_blank" rel="noopener noreferrer">زيارة الموقع</a></p></div>
          </div>
          <div class="full-width-card" style="margin-top:1.5rem;">
            <h3>البرامج المتاحة</h3>
            <div style="display:flex;flex-wrap:wrap; gap:0.75rem; margin-top:1rem;">${university.programs.map(program => `<span class="tag">${program}</span>`).join('')}</div>
          </div>
          <button class="outline-button-sm" type="button" style="margin-top:1.5rem;" onclick="toggleCompare('universities', ${university.id})">إضافة للمقارنة</button>
        </div>
      </div>
    </section>
  `;
}

function renderCountriesPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">الدول</h2>
            <p class="section-description">تعرف على الوجهات الدراسية المختلفة والمزايا العامة لكل دولة.</p>
          </div>
        </div>
        <div class="full-width-card" style="margin:1.5rem 0; padding:0; overflow:hidden; border-radius:1.5rem;">
          <img src="${SECTION_IMAGES.countries}" alt="الدول الدراسية" loading="lazy" style="width:100%;display:block;object-fit:cover;max-height:320px;" />
        </div>
        <div id="countries-grid" class="card-grid">${COUNTRIES.map(renderCountryCard).join('')}</div>
      </div>
    </section>
  `;
}

function renderCountryDetailPage(id) {
  const country = COUNTRIES.find(item => String(item.id) === String(id));
  if (!country) {
    return renderNotFound('لم يتم العثور على هذه الدولة');
  }
  return `
    <section class="page-section">
      <div class="container">
        <a class="secondary-button" href="#countries">← العودة إلى الدول</a>
        <div class="full-width-card" style="margin-top:1.5rem;">
          <div class="page-heading" style="margin-bottom:1rem;">
            <div>
              <h2 class="section-title">${country.name}</h2>
              <p class="section-description">معلومات عامة عن الدراسة والمعيشة في ${country.name}.</p>
            </div>
            <span class="badge">${country.flag}</span>
          </div>
          <div class="grid-3">
            ${renderInfoCard('تكلفة المعيشة', country.cost)}
            ${renderInfoCard('الطقس', country.weather)}
            ${renderInfoCard('التأشيرة', country.visa)}
            ${renderInfoCard('اللغة', country.language)}
            ${renderInfoCard('الرعاية الصحية', country.healthcare)}
            ${renderInfoCard('المواصلات', country.transport)}
          </div>
          <button class="outline-button-sm" type="button" style="margin-top:1.5rem;" onclick="toggleCompare('countries', ${country.id})">إضافة للمقارنة</button>
        </div>
      </div>
    </section>
  `;
}

function renderArticlesPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">المقالات</h2>
            <p class="section-description">تابع المقالات التي تساعدك في رحلة التقديم والدراسة بالخارج.</p>
          </div>
        </div>
        <div class="full-width-card" style="margin:1.5rem 0; padding:0; overflow:hidden; border-radius:1.5rem;">
          <img src="${SECTION_IMAGES.articles}" alt="مقالات الدراسة بالخارج" loading="lazy" style="width:100%;display:block;object-fit:cover;max-height:320px;" />
        </div>
        <div class="filter-row">
          <input id="article-search" type="search" class="search-input" placeholder="ابحث في المقالات..." aria-label="بحث في المقالات">
          <select id="article-cat" class="select-field" aria-label="فلترة حسب الفئة">
            <option value="">كل التصنيفات</option>
            <option value="دليل شامل">دليل شامل</option>
            <option value="تأشيرات">تأشيرات</option>
            <option value="اختبارات">اختبارات</option>
            <option value="نصائح">نصائح</option>
          </select>
        </div>
        <div id="articles-grid" class="card-grid" style="margin-top:1.5rem;">${ARTICLES.map(renderArticleCard).join('')}</div>
      </div>
    </section>
  `;
}

function renderArticleDetailPage(id) {
  const article = ARTICLES.find(item => String(item.id) === String(id));
  if (!article) {
    return renderNotFound('لم يتم العثور على هذا المقال');
  }
  const related = ARTICLES.filter(item => item.id !== article.id).slice(0, 2);
  return `
    <section class="page-section">
      <div class="container">
        <a class="secondary-button" href="#articles">← العودة إلى المقالات</a>
        <div class="full-width-card" style="margin-top:1.5rem;">
          <span class="tag">${article.cat}</span>
          <h2 class="section-title" style="margin-top:1rem;">${article.title}</h2>
          <p class="section-description">${article.author} • ${article.date} • ${article.time}</p>
          <div class="full-width-card" style="margin-top:1.5rem;">
            <h3>فهرس المحتوى</h3>
            <ul class="highlight-list">${article.toc.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="full-width-card" style="margin-top:1.5rem;">
            ${article.content}
          </div>
          <div class="card-actions" style="margin-top:1.5rem;">
            <button class="outline-button-sm" type="button" onclick="shareArticle('facebook')">مشاركة فيسبوك</button>
            <button class="outline-button-sm" type="button" onclick="shareArticle('twitter')">مشاركة تويتر</button>
            <button class="outline-button-sm" type="button" onclick="copyLink()">نسخ الرابط</button>
          </div>
          <div style="margin-top:1.5rem;">
            <h3>مقالات ذات صلة</h3>
            <div class="card-grid">${related.map(renderArticleCard).join('')}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderComparePage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">المقارنة</h2>
            <p class="section-description">قارن بين العناصر التي قمت بإضافتها.</p>
          </div>
        </div>
        <div class="card-actions" style="margin-bottom:1rem; gap:0.5rem;">
          <button class="outline-button-sm" type="button" onclick="switchCompareTab('scholarships')">المنح</button>
          <button class="outline-button-sm" type="button" onclick="switchCompareTab('universities')">الجامعات</button>
          <button class="outline-button-sm" type="button" onclick="switchCompareTab('countries')">الدول</button>
        </div>
        <div id="compare-content">${renderCompareContent()}</div>
      </div>
    </section>
  `;
}

function renderAboutPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-heading">
          <div>
            <h2 class="section-title">عن المنصة</h2>
            <p class="section-description">بوابة المصريين منصّة عربية تهدف إلى مساعدة الطلاب في البحث عن فرص الدراسة بالخارج.</p>
          </div>
        </div>
        <div class="grid-2">
          <div>
            <p>تهدف المنصة إلى تقديم معلومات واضحة ومبسطة عن المنح والجامعات والدول، مع تجربة تصفح مريحة للمستخدمين باللغة العربية.</p>
          </div>
          <div class="full-width-card">
            <h3>ما نقدمه</h3>
            <ul class="highlight-list">
              <li>معلومات منظمة عن الفرص التعليمية.</li>
              <li>أدوات مقارنة سهلة الاستخدام.</li>
              <li>محتوى مصمم لطلاب اللغة العربية.</li>
            </ul>
          </div>
        </div>
        <div class="support-grid" style="margin-top:1.5rem;">
          ${renderInfoCard('معلومات دقيقة', 'محتوى يعتمد على مصادر موثوقة ويقدم بطريقة بسيطة.' )}
          ${renderInfoCard('دعم المقارنة', 'قارن بين الخيارات المهمة لتسهيل قرارك الدراسي.')}
          ${renderInfoCard('تجربة عربية', 'واجهة وتصميم يتماشى مع قراءة اللغة العربية من اليمين إلى اليسار.')}
        </div>
      </div>
    </section>
  `;
}

function renderNotFound(message) {
  return `
    <section class="page-section">
      <div class="container no-results">
        <p>${message}</p>
        <a class="primary-button" href="#home">العودة إلى الصفحة الرئيسية</a>
      </div>
    </section>
  `;
}

function renderScholarshipCard(item) {
  const isSaved = state.savedScholarships.includes(item.id);
  const isCompared = state.compareItems.scholarships.includes(item.id);
  return `
    <article class="card fade-in">
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-text">${item.desc}</p>
        <div class="card-meta">
          <span class="badge">${item.funding}</span>
          <span class="tag">${item.degree}</span>
        </div>
        <div class="card-actions">
          <a class="outline-button-sm" href="#scholarship-detail/${item.id}">عرض التفاصيل</a>
          <button class="outline-button-sm" type="button" onclick="toggleSaveScholarship(${item.id})">${isSaved ? '✓ محفوظ' : 'حفظ'}</button>
          <button class="outline-button-sm" type="button" onclick="toggleCompare('scholarships', ${item.id})">${isCompared ? '✓ مقارنة' : 'قارن'}</button>
        </div>
      </div>
    </article>
  `;
}

function renderUniversityCard(item) {
  const isCompared = state.compareItems.universities.includes(item.id);
  return `
    <article class="card fade-in">
      <div class="card-body">
        <div class="badge">${item.flag}</div>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-text">${item.desc}</p>
        <div class="card-meta">
          <span class="tag">${item.ranking}</span>
        </div>
        <div class="card-actions">
          <a class="outline-button-sm" href="#university-detail/${item.id}">عرض التفاصيل</a>
          <button class="outline-button-sm" type="button" onclick="toggleCompare('universities', ${item.id})">${isCompared ? '✓ مقارنة' : 'قارن'}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCountryCard(item) {
  const isCompared = state.compareItems.countries.includes(item.id);
  return `
    <article class="card fade-in">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <img src="${item.flagImg}" alt="علم ${item.name}" loading="lazy" style="width:40px;height:28px;object-fit:cover;border-radius:4px;" />
          <div class="badge">${item.name}</div>
        </div>
        <div class="card-meta" style="justify-content: space-between; gap:0.5rem; margin-top:1rem;">
          <span class="tag">${item.cost}</span>
          <span class="tag">${item.visa}</span>
        </div>
        <div class="card-actions" style="margin-top:1rem;">
          <a class="outline-button-sm" href="#country-detail/${item.id}">عرض التفاصيل</a>
          <button class="outline-button-sm" type="button" onclick="toggleCompare('countries', ${item.id})">${isCompared ? '✓ مقارنة' : 'قارن'}</button>
        </div>
      </div>
    </article>
  `;
}

function renderArticleCard(item) {
  return `
    <article class="card fade-in">
      <div class="card-body">
        <span class="tag">${item.cat}</span>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-meta">
          <span>${item.date}</span>
          <span>${item.time}</span>
        </div>
        <p class="card-text">${item.author}</p>
        <a class="outline-button-sm" href="#article-detail/${item.id}">اقرأ المزيد</a>
      </div>
    </article>
  `;
}

function renderInfoCard(title, text) {
  return `
    <div class="info-card">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function renderDetailList(title, items) {
  return `
    <div class="info-card">
      <h3>${title}</h3>
      <ul class="highlight-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

function renderFeatureCard(title, text) {
  return `
    <div class="info-card fade-in">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function getCountryOptions() {
  return COUNTRIES.map(country => `<option value="${country.name}">${country.name}</option>`).join('');
}

function bindPageEvents() {
  const searchInput = document.getElementById('scholarship-search');
  const countrySelect = document.getElementById('filter-country');
  const degreeSelect = document.getElementById('filter-degree');
  if (searchInput) {
    searchInput.addEventListener('input', handleScholarshipFilter);
  }
  if (countrySelect) {
    countrySelect.addEventListener('change', handleScholarshipFilter);
  }
  if (degreeSelect) {
    degreeSelect.addEventListener('change', handleScholarshipFilter);
  }

  const universitySearch = document.getElementById('university-search');
  if (universitySearch) {
    universitySearch.addEventListener('input', handleUniversitySearch);
  }

  const articleSearch = document.getElementById('article-search');
  const articleCat = document.getElementById('article-cat');
  if (articleSearch) {
    articleSearch.addEventListener('input', handleArticleFilter);
  }
  if (articleCat) {
    articleCat.addEventListener('change', handleArticleFilter);
  }
}

function handleScholarshipFilter() {
  const query = document.getElementById('scholarship-search')?.value.trim().toLowerCase() || '';
  const countryValue = document.getElementById('filter-country')?.value || '';
  const degreeValue = document.getElementById('filter-degree')?.value || '';
  const results = SCHOLARSHIPS.filter(item => {
    const matchesQuery = query === '' || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query) || item.country.toLowerCase().includes(query);
    const matchesCountry = countryValue === '' || item.country === countryValue;
    const matchesDegree = degreeValue === '' || item.degree === degreeValue || item.degree === 'جميع الدرجات';
    return matchesQuery && matchesCountry && matchesDegree;
  });
  document.getElementById('scholarships-grid').innerHTML = results.map(renderScholarshipCard).join('');
  document.getElementById('no-results').classList.toggle('hidden', results.length > 0);
}

function handleUniversitySearch() {
  const query = document.getElementById('university-search')?.value.trim().toLowerCase() || '';
  const results = UNIVERSITIES.filter(item => item.name.toLowerCase().includes(query) || item.country.toLowerCase().includes(query));
  document.getElementById('universities-grid').innerHTML = results.map(renderUniversityCard).join('');
}

function handleArticleFilter() {
  const query = document.getElementById('article-search')?.value.trim().toLowerCase() || '';
  const category = document.getElementById('article-cat')?.value || '';
  const results = ARTICLES.filter(item => {
    const matchesQuery = query === '' || item.title.toLowerCase().includes(query);
    const matchesCategory = category === '' || item.cat === category;
    return matchesQuery && matchesCategory;
  });
  document.getElementById('articles-grid').innerHTML = results.map(renderArticleCard).join('');
}

function openSearchOverlay() {
  dom.searchOverlay.classList.remove('hidden');
  dom.searchInput.value = '';
  dom.searchResults.innerHTML = '<p class="no-results">اكتب ما تريد البحث عنه.</p>';
  dom.searchInput.focus();
}

function closeSearchOverlay() {
  dom.searchOverlay.classList.add('hidden');
}

function handleGlobalSearch(event) {
  const query = event.target.value.trim().toLowerCase();
  if (query === '') {
    dom.searchResults.innerHTML = '<p class="no-results">اكتب ما تريد البحث عنه.</p>';
    return;
  }
  const results = [];
  SCHOLARSHIPS.filter(item => item.name.toLowerCase().includes(query) || item.country.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)).forEach(item => {
    results.push({ title: item.name, subtitle: `منحة • ${item.country}`, link: `#scholarship-detail/${item.id}` });
  });
  UNIVERSITIES.filter(item => item.name.toLowerCase().includes(query) || item.country.toLowerCase().includes(query)).forEach(item => {
    results.push({ title: item.name, subtitle: `جامعة • ${item.country}`, link: `#university-detail/${item.id}` });
  });
  COUNTRIES.filter(item => item.name.toLowerCase().includes(query)).forEach(item => {
    results.push({ title: item.name, subtitle: 'دولة', link: `#country-detail/${item.id}` });
  });
  ARTICLES.filter(item => item.title.toLowerCase().includes(query)).forEach(item => {
    results.push({ title: item.title, subtitle: `مقال • ${item.cat}`, link: `#article-detail/${item.id}` });
  });

  if (!results.length) {
    dom.searchResults.innerHTML = '<p class="no-results">لا توجد نتائج</p>';
    return;
  }
  dom.searchResults.innerHTML = results.slice(0, 8).map(result => `
    <div class="search-result">
      <button type="button" onclick="navigateTo('${result.link}')">
        <strong>${result.title}</strong>
        <p>${result.subtitle}</p>
      </button>
    </div>
  `).join('');
}

function navigateTo(hash) {
  window.location.hash = hash;
  closeSearchOverlay();
}

function toggleSaveScholarship(id) {
  const index = state.savedScholarships.indexOf(id);
  if (index === -1) {
    state.savedScholarships.push(id);
  } else {
    state.savedScholarships.splice(index, 1);
  }
  if (state.page === 'scholarship-detail' || state.page === 'scholarships') {
    renderPage();
  }
}

function toggleCompare(type, id) {
  const list = state.compareItems[type];
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  if (state.page === 'compare' || state.page === type) {
    renderPage();
  }
}

function switchCompareTab(tab) {
  state.compareTab = tab;
  renderPage();
}

function renderCompareContent() {
  const items = state.compareItems[state.compareTab] || [];
  if (!items.length) {
    return `<div class="no-results">لم تضف عناصر للمقارنة في هذا القسم بعد.</div>`;
  }
  if (state.compareTab === 'scholarships') {
    const selected = items.map(id => SCHOLARSHIPS.find(item => item.id === id)).filter(Boolean);
    return renderScholarshipComparison(selected);
  }
  if (state.compareTab === 'universities') {
    const selected = items.map(id => UNIVERSITIES.find(item => item.id === id)).filter(Boolean);
    return renderUniversityComparison(selected);
  }
  if (state.compareTab === 'countries') {
    const selected = items.map(id => COUNTRIES.find(item => item.id === id)).filter(Boolean);
    return renderCountryComparison(selected);
  }
  return `<div class="no-results">لا توجد عناصر للمقارنة.</div>`;
}

function renderScholarshipComparison(items) {
  return `
    <div class="table-scroll">
      <table class="compare-table">
        <thead>
          <tr>
            <th>المعيار</th>
            ${items.map(item => `<th>${item.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr><td>الدولة</td>${items.map(item => `<td>${item.flag} ${item.country}</td>`).join('')}</tr>
          <tr><td>الدرجة</td>${items.map(item => `<td>${item.degree}</td>`).join('')}</tr>
          <tr><td>التمويل</td>${items.map(item => `<td>${item.funding}</td>`).join('')}</tr>
          <tr><td>الموعد النهائي</td>${items.map(item => `<td>${item.deadline}</td>`).join('')}</tr>
          <tr><td>اللغة</td>${items.map(item => `<td>${item.languageReq}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
    <div class="compare-actions"><button class="outline-button-sm" type="button" onclick="clearCompare()">مسح المقارنة</button></div>
  `;
}

function renderUniversityComparison(items) {
  return `
    <div class="table-scroll">
      <table class="compare-table">
        <thead>
          <tr>
            <th>المعيار</th>
            ${items.map(item => `<th>${item.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr><td>الدولة</td>${items.map(item => `<td>${item.flag} ${item.country}</td>`).join('')}</tr>
          <tr><td>البرامج</td>${items.map(item => `<td>${item.programs.join('، ')}</td>`).join('')}</tr>
          <tr><td>الوصف</td>${items.map(item => `<td>${item.desc}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
    <div class="compare-actions"><button class="outline-button-sm" type="button" onclick="clearCompare()">مسح المقارنة</button></div>
  `;
}

function renderCountryComparison(items) {
  return `
    <div class="table-scroll">
      <table class="compare-table">
        <thead>
          <tr>
            <th>المعيار</th>
            ${items.map(item => `<th>${item.flag} ${item.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr><td>تكلفة المعيشة</td>${items.map(item => `<td>${item.cost}</td>`).join('')}</tr>
          <tr><td>اللغة</td>${items.map(item => `<td>${item.language}</td>`).join('')}</tr>
          <tr><td>التأشيرة</td>${items.map(item => `<td>${item.visa}</td>`).join('')}</tr>
          <tr><td>الطقس</td>${items.map(item => `<td>${item.weather}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
    <div class="compare-actions"><button class="outline-button-sm" type="button" onclick="clearCompare()">مسح المقارنة</button></div>
  `;
}

function clearCompare() {
  state.compareItems[state.compareTab] = [];
  renderPage();
}

function shareArticle(platform) {
  if (!navigator.clipboard) return;
  const url = location.href;
  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,'_blank');
  }
  if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,'_blank');
  }
}

function copyLink() {
  navigator.clipboard.writeText(location.href).then(() => {
    alert('تم نسخ رابط المقال');
  }).catch(() => {
    alert('فشل نسخ الرابط');
  });
}

function observeFadeIns() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(element => observer.observe(element));
}

window.navigateTo = navigateTo;
window.toggleSaveScholarship = toggleSaveScholarship;
window.toggleCompare = toggleCompare;
window.switchCompareTab = switchCompareTab;
window.clearCompare = clearCompare;

initApp();
