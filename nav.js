document.addEventListener('DOMContentLoaded', () => {
    const toggle   = document.querySelector('.mobile-menu-toggle');
    const navbar   = document.querySelector('.navbar');
    const dropdowns = document.querySelectorAll('.nav-menu .dropdown, .nav-menu .dropdown-submenu');

    // Toggle mobile menu
    toggle?.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Mobile dropdown expand/collapse
    dropdowns.forEach(item => {
        const link = item.querySelector(':scope > a');
        link?.addEventListener('click', (e) => {
            if (window.matchMedia('(max-width: 992px)').matches) {
                e.preventDefault();      // don't navigate, just expand
                item.classList.toggle('open');
            }
        });
    });

    // Close menu when a real link is clicked on mobile
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.matchMedia('(max-width: 992px)').matches
                && !link.parentElement.classList.contains('dropdown')
                && !link.parentElement.classList.contains('dropdown-submenu')) {
                navbar.classList.remove('open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !toggle.contains(e.target)) {
            navbar.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on resize back to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            navbar.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.querySelectorAll('.dropdown.open, .dropdown-submenu.open')
                .forEach(el => el.classList.remove('open'));
        }
    });
});