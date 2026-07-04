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

    // ==========================================================================
    // CASE STUDY MODAL FUNCTIONALITY
    // ==========================================================================
    const openModalBtns = document.querySelectorAll('.open-case-study-btn');
    const modal = document.getElementById('ab-test-modal');
    
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        const wrapper = modal.querySelector('.modal-wrapper');

        const openModal = () => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            animateCounters(modal);
        };

        const closeModal = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        };

        openModalBtns.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        // Close modal when clicking outside the content (on wrapper but not container)
        if (wrapper) {
            wrapper.addEventListener('click', (e) => {
                if (e.target === wrapper) {
                    closeModal();
                }
            });
        }
    }

    // Animated Counters for Stats
    function animateCounters(modalElement) {
        const counters = modalElement.querySelectorAll('[data-val]');
        counters.forEach(counter => {
            const targetVal = parseFloat(counter.getAttribute('data-val'));
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1200; // in ms
            const startVal = 0;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                const currentVal = startVal + easeProgress * (targetVal - startVal);
                
                if (targetVal % 1 === 0) {
                    // Integer values
                    counter.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
                } else {
                    // Floating point values
                    counter.textContent = `${prefix}${currentVal.toFixed(2)}${suffix}`;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    if (targetVal % 1 === 0) {
                        counter.textContent = `${prefix}${targetVal}${suffix}`;
                    } else {
                        counter.textContent = `${prefix}${targetVal.toFixed(2)}${suffix}`;
                    }
                }
            };

            requestAnimationFrame(updateCount);
        });
    }
});

