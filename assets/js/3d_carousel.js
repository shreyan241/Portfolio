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
    let activeFilter = null;

    filterButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            console.log(`Filter ${index + 1} clicked: ${filter}`);

            if (activeFilter === filter) {
                this.classList.remove('active');
                activeFilter = null;
                showAllProjects();
            } else {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                activeFilter = filter;
                filterProjects(filter);
            }
        });
    });

    function filterProjects(filter) {
        faces.forEach((face, index) => {
            const tags = face.getAttribute('data-tags').split(',').map(tag => tag.trim());
    
            if (tags.includes(filter)) {
                face.style.display = 'block';
                console.log(`Project ${index + 1} shown for filter: ${filter}`);
            } else {
                face.style.display = 'none';
                console.log(`Project ${index + 1} hidden for filter: ${filter}`);
            }
        });
    }
    

    function showAllProjects() {
        faces.forEach((face, index) => {
            face.style.display = 'block';
            console.log(`Project ${index + 1} shown (all projects)`);
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
