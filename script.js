/* ==========================================================================
   TANAY JUJARAO — PORTFOLIO INTERACTIVITY & INTERSECTION OBSERVER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. Theme Switcher (Light / Dark Mode)
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or default to light theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    /* --------------------------------------------------------------------------
       2. Top Scroll Progress Indicator
       -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');

    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    /* --------------------------------------------------------------------------
       3. Navbar Header Scrolled Shadow & Active Link Highlight
       -------------------------------------------------------------------------- */
    const navbarHeader = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleHeaderScroll = () => {
        if (navbarHeader) {
            if (window.scrollY > 20) {
                navbarHeader.classList.add('scrolled');
            } else {
                navbarHeader.classList.remove('scrolled');
            }
        }

        // Active section indicator
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* --------------------------------------------------------------------------
       4. Mobile Drawer Navigation Toggle
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    /* --------------------------------------------------------------------------
       5. IntersectionObserver for Scroll Reveal Animations
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback if IntersectionObserver is not supported
        revealElements.forEach(el => el.classList.add('active'));
    }

});
