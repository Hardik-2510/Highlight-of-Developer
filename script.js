/* Gallery & Modal Logic — loop + autoplay + smooth fade */
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = [...document.querySelectorAll('.gallery img')];

  // ----- Modal elements
  const modal     = document.getElementById('modal');
  const modalImg  = modal.querySelector('.modal-img');
  const modalCap  = modal.querySelector('.modal-caption');
  const btnPrev   = modal.querySelector('.prev-btn');
  const btnNext   = modal.querySelector('.next-btn');
  const btnClose  = modal.querySelector('.close-btn');

  // ----- State
  let currentIndex = 0;
  const SLIDE_DELAY = 4000;          // ⏲️ auto‑advance every 4 s
  let autoSlideId = null;            // interval handle

  /* ========= Helpers ========= */

  const startAutoSlide = () => {
    stopAutoSlide();                 // ensure only one interval
    autoSlideId = setInterval(() => showSlide(currentIndex + 1), SLIDE_DELAY);
  };

  const stopAutoSlide = () => {
    if (autoSlideId) clearInterval(autoSlideId);
    autoSlideId = null;
  };

  // swap image with fade‑out / fade‑in
  const showSlide = (index, skipFade = false) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length; // loop

    const img = galleryItems[currentIndex];

    if (!skipFade) {
      modalImg.classList.add('fade-out');
      modalImg.addEventListener(
        'transitionend',
        () => {
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          modalCap.textContent = img.dataset.caption || img.alt || '';
          // Force reflow before fade‑in
          void modalImg.offsetWidth;
          modalImg.classList.remove('fade-out');
        },
        { once: true }
      );
    } else {
      // first render (no fade)
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalCap.textContent = img.dataset.caption || img.alt || '';
    }
  };

  const openModal = (index) => {
    showSlide(index, true);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    startAutoSlide();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopAutoSlide();
  };

  /* ========= Event bindings ========= */

  // Open modal on thumbnail click
  galleryItems.forEach((img, idx) =>
    img.closest('figure').addEventListener('click', () => openModal(idx))
  );

  // Manual arrows
  btnNext.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    startAutoSlide();                // restart timer
  });
  btnPrev.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    startAutoSlide();
  });

  // Close icon
  btnClose.addEventListener('click', closeModal);

  // Keyboard navigation inside modal
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') { showSlide(currentIndex + 1); startAutoSlide(); }
    if (e.key === 'ArrowLeft')  { showSlide(currentIndex - 1); startAutoSlide(); }
    if (e.key === 'Escape') closeModal();
  });

  // Close when clicking the dark backdrop (but not the image / buttons)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
});
