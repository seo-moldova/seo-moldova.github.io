(function () {
    'use strict';

    const language = (document.documentElement.lang || 'ru').toLowerCase().split('-')[0];

    function setupNavigation() {
        const header = document.querySelector('header');
        const nav = header?.querySelector('nav');
        const container = header?.querySelector('.header-container');

        if (!nav || !container || container.querySelector('.menu-toggle')) {
            return;
        }

        if (!nav.id) {
            nav.id = 'site-navigation';
        }

        const labels = {
            ru: ['Открыть меню', 'Закрыть меню'],
            ro: ['Deschide meniul', 'Închide meniul'],
            en: ['Open menu', 'Close menu']
        };
        const currentLabels = labels[language] || labels.en;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'menu-toggle';
        toggle.setAttribute('aria-controls', nav.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', currentLabels[0]);
        toggle.innerHTML = '<span class="menu-toggle-lines" aria-hidden="true"></span>';
        container.insertBefore(toggle, nav);

        const closeMenu = () => {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', currentLabels[0]);
        };

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            nav.classList.toggle('is-open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            toggle.setAttribute('aria-label', isOpen ? currentLabels[0] : currentLabels[1]);
        });

        document.addEventListener('click', event => {
            if (!header.contains(event.target)) closeMenu();
        });

        nav.addEventListener('click', event => {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
                toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 960) {
                closeMenu();
            }
        });
    }

    function markCurrentNavigation() {
        const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');

        document.querySelectorAll('header nav a[href]').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/index\.html$/, '/');
            if (!link.hash && linkPath === currentPath) {
                link.setAttribute('aria-current', 'page');
            } else if (link.classList.contains('active')) {
                link.setAttribute('aria-current', 'location');
            }
        });
    }

    function setupContactForms() {
        const messages = {
            ru: {
                sending: 'Отправляем сообщение...',
                success: 'Сообщение отправлено. Я отвечу в течение 24 часов.',
                error: 'Не удалось отправить сообщение. Напишите мне на ipridorojnov@gmail.com.'
            },
            ro: {
                sending: 'Mesajul se trimite...',
                success: 'Mesajul a fost trimis. Voi răspunde în 24 de ore.',
                error: 'Mesajul nu a putut fi trimis. Scrieți la ipridorojnov@gmail.com.'
            },
            en: {
                sending: 'Sending your message...',
                success: 'Your message was sent. I will reply within 24 hours.',
                error: 'The message could not be sent. Email me at ipridorojnov@gmail.com.'
            }
        };
        const copy = messages[language] || messages.en;

        document.querySelectorAll('.feedback-form').forEach(form => {
            const status = form.querySelector('.form-status');
            const submit = form.querySelector('[type="submit"]');
            if (!status || !submit || !window.fetch) {
                return;
            }

            form.addEventListener('submit', async event => {
                event.preventDefault();
                submit.disabled = true;
                status.hidden = false;
                status.className = 'form-status is-pending';
                status.textContent = copy.sending;

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { Accept: 'application/json' }
                    });
                    if (!response.ok) {
                        throw new Error(`Form submission failed: ${response.status}`);
                    }
                    form.reset();
                    status.className = 'form-status is-success';
                    status.textContent = copy.success;
                    form.dispatchEvent(new CustomEvent('contact:submitted', { bubbles: true }));
                } catch (error) {
                    status.className = 'form-status is-error';
                    status.textContent = copy.error;
                } finally {
                    submit.disabled = false;
                }
            });
        });
    }

    function enhanceProjectCards() {
        const metrics = {
            vinrecords: ['73.2K', '+54%'],
            tvn: ['+60%', '+30%'],
            'bursa-muncii': ['+250%', '+300%'],
            cetarom: ['10×', '6×'],
            strand: ['+230%', '+400%'],
            andiva: ['+150%', '+300%'],
            loremaesthetic: ['+300%', '+250%'],
            taxonest: ['+1200%', '+900%'],
            lista: ['+350%', '1,500+'],
            mobilestyles: ['+230%', '6,900+'],
            uls: ['+650%', 'TOP 10'],
            exportportal: ['+400%', '3,100+']
        };
        const labels = {
            ru: {
                vinrecords: ['показов', 'ключевых слов'],
                tvn: ['кликов', 'показов'],
                'bursa-muncii': ['трафика', 'показов'],
                cetarom: ['видимость', 'нижний порог'],
                strand: ['трафика', 'видимости'],
                andiva: ['средний трафик', 'пиковый трафик'],
                loremaesthetic: ['показов', 'кликов'],
                taxonest: ['показов', 'кликов'],
                lista: ['трафика', 'ключевых слов'],
                mobilestyles: ['трафика', 'ключевых слов'],
                uls: ['трафика', 'позиции'],
                exportportal: ['трафика', 'ключевых слов']
            },
            ro: {
                vinrecords: ['afișări', 'cuvinte cheie'], tvn: ['clicuri', 'afișări'],
                'bursa-muncii': ['trafic', 'afișări'], cetarom: ['vizibilitate', 'nivel minim'],
                strand: ['trafic', 'vizibilitate'], andiva: ['trafic mediu', 'trafic maxim'],
                loremaesthetic: ['afișări', 'clicuri'], taxonest: ['afișări', 'clicuri'],
                lista: ['trafic', 'cuvinte cheie'], mobilestyles: ['trafic', 'cuvinte cheie'],
                uls: ['trafic', 'poziții'], exportportal: ['trafic', 'cuvinte cheie']
            },
            en: {
                vinrecords: ['impressions', 'keywords'], tvn: ['clicks', 'impressions'],
                'bursa-muncii': ['traffic', 'impressions'], cetarom: ['visibility', 'baseline traffic'],
                strand: ['traffic', 'visibility'], andiva: ['average traffic', 'peak traffic'],
                loremaesthetic: ['impressions', 'clicks'], taxonest: ['impressions', 'clicks'],
                lista: ['traffic', 'keywords'], mobilestyles: ['traffic', 'keywords'],
                uls: ['traffic', 'rankings'], exportportal: ['traffic', 'keywords']
            }
        };

        document.querySelectorAll('.project-card').forEach(card => {
            if (card.querySelector('.project-card-metrics')) {
                return;
            }

            const slug = new URL(card.href, window.location.origin).pathname.split('/').pop().replace('.html', '');
            if (!metrics[slug]) {
                return;
            }

            const metricLabels = (labels[language] || labels.en)[slug];
            const container = document.createElement('div');
            container.className = 'project-card-metrics';
            container.setAttribute('aria-label', language === 'ru' ? 'Ключевые результаты' : language === 'ro' ? 'Rezultate cheie' : 'Key results');
            metrics[slug].forEach((value, index) => {
                const item = document.createElement('span');
                item.textContent = `${value} ${metricLabels[index]}`;
                container.appendChild(item);
            });
            card.querySelector('.project-card-info')?.appendChild(container);
        });
    }

    function setupAnalyticsConsent() {
        const storageKey = 'analytics-consent';
        const copy = {
            ru: {
                title: 'Настройки аналитики',
                text: 'С вашего согласия сайт использует Google Analytics для оценки посещаемости и улучшения страниц.',
                accept: 'Разрешить аналитику',
                reject: 'Отказаться',
                privacy: 'Политика конфиденциальности',
                privacyUrl: '/privacy.html'
            },
            ro: {
                title: 'Setări de analiză',
                text: 'Cu acordul dvs., site-ul folosește Google Analytics pentru a evalua traficul și a îmbunătăți paginile.',
                accept: 'Accept analiza',
                reject: 'Refuz',
                privacy: 'Politica de confidențialitate',
                privacyUrl: '/ro/privacy.html'
            },
            en: {
                title: 'Analytics settings',
                text: 'With your consent, this site uses Google Analytics to measure visits and improve its pages.',
                accept: 'Allow analytics',
                reject: 'Decline',
                privacy: 'Privacy policy',
                privacyUrl: '/en/privacy.html'
            }
        };
        const currentCopy = copy[language] || copy.en;

        const getChoice = () => {
            try {
                return localStorage.getItem(storageKey);
            } catch (error) {
                return null;
            }
        };

        const setChoice = value => {
            try {
                localStorage.setItem(storageKey, value);
            } catch (error) {
                // The choice remains valid for the current page when storage is unavailable.
            }
        };

        const loadAnalytics = () => {
            if (document.querySelector('script[data-google-analytics]')) {
                return;
            }
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', 'G-W9MHRR5XNT', { anonymize_ip: true });

            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W9MHRR5XNT';
            script.dataset.googleAnalytics = 'true';
            document.head.appendChild(script);
        };

        if (getChoice() === 'accepted') {
            loadAnalytics();
        } else if (getChoice() !== 'declined') {
            const banner = document.createElement('aside');
            banner.className = 'consent-banner';
            banner.setAttribute('aria-label', currentCopy.title);
            banner.innerHTML = `
                <div>
                    <strong>${currentCopy.title}</strong>
                    <p>${currentCopy.text} <a href="${currentCopy.privacyUrl}">${currentCopy.privacy}</a>.</p>
                </div>
                <div class="consent-actions">
                    <button type="button" class="btn btn-outline" data-consent="declined">${currentCopy.reject}</button>
                    <button type="button" class="btn btn-primary" data-consent="accepted">${currentCopy.accept}</button>
                </div>`;
            banner.addEventListener('click', event => {
                const button = event.target.closest('[data-consent]');
                if (!button) {
                    return;
                }
                const choice = button.dataset.consent;
                setChoice(choice);
                banner.remove();
                if (choice === 'accepted') {
                    loadAnalytics();
                }
            });
            document.body.appendChild(banner);
        }

        document.querySelectorAll('[data-reset-consent]').forEach(button => {
            button.addEventListener('click', () => {
                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    // Reloading still restores the default no-analytics state for this page.
                }
                window.location.reload();
            });
        });
    }

    function setupAnalytics() {
        const track = (eventName, parameters) => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, parameters);
            }
        };

        document.addEventListener('click', event => {
            const link = event.target.closest('a');
            if (!link) {
                return;
            }

            const href = link.getAttribute('href') || '';
            let channel = '';
            if (href.startsWith('mailto:')) channel = 'email';
            else if (href.includes('t.me/')) channel = 'telegram';
            else if (href.endsWith('.pdf')) channel = 'cv_download';
            else if (href.includes('contacts.html')) channel = 'contact_page';

            if (channel) {
                track('contact_intent', { channel, link_url: link.href });
            }
        });

        document.querySelectorAll('.feedback-form').forEach(form => {
            form.addEventListener('contact:submitted', () => {
                track('generate_lead', { method: 'contact_form' });
            });
        });
    }

    const main = document.querySelector('main');
    if (main) {
        if (!main.id) main.id = 'main-content';
        const skip = document.createElement('a');
        skip.className = 'skip-link';
        skip.href = '#' + main.id;
        skip.textContent = {ru:'Перейти к содержанию',ro:'Salt la conținut',en:'Skip to content'}[language] || 'Skip to content';
        document.body.prepend(skip);
    }
    setupNavigation();
    markCurrentNavigation();
    enhanceProjectCards();
    setupContactForms();
    setupAnalyticsConsent();
    setupAnalytics();
})();
