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
        if (container) {
            container.style.top = (-index * 100) + 'vh';
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
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex > lis.length - 1) targetIndex = lis.length - 1;
        
        index = targetIndex;
        container.style.top = (-index * 100) + 'vh';
        changeColor(index);
        if (window.scrollY !== 0 || window.pageYOffset !== 0) {
            window.scrollTo(0, 0);
        }
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

    document.addEventListener('touchmove', function(e) {
        // Allow normal touch scrolling inside opened menus, drawers, or modal
        var isScrollable = e.target.closest('#nav.nav-open') || 
                           e.target.closest('#nav-l.drawer-open') || 
                           e.target.closest('#img-modal.show');
        if (!isScrollable && e.cancelable) {
            e.preventDefault();
        }
    }, { passive: false });

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

    // Track user touch interaction to reliably distinguish real mouse hover from touch emulation
    var lastTouchTimestamp = 0;
    window.addEventListener('touchstart', function() {
        lastTouchTimestamp = Date.now();
    }, { passive: true });

    function isDesktopPointer() {
        var hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        var isWide = window.innerWidth > 768;
        var notRecentTouch = (Date.now() - lastTouchTimestamp) > 800;
        return hasHover && isWide && notRecentTouch;
    }

    function switchHallImage(li, img) {
        var zSection = li.closest('.z1, .z2, .z3, .z4, .z5, .z6, .z7, .z8');
        if (zSection) {
            zSection.style.backgroundImage = 'url("' + img.src + '")';
            zSection.setAttribute('data-main-img', img.src);

            var siblings = li.parentElement.querySelectorAll('li');
            siblings.forEach(function(s) { s.classList.remove('active-thumb'); });
            li.classList.add('active-thumb');
        }
    }

    // Record initial default background image for every hall slide
    document.querySelectorAll('.z1, .z2, .z3, .z4, .z5, .z6, .z7, .z8').forEach(function(z) {
        var initialImg = z.getAttribute('data-main-img');
        if (!initialImg) {
            var bg = window.getComputedStyle(z).backgroundImage;
            var match = bg.match(/url\(["']?([^"']*)["']?\)/);
            if (match && match[1]) initialImg = match[1];
        }
        if (initialImg) {
            z.setAttribute('data-initial-img', initialImg);
            z.setAttribute('data-main-img', initialImg);
        }
    });

    function isPCMode() {
        return window.innerWidth > 1024 || (window.matchMedia && window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768);
    }

    // Function to restore a hall to its initial main artwork
    function restoreHallImage(zSection) {
        if (!zSection) return;
        var initialImg = zSection.getAttribute('data-initial-img');
        if (initialImg) {
            zSection.style.backgroundImage = 'url("' + initialImg + '")';
            zSection.setAttribute('data-main-img', initialImg);
        }
        var activeThumbs = zSection.querySelectorAll('ul li');
        activeThumbs.forEach(function(s) {
            s.classList.remove('active-thumb');
            s.removeAttribute('data-pinned');
        });
    }

    // Thumbnail interaction: PC hover-preview & restore vs Mobile click & modal
    var uls = document.querySelectorAll('.container ul');
    uls.forEach(function(ul) {
        var zSection = ul.closest('.z1, .z2, .z3, .z4, .z5, .z6, .z7, .z8');

        // PC 电脑端：鼠标移出缩略图区域时，若未锁定固定，立即恢复至最开始的初始主图
        ul.addEventListener('mouseleave', function() {
            if (isPCMode()) {
                var pinnedLi = ul.querySelector('li[data-pinned="true"]');
                if (!pinnedLi) {
                    restoreHallImage(zSection);
                }
            }
        });

        var thumbs = ul.querySelectorAll('li img');
        thumbs.forEach(function(img) {
            var li = img.parentElement;

            // PC 悬停：即时预览对应大图
            li.addEventListener('mouseenter', function() {
                if (isPCMode()) {
                    var pinnedLi = ul.querySelector('li[data-pinned="true"]');
                    if (!pinnedLi || pinnedLi === li) {
                        switchHallImage(li, img);
                    } else {
                        if (zSection) {
                            zSection.style.backgroundImage = 'url("' + img.src + '")';
                            zSection.setAttribute('data-main-img', img.src);
                            ul.querySelectorAll('li').forEach(function(s) { s.classList.remove('active-thumb'); });
                            li.classList.add('active-thumb');
                        }
                    }
                }
            });

            // 点击操作：PC 电脑端可点击固定/取消固定，再次点击恢复最初始大图；移动端切换并支持打开高清全屏
            li.addEventListener('click', function(e) {
                e.stopPropagation();

                if (isPCMode()) {
                    var isPinned = li.getAttribute('data-pinned') === 'true';
                    if (isPinned) {
                        // 再次点击已选中的图片：取消固定，直接恢复到最开始的图片！
                        li.removeAttribute('data-pinned');
                        restoreHallImage(zSection);
                    } else {
                        // 首次点击：固定当前图片视角
                        ul.querySelectorAll('li').forEach(function(s) {
                            s.removeAttribute('data-pinned');
                            s.classList.remove('active-thumb');
                        });
                        li.setAttribute('data-pinned', 'true');
                        switchHallImage(li, img);
                    }
                    return;
                }

                // 移动端及平板端（<= 1024px）：
                var wasActive = li.classList.contains('active-thumb');
                switchHallImage(li, img);

                if (modal && modalImg) {
                    // 首次点击切换视角，再次点击已选中的图片进入全屏高清大图
                    if (wasActive) {
                        modalImg.src = img.src;
                        modal.classList.add('show');
                    }
                }
            });
        });
    });

    // 点击展厅任意空白处，也可取消固定并恢复为最开始的初始图
    document.querySelectorAll('.z1, .z2, .z3, .z4, .z5, .z6, .z7, .z8').forEach(function(z) {
        z.addEventListener('click', function(e) {
            if (isPCMode()) {
                if (!e.target.closest('ul') && !e.target.closest('#nav-l')) {
                    var pinnedLi = z.querySelector('ul li[data-pinned="true"]');
                    if (pinnedLi) {
                        restoreHallImage(z);
                    }
                }
            }
        });
    });

    if (modal && modalImg) {
        // Main artwork hitbox / touch hint click (仅在移动端与平板端 <= 1024px 生效)
        var hitboxes = document.querySelectorAll('.main-artwork-hitbox, .main-view-touch-hint');
        hitboxes.forEach(function(box) {
            box.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isPCMode()) return; // PC 端不触发弹窗
                
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
