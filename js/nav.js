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
        
        // Insert toggle button into header-right-group if present, else header
        var rightGroup = header.querySelector('.header-right-group') || header;
        rightGroup.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = nav.classList.toggle('nav-open');
            toggleBtn.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-active', isOpen);
        });
    }

    // Handle dropdown menus on desktop and mobile
    var dropdownItems = nav.querySelectorAll('#nav > ul > li');
    dropdownItems.forEach(function(item) {
        var sub = item.querySelector('ul');
        if (!sub) return;

        var link = item.querySelector('a');
        var timer = null;

        // Desktop: smooth hover with grace buffer so moving down to sub-menu never flickers or disappears
        var handleEnter = function() {
            if (window.innerWidth > 900) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                item.classList.add('dropdown-active');
            }
        };

        var handleLeave = function() {
            if (window.innerWidth > 900) {
                timer = setTimeout(function() {
                    item.classList.remove('dropdown-active');
                }, 220); // 220ms grace period
            }
        };

        item.addEventListener('mouseenter', handleEnter);
        item.addEventListener('mouseleave', handleLeave);
        sub.addEventListener('mouseenter', handleEnter);
        sub.addEventListener('mouseleave', handleLeave);

        if (link) {
            link.addEventListener('click', function(e) {
                if (link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:;') {
                    e.preventDefault();
                    if (window.innerWidth <= 900) {
                        item.classList.toggle('sub-open');
                    } else {
                        // Desktop: clicking also toggles and keeps the menu open
                        item.classList.toggle('dropdown-active');
                    }
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            dropdownItems.forEach(function(item) {
                item.classList.remove('dropdown-active');
            });
        }

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
