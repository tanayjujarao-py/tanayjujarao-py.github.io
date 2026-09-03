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
        const sections = document.querySelectorAll('section[id]');
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
    handleScrollEffects();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // MOBILE MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-resume');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
        document.body.style.overflow = navMenu.classList.contains('show') ? 'hidden' : '';
    };

    const closeMenu = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('show')) {
            closeMenu();
        }
    });

    // ==========================================================================
    // TYPEWRITER ANIMATION IN HERO
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const phrases = [
            "Data Analyst → Analytics Engineer",
            "Building Cloud Data Pipelines",
            "Snowflake • dbt Core • Airflow",
            "Transforming Data into Business Value"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2200; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    // ==========================================================================
    // INTERSECTION OBSERVER FOR SCROLL REVEAL
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // SHOW MORE PROJECTS TOGGLE
    // ==========================================================================
    const toggleProjectsBtn = document.getElementById('toggle-projects-btn');
    const hiddenProjects = document.querySelectorAll('.projects-hidden');

    if (toggleProjectsBtn) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = toggleProjectsBtn.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
                hiddenProjects.forEach(project => {
                    project.style.display = 'none';
                });
                toggleProjectsBtn.setAttribute('data-expanded', 'false');
                toggleProjectsBtn.innerHTML = `
                    <span>Show More Projects (6 More)</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                `;
            } else {
                hiddenProjects.forEach(project => {
                    project.style.display = 'flex';
                });
                toggleProjectsBtn.setAttribute('data-expanded', 'true');
                toggleProjectsBtn.innerHTML = `
                    <span>Show Fewer Projects</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                `;
            }
        });
    }
});
