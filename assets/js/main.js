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

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
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

const pointColors = [
    'rgb(173, 216, 230)', 'rgb(152, 251, 152)', 'rgb(240, 128, 128)',
    'rgb(255, 218, 185)', 'rgb(230, 230, 250)', 'rgb(250, 250, 210)',
    'rgb(176, 224, 230)', 'rgb(255, 228, 225)', 'rgb(255, 182, 193)',
    'rgb(175, 238, 238)'
];

let points = [];
let progress = 0;
let isSnakeGame = false;
let snake = [];
let direction = { x: 1, y: 0 };
const snakeSpeed = 3; // Increased speed
let lastTime = 0;
const regressionDuration = 5000; // 5 seconds
let score = 0;
let lastMoveTime = 0;
const idleThreshold = 5000; // 5 seconds of no movement
let angle = 0;
const maxSnakeLength = 50; // Reduced max length
// let allPointsEaten = false;
const numPoints = 50

function generatePoints() {
    const margin = 20; // Margin from the edges of the canvas
    points = Array.from({ length: numPoints }, () => ({
        x: Math.random() * (canvas.width - 2 * margin) + margin,
        y: Math.random() * (canvas.height - 2 * margin) + margin,
        color: pointColors[Math.floor(Math.random() * pointColors.length)],
        eaten: false
    }));
}

// Add this function to count visible points
function countVisiblePoints() {
    return points.filter(point => !point.eaten).length;
}

function drawPoints() {
    points.forEach(point => {
        if (!point.eaten) {
            ctx.fillStyle = point.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawRegressionLine(timestamp) {
    const elapsedTime = timestamp - lastTime;
    progress = Math.min(canvas.width, (elapsedTime / regressionDuration) * canvas.width);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0.85)'); // Light Blue
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)'); // White
    gradient.addColorStop(1, 'rgba(240, 128, 128, 0.85)'); // Light Coral

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();

    const amplitude = canvas.height / 4;
    const frequency = 2 * Math.PI / canvas.width;

    for (let x = 0; x <= progress; x++) {
        const normalizedX = x / canvas.width - 0.5;
        const y = canvas.height / 2 + amplitude * Math.sin(frequency * x * 3) * Math.exp(-Math.pow(normalizedX * 2, 2));

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    if (elapsedTime >= regressionDuration) {
        isSnakeGame = true;
        initSnake();
    }
}


let particles = [];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.gravity = 0.05;
        this.life = 60; // Increased life for longer particles
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.life--;
        this.opacity = this.life / 60; // Fade out
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(${this.color.match(/\d+/g).slice(0, 3).join(',')}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


function createParticles(x, y, color, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => particle.draw(ctx));
}

function initSnake() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    snake = [{ x: centerX, y: centerY }];
    direction = { x: 1, y: 0 };
    lastMoveTime = performance.now();
    angle = 0; // Initialize angle for circular motion
}

let isTransitioningToIdle = false;
let idleAngle = 0;

function updateSnake(timestamp) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const isIdle = timestamp - lastMoveTime > idleThreshold;

    if (isIdle && !isTransitioningToIdle) {
        isTransitioningToIdle = true;
        idleAngle = Math.atan2(snake[0].y - centerY, snake[0].x - centerX);
    }

    if (isTransitioningToIdle || isIdle) {
        const radius = 80; // circle
        idleAngle += 0.02; // Adjust for speed of rotation

        const targetX = centerX + Math.cos(idleAngle) * radius;
        const targetY = centerY + Math.sin(idleAngle) * radius;

        const head = snake[0];
        const dx = targetX - head.x;
        const dy = targetY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            const moveX = (dx / distance) * snakeSpeed;
            const moveY = (dy / distance) * snakeSpeed;
            snake.unshift({ x: head.x + moveX, y: head.y + moveY });
        } else {
            snake.unshift({ x: targetX, y: targetY });
        }
    } else {
        // Normal movement
        const head = { 
            x: snake[0].x + direction.x * snakeSpeed, 
            y: snake[0].y + direction.y * snakeSpeed 
        };
        
        // Bounce off walls
        if (head.x < 0 || head.x > canvas.width) {
            direction.x *= -1;
            head.x = Math.max(0, Math.min(head.x, canvas.width));
        }
        if (head.y < 0 || head.y > canvas.height) {
            direction.y *= -1;
            head.y = Math.max(0, Math.min(head.y, canvas.height));
        }

        snake.unshift(head);

        // Check for point eating
        points.forEach(point => {
            if (!point.eaten && Math.hypot(head.x - point.x, head.y - point.y) < 10) {
                point.eaten = true;
                score += 10;
                createParticles(point.x, point.y, point.color, 20);
            }
        });

        // allPointsEaten = points.every(point => point.eaten);
    }

    // Limit snake length
    if (snake.length > maxSnakeLength) {
        snake = snake.slice(0, maxSnakeLength);
    }
}

