import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://seo-moldova.github.io';

const locale = {
  ru: {
    htmlLang: 'ru', home: '/', experience: '/experience.html', projects: '/projects.html', about: '/about.html', contacts: '/contacts.html',
    nav: ['Главная', 'Опыт', 'Услуги', 'Проекты', 'Обо мне', 'Контакты'], servicesHome: '/#services', servicePicker: 'Выберите услугу',
    label: 'SEO-услуга', fitTitle: 'Когда эта услуга нужна', deliverTitle: 'Что входит в работу', processTitle: 'Как проходит работа',
    casesTitle: 'Релевантные кейсы', faqTitle: 'Частые вопросы', contactTitle: 'Обсудим задачу вашего сайта',
    contactText: 'Пришлите адрес сайта, регион продвижения и краткое описание задачи. Я отвечу в течение 24 часов и предложу следующий шаг.',
    contactButton: 'Обсудить проект', allCases: 'Все кейсы', result: 'Результат', breadcrumb: 'Услуги', og: 'og-image-ru.png',
    process: [
      ['Диагностика', 'Изучаю сайт, аналитику, рынок и ограничения проекта.'],
      ['Приоритеты', 'Формирую план по влиянию на трафик, риску и стоимости внедрения.'],
      ['Внедрение', 'Готовлю задания, контролирую реализацию и проверяю изменения.'],
      ['Измерение', 'Сравниваю результат с исходной точкой и корректирую стратегию.']
    ]
  },
  ro: {
    htmlLang: 'ro', home: '/ro/index.html', experience: '/ro/experience.html', projects: '/ro/projects.html', about: '/ro/about.html', contacts: '/ro/contacts.html',
    nav: ['Acasă', 'Experiență', 'Servicii', 'Proiecte', 'Despre mine', 'Contacte'], servicesHome: '/ro/index.html#services', servicePicker: 'Alegeți serviciul',
    label: 'Serviciu SEO', fitTitle: 'Când este potrivit serviciul', deliverTitle: 'Ce include lucrul', processTitle: 'Cum decurge colaborarea',
    casesTitle: 'Studii de caz relevante', faqTitle: 'Întrebări frecvente', contactTitle: 'Să discutăm provocarea site-ului',
    contactText: 'Trimiteți adresa site-ului, regiunea vizată și o scurtă descriere a obiectivului. Voi răspunde în 24 de ore cu următorul pas recomandat.',
    contactButton: 'Discută proiectul', allCases: 'Toate proiectele', result: 'Rezultat', breadcrumb: 'Servicii', og: 'og-image-ro.png',
    process: [
      ['Diagnostic', 'Analizez site-ul, datele, piața și limitele proiectului.'],
      ['Priorități', 'Construiesc planul după impact, risc și efortul de implementare.'],
      ['Implementare', 'Pregătesc sarcinile, urmăresc implementarea și verific schimbările.'],
      ['Măsurare', 'Compar rezultatele cu punctul de pornire și ajustez strategia.']
    ]
  },
  en: {
    htmlLang: 'en', home: '/en/index.html', experience: '/en/experience.html', projects: '/en/projects.html', about: '/en/about.html', contacts: '/en/contacts.html',
    nav: ['Home', 'Experience', 'Services', 'Projects', 'About', 'Contact'], servicesHome: '/en/index.html#services', servicePicker: 'Choose a service',
    label: 'SEO service', fitTitle: 'When this service is a fit', deliverTitle: 'What the work includes', processTitle: 'How the engagement works',
    casesTitle: 'Relevant case studies', faqTitle: 'Common questions', contactTitle: 'Let’s discuss your website challenge',
    contactText: 'Send the website, target market and a short description of the goal. I will reply within 24 hours with a recommended next step.',
    contactButton: 'Discuss the project', allCases: 'All case studies', result: 'Result', breadcrumb: 'Services', og: 'og-image-en.png',
    process: [
      ['Diagnosis', 'I review the website, data, market and project constraints.'],
      ['Priorities', 'I build the plan around impact, risk and implementation effort.'],
      ['Implementation', 'I prepare tasks, support delivery and verify every change.'],
      ['Measurement', 'I compare results with the baseline and adjust the strategy.']
    ]
  }
};

