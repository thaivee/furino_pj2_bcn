document.addEventListener("DOMContentLoaded", () => {
    
    const loadComponent = (id, path) => {
        const element = document.getElementById(id);
        if (element) {
            fetch(path)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(err => console.error("Lỗi tải component:", err));
        }
    };

    loadComponent('header-placeholder', '/component/header/header.html');
    loadComponent('footer-placeholder', '/component/footer/footer.html');
    const mainImg = document.getElementById('main-product-img');
    const thumbnails = document.querySelectorAll('.img-small img');

    if (mainImg && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImg.src = thumb.src;
                mainImg.style.opacity = '0.5';
                setTimeout(() => { mainImg.style.opacity = '1'; }, 100);
            });
        });
    }
    const qtyInput = document.getElementById('quantity-input');
    const btnDecrease = document.getElementById('decrease-qty');
    const btnIncrease = document.getElementById('increase-qty');

    if (qtyInput && btnDecrease && btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });

        btnDecrease.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
    }


    const setupActive = (selector) => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    };

    setupActive('.size-text');
    setupActive('.colour');


    const viewMoreBtn = document.querySelector('.button-viewmore');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = '../shop/shop.html';
        });
    }
});