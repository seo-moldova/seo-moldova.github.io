// js/seo-schema.js
(function() {
    const path = window.location.pathname;
    
    // ===== ОБНОВЛЕНИЕ OPEN GRAPH =====
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
    const pageUrl = window.location.href;
    
    // Обновляем OG теги
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
            "isPartOf": { "@id": "https://seo-moldova.github.io/#website" }
        };
        
        // Определяем тип страницы
        if (path === '/' || path === '/index.html') {
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
        else if (path.includes('/projects/') && !path.includes('/projects.html')) {
            currentPage["@type"] = "CreativeWork";
            currentPage["author"] = { "@id": "https://seo-moldova.github.io/#person" };
            currentPage["datePublished"] = "2025-03-29";
            
            // Добавляем изображение для проекта
            const projectFile = path.split('/').pop().replace('.html', '');
            currentPage["image"] = `https://seo-moldova.github.io/images/projects/${projectFile}-main.webp`;
        }
        else if (path.includes('/projects.html')) {
            currentPage["@type"] = "CollectionPage";
            currentPage["numberOfItems"] = 12;
        }
        else if (path.includes('/about.html')) {
            currentPage["@type"] = "ProfilePage";
            currentPage["mainEntity"] = { "@id": "https://seo-moldova.github.io/#person" };
        }
        else if (path.includes('/experience.html')) {
            currentPage["@type"] = "ProfilePage";
            currentPage["mainEntity"] = {
                "@type": "ItemList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "SEO и Google Ads стратег (ARA, 2023-2025)" },
                    { "@type": "ListItem", "position": 2, "name": "Senior SEO и PPC специалист (USA Link System, 2022-2023)" },
                    { "@type": "ListItem", "position": 3, "name": "Middle SEO и PPC специалист (USA Link System, 2021-2022)" }
                ]
            };
        }
        else if (path.includes('/contacts.html')) {
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
                // Удаляем старую запись о текущей странице, если есть
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
        { position: 1, name: "Главная", item: "https://seo-moldova.github.io/" }
    ];
    
    if (path.includes('/projects.html') || path.includes('/projects/')) {
        breadcrumbItems.push({ position: 2, name: "Проекты", item: "https://seo-moldova.github.io/projects.html" });
    }
    if (path.includes('/projects/') && !path.includes('/projects.html')) {
        let projectName = path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
        if (projectName === 'tvn') projectName = 'TVN, MD';
        if (projectName === 'bursa muncii') projectName = 'Bursa Muncii, MD';
        if (projectName === 'cetarom') projectName = 'CETAROM, MD';
        if (projectName === 'strand') projectName = 'Strand, MD';
        if (projectName === 'andiva') projectName = 'Andiva, MD';
        if (projectName === 'loremaesthetic') projectName = 'LorEmAEsthetic, MD';
        if (projectName === 'taxonest') projectName = 'TaxOnest, MD';
        if (projectName === 'lista') projectName = 'Lista, MD';
        if (projectName === 'mobilestyles') projectName = 'MobileStyles, USA';
        if (projectName === 'uls') projectName = 'ULS, USA';
        if (projectName === 'exportportal') projectName = 'ExportPortal, Global';
        if (projectName === 'vinrecords') projectName = 'VinRecords, CA';
        breadcrumbItems.push({ position: 3, name: projectName, item: window.location.href });
    }
    if (path.includes('/experience.html')) {
        breadcrumbItems.push({ position: 2, name: "Опыт", item: "https://seo-moldova.github.io/experience.html" });
    }
    if (path.includes('/about.html')) {
        breadcrumbItems.push({ position: 2, name: "Обо мне", item: "https://seo-moldova.github.io/about.html" });
    }
    if (path.includes('/contacts.html')) {
        breadcrumbItems.push({ position: 2, name: "Контакты", item: "https://seo-moldova.github.io/contacts.html" });
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