function drawSnake() {
    // Dynamic Gradient Animation based on Time
    const time = Date.now() * 0.05; // Adjust the multiplier for speed of color shift
    const hue = (time % 360); // Hue value cycles between 0 and 360

    // Create a linear gradient along the snake's body
    const gradient = ctx.createLinearGradient(
        snake[snake.length - 1].x, snake[snake.length - 1].y, 
        snake[0].x, snake[0].y
    );
    gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`); // Dynamic color at tail
    gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`); // Dynamic color at head

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 6; // Adjusted for better visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Subtle Glow Effect
    ctx.shadowBlur = 8; // Reduced from 10 to make it less harsh
    ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.3)`; // Matching hue with lower opacity

    ctx.beginPath();
    ctx.moveTo(snake[0].x, snake[0].y);
    for (let i = 1; i < snake.length; i++) {
        const prev = snake[i - 1];
        const current = snake[i];
        const next = snake[i + 1] || current;

        const controlPoint1 = {
            x: current.x - (next.x - prev.x) / 4,
            y: current.y - (next.y - prev.y) / 4
        };
        const controlPoint2 = {
            x: current.x + (next.x - prev.x) / 4,
            y: current.y + (next.y - prev.y) / 4
        };

        ctx.bezierCurveTo(
            controlPoint1.x, controlPoint1.y,
            controlPoint2.x, controlPoint2.y,
            current.x, current.y
        );
    }
    ctx.stroke();

    // Reset shadow settings to prevent affecting other drawings
    ctx.shadowBlur = 0;

    // Tail Fading Effect
    drawSnakeTail();

    // Draw Snake Head with Consistent Color Scheme
    drawSnakeHead(hue);
}

function drawSnakeHead(hue) {
    // Create a radial gradient for the snake head
    const headGradient = ctx.createRadialGradient(
        snake[0].x, snake[0].y, 0,
        snake[0].x, snake[0].y, 12
    );
    headGradient.addColorStop(0, `hsl(${(hue + 30) % 360}, 100%, 70%)`);   // Slightly shifted hue
    headGradient.addColorStop(1, `hsla(${(hue + 30) % 360}, 100%, 50%, 0.6)`); // Faded hue

    ctx.fillStyle = headGradient;
    ctx.shadowBlur = 5; // Reduced shadow blur for subtlety
    ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.2)`; // Matching hue with lower opacity

    ctx.beginPath();
    ctx.arc(snake[0].x, snake[0].y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow settings
    ctx.shadowBlur = 0;

    // Optional: Add a simple eye for character
    drawSnakeHeadFeatures();
}

