document.addEventListener('DOMContentLoaded', () => {
    // 1. 動かしたい要素を取得
    const leftImg = document.querySelector('.main-gallery__img--left');
    const rightImg = document.querySelector('.main-gallery__img--right');
    const allImg = document.querySelectorAll('.main-gallery__img');

    let ticking = false;

    // 2. スクロールイベントの登録
    window.addEventListener('scroll', () => {
        // パフォーマンス対策：描画のタイミング（1秒間に60回）に合わせて計算を実行
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateAnimation();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // スクロールを滑らかにするためのオプション

    // 3. 実際の計算・アニメーション処理
    function updateAnimation() {
        const scrollY = window.scrollY; // 現在のスクロール量（px）を取得

        // 768px以上の時だけ画像をスライドさせる
        if (window.innerWidth > 768) {
            // 例：スクロール量に合わせて最大20pxまで左右に広げる
            const moveAmount = scrollY * 1.8;
            const scaleAmount = Math.min(1 + scrollY * 0.003, 3);

            if (allImg.length > 0) {
                allImg.forEach((img) => {
                    if (img.classList.contains('main-gallery__img--left')) {
                        img.style.transform = `translateX(-${moveAmount}px) scale(${scaleAmount})`;
                    }

                    else if (img.classList.contains('main-gallery__img--right')) {
                        img.style.transform = `translateX(${moveAmount}px) scale(${scaleAmount})`;
                    } 
                    // 真ん中の画像の場合
                    else {
                        img.style.transform = `scale(${scaleAmount})`;
                    }
                });
            }
        }
    }

    const fadeElements = document.querySelectorAll('.fadeup')

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            }
        });
    }, {
        threshold: 0.3
    });

    fadeElements.forEach((el) => {
        observer.observe(el)
    });
});