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
    } else if (isTouching) {
        // Follow touch
        const head = snake[0];
        const dx = touchX - head.x;
        const dy = touchY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > snakeSpeed) {
            const moveX = (dx / distance) * snakeSpeed;
            const moveY = (dy / distance) * snakeSpeed;
            snake.unshift({ x: head.x + moveX, y: head.y + moveY });
        } else {
            snake.unshift({ x: touchX, y: touchY });
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

    if (isMobileDevice()) {
        // Mobile controls
        ctx.font = '16px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Touch and drag to move the snake', panelX + 25, panelY + 50);
    } else {
        // Desktop controls
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
            drawStylizedArrow(ctx, panelX + 30, currentY, control.direction);

            // Draw action text
            ctx.font = '16px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(control.action, panelX + 60, currentY - 6);
        });
    }
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


canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

let touchX, touchY;
let isTouching = false;

function handleTouchStart(event) {
    event.preventDefault();
    isTouching = true;
    const touch = event.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    lastMoveTime = performance.now();
    isTransitioningToIdle = false;
}

function handleTouchMove(event) {
    event.preventDefault();
    if (isTouching) {
        const touch = event.touches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
        lastMoveTime = performance.now();
    }
}

function handleTouchEnd(event) {
    isTouching = false;
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}