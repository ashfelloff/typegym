document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        try {
            const burger = document.querySelector('.burger');
            const nav = document.querySelector('.nav-links');
            
            if (!burger || !nav) {
                console.warn('Navigation elements not found');
                return;
            }

            burger.addEventListener('click', () => {
                nav.classList.toggle('active');
                burger.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !burger.contains(e.target)) {
                    nav.classList.remove('active');
                    burger.classList.remove('active');
                }
            });

            // Close menu when clicking a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    burger.classList.remove('active');
                });
            });
        } catch (error) {
            console.error('Error initializing navigation:', error);
        }
    }, 100);
}); 