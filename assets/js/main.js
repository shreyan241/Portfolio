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
const words = ["a Data Science Grad.", "a Machine Learning Researcher.", "a Computer Vision Developer.", "a Statistical Modeler.", "a Data Storyteller."];
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

// Generate random data points
const points = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
}));

// Polynomial coefficients for a nonlinear regression line
const coefficients = [0.000001, -0.002, 1.3, 50]; // Example coefficients for a cubic regression line

let progress = 0;

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(175, 238, 238, 0.75)';

    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawRegressionLine() {
    ctx.strokeStyle = 'rgba(255, 69, 0, 0.85)';
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