const services = {
  audit: {
    slugs: { ru: 'seo-audit', ro: 'audit-seo', en: 'technical-seo-audit' },
    copy: {
      ru: {
        title: 'Технический SEO-аудит сайта', metaTitle: 'Технический SEO аудит сайта | Иван Придорожнов',
        description: 'Технический SEO-аудит: индексация, Core Web Vitals, canonical, hreflang, микроразметка, внутренняя перелинковка и приоритетный план исправлений.',
        intro: 'Нахожу технические и структурные ограничения, которые мешают Google корректно сканировать, понимать и ранжировать сайт. Результат аудита: не список ошибок, а приоритетный план внедрения.',
        fit: ['Органический трафик падает или долго не растёт', 'После редизайна или миграции появились просадки', 'В индексе находятся дубли и технические URL', 'Команда готовит запуск нового сайта'],
        deliver: ['Проверка сканирования и индексации', 'Canonical, hreflang, robots.txt и sitemap', 'Core Web Vitals и шаблоны страниц', 'Внутренняя перелинковка и глубина клика', 'Структурированные данные и HTML-семантика', 'Backlog задач с приоритетом и критериями приёмки'],
        outcomes: ['Понятный порядок исправлений', 'Снижение технических рисков', 'Основа для дальнейшего роста'],
        cases: [['cetarom', 'CETAROM', 'Видимость выросла в 10 раз'], ['tvn', 'TVN', '+60% кликов и +30% показов']],
        faq: [['Что вы получите после аудита?', 'Документ с проблемами, доказательствами, приоритетом, рекомендациями и критериями проверки внедрения.'], ['Вы внедряете исправления?', 'Могу подготовить технические задания, работать с разработчиками и проверить результат после релиза.'], ['Сколько времени занимает аудит?', 'Срок зависит от размера и сложности сайта. После первичной оценки я фиксирую объём и этапы.']]
      },
      ro: {
        title: 'Audit SEO tehnic pentru site', metaTitle: 'Audit SEO tehnic pentru site | Ivan Pridorojnov',
        description: 'Audit SEO tehnic: indexare, Core Web Vitals, canonical, hreflang, microdate, legături interne și plan prioritar de remediere.',
        intro: 'Identific limitele tehnice și structurale care împiedică Google să acceseze, să înțeleagă și să claseze corect site-ul. Livrabilul este un plan prioritar, nu doar o listă de erori.',
        fit: ['Traficul organic scade sau stagnează', 'Migrarea ori redesignul a produs pierderi', 'În index apar duplicate și URL-uri tehnice', 'Echipa pregătește lansarea unui site nou'],
        deliver: ['Crawl și indexare', 'Canonical, hreflang, robots.txt și sitemap', 'Core Web Vitals și șabloane', 'Legături interne și adâncimea paginilor', 'Date structurate și HTML semantic', 'Backlog prioritar cu criterii de acceptare'],
        outcomes: ['Ordine clară a remedierilor', 'Riscuri tehnice mai mici', 'Fundație pentru creștere'],
        cases: [['cetarom', 'CETAROM', 'Vizibilitate de 10 ori mai mare'], ['tvn', 'TVN', '+60% clicuri și +30% afișări']],
        faq: [['Ce primesc după audit?', 'Un document cu probleme, dovezi, priorități, recomandări și criterii de verificare.'], ['Ajutați la implementare?', 'Pot pregăti sarcini tehnice, colabora cu dezvoltatorii și valida schimbările după lansare.'], ['Cât durează auditul?', 'Durata depinde de dimensiunea și complexitatea site-ului. Volumul este stabilit după evaluarea inițială.']]
      },
      en: {
        title: 'Technical SEO audit', metaTitle: 'Technical SEO Audit Services | Ivan Pridorojnov',
        description: 'Technical SEO audit covering indexing, Core Web Vitals, canonicals, hreflang, structured data, internal links and a prioritized implementation plan.',
        intro: 'I identify the technical and structural constraints that prevent Google from crawling, understanding and ranking the website correctly. The output is a prioritized implementation plan, not a generic issue list.',
        fit: ['Organic traffic is declining or has stalled', 'A redesign or migration caused losses', 'Duplicate and technical URLs appear in the index', 'The team is preparing a new website launch'],
        deliver: ['Crawling and indexation review', 'Canonicals, hreflang, robots.txt and sitemap', 'Core Web Vitals and page templates', 'Internal linking and click depth', 'Structured data and semantic HTML', 'Prioritized backlog with acceptance criteria'],
        outcomes: ['Clear implementation order', 'Lower technical risk', 'A foundation for sustainable growth'],
        cases: [['cetarom', 'CETAROM', '10× visibility growth'], ['tvn', 'TVN', '+60% clicks and +30% impressions']],
        faq: [['What do I receive after the audit?', 'A document with evidence, priorities, recommendations and acceptance criteria for each important issue.'], ['Can you support implementation?', 'Yes. I can prepare developer tasks, work with the delivery team and validate changes after release.'], ['How long does an audit take?', 'Timing depends on website size and complexity. I confirm the scope after the initial review.']]
      }
    }
  },
  promotion: {
    slugs: { ru: 'seo-promotion', ro: 'promovare-seo', en: 'seo-services' },
    copy: {
      ru: {
        title: 'Комплексное SEO-продвижение', metaTitle: 'SEO продвижение сайта под ключ | Иван Придорожнов',
        description: 'Комплексное SEO-продвижение: стратегия, семантика, контент, техническая оптимизация, аналитика и регулярная работа над ростом органического трафика.',
        intro: 'Выстраиваю системную работу над органическим каналом: от исследования спроса и технического фундамента до контента, перелинковки и измерения бизнес-результата.',
        fit: ['Нужен стабильный органический канал привлечения', 'Сайт получает показы, но мало целевых переходов', 'Нет общей SEO-стратегии и приоритетов', 'Нужно масштабировать существующий результат'],
        deliver: ['Исследование спроса и конкурентов', 'Семантика, кластеры и карта страниц', 'Технический backlog', 'Контент-план и on-page оптимизация', 'Внутренняя перелинковка', 'GA4, GSC и регулярная отчётность'],
        outcomes: ['Расширение поискового спроса', 'Рост целевого трафика', 'Понятная система управления SEO'],
        cases: [['strand', 'Strand', '+230% среднего трафика'], ['exportportal', 'ExportPortal', '+400% органического трафика']],
        faq: [['Когда появятся первые результаты?', 'SEO имеет накопительный эффект. Первые изменения могут появиться после индексации внедрений, а устойчивый результат оценивается на более длинном периоде.'], ['Можно гарантировать позиции?', 'Нет. Корректно гарантировать качество работ, прозрачный процесс и измерение результата, но не конкретную позицию Google.'], ['Как строится отчётность?', 'Фиксируем исходную точку и KPI, затем отслеживаем внедрения, видимость, трафик и конверсии.']]
      },
      ro: {
        title: 'Promovare SEO completă', metaTitle: 'Promovare SEO site-uri | Ivan Pridorojnov',
        description: 'Promovare SEO completă: strategie, semantică, conținut, optimizare tehnică, analiză și lucru continuu pentru creșterea traficului organic.',
        intro: 'Construiesc un canal organic sistematic: de la cercetarea cererii și fundația tehnică până la conținut, legături interne și măsurarea rezultatului de business.',
        fit: ['Este necesar un canal organic stabil', 'Site-ul are afișări, dar puține vizite relevante', 'Lipsește strategia și ordinea priorităților', 'Rezultatele existente trebuie scalate'],
        deliver: ['Cercetarea cererii și concurenților', 'Semantică, clustere și hartă de pagini', 'Backlog tehnic', 'Plan editorial și optimizare on-page', 'Legături interne', 'GA4, GSC și raportare regulată'],
        outcomes: ['Acoperire mai mare a cererii', 'Creșterea traficului relevant', 'Sistem clar de administrare SEO'],
        cases: [['strand', 'Strand', '+230% trafic mediu'], ['exportportal', 'ExportPortal', '+400% trafic organic']],
        faq: [['Când apar primele rezultate?', 'SEO are efect cumulativ. Primele schimbări pot apărea după indexarea implementărilor, iar rezultatul stabil se evaluează pe o perioadă mai lungă.'], ['Puteți garanta poziții?', 'Nu. Pot fi garantate calitatea lucrului, procesul transparent și măsurarea, nu o poziție exactă în Google.'], ['Cum funcționează raportarea?', 'Stabilim punctul inițial și KPI, apoi urmărim implementările, vizibilitatea, traficul și conversiile.']]
      },
      en: {
        title: 'Ongoing SEO services', metaTitle: 'Ongoing SEO Services | Ivan Pridorojnov',
        description: 'Ongoing SEO services covering strategy, keyword research, content, technical optimization, analytics and continuous organic traffic growth.',
        intro: 'I build a systematic organic acquisition channel, from demand research and the technical foundation to content, internal linking and measurement of business outcomes.',
        fit: ['You need a sustainable organic acquisition channel', 'The site earns impressions but few qualified visits', 'There is no shared SEO strategy or priority order', 'Existing organic performance needs to scale'],
        deliver: ['Demand and competitor research', 'Keywords, clusters and page map', 'Technical backlog', 'Content plan and on-page optimization', 'Internal linking', 'GA4, GSC and regular reporting'],
        outcomes: ['Broader search demand coverage', 'More qualified organic traffic', 'A clear SEO operating system'],
        cases: [['strand', 'Strand', '+230% average traffic'], ['exportportal', 'ExportPortal', '+400% organic traffic']],
        faq: [['When should I expect results?', 'SEO compounds over time. Early movement may follow indexation of changes, while sustainable impact needs a longer measurement period.'], ['Can you guarantee rankings?', 'No. It is reasonable to guarantee work quality, a transparent process and measurement, but not a specific Google position.'], ['How does reporting work?', 'We agree on a baseline and KPIs, then track implementation, visibility, traffic and conversions.']]
      }
    }
  },
  architecture: {
    slugs: { ru: 'site-structure', ro: 'structura-site', en: 'site-architecture' },
    copy: {
      ru: {
        title: 'SEO-структура и миграция сайта', metaTitle: 'SEO структура сайта и безопасная миграция | Иван Придорожнов',
        description: 'Проектирование SEO-структуры, карта страниц, таксономия и миграция сайта без потери органического трафика.',
        intro: 'Проектирую архитектуру вокруг поискового спроса и пользовательских задач. При миграции сохраняю ценные URL, сигналы и путь поискового робота.',
        fit: ['Создаётся новый сайт или направление', 'Каталог трудно масштабировать', 'Страницы конкурируют между собой', 'Планируется смена CMS, домена или URL'],
        deliver: ['Карта спроса и типов страниц', 'Иерархия категорий и таксономия', 'Правила URL, canonical и пагинации', 'Матрица редиректов для миграции', 'Навигация и перелинковка', 'Контроль до и после релиза'],
        outcomes: ['Понятная архитектура', 'Снижение риска потери трафика', 'Основа для масштабирования'],
        cases: [['bursa-muncii', 'Bursa Muncii', '+250% органического трафика'], ['vinrecords', 'VinRecords', '73,2K показов за 5 месяцев']],
        faq: [['Когда SEO нужно подключать к разработке?', 'До утверждения структуры, URL и шаблонов. Чем позже подключается SEO, тем дороже исправлять архитектурные решения.'], ['Можно полностью исключить просадку при миграции?', 'Нельзя обещать нулевую волатильность, но можно существенно снизить риск подготовкой редиректов, проверок и мониторинга.'], ['Что нужно от команды разработки?', 'Доступ к карте URL, шаблонам, тестовому окружению и ответственному за внедрение.']]
      },
      ro: {
        title: 'Structură SEO și migrare de site', metaTitle: 'Structură SEO și migrare site | Ivan Pridorojnov',
        description: 'Proiectarea structurii SEO, harta paginilor, taxonomie și migrarea site-ului cu protejarea traficului organic.',
        intro: 'Proiectez arhitectura în jurul cererii de căutare și al sarcinilor utilizatorilor. La migrare păstrez URL-urile valoroase, semnalele și traseul crawlerului.',
        fit: ['Se lansează un site sau o direcție nouă', 'Catalogul este greu de scalat', 'Paginile concurează între ele', 'Urmează schimbarea CMS-ului, domeniului sau URL-urilor'],
        deliver: ['Harta cererii și tipurilor de pagini', 'Ierarhie și taxonomie', 'Reguli pentru URL, canonical și paginare', 'Matrice de redirecturi', 'Navigare și legături interne', 'Control înainte și după lansare'],
        outcomes: ['Arhitectură ușor de înțeles', 'Risc redus la migrare', 'Bază pentru scalare'],
        cases: [['bursa-muncii', 'Bursa Muncii', '+250% trafic organic'], ['vinrecords', 'VinRecords', '73,2K afișări în 5 luni']],
        faq: [['Când trebuie implicat SEO în dezvoltare?', 'Înainte de aprobarea structurii, URL-urilor și șabloanelor. Corectarea târzie este mai costisitoare.'], ['Poate fi eliminată complet scăderea la migrare?', 'Nu poate fi promisă volatilitate zero, dar riscul poate fi redus semnificativ prin redirecturi, verificări și monitorizare.'], ['Ce este necesar de la dezvoltatori?', 'Acces la harta URL-urilor, șabloane, mediul de testare și o persoană responsabilă de implementare.']]
      },
      en: {
        title: 'SEO site architecture and migration', metaTitle: 'SEO Site Architecture and Migration | Ivan Pridorojnov',
        description: 'SEO site architecture, page mapping, taxonomy and website migration planning that protects valuable organic traffic.',
        intro: 'I design architecture around search demand and user tasks. During migration, I protect valuable URLs, search signals and crawler paths.',
        fit: ['A new website or business line is launching', 'The catalogue is difficult to scale', 'Pages compete with each other', 'A CMS, domain or URL migration is planned'],
        deliver: ['Demand and page-type map', 'Category hierarchy and taxonomy', 'URL, canonical and pagination rules', 'Migration redirect matrix', 'Navigation and internal linking', 'Pre-launch and post-launch validation'],
        outcomes: ['Clear site architecture', 'Lower migration risk', 'A scalable search foundation'],
        cases: [['bursa-muncii', 'Bursa Muncii', '+250% organic traffic'], ['vinrecords', 'VinRecords', '73.2K impressions in 5 months']],
        faq: [['When should SEO join development?', 'Before the structure, URLs and templates are approved. Architecture becomes more expensive to correct later.'], ['Can a migration have zero traffic loss?', 'Zero volatility cannot be promised, but redirect planning, validation and monitoring can materially reduce the risk.'], ['What is needed from developers?', 'Access to the URL map, templates, staging environment and an owner for implementation.']]
      }
    }
  },
  local: {
    slugs: { ru: 'local-seo', ro: 'seo-local', en: 'local-seo' },
    copy: {
      ru: {
        title: 'Локальное SEO и Google Business Profile', metaTitle: 'Локальное SEO продвижение в Google | Иван Придорожнов',
        description: 'Локальное SEO: Google Business Profile, страницы локаций, локальная семантика, отзывы, карты и аналитика обращений.',
        intro: 'Помогаю локальному бизнесу стать заметнее по запросам с географическим намерением в обычной выдаче и Google Maps.',
        fit: ['Клиенты ищут услугу рядом с собой', 'Карточка компании получает мало обращений', 'Есть несколько филиалов или регионов', 'Сайт не ранжируется по локальным запросам'],
        deliver: ['Аудит Google Business Profile', 'Локальная семантика и страницы услуг', 'Данные компании и согласованность NAP', 'Категории, услуги, фото и публикации', 'Работа с отзывами и репутацией', 'Отслеживание звонков, маршрутов и заявок'],
        outcomes: ['Больше локальной видимости', 'Полнее карточка компании', 'Измеримые обращения из поиска'],
        cases: [['loremaesthetic', 'LorEmA Esthetic', '+300% показов и +250% кликов'], ['cetarom', 'CETAROM', 'Видимость выросла в 10 раз']],
        faq: [['Нужен ли сайт для локального SEO?', 'Google Business Profile может работать самостоятельно, но сайт усиливает релевантность услуг, регионов и доверие пользователя.'], ['Как работать с несколькими филиалами?', 'Для каждой реальной локации нужны корректные данные, уникальная локальная информация и понятная связь с сайтом.'], ['Можно ли быстро получить отзывы?', 'Используется системный запрос отзывов у реальных клиентов. Покупка и публикация фиктивных отзывов не применяются.']]
      },
      ro: {
        title: 'SEO local și Google Business Profile', metaTitle: 'Servicii SEO local în Google | Ivan Pridorojnov',
        description: 'SEO local: Google Business Profile, pagini pentru locații, semantică locală, recenzii, hărți și măsurarea solicitărilor.',
        intro: 'Ajut afacerile locale să fie mai vizibile pentru căutările geografice în rezultatele organice și Google Maps.',
        fit: ['Clienții caută serviciul în apropiere', 'Profilul companiei aduce puține solicitări', 'Există mai multe filiale sau regiuni', 'Site-ul nu se clasează pentru interogări locale'],
        deliver: ['Audit Google Business Profile', 'Semantică și pagini locale', 'Datele companiei și consistența NAP', 'Categorii, servicii, fotografii și postări', 'Proces pentru recenzii și reputație', 'Măsurarea apelurilor, rutelor și cererilor'],
        outcomes: ['Vizibilitate locală mai bună', 'Profil complet și relevant', 'Solicitări măsurabile din căutare'],
        cases: [['loremaesthetic', 'LorEmA Esthetic', '+300% afișări și +250% clicuri'], ['cetarom', 'CETAROM', 'Vizibilitate de 10 ori mai mare']],
        faq: [['Este necesar un site pentru SEO local?', 'Google Business Profile poate funcționa separat, dar site-ul întărește relevanța serviciilor, regiunilor și încrederea.'], ['Cum se lucrează cu mai multe filiale?', 'Fiecare locație reală are nevoie de date corecte, informație locală unică și o legătură clară cu site-ul.'], ['Pot fi obținute rapid recenzii?', 'Se construiește un proces de solicitare de la clienți reali. Recenziile false nu sunt folosite.']]
      },
      en: {
        title: 'Local SEO and Google Business Profile', metaTitle: 'Local SEO Services | Ivan Pridorojnov',
        description: 'Local SEO services covering Google Business Profile, location pages, local keywords, reviews, maps visibility and lead measurement.',
        intro: 'I help local businesses become more visible for geographic search intent in organic results and Google Maps.',
        fit: ['Customers search for the service nearby', 'The business profile generates few enquiries', 'The company has multiple locations or regions', 'The website does not rank for local searches'],
        deliver: ['Google Business Profile audit', 'Local keyword and service pages', 'Business data and NAP consistency', 'Categories, services, photos and updates', 'Review and reputation process', 'Tracking calls, directions and enquiries'],
        outcomes: ['Greater local visibility', 'A complete and relevant profile', 'Measurable enquiries from search'],
        cases: [['loremaesthetic', 'LorEmA Esthetic', '+300% impressions and +250% clicks'], ['cetarom', 'CETAROM', '10× visibility growth']],
        faq: [['Do I need a website for local SEO?', 'Google Business Profile can work independently, but a website strengthens service and location relevance and user trust.'], ['How are multiple locations handled?', 'Each real location needs accurate data, useful local information and a clear relationship with the website.'], ['Can reviews be generated quickly?', 'The right approach is a consistent request process for real customers. Fake or purchased reviews are not used.']]
      }
    }
  }
};

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function serviceUrl(key, lang) {
  return `${origin}/services/${lang}/${services[key].slugs[lang]}.html`;
}

