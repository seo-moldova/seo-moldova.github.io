function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    
    const imgElement = document.querySelector('.screenshot-clickable img');
    const altText = imgElement ? imgElement.alt : 'Google Search Console результаты';
    captionText.innerHTML = altText;
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});