// Responsive Navigation & Mobile Menu Handler
document.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementById('header');
    var nav = document.getElementById('nav');
    
    if (!header || !nav) return;

    // Create mobile menu toggle button if not present
    if (!document.getElementById('mobile-menu-btn')) {
        var toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobile-menu-btn';
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', '打开菜单');
        toggleBtn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        
        // Insert toggle button into header
        header.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = nav.classList.toggle('nav-open');
            toggleBtn.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-active', isOpen);
        });
    }

    // Handle touch/click on menu items with submenus on mobile
    var dropdownItems = nav.querySelectorAll('li:has(ul), li');
    dropdownItems.forEach(function(item) {
        var sub = item.querySelector('ul');
        if (sub) {
            var link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 900) {
                        // If clicking a parent link with href="#"
                        if (link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:;') {
                            e.preventDefault();
                            item.classList.toggle('sub-open');
                        }
                    }
                });
            }
        }
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 900 && nav.classList.contains('nav-open')) {
            if (!nav.contains(e.target) && !document.getElementById('mobile-menu-btn').contains(e.target)) {
                nav.classList.remove('nav-open');
                var toggleBtn = document.getElementById('mobile-menu-btn');
                if (toggleBtn) toggleBtn.classList.remove('active');
                document.body.classList.remove('menu-active');
            }
        }
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900 && nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
            var toggleBtn = document.getElementById('mobile-menu-btn');
            if (toggleBtn) toggleBtn.classList.remove('active');
            document.body.classList.remove('menu-active');
        }
    });
});
