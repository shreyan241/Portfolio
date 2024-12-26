document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const faces = document.querySelectorAll('.carousel__face');
    const modal = document.getElementById('demoModal');
    const modalImg = document.getElementById('demoGifInModal');
    const demoButtons = document.querySelectorAll('.demo-btn');
    const closeBtn = document.querySelector('.close-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Check Flip CSS (Optional Debugging Function)
    function checkFlipCSS() {
        if (faces.length > 0) {
            const style = window.getComputedStyle(faces[0]);
            console.log('Transition property:', style.getPropertyValue('transition'));
            console.log('Transform style:', style.getPropertyValue('transform-style'));
            console.log('Backface visibility:', style.getPropertyValue('backface-visibility'));
        } else {
            console.log('No carousel faces found for CSS check');
        }
    }

    // Carousel rotation and pausing
    let isCarouselPaused = false;

    function pauseCarousel() {
        carousel.classList.add('paused');
        isCarouselPaused = true;
        console.log('Carousel paused');
    }

    function resumeCarousel() {
        carousel.classList.remove('paused');
        isCarouselPaused = false;
        console.log('Carousel resumed');
    }

    // Card flipping
    faces.forEach((face, index) => {
        const cardInner = face.querySelector('.card-inner');
        const flipBtn = face.querySelector('.flip-btn');
        const unflipBtn = face.querySelector('.unflip-btn');

        if (flipBtn) {
            flipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cardInner.classList.add('flipped');
                pauseCarousel();
                console.log(`Card ${index + 1} flip attempted`);
                console.log(`Card ${index + 1} classes:`, cardInner.className);
                console.log(`Card ${index + 1} transform:`, window.getComputedStyle(cardInner).transform);
            });
        }

        if (unflipBtn) {
            unflipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cardInner.classList.remove('flipped');
                resumeCarousel();
                console.log(`Card ${index + 1} unflip attempted`);
                console.log(`Card ${index + 1} classes:`, cardInner.className);
                console.log(`Card ${index + 1} transform:`, window.getComputedStyle(cardInner).transform);
            });
        }
    });

    // Demo functionality
    demoButtons.forEach((btn, index) => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const demoType = this.getAttribute('data-demo');
            let gifSrc;

            if (demoType === 'rubiks') {
                gifSrc = 'demos/rubiks.gif';
            } else if (demoType === 'grammar') {
                gifSrc = 'demos/grammar.gif';
            }

            modalImg.src = gifSrc;
            modal.style.display = 'block';
            pauseCarousel();
            console.log(`Demo ${index + 1} shown: ${demoType}`);
        });
    });

    // Close modal functionality
    function closeModal() {
        modal.style.display = 'none';
        resumeCarousel();
        console.log('Modal closed');
    }

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    } else {
        console.log('Close button not found');
    }

    // Filter functionality
    let activeFilters = new Set();

    filterButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            
            if (activeFilters.has(filter)) {
                // Remove filter if already active
                activeFilters.delete(filter);
                this.classList.remove('active');
            } else {
                // Add new filter
                activeFilters.add(filter);
                this.classList.add('active');
            }

            // Show all projects if no filters are active
            if (activeFilters.size === 0) {
                showAllProjects();
            } else {
                filterProjects(activeFilters);
            }

            console.log('Active filters:', Array.from(activeFilters));
        });
    });

    function filterProjects(activeFilters) {
        faces.forEach((face) => {
            const tags = face.getAttribute('data-tags').split(',').map(tag => tag.trim());
            // Show face if it matches ANY of the active filters
            const shouldShow = tags.some(tag => activeFilters.has(tag));
            
            if (shouldShow) {
                face.style.display = 'block';
                face.style.opacity = '1';
            } else {
                face.style.opacity = '0';
                setTimeout(() => {
                    if (!tags.some(tag => activeFilters.has(tag))) {
                        face.style.display = 'none';
                    }
                }, 300); // Match this with CSS transition duration
            }
        });
    }

    function showAllProjects() {
        faces.forEach((face) => {
            face.style.display = 'block';
            // Small delay to allow display to take effect before opacity
            setTimeout(() => {
                face.style.opacity = '1';
            }, 10);
        });
    }

    // Debugging
    console.log('DOMContentLoaded event fired');
    console.log('Number of carousel faces:', faces.length);
    console.log('Number of demo buttons:', demoButtons.length);
    console.log('Number of filter buttons:', filterButtons.length);

    // Log details about each face
    faces.forEach((face, index) => {
        console.log(`Face ${index + 1}:`);
        console.log('  Flip button:', face.querySelector('.flip-btn') ? 'Found' : 'Not found');
        console.log('  Unflip button:', face.querySelector('.unflip-btn') ? 'Found' : 'Not found');
        console.log('  Demo button:', face.querySelector('.demo-btn') ? 'Found' : 'Not found');
    });

    // Global click listener for debugging
    document.addEventListener('click', function (e) {
        console.log('Click detected on:', e.target);
    });

    checkFlipCSS();

    console.log('Carousel setup complete');
});
