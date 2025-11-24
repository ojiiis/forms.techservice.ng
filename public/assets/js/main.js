// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Functionality
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileToggle && mobileNav) {
        // Toggle the mobile menu on button click
        mobileToggle.addEventListener('click', () => {
            const isHidden = mobileNav.classList.toggle('mobile-menu-hidden');
            document.getElementById("mobile-nav").style.top = document.getElementById("site-header").offsetHeight+"px";
            // Change the icon from bars to X
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', isHidden);
                icon.classList.toggle('fa-xmark', !isHidden);
            }
        });

        // Close the mobile menu when a link inside it is clicked (for smooth scrolling)
        mobileNav.querySelectorAll('a[data-close-menu]').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('mobile-menu-hidden');
                
                // Reset icon back to bars
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Set Current Year in Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // 3. Optional: Smooth Scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});