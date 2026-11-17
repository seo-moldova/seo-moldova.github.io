// Editorial voice shared by generated service pages. See CONTENT_STYLE.md.
export function applyEditorialCopy(services, locale) {
  const intros = {
    ru: {
      audit: 'Трафик перестал расти, важные страницы не попадают в Google, а после обновления сайта стало хуже? SEO-аудит помогает понять, где искать причину. Я проверю техническую сторону сайта и объясню, какие ошибки мешают поиску, что исправить первым и как проверить результат.',
      promotion: 'Клиент уже ищет вашу услугу. Вопрос в том, найдёт ли он подходящую страницу и захочет ли обратиться. Я занимаюсь SEO-продвижением сайтов: исследую спрос, выстраиваю структуру, пишу и редактирую контент, работаю с техническими ограничениями. Все решения связываю с задачами бизнеса и проверяю по данным.',
      architecture: 'Когда услуги трудно найти, а страницы конкурируют между собой, новые тексты не решают проблему целиком. Я проектирую SEO-структуру сайта на основе спроса: какие разделы нужны, как их связать и куда вести посетителя. При переносе сайта отдельно готовлю карту редиректов и проверяю запуск.',
      local: 'Когда человек ищет услугу рядом, ему нужны понятные ответы: где вы находитесь, чем можете помочь и как связаться. Локальное SEO объединяет работу с Google Business Profile, Google Maps и страницами сайта. Я проверю, насколько точно они представляют ваш бизнес, и помогу устранить пробелы.',
      ads: 'Контекстная реклама должна помогать бизнесу находить клиентов. Клики ещё не означают, что реклама работает на бизнес. Я настраиваю и веду Google Ads так, чтобы было понятно, по каким запросам приходят люди, какие обращения получает компания и сколько они стоят. Можно начать с запуска новых кампаний, аудита действующей рекламы или регулярного ведения.',
      geo: 'Клиенты всё чаще задают вопросы AI-сервисам ещё до перехода на сайт. Я проверяю, появляется ли ваша компания в этих ответах, что о ней говорят и откуда берут информацию. GEO-продвижение помогает сделать сведения о бизнесе понятнее и доступнее для AI-поиска: на сайте, в профилях и реальных внешних упоминаниях.'
    },
    ro: {
      audit: 'Traficul nu mai crește, paginile importante lipsesc din Google sau rezultatele au scăzut după o actualizare? Un audit SEO vă ajută să înțelegeți unde să căutați cauza. Verific partea tehnică a site-ului și explic ce probleme afectează căutarea, ce merită corectat mai întâi și cum verificăm rezultatul.',
      promotion: 'Clientul caută deja serviciul dumneavoastră. Întrebarea este dacă va găsi pagina potrivită și un motiv să vă contacteze. Mă ocup de promovare SEO: cercetez cererea, organizez structura, scriu și editez conținutul și rezolv problemele tehnice. Leg deciziile de obiectivele afacerii și le verific folosind date.',
      architecture: 'Când serviciile sunt greu de găsit, iar paginile concurează între ele, câteva texte noi nu rezolvă totul. Planific structura SEO pornind de la căutările clienților: ce secțiuni sunt necesare, cum se leagă și unde îl conduc pe vizitator. Pentru migrare pregătesc redirecționările și verific lansarea.',
      local: 'Cine caută un serviciu în apropiere vrea să știe unde sunteți, cum îl puteți ajuta și cum vă poate contacta. SEO local leagă Google Business Profile, Google Maps și paginile site-ului. Verific dacă acestea descriu corect afacerea și completez informațiile care lipsesc.',
      ads: 'Clicurile nu spun singure dacă publicitatea ajută afacerea. Configurez și administrez Google Ads pentru a vedea ce caută oamenii, ce solicitări primește compania și cât costă. Putem începe cu o campanie nouă, un audit al contului existent sau administrare lunară.',
      geo: 'Clienții pun întrebări serviciilor AI înainte să ajungă pe un site. Verific dacă afacerea apare în răspunsuri, ce se spune despre ea și ce surse sunt folosite. Optimizarea GEO urmărește ca informația despre companie să fie mai clară și mai accesibilă în căutarea AI: pe site, în profiluri și în mențiuni externe reale.'
    },
    en: {
      audit: 'Has traffic stalled? Are important pages missing from Google, or did performance drop after a website update? A technical SEO audit helps you understand where to look. I review the site, explain what is getting in the way of search, and show you which fixes to make first and how to check them.',
      promotion: 'Your customer is already searching for the service. The question is whether they’ll find the right page and a reason to get in touch. My SEO work connects keyword research, site structure, writing and technical improvements. I tie those decisions to your business goals and check them against the data.',
      architecture: 'When services are hard to find and pages compete with each other, adding more copy only solves part of the problem. I plan SEO website architecture around customer searches: which pages you need, how they connect and where they lead visitors. For a migration, I also prepare redirects and check the launch.',
      local: 'Someone looking for a nearby service needs to know where you are, what you offer and how to contact you. Local SEO brings together your Google Business Profile, Google Maps presence and website. I check how accurately they represent the business and work on what is missing.',
      ads: 'Clicks alone don’t tell you whether advertising is helping the business. I set up and manage Google Ads so you can understand what people search for, which enquiries reach the company and what they cost. We can start with a new campaign, a review of an existing account or ongoing management.',
      geo: 'Customers ask AI services questions before they visit a website. I check whether your business appears in the answers, what they say about it and which sources they use. GEO work makes your business information clearer and easier to access through AI search, across your website, profiles and genuine external mentions.'
    }
  };
  for (const lang of ['ru','ro','en']) {
    for (const key of Object.keys(intros[lang])) services[key].copy[lang].intro = intros[lang][key];
    const p=services.promotion.copy[lang];
    p.process[2] = {
      ru:['Страницы и внедрение','Пишу и редактирую контент, дорабатываю страницы. Технические изменения описываю разработчикам и проверяю после внедрения.'],
      ro:['Pagini și implementare','Scriu și editez conținutul și îmbunătățesc paginile. Pregătesc cerințele tehnice pentru dezvoltatori și verific implementarea.'],
      en:['Pages and implementation','I write and edit the content and improve the pages. I prepare technical requirements for developers and check the implementation.']
    }[lang];
    p.details[1] = {
      ru:['Работа над сайтом','План показывает, что делаем и зачем: какие страницы создаём, что меняем в текстах и какие технические ошибки исправляем. Контент пишу и редактирую сам; внедрение обсуждаю с вашей командой.'],
      ro:['Lucrul la site','Planul arată ce facem și de ce: pagini noi, modificări de conținut și corecții tehnice. Scriu și editez textele personal, iar implementarea o discut cu echipa dumneavoastră.'],
      en:['Work on the website','The plan explains what we’re doing and why: new pages, content changes and technical fixes. I write and edit the copy myself and discuss implementation with your team.']
    }[lang];
    p.inputs={ru:'Пришлите сайт и расскажите, какие услуги или товары важнее, где находятся ваши клиенты и на каких языках они ищут. Понадобятся доступы к Search Console и аналитике. Уточним, кто вносит технические правки; тексты я подготовлю сам.',ro:'Trimiteți site-ul și spuneți ce servicii sau produse sunt prioritare, unde sunt clienții și în ce limbi caută. Voi avea nevoie de acces la Search Console și analiză. Stabilim cine implementează modificările tehnice; textele le pregătesc personal.',en:'Send the website, your priority services or products, and the markets and languages you want to reach. I’ll need Search Console and analytics access. We’ll agree who implements technical changes; I’ll handle the copy.'}[lang];
    p.terms={ru:'Это ежемесячная работа с понятными приоритетами. В согласованный объём входят исследование спроса, структура, написание и редактура контента, работа с разработчиками, проверка изменений и отчёт. Стоимость зависит от сайта и задач — обсудим её до начала.',ro:'Este o colaborare lunară cu priorități clare. Volumul agreat include cercetarea cererii, structura, scrierea și editarea conținutului, colaborarea cu dezvoltatorii, verificarea schimbărilor și raportarea. Discutăm costul înainte de începere.',en:'This is monthly work with clear priorities. The agreed scope covers research, structure, writing and editing, collaboration with developers, implementation checks and reporting. We discuss the fee before starting, based on your website and goals.'}[lang];
    p.outcomes[2]={ru:'Готовый контент и понятный отчёт',ro:'Conținut pregătit și rapoarte clare',en:'Written content and clear reporting'}[lang];
    p.faq.push({
      ru:['Вы пишете тексты для сайта?','Да. Сам исследую тему и запросы, пишу и редактирую тексты для страниц услуг, категорий и статей. От вас нужны достоверные сведения о продукте и проверка фактов, которые знает только ваша команда.'],
      ro:['Scrieți și textele pentru site?','Da. Cercetez subiectul și cuvintele-cheie, apoi scriu și editez paginile de servicii, categorii și articolele. De la dumneavoastră am nevoie de informații corecte despre produs și de verificarea detaliilor pe care le cunoaște echipa.'],
      en:['Do you write the website content too?','Yes. I research the topic and keywords, then write and edit service pages, category copy and articles. I’ll need accurate product information and your team’s help checking facts specific to the business.']
    }[lang]);
    p.faq.push({
      ru:['Чем отличается продвижение интернет-магазина от сайта услуг?','У магазина обычно больше категорий, фильтров и карточек товаров, поэтому важно управлять индексацией и шаблонами. Для сайта услуг чаще начинаем со спроса, убедительного описания предложения и подходящих посадочных страниц. Состав работ зависит от самого сайта.'],
      ro:['Cum diferă SEO pentru un magazin online de un site de servicii?','Un magazin are de obicei mai multe categorii, filtre și produse, deci indexarea și șabloanele cer mai multă atenție. Pentru servicii pornim adesea de la cerere, claritatea ofertei și paginile potrivite. Lucrările depind de site.'],
      en:['How does SEO for an online store differ from a service website?','Stores usually have more categories, filters and product pages, so indexing and templates need particular attention. Service websites often start with demand, a clear offer and the right landing pages. The work depends on the individual website.']
    }[lang]);
    locale[lang].contactText={ru:'Пришлите ссылку на сайт и опишите, что хотите улучшить. Я посмотрю задачу и в течение 24 часов предложу, с чего начать.',ro:'Trimiteți linkul site-ului și spuneți ce doriți să îmbunătățiți. Analizez cererea și răspund în 24 de ore cu o propunere de început.',en:'Send your website and tell me what you’d like to improve. I’ll review the request and reply within 24 hours with a suggested starting point.'}[lang];
    locale[lang].casesTitle={ru:'Как это выглядело в проектах',ro:'Exemple din proiectele mele',en:'Examples from my work'}[lang];
    locale[lang].contactButton={ru:'Обсудить задачу',ro:'Să discutăm obiectivul',en:'Discuss your goals'}[lang];
  }
}
