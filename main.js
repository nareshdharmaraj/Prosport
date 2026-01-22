document.addEventListener('DOMContentLoaded', () => {
    // --- Page Loader Injection & Logic ---
    const loaderHTML = `
        <div class="page-loader">
            <div class="loader-content">
                <div class="loader-icon"><i class="fas fa-dumbbell"></i></div>
                <div class="loader-text">PROSPORT</div>
                <div class="loader-progress-track">
                    <div class="loader-progress-bar"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    const pageLoader = document.querySelector('.page-loader');

    // Hide loader when window is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (pageLoader) pageLoader.classList.add('hidden');
        }, 800); // Minimum view time for effect
    });

    // Fallback: If window.load fired before this script, hide it anyway
    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (pageLoader) pageLoader.classList.add('hidden');
        }, 800);
    }

    // Intercept Links for Exit Animation
    document.body.addEventListener('click', (e) => {
        // Find closest anchor tag
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            // Check if valid navigation
            // Ignore anchors, JS links, external tabs, or same-page hashes
            if (href &&
                !href.startsWith('#') &&
                !href.startsWith('javascript:') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                link.target !== '_blank') {

                e.preventDefault();
                if (pageLoader) {
                    pageLoader.classList.remove('hidden');
                }
                setTimeout(() => {
                    window.location.href = href;
                }, 800); // Wait for animation
            }
        }
    });

    // --- Mobile Menu Injection (Before Event Binding) ---
    const navActions = document.querySelector('.nav-actions');
    const navLinksList = document.querySelector('.nav-links');

    if (navActions && navLinksList) {
        const mobileContainer = document.createElement('li');
        mobileContainer.className = 'mobile-only-actions';

        // Clone specific buttons
        const rtlBtn = navActions.querySelector('.rtl-toggle');
        const themeBtn = navActions.querySelector('.theme-toggle');
        // Find Login button (usually has href login.html or class btn)
        const loginBtn = navActions.querySelector('a[href*="login"]') || navActions.querySelector('.btn-outline');

        if (rtlBtn) mobileContainer.appendChild(rtlBtn.cloneNode(true));
        if (themeBtn) mobileContainer.appendChild(themeBtn.cloneNode(true));
        if (loginBtn) mobileContainer.appendChild(loginBtn.cloneNode(true));

        navLinksList.appendChild(mobileContainer);
    }

    // --- RTL/LTR Toggle ---
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    const htmlEl = document.documentElement;

    // Check Storage
    const savedDir = localStorage.getItem('site_direction');
    if (savedDir) {
        htmlEl.setAttribute('dir', savedDir);
    }

    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = htmlEl.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            htmlEl.setAttribute('dir', newDir);
            localStorage.setItem('site_direction', newDir);
        });
    });

    // --- Theme Toggle ---
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const savedTheme = localStorage.getItem('site_theme');

    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('site_theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        const icons = document.querySelectorAll('.theme-toggle i');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }


    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', () => {
            navLinks.classList.remove('active');
            // Reset hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    }

    // Mobile Dropdown Toggle
    const mobileDropdowns = document.querySelectorAll('.nav-links .dropdown > a');
    mobileDropdowns.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only toggle on mobile (when nav-links is active/fixed)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const content = link.nextElementSibling;
                if (content) {
                    content.style.display = content.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });

    // Clean up mobile states on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Close mobile menu
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                // Reset hamburger icon
                if (hamburger) {
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }

            // Reset dropdown inline styles (fixes "stuck open" issue)
            const dropdownContents = document.querySelectorAll('.dropdown-content');
            dropdownContents.forEach(content => {
                content.style.display = '';
            });
        }
    });
    // --- Cart Toggle ---
    const cartToggleBtns = document.querySelectorAll('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');

    function toggleCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        }
    }

    cartToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    });

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        // Target the header part (.flex-between contains the question and icon)
        const header = item.querySelector('.faq-question');
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed

                // Optional: Close others accordion-style
                const otherItems = document.querySelectorAll('.faq-item.active');
                otherItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });

                // Toggle current
                item.classList.toggle('active');
            });
        }
    });


    // --- Help Center Accordion ---
    const helpItems = document.querySelectorAll('.help-item');

    helpItems.forEach(item => {
        const header = item.querySelector('.help-header');
        if (header) {
            header.addEventListener('click', (e) => {
                // optional: close others
                const others = document.querySelectorAll('.help-item.active');
                others.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });

                item.classList.toggle('active');
            });
        }
    });

});
