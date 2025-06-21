document.addEventListener('DOMContentLoaded', function() {
    // Theme variables
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDark.matches ? 'dark' : 'light';
    }
    
    // Set theme
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        updateToggleIcon(theme);
        
        // Add transition class for smooth animations
        body.classList.add('theme-transition');
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 300);
    }
    
    // Update toggle icon
    function updateToggleIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    // Ripple effect animation
    function createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Toggle theme
    function toggleTheme(event) {
        createRipple(event);
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }
    
    // Initialize theme
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    console.log('Theme switcher initialized:', initialTheme);
}); 