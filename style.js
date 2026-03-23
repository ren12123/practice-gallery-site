document.addEventListener('DOMContentLoaded', () => {
    // --- 1. パララックス (変更なし) ---
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

    // --- 2. フェードアップ (変更なし) ---
    const fadeElements = document.querySelectorAll('.fadeup');
    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => generalObserver.observe(el));

    // --- 3. 画像5-6の消去とAccess背景の連動 (完全対称版) ---
    const inOutImages = document.querySelectorAll('.in-out'); 
    const triggerImg6 = document.querySelector('.picture-right.in-out'); 
    const accessSection = document.querySelector('.access');
    const accessContent = document.querySelector('.access__content');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const rect = entry.boundingClientRect;
            const wh = window.innerHeight;

            // 画面外（下）にあり、かつ見えていない時はリセット（バグ防止）
            if (!entry.isIntersecting && rect.top > wh) {
                inOutImages.forEach(img => img.classList.remove('is-hidden'));
                accessSection.classList.remove('is-bg-active');
                return;
            }

            // --- 画像6に対する判定 ---
            if (entry.target === triggerImg6) {
                // 判定基準を wh / 3 に統一（下スクロールの消える位置に合わせる）
                if (rect.top < wh / 3) { 
                    // 【下へ進む時】画像が消え、背景が出る
                    inOutImages.forEach(img => img.classList.add('is-hidden'));
                    accessSection.classList.add('is-bg-active');
                } else {
                    // 【上へ戻る時】画像が現れ、背景が消える
                    inOutImages.forEach(img => img.classList.remove('is-hidden'));
                    accessSection.classList.remove('is-bg-active');
                }
            }

            // --- Access文章に対する判定 ---
            if (entry.target === accessContent) {
                // 文章が上部1/3を過ぎたら背景を完全に消す（セクション終了）
                if (rect.top < wh / 3) {
                    accessSection.classList.remove('is-bg-active');
                } 
                // 戻る時、文章が1/3より下にあれば背景を再点灯
                // ※ただし画像6の判定と矛盾しないよう、画像6が画面上部にある時だけ機能する
                else if (rect.top > wh / 3) {
                    // 画像6がまだ「消えるべき位置」にいるかチェック
                    const img6Rect = triggerImg6.getBoundingClientRect();
                    if (img6Rect.top < wh / 3) {
                        accessSection.classList.add('is-bg-active');
                    }
                }
            }
        });
    }, {
        // 0.1刻みで細かくチェック
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    });

    if (triggerImg6) scrollObserver.observe(triggerImg6);
    if (accessContent) scrollObserver.observe(accessContent);
});