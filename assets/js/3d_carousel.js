document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    const faces = document.querySelectorAll('.carousel__face');
    const modal = document.getElementById('demoModal');
    const modalImg = document.getElementById('demoGifInModal');
    const demoButtons = document.querySelectorAll('.demo-btn');
    const closeBtn = document.querySelector('.close-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Carousel interaction variables
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentRotation = 0;
    let autoRotationSpeed = 9; // degrees per second (360deg / 40s = 9deg/s)
    let lastTime = 0;
    let autoRotationAnimation = null;
    let velocity = 0;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    const maxSpeed = 720; // Maximum degrees per second
    const minSpeed = 9; // Minimum auto-rotation speed
    let isUserControlled = false;

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
        if (!isUserControlled) {
            carousel.classList.remove('paused');
            isCarouselPaused = false;
            console.log('Carousel resumed');
        }
    }

    // Carousel control functions
    function updateCarouselRotation(rotation) {
        carousel.style.transform = `rotateY(${rotation}deg)`;
        currentRotation = rotation;
    }

    function startAutoRotation() {
        if (autoRotationAnimation) {
            cancelAnimationFrame(autoRotationAnimation);
        }

        // Ensure we continue from current position, not reset to CSS animation
        carousel.classList.add('user-controlled');
        
        function animate() {
            if (!isDragging && !isCarouselPaused) {
                const now = performance.now();
                if (lastTime) {
                    const deltaTime = (now - lastTime) / 1000; // Convert to seconds
                    currentRotation -= autoRotationSpeed * deltaTime;
                    updateCarouselRotation(currentRotation);
                }
                lastTime = now;
                autoRotationAnimation = requestAnimationFrame(animate);
            }
        }
        lastTime = performance.now();
        autoRotationAnimation = requestAnimationFrame(animate);
    }

    function startUserRotation(speed) {
        isUserControlled = true;
        carousel.classList.add('user-controlled');
        
        if (autoRotationAnimation) {
            cancelAnimationFrame(autoRotationAnimation);
        }

        function animate() {
            if (isUserControlled && Math.abs(speed) > 0.5) {
                const now = performance.now();
                if (lastTime) {
                    const deltaTime = (now - lastTime) / 1000;
                    currentRotation -= speed * deltaTime;
                    updateCarouselRotation(currentRotation);
                    
                    // Apply friction
                    speed *= 0.95;
                }
                lastTime = now;
                autoRotationAnimation = requestAnimationFrame(animate);
            } else {
                // Smoothly transition to auto rotation without position jump
                lastTime = performance.now();
                autoRotationAnimation = requestAnimationFrame(function animate() {
                    if (!isDragging && !isCarouselPaused) {
                        const now = performance.now();
                        if (lastTime) {
                            const deltaTime = (now - lastTime) / 1000;
                            currentRotation -= autoRotationSpeed * deltaTime;
                            updateCarouselRotation(currentRotation);
                        }
                        lastTime = now;
                        autoRotationAnimation = requestAnimationFrame(animate);
                    }
                });
            }
        }
        lastTime = performance.now();
        autoRotationAnimation = requestAnimationFrame(animate);
    }

    // Mouse and touch event handlers
    function getEventX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    function getEventY(e) {
        return e.touches ? e.touches[0].clientY : e.clientY;
    }

    function startDrag(e) {
        isDragging = true;
        startX = getEventX(e);
        startY = getEventY(e);
        lastMoveX = startX;
        lastMoveTime = performance.now();
        velocity = 0;
        
        carousel.classList.add('dragging');
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const currentX = getEventX(e);
        const currentY = getEventY(e);
        const currentTime = performance.now();
        
        // Calculate movement distance and time
        const deltaX = currentX - lastMoveX;
        const deltaTime = currentTime - lastMoveTime;
        
        // Update velocity (pixels per millisecond converted to degrees per second)
        if (deltaTime > 0) {
            velocity = (deltaX / deltaTime) * 1000 * 0.5; // Scale factor for sensitivity
            velocity = Math.max(-maxSpeed, Math.min(maxSpeed, velocity)); // Clamp to max speed
        }
        
        // Update rotation based on horizontal movement
        const rotationDelta = deltaX * 0.5; // Scale factor for rotation sensitivity
        currentRotation -= rotationDelta;
        updateCarouselRotation(currentRotation);
        
        lastMoveX = currentX;
        lastMoveTime = currentTime;
    }

    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.classList.remove('dragging');
        
        // Start momentum rotation based on final velocity
        if (Math.abs(velocity) > 10) {
            startUserRotation(velocity);
        } else {
            // Resume auto rotation if velocity is too low, continuing from current position
            lastTime = performance.now();
            autoRotationAnimation = requestAnimationFrame(function animate() {
                if (!isDragging && !isCarouselPaused) {
                    const now = performance.now();
                    if (lastTime) {
                        const deltaTime = (now - lastTime) / 1000;
                        currentRotation -= autoRotationSpeed * deltaTime;
                        updateCarouselRotation(currentRotation);
                    }
                    lastTime = now;
                    autoRotationAnimation = requestAnimationFrame(animate);
                }
            });
        }
    }

    // Mouse events
    carouselContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Prevent context menu on long press
    carouselContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    // Card flipping
    faces.forEach((face, index) => {
        const cardInner = face.querySelector('.card-inner');
        const flipBtn = face.querySelector('.flip-btn');
        const unflipBtn = face.querySelector('.unflip-btn');

        if (flipBtn) {
            flipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cardInner.classList.add('flipped');
                
                // Pause all carousel movement
                if (autoRotationAnimation) {
                    cancelAnimationFrame(autoRotationAnimation);
                }
                isUserControlled = true;
                carousel.classList.add('user-controlled');
                
                console.log(`Card ${index + 1} flip attempted`);
                console.log(`Card ${index + 1} classes:`, cardInner.className);
                console.log(`Card ${index + 1} transform:`, window.getComputedStyle(cardInner).transform);
            });
        }

        if (unflipBtn) {
            unflipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cardInner.classList.remove('flipped');
                
                // Resume auto rotation from current position
                lastTime = performance.now();
                autoRotationAnimation = requestAnimationFrame(function animate() {
                    if (!isDragging && !isCarouselPaused) {
                        const now = performance.now();
                        if (lastTime) {
                            const deltaTime = (now - lastTime) / 1000;
                            currentRotation -= autoRotationSpeed * deltaTime;
                            updateCarouselRotation(currentRotation);
                        }
                        lastTime = now;
                        autoRotationAnimation = requestAnimationFrame(animate);
                    }
                });
                
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
            } else if (demoType === 'quant') {
                gifSrc = 'demos/quant.gif';
            }

            modalImg.src = gifSrc;
            modal.style.display = 'block';
            
            // Pause all carousel movement
            if (autoRotationAnimation) {
                cancelAnimationFrame(autoRotationAnimation);
            }
            isUserControlled = true;
            carousel.classList.add('user-controlled');
            
            console.log(`Demo ${index + 1} shown: ${demoType}`);
        });
    });

    // Close modal functionality
    function closeModal() {
        modal.style.display = 'none';
        
        // Resume auto rotation from current position
        lastTime = performance.now();
        autoRotationAnimation = requestAnimationFrame(function animate() {
            if (!isDragging && !isCarouselPaused) {
                const now = performance.now();
                if (lastTime) {
                    const deltaTime = (now - lastTime) / 1000;
                    currentRotation -= autoRotationSpeed * deltaTime;
                    updateCarouselRotation(currentRotation);
                }
                lastTime = now;
                autoRotationAnimation = requestAnimationFrame(animate);
            }
        });
        
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

    // Initialize carousel position and start auto-rotation
    carousel.classList.add('user-controlled'); // Always use manual transform control
    updateCarouselRotation(0); // Start at 0 degrees
    startAutoRotation();

    console.log('Carousel setup complete with interactive controls');
});
