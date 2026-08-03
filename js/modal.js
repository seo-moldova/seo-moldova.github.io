let lastFocusedElement = null;

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');

    if (!modal || !modalImg || !captionText) return;

    lastFocusedElement = document.activeElement;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    modalImg.src = imageSrc;

    const targetPath = new URL(imageSrc, window.location.href).pathname;
    const imgElement = Array.from(document.querySelectorAll('.screenshot-clickable img'))
        .find((image) => new URL(image.currentSrc || image.src, window.location.href).pathname === targetPath);
    const altText = imgElement ? imgElement.alt : 'Google Search Console результаты';
    modalImg.alt = altText;
    captionText.textContent = altText;

    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    if (!modal) return;

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalImg?.removeAttribute('src');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
}

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    if (!modal || modal.style.display !== 'block') return;

    if (event.key === 'Escape') {
        closeModal();
    } else if (event.key === 'Tab') {
        event.preventDefault();
        modal.querySelector('.modal-close')?.focus();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const lang = document.documentElement.lang || 'en';
    const labels = {
        ru: { close: 'Закрыть изображение', open: 'Открыть изображение' },
        ro: { close: 'Închide imaginea', open: 'Deschide imaginea' },
        en: { close: 'Close image', open: 'Open image' }
    };
    const currentLabels = labels[lang] || labels.en;
    const modal = document.getElementById('imageModal');
    const closeButton = modal?.querySelector('.modal-close');

    closeButton?.setAttribute('aria-label', currentLabels.close);

    document.querySelectorAll('.screenshot-clickable').forEach((container) => {
        const image = container.querySelector('img');
        if (!image) return;

        container.setAttribute('role', 'button');
        container.setAttribute('tabindex', '0');
        container.setAttribute('aria-label', `${currentLabels.open}: ${image.alt}`);
        container.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(image.currentSrc || image.src);
            }
        });
    });
});