function projectUrl(slug, lang) {
  return `/projects/${lang}/${slug}.html`;
}

function render(key, lang) {
  const ui = locale[lang];
  const service = services[key];
  const copy = service.copy[lang];
  const privacy = lang === 'ru'
    ? ['/privacy.html', 'Политика конфиденциальности']
    : lang === 'ro'
      ? ['/ro/privacy.html', 'Politica de confidențialitate']
      : ['/en/privacy.html', 'Privacy policy'];
  const canonical = serviceUrl(key, lang);
  const alternates = Object.keys(locale).map(code => `    <link rel="alternate" hreflang="${code}" href="${serviceUrl(key, code)}">`).join('\n');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': `${canonical}#service`, name: copy.title, description: copy.description, provider: { '@id': `${origin}/#person` }, areaServed: ['MD', 'EU', 'US', 'CA'], url: canonical },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.nav[0], item: `${origin}${ui.home}` },
        { '@type': 'ListItem', position: 2, name: ui.breadcrumb, item: `${origin}${ui.servicesHome}` },
        { '@type': 'ListItem', position: 3, name: copy.title, item: canonical }
      ] }
    ]
  };
  const navLinks = [ui.home, ui.experience, ui.servicesHome, ui.projects, ui.about, ui.contacts]
    .map((href, index) => `<li><a href="${href}"${index === 2 ? ' class="active"' : ''}>${ui.nav[index]}</a></li>`).join('\n                    ');
  const langLinks = Object.keys(locale).map(code => `<li><a href="${serviceUrl(key, code).replace(origin, '')}"${code === lang ? ' class="active"' : ''}>${code === 'ru' ? 'РУС' : code.toUpperCase()}</a></li>`).join('\n                    ');
  const serviceLinks = Object.keys(services).map(serviceKey => {
    const href = serviceUrl(serviceKey, lang).replace(origin, '');
    const title = services[serviceKey].copy[lang].title;
    return `<a href="${href}"${serviceKey === key ? ' aria-current="page"' : ''}>${title}</a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="${ui.htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${copy.metaTitle}</title>
    <meta name="description" content="${copy.description}">
    <meta name="author" content="Ivan Pridorojnov">
    <link rel="canonical" href="${canonical}">
${alternates}
    <link rel="alternate" hreflang="x-default" href="${serviceUrl(key, 'en')}">
    <link rel="icon" type="image/x-icon" href="/images/favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/portfolio.css">
    <link rel="stylesheet" href="/css/editorial.css">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${copy.metaTitle}">
    <meta property="og:description" content="${copy.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${origin}/images/${ui.og}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${copy.metaTitle}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${copy.metaTitle}">
    <meta name="twitter:description" content="${copy.description}">
    <meta name="twitter:image" content="${origin}/images/${ui.og}">
    <meta name="twitter:image:alt" content="${copy.metaTitle}">
    <script type="application/ld+json" id="jsonld-script">${escapeJson(schema)}</script>
    <script src="/js/seo-schema.js" defer></script>
    <script src="/js/site.js" defer></script>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="logo"><a href="${ui.home}">IVAN PRIDOROJNOV</a></div>
            <nav>
                <ul class="main-nav">${navLinks}</ul>
                <ul class="lang-switcher">${langLinks}</ul>
            </nav>
        </div>
    </header>
    <main>
        <section class="service-hero">
            <div class="container">
                <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${ui.home}">${ui.nav[0]}</a><span class="separator">/</span><a href="${ui.servicesHome}">${ui.breadcrumb}</a><span class="separator">/</span><span class="current">${copy.title}</span></nav>
                <span class="section-kicker">${ui.label}</span>
                <h1>${copy.title}</h1>
                <p>${copy.intro}</p>
                <div class="hero-buttons"><a href="${ui.contacts}" class="btn btn-primary">${ui.contactButton}</a><a href="${ui.projects}" class="btn btn-outline">${ui.allCases}</a></div>
            </div>
        </section>
        <section class="service-switcher-section">
            <div class="container">
                <span class="section-kicker">${ui.servicePicker}</span>
                <nav class="service-switcher" aria-label="${ui.servicePicker}">${serviceLinks}</nav>
            </div>
        </section>
        <section class="container service-fit">
            <div class="service-section-title"><span class="section-kicker">01</span><h2>${ui.fitTitle}</h2></div>
            <ul class="fit-list">${copy.fit.map(item => `<li>${item}</li>`).join('')}</ul>
        </section>
        <section class="service-deliverables">
            <div class="container">
                <div class="service-section-title"><span class="section-kicker">02</span><h2>${ui.deliverTitle}</h2></div>
                <div class="deliverables-grid">${copy.deliver.map((item, index) => `<div class="deliverable"><span>${String(index + 1).padStart(2, '0')}</span><h3>${item}</h3></div>`).join('')}</div>
                <div class="outcome-strip">${copy.outcomes.map(item => `<strong>${item}</strong>`).join('')}</div>
            </div>
        </section>
        <section class="container service-process">
            <div class="service-section-title"><span class="section-kicker">03</span><h2>${ui.processTitle}</h2></div>
            <ol class="process-grid">${ui.process.map(([title, text], index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>
        </section>
        <section class="service-evidence">
            <div class="container">
                <div class="service-section-title"><span class="section-kicker">04</span><h2>${ui.casesTitle}</h2></div>
                <div class="evidence-grid">${copy.cases.map(([slug, title, metric]) => `<a href="${projectUrl(slug, lang)}" class="evidence-card"><img src="/images/projects/${slug}-${slug === 'vinrecords' ? 'main' : 'thumb'}.webp" alt="${title}" width="1200" height="900" loading="lazy" decoding="async"><div><span>${ui.result}</span><h3>${title}</h3><strong>${metric}</strong></div></a>`).join('')}</div>
            </div>
        </section>
        <section class="container service-faq">
            <div class="service-section-title"><span class="section-kicker">05</span><h2>${ui.faqTitle}</h2></div>
            <div class="faq-list">${copy.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div>
        </section>
        <section class="container cta-section service-cta"><div class="cta-card"><span class="section-kicker">${ui.label}</span><h2>${ui.contactTitle}</h2><p>${ui.contactText}</p><div class="cta-buttons"><a href="${ui.contacts}" class="btn btn-primary">${ui.contactButton}</a><a href="mailto:ipridorojnov@gmail.com" class="btn btn-outline">ipridorojnov@gmail.com</a></div></div></section>
    </main>
    <footer><div class="container"><p>© 2026 Ivan Pridorojnov · SEO</p><p><a href="mailto:ipridorojnov@gmail.com">ipridorojnov@gmail.com</a> | <a href="https://t.me/Iezuit" target="_blank" rel="noopener noreferrer">Telegram</a> | <a href="https://www.linkedin.com/in/ivan-pridorojnov-2197571a7/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p><p class="footer-privacy"><a href="${privacy[0]}">${privacy[1]}</a></p></div></footer>
</body>
</html>`;
}

for (const [key, service] of Object.entries(services)) {
  for (const lang of Object.keys(locale)) {
    const directory = path.join(root, 'services', lang);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${service.slugs[lang]}.html`), render(key, lang), 'utf8');
  }
}

console.log(`Generated ${Object.keys(services).length * Object.keys(locale).length} service pages.`);
