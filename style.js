document.addEventListener('DOMContentLoaded', () => {
    // --- 1. パララックス ---
    const allImg = document.querySelectorAll('.main-gallery__img');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeroAnimation();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function updateHeroAnimation() {
        const scrollY = window.scrollY;
        if (window.innerWidth > 768) {
            const moveAmount = scrollY * 1.8;
            const scaleAmount = Math.min(1 + scrollY * 0.003, 3);
            allImg.forEach((img) => {
                if (img.classList.contains('main-gallery__img--left')) {
                    img.style.transform = `translateX(-${moveAmount}px) scale(${scaleAmount})`;
                } else if (img.classList.contains('main-gallery__img--right')) {
                    img.style.transform = `translateX(${moveAmount}px) scale(${scaleAmount})`;
                } else {
                    img.style.transform = `scale(${scaleAmount})`;
                }
            });
        }
    }

    // --- 2. フェードアップ ---
    const fadeElements = document.querySelectorAll('.fadeup');
    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => generalObserver.observe(el));

    // --- 3. 画像5-6消去とAccess背景連動 ---
    const inOutImages = document.querySelectorAll('.in-out'); 
    const triggerImg6 = document.querySelector('.picture-right.in-out'); 
    const accessSection = document.querySelector('.access');
    const accessContent = document.querySelector('.access__content');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const rect = entry.boundingClientRect;
            const wh = window.innerHeight;

            if (!entry.isIntersecting && rect.top > wh) {
                inOutImages.forEach(img => img.classList.remove('is-hidden'));
                accessSection.classList.remove('is-bg-active');
                return;
            }

            if (entry.target === triggerImg6) {
                if (rect.top < wh / 3) { 
                    inOutImages.forEach(img => img.classList.add('is-hidden'));
                    accessSection.classList.add('is-bg-active');
                } else {
                    inOutImages.forEach(img => img.classList.remove('is-hidden'));
                    accessSection.classList.remove('is-bg-active');
                }
            }

            if (entry.target === accessContent) {
                if (rect.top < wh / 3) {
                    accessSection.classList.remove('is-bg-active');
                } 
                else if (rect.top > wh / 3) {
                    const img6Rect = triggerImg6.getBoundingClientRect();
                    if (img6Rect.top < wh / 3) {
                        accessSection.classList.add('is-bg-active');
                    }
                }
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    });

    if (triggerImg6) scrollObserver.observe(triggerImg6);
    if (accessContent) scrollObserver.observe(accessContent);

    // --- 4. ハンバーガーメニュー制御 ---
    const hamBurger = document.querySelector('.hamburger');
    const serchMenu = document.querySelector('.menu');
    const header = document.querySelector('.header');

    hamBurger.addEventListener('click', () => {
        hamBurger.classList.toggle('is-active');
        header.classList.toggle('is-open');

        if (hamBurger.classList.contains('is-active')) {
            serchMenu.classList.add('is-active');
        }
        else {
            serchMenu.classList.remove('is-active');
        }
    });
});