function drawSnakeHeadFeatures() {
    // Draw a simple eye
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // White eye
    ctx.beginPath();
    ctx.arc(snake[0].x + 4, snake[0].y - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Black pupil
    ctx.beginPath();
    ctx.arc(snake[0].x + 4, snake[0].y - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnakeTail() {
    // Create a fading effect for the tail
    for (let i = snake.length - 1; i > snake.length - 10 && i >= 0; i--) {
        const segment = snake[i];
        const alpha = (snake.length - i) / 10; // Fading alpha
        ctx.fillStyle = `hsla(180, 100%, 70%, ${alpha * 0.6})`; // Light Turquoise with fading
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawControls() {
    // Define control panel dimensions
    const panelWidth = 250;
    const panelHeight = 155;
    const panelX = 10;
    const panelY = 10;
    const borderRadius = 15;

    // Create a linear gradient for the control panel background
    const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    panelGradient.addColorStop(0, 'rgba(34, 34, 34, 0.9)'); // Dark gray
    panelGradient.addColorStop(1, 'rgba(51, 51, 51, 0.9)'); // Slightly lighter gray

    // Draw rounded rectangle for the control panel
    ctx.fillStyle = panelGradient;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // White border with opacity
    ctx.lineWidth = 2;
    drawRoundedRectangle(ctx, panelX, panelY, panelWidth, panelHeight, borderRadius);
    ctx.fill();
    ctx.stroke();

    // Optional: Add subtle shadow for depth
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    drawRoundedRectangle(ctx, panelX, panelY, panelWidth, panelHeight, borderRadius);
    ctx.strokeStyle = 'transparent'; // No additional stroke
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Set font styles
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FFFFFF'; // White color for text
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 2;

    // Title
    ctx.fillText('Controls:', panelX + 25, panelY + 15);

    // Reset shadow settings for subsequent text
    ctx.shadowBlur = 0;

    // Define controls with stylized arrows
    const controls = [
        { direction: 'up', key: '↑', action: 'Move Up' },
        { direction: 'down', key: '↓', action: 'Move Down' },
        { direction: 'left', key: '←', action: 'Move Left' },
        { direction: 'right', key: '→', action: 'Move Right' }
    ];

    // Draw each control
    controls.forEach((control, index) => {
        const spacingY = 30;
        const startY = panelY + 50;
        const currentY = startY + index * spacingY;

        // Draw stylized arrow
        drawStylizedArrow(ctx, panelX + 30, currentY , control.direction);

        // Draw action text
        ctx.font = '16px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(control.action, panelX + 60, currentY - 6);
    });
}

// Helper function to draw rounded rectangles
function drawRoundedRectangle(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Helper function to draw stylized arrows
function drawStylizedArrow(ctx, x, y, direction) {
    ctx.save();
    ctx.translate(x, y);

    // Define arrow size
    const arrowSize = 15;

    // Set arrow color
    ctx.fillStyle = '#FFD700'; // Gold color

    ctx.beginPath();
    switch(direction) {
        case 'up':
            ctx.moveTo(0, -arrowSize / 2);
            ctx.lineTo(-arrowSize / 2, arrowSize / 2);
            ctx.lineTo(arrowSize / 2, arrowSize / 2);
            ctx.closePath();
            break;
        case 'down':
            ctx.moveTo(0, arrowSize / 2);
            ctx.lineTo(-arrowSize / 2, -arrowSize / 2);
            ctx.lineTo(arrowSize / 2, -arrowSize / 2);
            ctx.closePath();
            break;
        case 'left':
            ctx.moveTo(-arrowSize / 2, 0);
            ctx.lineTo(arrowSize / 2, -arrowSize / 2);
            ctx.lineTo(arrowSize / 2, arrowSize / 2);
            ctx.closePath();
            break;
        case 'right':
            ctx.moveTo(arrowSize / 2, 0);
            ctx.lineTo(-arrowSize / 2, -arrowSize / 2);
            ctx.lineTo(-arrowSize / 2, arrowSize / 2);
            ctx.closePath();
            break;
    }
    ctx.fill();
    ctx.restore();
}


function countVisiblePoints() {
    return points.filter(point => !point.eaten).length;
}

function drawScore() {
    const visiblePoints = countVisiblePoints();

    // **Draw the Score**
    // Create a gradient for the score text
    const scoreGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    scoreGradient.addColorStop(0, 'rgb(255, 140, 0)'); // Dark Orange
    scoreGradient.addColorStop(1, 'rgb(255, 215, 0)'); // Gold

    ctx.fillStyle = scoreGradient;
    ctx.font = 'bold 28px Arial'; // Increased font size for prominence
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    
    // Add subtle shadow to the score text
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 20);
    
    // Reset shadow settings
    ctx.shadowBlur = 0;

    // **Draw the Win Message**
    // **Draw the Win Message**
    if (visiblePoints === 0) {
        // Create a pulsating effect for the win message
        const time = Date.now() * 0.005; // Adjust the multiplier for speed of pulsation
        const pulse = Math.sin(time) * 5 + 30; // Pulse size between 10 and 20 for subtlety

        // Create a vibrant radial gradient for the win message
        const winGradient = ctx.createRadialGradient(
            canvas.width - 20, 60, pulse - 5, // Inner circle
            canvas.width - 20, 60, pulse      // Outer circle
        );
        winGradient.addColorStop(0, 'rgba(0, 255, 0, 1)');    // Bright Green at center
        winGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)'); // Slightly transparent
        winGradient.addColorStop(1, 'rgba(0, 128, 0, 0.6)');    // Dark Green at edges

        ctx.fillStyle = winGradient;
        ctx.font = 'bold 36px Arial'; // Increased font size for emphasis
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';

        // Add enhanced glow effect to the win message
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0, 255, 0, 0.8)'; // Stronger green glow

        // Draw the main win message
        ctx.fillText('You Won!', canvas.width - 20, 60);
        
        // **Add a Shining Effect**
        // Create a linear gradient to simulate a shine
        const shineGradient = ctx.createLinearGradient(
            canvas.width - 60, 60, 
            canvas.width - 40, 80
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // White shine
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   // Transparent

        ctx.fillStyle = shineGradient;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        
        // Draw the shine overlay
        ctx.fillText('You Won!', canvas.width - 20, 60);

        // Reset shadow settings to avoid affecting other drawings
        ctx.shadowBlur = 0;
    }
}


function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints();

    if (!isSnakeGame) {
        drawRegressionLine(timestamp);
    } else {
        updateSnake(timestamp);
        updateParticles();
        drawSnake();
        drawParticles();
        drawControls();
        drawScore();
    }

    requestAnimationFrame(draw);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generatePoints();
    if (isSnakeGame) {
        initSnake();
    } else {
        progress = 0;
        lastTime = performance.now();
    }
}

window.addEventListener('resize', resizeCanvas);

document.addEventListener('keydown', (event) => {
    if (isSnakeGame) {
        // Prevent arrow keys from scrolling the page
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }

        isTransitioningToIdle = false;
        lastMoveTime = performance.now();
        switch(event.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    generatePoints();
    lastTime = performance.now();
    requestAnimationFrame(draw);
});

(function() {
    const canvas = document.getElementById('meteorCanvas');
    const context = canvas.getContext('2d');

    // Set canvas size to match the window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    // Meteor object definition
    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            // Random starting position across the sky
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.5; // Keep meteors in the upper half of the canvas
            this.length = Math.random() * 80 + 20; // Varied trail lengths
            this.speed = Math.random() * 0.3 + 0.1; // Varied speed
            this.angle = Math.random() * (Math.PI / 4) + (Math.PI / 6); // Random angle
            this.opacity = 1; // Start fully visible
            this.fadeRate = 0.005; // Slow fade rate
            this.width = Math.random() * 2 + 1; // Thin meteor trails
            this.color = this.getRandomColor(); // Vibrant color
            this.direction = Math.random() < 0.5 ? 1 : -1; // Random left-to-right or right-to-left
            this.hasFaded = false; // Track fading status
        }

        getRandomColor() {
            // Generate a random vibrant color
            const colors = [
                'rgba(255, 69, 0, 1)',    // Orange Red
                'rgba(255, 140, 0, 1)',   // Dark Orange
                'rgba(255, 215, 0, 1)',   // Gold
                'rgba(173, 216, 230, 1)', // Light Blue
                'rgba(138, 43, 226, 1)'   // Blue Violet
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Move the meteor based on its speed and angle
            this.x += this.direction * Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= this.fadeRate; // Gradually fade out

            // Reset the meteor if it fades out completely or moves off-screen
            if (this.opacity <= 0 || this.x < -this.length || this.x > canvas.width + this.length || this.y < 0 || this.y > canvas.height) {
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

            // Smooth gradient from transparent to vibrant color
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); // Transparent tail
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.7})`); // Mid trail
            gradient.addColorStop(1, `${this.color.replace('1)', `${this.opacity})`)}`); // Vibrant head

            context.strokeStyle = gradient;
            context.lineWidth = this.width;
            context.shadowBlur = 10; // Subtle glow
            context.shadowColor = this.color;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(
                this.x - this.direction * Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            context.stroke();
            context.shadowBlur = 0;
        }
    }

    // Create an array for meteors
    let meteors = [];

    // Function to spawn meteors less frequently (every 4-6 seconds)
    setInterval(() => {
        if (meteors.length < 4) { // Limit the number of meteors on screen to 4
            meteors.push(new Meteor());
        }
    }, Math.random() * 2000 + 4000); // Spawn every 4-6 seconds

    function animate() {
        // Clear the canvas completely to prevent darkening the background
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
        resizeCanvas();
    });
})();


document.addEventListener('DOMContentLoaded', function () {
    // Get modal elements
    const modal = document.getElementById('demoModal');
    const modalImg = document.getElementById('demoGifInModal');
    const demoButtons = document.querySelectorAll('.demo-btn');
    const closeBtn = document.querySelector('.close-btn');

    demoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const demoType = this.getAttribute('data-demo');
            let gifSrc;
            
            if (demoType === 'rubiks') {
                gifSrc = 'demos/rubiks.gif';
            } else if (demoType === 'grammar') {
                gifSrc = 'demos/grammar.gif';
            }
        // Add more conditions for other demos as needed
        
        modalImg.src = gifSrc;
        modal.style.display = 'block';
    });
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

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const visualizations = document.querySelectorAll('.visualization');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const vizId = button.getAttribute('data-visualization');

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Hide all visualizations
            visualizations.forEach(viz => viz.classList.remove('active'));

            // Add active class to the clicked button
            button.classList.add('active');

            // Show the targeted visualization
            const vizElement = document.getElementById(vizId);
            if (vizElement) {
                vizElement.classList.add('active');
            }

            // Additional logic for initializing or stopping visualizations can be added here
        });
    });
});
