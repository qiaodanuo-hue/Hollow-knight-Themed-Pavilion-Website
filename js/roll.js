// Fullscreen Exhibition Slide Controller with Option 1 Mobile Optimization
(function() {
    var container = document.querySelector('.container');
    var lis = document.querySelectorAll('.controls li');
    var viewHeight = window.innerHeight;
    var index = 0;
    var flag = true;

    // Mobile Elements
    var pillBtn = document.getElementById('mobile-hall-pill');
    var pillText = document.getElementById('pill-text');
    var pillIcon = document.getElementById('pill-icon');
    var navL = document.getElementById('nav-l');
    var drawerClose = document.getElementById('drawer-close');
    var drawerBackdrop = document.getElementById('drawer-backdrop');

    function openDrawer() {
        if (navL) navL.classList.add('drawer-open');
        if (drawerBackdrop) drawerBackdrop.classList.add('active');
    }

    function closeDrawer() {
        if (navL) navL.classList.remove('drawer-open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    }

    if (pillBtn) pillBtn.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    function updateHeight() {
        viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (container) {
            container.style.top = -index * viewHeight + 'px';
        }
    }

    window.addEventListener('resize', updateHeight);

    function changeColor(idx) {
        for (var j = 0; j < lis.length; j++) {
            lis[j].className = '';
        }
        if (lis[idx]) {
            lis[idx].className = 'active';

            // Sync Mobile Selector Pill text & icon
            var hallName = lis[idx].getAttribute('data-name') || lis[idx].innerText.trim();
            var hallIcon = lis[idx].getAttribute('data-icon') || (lis[idx].querySelector('img') ? lis[idx].querySelector('img').src : '');
            if (pillText && hallName) pillText.textContent = hallName;
            if (pillIcon && hallIcon) pillIcon.src = hallIcon;
        }
    }

    function goToSlide(targetIndex) {
        if (!container) return;
        viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > lis.length - 1) targetIndex = lis.length - 1;
        
        index = targetIndex;
        container.style.top = -index * viewHeight + 'px';
        changeColor(index);
    }

    // Scroll handling
    function handleScroll(e) {
        if (!container) return;
        // Don't scroll slides if modal or drawer is open
        if (navL && navL.classList.contains('drawer-open')) return;
        var modal = document.getElementById('img-modal');
        if (modal && modal.classList.contains('show')) return;

        e = e || window.event;
        if (flag) {
            flag = false;
            var delta = typeof e.wheelDelta !== 'undefined' ? e.wheelDelta : -e.deltaY;
            if (delta > 0) {
                goToSlide(index - 1);
            } else {
                goToSlide(index + 1);
            }
            setTimeout(function() {
                flag = true;
            }, 450);
        }
    }

    document.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('mousewheel', handleScroll, { passive: true });

    // Touch swipe support for mobile
    var touchStartY = 0;
    var touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (navL && navL.classList.contains('drawer-open')) return;
        var modal = document.getElementById('img-modal');
        if (modal && modal.classList.contains('show')) return;

        touchEndY = e.changedTouches[0].clientY;
        var diff = touchStartY - touchEndY;
        if (Math.abs(diff) > 40 && flag) {
            flag = false;
            if (diff > 0) {
                // Swiped up -> next hall
                goToSlide(index + 1);
            } else {
                // Swiped down -> prev hall
                goToSlide(index - 1);
            }
            setTimeout(function() {
                flag = true;
            }, 450);
        }
    }, { passive: true });

    // Keyboard support (Arrow Up / Down / Esc)
    document.addEventListener('keydown', function(e) {
        var modal = document.getElementById('img-modal');
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
            closeDrawer();
            return;
        }

        if (modal && modal.classList.contains('show')) return;
        if (navL && navL.classList.contains('drawer-open')) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            goToSlide(index + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            goToSlide(index - 1);
        }
    });

    // Control pin click binding
    for (let i = 0; i < lis.length; i++) {
        lis[i].addEventListener('click', function() {
            goToSlide(i);
            closeDrawer();
        });
    }

    // Floating navigation arrows
    var prevBtn = document.getElementById('slide-prev');
    var nextBtn = document.getElementById('slide-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(index - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSlide(index + 1);
        });
    }

    // Lightbox image viewer for thumbnails & main artworks
    var modal = document.getElementById('img-modal');
    var modalImg = document.getElementById('modal-img');
    var modalClose = document.getElementById('modal-close');

    if (modal && modalImg) {
        // Initialize first thumbnail of each hall as active
        document.querySelectorAll('.container ul').forEach(function(ul) {
            var first = ul.querySelector('li');
            if (first) first.classList.add('active-thumb');
        });

        // Thumbnail click: switch main render angle & highlight
        var thumbs = document.querySelectorAll('.container ul li img');
        thumbs.forEach(function(img) {
            img.parentElement.addEventListener('click', function(e) {
                e.stopPropagation();
                var li = this;
                var zSection = li.closest('.z1, .z2, .z3, .z4, .z5, .z6, .z7, .z8');
                if (zSection) {
                    var wasActive = li.classList.contains('active-thumb');
                    zSection.style.backgroundImage = 'url("' + img.src + '")';
                    zSection.setAttribute('data-main-img', img.src);

                    var siblings = li.parentElement.querySelectorAll('li');
                    siblings.forEach(function(s) { s.classList.remove('active-thumb'); });
                    li.classList.add('active-thumb');

                    // If already active or clicked again, also open full-screen preview
                    if (wasActive) {
                        modalImg.src = img.src;
                        modal.classList.add('show');
                    }
                } else {
                    modalImg.src = img.src;
                    modal.classList.add('show');
                }
            });
        });

        // Main artwork hitbox / touch hint click
        var hitboxes = document.querySelectorAll('.main-artwork-hitbox, .main-view-touch-hint');
        hitboxes.forEach(function(box) {
            box.addEventListener('click', function(e) {
                e.stopPropagation();
                var parentSlide = box.closest('[data-main-img]');
                if (parentSlide) {
                    var imgSrc = parentSlide.getAttribute('data-main-img');
                    if (imgSrc) {
                        modalImg.src = imgSrc;
                        modal.classList.add('show');
                    }
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', function() {
                modal.classList.remove('show');
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === modalImg) {
                modal.classList.remove('show');
            }
        });
    }

    // Initialize pill with first slide info
    changeColor(0);
})();
