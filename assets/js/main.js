/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

})(jQuery);

document.querySelectorAll('.flip-icon').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const card = icon.closest('.timeline-card');
        card.classList.add('flipped');
    });
});

document.querySelectorAll('.unflip-icon').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const card = icon.closest('.timeline-card');
        card.classList.remove('flipped');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Animate entry
    const projectCards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Collapsible descriptions
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = btn.closest('.project-card');
            card.classList.toggle('expanded');
            btn.textContent = card.classList.contains('expanded') ? 'Show Less' : 'More Info';
        });
    });
});

const typewriter = document.querySelector('.typewriter');
const words = ["a Data Science Grad.", "a Machine Learning Researcher.", "a Computer Vision Developer.", "a Statistical Analyst.", "a Data Storyteller."];
let i = 0;
let j = 0;
let currentWord = '';
let isDeleting = false;

function type() {
    if (isDeleting) {
        currentWord = words[i].substring(0, j--);
    } else {
        currentWord = words[i].substring(0, j++);
    }
    
    typewriter.textContent = currentWord;

    if (!isDeleting && j === words[i].length) {
        setTimeout(() => isDeleting = true, 1000);
    } else if (isDeleting && j === 0) {
        i = (i + 1) % words.length;
        isDeleting = false;
    }

    setTimeout(type, isDeleting ? 50 : 150);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define an array of colors for the points
const pointColors = [
    'rgb(173, 216, 230)',
    'rgb(152, 251, 152)',
    'rgb(240, 128, 128)',
    'rgb(255, 218, 185)',
    'rgb(230, 230, 250)',
    'rgb(250, 250, 210)',
    'rgb(176, 224, 230)',
    'rgb(255, 228, 225)',
    'rgb(255, 182, 193)',
    'rgb(175, 238, 238)'
];

// Generate random data points with random colors
const points = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: pointColors[Math.floor(Math.random() * pointColors.length)]
}));

// Polynomial coefficients for a nonlinear regression line
const coefficients = [0.000001, -0.002, 1.3, 50]; // Example coefficients for a cubic regression line

let progress = 0;

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        ctx.fillStyle = point.color; // Set the color for each point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawRegressionLine() {
    // Create a linear gradient for the regression line
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0.85)'); // Light blue
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)'); // White
    gradient.addColorStop(1, 'rgba(240, 128, 128, 0.85)'); // Light coral

    ctx.strokeStyle = gradient; // Apply the gradient to the line
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x++) {
        let y = 0;
        for (let i = 0; i < coefficients.length; i++) {
            y += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
        }

        y = canvas.height - (y / canvas.height * canvas.height / 2) - canvas.height / 4;

        if (x === 0) {
            ctx.moveTo(x, y);
        } else if (x <= progress) {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    if (progress < canvas.width) {
        progress += 1.5; // Adjust this value to speed up or slow down the drawing
    } else {
        // Reset the progress to 0 to replay the animation
        progress = 0;
    }

    requestAnimationFrame(draw);
}

function draw() {
    drawPoints();
    drawRegressionLine();
}

document.addEventListener('DOMContentLoaded', () => {
    draw();
});

(function() {
    const canvas = document.getElementById('meteorCanvas');
    const context = canvas.getContext('2d');

    // Set canvas size to match the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Meteor object definition
    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            // Random starting position across the sky
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.5; // Keep meteors in the upper half of the canvas
            this.length = Math.random() * 60 + 30; // Shorter meteors
            this.speed = Math.random() * 0.15 + 0.05; // Slower speed
            this.angle = Math.random() * (Math.PI / 3) + (Math.PI / 6); // Random angle
            this.opacity = 1; // Start fully visible
            this.fadeRate = 0.005; // Slow fade rate for demure effect
            this.width = Math.random() * 2 + 1; // Thin meteor trails
            this.color = 'rgba(255, 165, 0, 1)'; // Darker golden color
            this.direction = Math.random() < 0.5 ? 1 : -1; // Random left-to-right or right-to-left
            this.hasFaded = false; // Track fading status
        }

        update() {
            // Move the meteor based on its speed and angle
            this.x += this.direction * Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= this.fadeRate; // Gradually fade out

            // Mark the meteor as having faded when the opacity is very low
            if (this.opacity <= 0.1 && !this.hasFaded) {
                this.hasFaded = true;
            }

            // Reset the meteor if it fades out completely or moves off-screen
            if (this.opacity <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            const gradient = context.createLinearGradient(
                this.x - this.direction * Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length,
                this.x,
                this.y
            );

            // Start with a darker, richer golden color and fade toward the tail
            gradient.addColorStop(0, 'rgba(218, 165, 32, 0)'); // End of the tail (fading away)
            gradient.addColorStop(0.7, `rgba(218, 165, 32, ${this.opacity})`); // Mid section (faded)
            gradient.addColorStop(1, `rgba(255, 140, 0, ${this.opacity * 1.5})`); // Brighter head

            context.strokeStyle = gradient;
            context.lineWidth = this.width;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(
                this.x - this.direction * Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            context.stroke();
        }
    }

    // Create an array for meteors
    let meteors = [];

    // Function to spawn meteors less frequently (every 6-8 seconds)
    setInterval(() => {
        if (meteors.length < 3) { // Limit the number of meteors on screen
            meteors.push(new Meteor());
        }
    }, Math.random() * 2000 + 6000); // Spawn every 6-8 seconds

    function animate() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update meteors
        meteors.forEach(meteor => {
            meteor.update();
            meteor.draw();
        });

        // Remove meteors that have fully faded out
        meteors = meteors.filter(meteor => meteor.opacity > 0);

        // Loop the animation
        requestAnimationFrame(animate);
    }

    // Initialize animation when the document is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        animate();
    });

    // Adjust the canvas size when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    // Get modal elements
    const modal = document.getElementById('demoModal');
    const closeBtn = document.querySelector('.close-btn');

    // Open modal on demo button click
    document.querySelectorAll('.demo-btn').forEach(demoBtn => {
        demoBtn.addEventListener('click', function () {
            modal.style.display = 'flex'; // Show the modal (flex for centering)
        });
    });

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    let activeFilter = null; // Track the currently active filter

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = button.getAttribute('data-filter');

            // If clicking the same active button, reset filter
            if (activeFilter === filter) {
                // Deselect the button and reset filter
                button.classList.remove('active');
                activeFilter = null;
                showAllProjects();
            } else {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Set this button as active
                button.classList.add('active');
                activeFilter = filter;

                // Show/hide projects based on the selected filter
                projects.forEach(project => {
                    const tags = project.getAttribute('data-tags').split(',').map(tag => tag.trim());

                    if (tags.includes(filter)) {
                        project.style.display = 'block'; // Show the project
                    } else {
                        project.style.display = 'none'; // Hide the project
                    }
                });
            }
        });
    });

    // Function to show all projects
    function showAllProjects() {
        projects.forEach(project => {
            project.style.display = 'block';
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

