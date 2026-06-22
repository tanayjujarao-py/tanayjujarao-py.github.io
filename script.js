document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // STICKY NAVBAR & BACK-TO-TOP BUTTON
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const handleScrollEffects = () => {
        const scrollY = window.scrollY;

        // Sticky Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Navigation Highlight
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = scrollY + 200; // Offset for navbar trigger

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for top of page (Hero section)
        if (scrollY < 100) {
            currentSectionId = '';
        }

        // Fallback for bottom of page (Contact)
        if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
            currentSectionId = 'contact';
        }

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    // Run once on load to ensure correct initial state
    handleScrollEffects();

    // Scroll back to top event
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // MOBILE MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-resume');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('show') ? 'hidden' : '';
    };

    const closeMenu = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Handle window resize (close menu if desktop size reached)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('show')) {
            closeMenu();
        }
    });

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEAL
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly earlier for better flow
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep layout responsive
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // stagger child elements in grids programmatically if needed
    // This allows us to easily stagger any elements inside grids for a premium entry animation
    const staggerGrids = document.querySelectorAll('.projects-grid, .skills-grid, .certifications-grid, .contact-grid');
    staggerGrids.forEach(grid => {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            // Apply delay based on item index (e.g. 100ms * index)
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
});
