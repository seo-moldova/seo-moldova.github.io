import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const locale = {
  ru: {
    source: 'contacts.html', output: 'privacy.html', home: '/', contact: '/contacts.html',
    url: 'https://seo-moldova.github.io/privacy.html',
    title: 'Политика конфиденциальности | Иван Придорожнов',
    description: 'Как сайт SEO-специалиста Ивана Придорожнова обрабатывает данные из контактной формы и данные веб-аналитики.',
    homeLabel: 'Главная', kicker: 'Контакты', heading: 'Политика конфиденциальности',
    updated: 'Обновлено: 3 августа 2026 года', privacyLabel: 'Политика конфиденциальности',
    reset: 'Изменить выбор аналитики',
    evidence: 'Примечание к данным: показатели относятся к периоду и источникам, показанным в кейсе. Позиции, показы и трафик сами по себе не подтверждают количество заявок или продаж.',
    sections: [
      ['Кто обрабатывает данные', 'Ответственный за данные — Иван Придорожнов. По вопросам конфиденциальности: <a href="mailto:ipridorojnov@gmail.com">ipridorojnov@gmail.com</a>.'],
      ['Какие данные собираются', 'Контактная форма может передавать имя, email, адрес сайта, текст сообщения и отметку о согласии. После согласия на аналитику Google Analytics также может получать технические сведения об устройстве, страницах и источнике перехода.'],
      ['Зачем используются данные', 'Данные формы нужны только для ответа на обращение и обсуждения проекта. Аналитика используется для понимания работы сайта и улучшения его страниц.'],
      ['Сторонние сервисы', 'Форма отправляется через FormSubmit и затем поступает на email. Сайт размещён на GitHub Pages. Google Analytics загружается только после вашего согласия. Эти сервисы могут обрабатывать технические данные по собственным правилам.'],
      ['Срок хранения и ваши права', 'Переписка хранится столько, сколько необходимо для ответа и ведения деловой коммуникации. Вы можете запросить доступ, исправление или удаление своих данных, написав на email выше. Выбор аналитики хранится локально в браузере и может быть сброшен очисткой данных сайта.']
    ]
  },
  ro: {
    source: 'ro/contacts.html', output: 'ro/privacy.html', home: '/ro/index.html', contact: '/ro/contacts.html',
    url: 'https://seo-moldova.github.io/ro/privacy.html',
    title: 'Politica de confidențialitate | Ivan Pridorojnov',
    description: 'Cum portofoliul SEO al lui Ivan Pridorojnov prelucrează mesajele din formular și datele de analiză web.',
    homeLabel: 'Acasă', kicker: 'Contacte', heading: 'Politica de confidențialitate',
    updated: 'Actualizat: 3 august 2026', privacyLabel: 'Politica de confidențialitate',
    reset: 'Modificați opțiunea de analiză',
    evidence: 'Notă privind datele: indicatorii se referă la perioada și sursele prezentate în studiu. Pozițiile, afișările și traficul nu confirmă singure numărul de solicitări sau vânzări.',
    sections: [
      ['Cine prelucrează datele', 'Operatorul datelor este Ivan Pridorojnov. Pentru întrebări despre confidențialitate: <a href="mailto:ipridorojnov@gmail.com">ipridorojnov@gmail.com</a>.'],
      ['Datele colectate', 'Formularul de contact poate transmite numele, adresa de email, site-ul, mesajul și confirmarea consimțământului. După acceptarea analizei, Google Analytics poate primi informații tehnice despre dispozitiv, paginile vizitate și sursa accesării.'],
      ['Cum sunt folosite datele', 'Datele din formular sunt utilizate doar pentru a răspunde solicitării și pentru a discuta un posibil proiect. Datele analitice sunt folosite pentru a înțelege funcționarea site-ului și a îmbunătăți paginile.'],
      ['Servicii terțe', 'Formularul este procesat prin FormSubmit și livrat prin email. Site-ul este găzduit pe GitHub Pages. Google Analytics se încarcă doar după consimțământ. Acești furnizori pot prelucra date tehnice conform propriilor reguli.'],
      ['Păstrarea datelor și drepturile dvs.', 'Corespondența este păstrată numai atât timp cât este necesar pentru răspuns și comunicarea profesională relevantă. Puteți solicita accesul, corectarea sau ștergerea datelor prin email. Alegerea privind analiza este stocată local în browser și poate fi resetată prin ștergerea datelor site-ului.']
    ]
  },
  en: {
    source: 'en/contacts.html', output: 'en/privacy.html', home: '/en/index.html', contact: '/en/contacts.html',
    url: 'https://seo-moldova.github.io/en/privacy.html',
    title: 'Privacy Policy | Ivan Pridorojnov',
    description: 'How Ivan Pridorojnov’s SEO portfolio processes contact form submissions and website analytics data.',
    homeLabel: 'Home', kicker: 'Contact', heading: 'Privacy policy', updated: 'Last updated: August 3, 2026',
    privacyLabel: 'Privacy policy', reset: 'Change analytics choice',
    evidence: 'Data note: metrics refer to the period and sources shown in this case study. Rankings, impressions and traffic alone do not establish the number of enquiries or sales.',
    sections: [
      ['Who processes the data', 'The data controller is Ivan Pridorojnov. For privacy questions, email <a href="mailto:ipridorojnov@gmail.com">ipridorojnov@gmail.com</a>.'],
      ['Data collected', 'The contact form may send your name, email address, website, message and consent confirmation. After analytics consent, Google Analytics may also receive technical information about the device, visited pages and referral source.'],
      ['How the data is used', 'Form data is used only to reply to your enquiry and discuss a possible project. Analytics data is used to understand website performance and improve its pages.'],
      ['Service providers', 'The form is processed by FormSubmit and delivered by email. The website is hosted on GitHub Pages. Google Analytics loads only after consent. These providers may process technical data under their own terms.'],
      ['Retention and your rights', 'Correspondence is retained only as long as needed to answer and maintain relevant business communication. You can request access, correction or deletion by emailing the address above. The analytics choice is stored locally in your browser and can be reset by clearing site data.']
    ]
  }
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  }));
  return files.flat();
}

