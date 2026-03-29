document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 要素の取得 ---
    const allImg = document.querySelectorAll('.main-gallery__img');
    const fadeElements = document.querySelectorAll('.fadeup');
    const sideBtn = document.querySelector('.side-nav');
    const heroElement = document.querySelector('.hero');
    const inOutImages = document.querySelectorAll('.in-out'); 
    
    // 正しい Modifier: gallery__item--even
    const triggerImg6 = document.querySelector('.gallery__item--even.in-out'); 
    
    const accessSection = document.querySelector('.access');
    const accessContent = document.querySelector('.access__content');
    
    // 修正済み: header__hamburger
    const hamBurger = document.querySelector('.header__hamburger');
    const serchMenu = document.querySelector('.menu');
    const header = document.querySelector('.header');

    let ticking = false;

    // --- 2. スクロールイベント ---
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeroAnimation();
                handleSideBtnDisplay();
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

    function handleSideBtnDisplay() {
        if (!heroElement || !sideBtn || !accessSection) return;
        const heroRect = heroElement.getBoundingClientRect();
        const accessRect = accessSection.getBoundingClientRect();
        const vh = window.innerHeight;

        if (heroRect.top < 100 && accessRect.top > (vh + 100)) {
            sideBtn.classList.add('is-activate');
        } else {
            sideBtn.classList.remove('is-activate');
        }
    }

    // --- 3. フェードアニメーション ---
    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => generalObserver.observe(el));

    // --- 4. 画像5-6消去とAccess背景連動 ---
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
                } else if (rect.top > wh / 3) {
                    if (triggerImg6) {
                        const img6Rect = triggerImg6.getBoundingClientRect();
                        if (img6Rect.top < wh / 3) {
                            accessSection.classList.add('is-bg-active');
                        }
                    }
                }
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    });

    if (triggerImg6) scrollObserver.observe(triggerImg6);
    if (accessContent) scrollObserver.observe(accessContent);

    // --- 5. ハンバーガーメニュー制御 ---
    if (hamBurger) {
        hamBurger.addEventListener('click', () => {
            hamBurger.classList.toggle('is-active');
            header.classList.toggle('is-open');
            if (hamBurger.classList.contains('is-active')) {
                serchMenu.classList.add('is-active');
            } else {
                serchMenu.classList.remove('is-active');
            }
        });
    }
});