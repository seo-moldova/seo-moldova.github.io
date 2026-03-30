// js/seo-schema.js — единый скрипт для всех языков
(function() {
    const path = window.location.pathname;
    
    // Определяем язык по URL
    let lang = 'ru';
    let langPrefix = '';
    if (path.startsWith('/ro/')) {
        lang = 'ro';
        langPrefix = '/ro';
    } else if (path.startsWith('/en/')) {
        lang = 'en';
        langPrefix = '/en';
    }
    
    // Переводы для BreadcrumbList
    const translations = {
        ru: {
            home: "Главная",
            projects: "Проекты",
            experience: "Опыт",
            about: "Обо мне",
            contacts: "Контакты"
        },
        ro: {
            home: "Acasă",
            projects: "Proiecte",
            experience: "Experiență",
            about: "Despre mine",
            contacts: "Contacte"
        },
        en: {
            home: "Home",
            projects: "Projects",
            experience: "Experience",
            about: "About",
            contacts: "Contact"
        }
    };
    
    const t = translations[lang];
    
    // ===== ОБНОВЛЕНИЕ OPEN GRAPH =====
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
    const pageUrl = window.location.href;
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
    if (ogDescription) ogDescription.setAttribute('content', pageDescription);
    if (twitterDescription) twitterDescription.setAttribute('content', pageDescription);
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    
    // ===== ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ JSON-LD =====
    const jsonLdScript = document.getElementById('jsonld-script');
    
    if (jsonLdScript) {
        let currentPage = {
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": pageUrl,
            "isPartOf": { "@id": "https://seo-moldova.github.io/#website" },
            "inLanguage": lang
        };
        
        // Определяем тип страницы
        const cleanPath = path.replace(langPrefix, '');
        
        if (cleanPath === '/' || cleanPath === '/index.html') {
            currentPage["@type"] = "WebSite";
            currentPage["potentialAction"] = {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://seo-moldova.github.io/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            };
        } 
        else if (cleanPath.includes('/projects/') && !cleanPath.includes('/projects.html')) {
            currentPage["@type"] = "CreativeWork";
            currentPage["author"] = { "@id": "https://seo-moldova.github.io/#person" };
            currentPage["datePublished"] = "2025-03-29";
            
            const projectFile = cleanPath.split('/').pop().replace('.html', '');
            currentPage["image"] = `https://seo-moldova.github.io/images/projects/${projectFile}-main.webp`;
            currentPage["inLanguage"] = lang;
        }
        else if (cleanPath.includes('/projects.html')) {
            currentPage["@type"] = "CollectionPage";
            currentPage["numberOfItems"] = 12;
        }
        else if (cleanPath.includes('/about.html')) {
            currentPage["@type"] = "ProfilePage";
            currentPage["mainEntity"] = { "@id": "https://seo-moldova.github.io/#person" };
        }
        else if (cleanPath.includes('/experience.html')) {
            currentPage["@type"] = "ProfilePage";
        }
        else if (cleanPath.includes('/contacts.html')) {
            currentPage["@type"] = "ContactPage";
            currentPage["mainEntity"] = {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "ipridorojnov@gmail.com",
                "url": "https://t.me/Iezuit",
                "availableLanguage": ["Russian", "Romanian", "English"],
                "areaServed": "MD"
            };
        }
        
        try {
            const existingData = JSON.parse(jsonLdScript.textContent);
            if (existingData["@graph"]) {
                const filteredGraph = existingData["@graph"].filter(item => 
                    item["@type"] !== "WebPage" && 
                    item["@type"] !== "WebSite" && 
                    item["@type"] !== "CreativeWork" &&
                    item["@type"] !== "CollectionPage" &&
                    item["@type"] !== "ProfilePage" &&
                    item["@type"] !== "ContactPage"
                );
                filteredGraph.push(currentPage);
                existingData["@graph"] = filteredGraph;
                jsonLdScript.textContent = JSON.stringify(existingData, null, 2);
            }
        } catch(e) {
            console.log('JSON-LD update error:', e);
        }
    }
    
    // ===== BREADCRUMBLIST =====
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    
    const breadcrumbItems = [
        { position: 1, name: t.home, item: `https://seo-moldova.github.io${langPrefix}/` }
    ];
    
    const cleanPath = path.replace(langPrefix, '');
    
    if (cleanPath.includes('/projects.html') || cleanPath.includes('/projects/')) {
        breadcrumbItems.push({ 
            position: 2, 
            name: t.projects, 
            item: `https://seo-moldova.github.io${langPrefix}/projects.html` 
        });
    }
    if (cleanPath.includes('/projects/') && !cleanPath.includes('/projects.html')) {
        let projectName = cleanPath.split('/').pop().replace('.html', '').replace(/-/g, ' ');
        
        // Переводы названий проектов
        const projectNames = {
            ru: {
                tvn: "TVN, MD",
                'bursa-muncii': "Bursa Muncii, MD",
                cetarom: "CETAROM, MD",
                strand: "Strand, MD",
                andiva: "Andiva, MD",
                loremaesthetic: "LorEmAEsthetic, MD",
                taxonest: "TaxOnest, MD",
                lista: "Lista, MD",
                mobilestyles: "MobileStyles, USA",
                uls: "ULS, USA",
                exportportal: "ExportPortal, Global",
                vinrecords: "VinRecords, CA"
            },
            ro: {
                tvn: "TVN, MD",
                'bursa-muncii': "Bursa Muncii, MD",
                cetarom: "CETAROM, MD",
                strand: "Strand, MD",
                andiva: "Andiva, MD",
                loremaesthetic: "LorEmAEsthetic, MD",
                taxonest: "TaxOnest, MD",
                lista: "Lista, MD",
                mobilestyles: "MobileStyles, USA",
                uls: "ULS, USA",
                exportportal: "ExportPortal, Global",
                vinrecords: "VinRecords, CA"
            },
            en: {
                tvn: "TVN, MD",
                'bursa-muncii': "Bursa Muncii, MD",
                cetarom: "CETAROM, MD",
                strand: "Strand, MD",
                andiva: "Andiva, MD",
                loremaesthetic: "LorEmAEsthetic, MD",
                taxonest: "TaxOnest, MD",
                lista: "Lista, MD",
                mobilestyles: "MobileStyles, USA",
                uls: "ULS, USA",
                exportportal: "ExportPortal, Global",
                vinrecords: "VinRecords, CA"
            }
        };
        
        const projectKey = cleanPath.split('/').pop().replace('.html', '');
        if (projectNames[lang] && projectNames[lang][projectKey]) {
            projectName = projectNames[lang][projectKey];
        }
        
        breadcrumbItems.push({ 
            position: 3, 
            name: projectName, 
            item: window.location.href 
        });
    }
    if (cleanPath.includes('/experience.html')) {
        breadcrumbItems.push({ position: 2, name: t.experience, item: `https://seo-moldova.github.io${langPrefix}/experience.html` });
    }
    if (cleanPath.includes('/about.html')) {
        breadcrumbItems.push({ position: 2, name: t.about, item: `https://seo-moldova.github.io${langPrefix}/about.html` });
    }
    if (cleanPath.includes('/contacts.html')) {
        breadcrumbItems.push({ position: 2, name: t.contacts, item: `https://seo-moldova.github.io${langPrefix}/contacts.html` });
    }
    
    breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map(item => ({
            "@type": "ListItem",
            "position": item.position,
            "name": item.name,
            "item": item.item
        }))
    });
    
    document.head.appendChild(breadcrumbScript);
})();