function languageOf(html) {
  return html.match(/<html lang="([^"]+)/)?.[1]?.slice(0, 2) || 'ru';
}

for (const [language, copy] of Object.entries(locale)) {
  let html = await readFile(path.join(root, copy.source), 'utf8');
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${copy.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${copy.description}">`)
    .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${copy.url}">`)
    .replace(/<meta property="og:url" content="[^"]+">/, `<meta property="og:url" content="${copy.url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${copy.title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${copy.description}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${copy.title}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${copy.description}">`)
    .replace(/https:\/\/seo-moldova\.github\.io\/(?:ro\/|en\/)?contacts\.html/g, value => value.replace('contacts.html', 'privacy.html'))
    .replace(new RegExp(`(<a href="${copy.contact.replaceAll('/', '\\/')}"[^>]*) class="active"`), '$1');

  const sections = copy.sections.map(([heading, body]) => `<section><h2>${heading}</h2><p>${body}</p></section>`).join('\n            ');
  const main = `<main>
        <div class="container legal-page">
            <div class="breadcrumbs"><a href="${copy.home}">${copy.homeLabel}</a><span class="separator">/</span><span class="current">${copy.heading}</span></div>
            <p class="section-kicker">${copy.kicker}</p>
            <h1>${copy.heading}</h1>
            <p>${copy.updated}</p>
            ${sections}
            <button type="button" class="btn btn-outline" data-reset-consent>${copy.reset}</button>
        </div>
    </main>`;
  html = html.replace(/<main>[\s\S]*?<\/main>/, main);
  html = html.replace(/<p class="footer-privacy">[\s\S]*?<\/p>/, `<p class="footer-privacy"><a href="${language === 'ru' ? '/privacy.html' : `/${language}/privacy.html`}">${copy.privacyLabel}</a></p>`);
  await writeFile(path.join(root, copy.output), html, 'utf8');
}

const htmlFiles = (await walk(root)).filter(file => file.endsWith('.html') && !file.includes(`${path.sep}.audit${path.sep}`));
for (const file of htmlFiles) {
  let html = await readFile(file, 'utf8');
  const language = languageOf(html);
  const copy = locale[language] || locale.en;
  const privacyUrl = language === 'ru' ? '/privacy.html' : `/${language}/privacy.html`;
  html = html.replace(/<p class="footer-privacy">[\s\S]*?<\/p>/, `<p class="footer-privacy"><a href="${privacyUrl}">${copy.privacyLabel}</a></p>`);
  if (file.includes(`${path.sep}projects${path.sep}`)) {
    html = html.replace(/<p class="case-evidence-note">[\s\S]*?<\/p>/, `<p class="case-evidence-note">${copy.evidence}</p>`);
  }
  await writeFile(file, html, 'utf8');
}

console.log(`Updated ${htmlFiles.length} HTML files and generated 3 privacy pages.`);
