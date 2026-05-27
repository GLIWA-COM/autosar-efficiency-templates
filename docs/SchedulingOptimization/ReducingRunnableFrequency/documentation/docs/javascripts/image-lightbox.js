document$.subscribe(function() {
  const images = document.querySelectorAll('main img:not(.no-lightbox)'); 
  
  images.forEach(img => {
    // Skip if already wrapped in a link
    if (img.parentElement.tagName.toLowerCase() === 'a') return;
    
    // 1. Create the GLightbox wrapper (No data-description added this time!)
    const lightboxLink = document.createElement('a');
    lightboxLink.href = img.src;
    lightboxLink.className = 'glightbox';
    lightboxLink.setAttribute('data-type', 'image');
    
    // 2. Assemble the DOM structure
    const figure = img.closest('figure');
    
    if (figure) {
      // If it's a figure, just wrap the image for zooming
      img.parentNode.insertBefore(lightboxLink, img);
      lightboxLink.appendChild(img);
    } else {
      // If it's a standard image, apply the center wrapper too
      const centerWrapper = document.createElement('div');
      centerWrapper.className = 'image-center-wrapper';
      img.parentNode.insertBefore(centerWrapper, img);
      lightboxLink.appendChild(img);
      centerWrapper.appendChild(lightboxLink);
    }
  });

  // 3. Initialize GLightbox
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }
});