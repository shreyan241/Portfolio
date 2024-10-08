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
                'rgba(138, 43, 226, 1)',  // Blue Violet
                'rgba(0, 200, 0, 1)',     // Darker, brighter green
                'rgba(255, 20, 147, 1)'   // Hot Pink
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
