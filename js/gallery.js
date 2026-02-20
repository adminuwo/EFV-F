/**
 * EFV Gallery JS - Premium Lightbox Viewer
 */

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            const type = item.getAttribute('data-type');

            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';

            if (type === 'video') {
                lightbox.innerHTML = `
                    <div class="close-lightbox">&times;</div>
                    <video src="${src}" controls autoplay id="lightbox-content"></video>
                `;
            } else {
                lightbox.innerHTML = `
                    <div class="close-lightbox">&times;</div>
                    <img id="lightbox-content" src="${src}" alt="Gallery Image Preview">
                `;
            }

            // Re-bind close button
            lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.innerHTML = '';
        }, 500);
        document.body.style.overflow = 'auto';
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
