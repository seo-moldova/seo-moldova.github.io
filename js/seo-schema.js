// js/seo-schema.js — только JSON-LD
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
    
    // ===== ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ JSON-LD =====
    const jsonLdScript = document.getElementById('jsonld-script');
    
    if (jsonLdScript) {
        let currentPage = {
            "@type": "WebPage",
            "name": document.title,
            "description": document.querySelector('meta[name="description"]')?.getAttribute('content') || "",
            "url": window.location.href,
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
})();