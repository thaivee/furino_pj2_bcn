document.addEventListener("DOMContentLoaded", () => {

    const loadComponent = (id, path) => {
        const element = document.getElementById(id);
        if (element) {
            fetch(path)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(err => console.error("Error loading component:", err));
        }
    };

    loadComponent('header-placeholder', '/component/header/header.html');
    loadComponent('footer-placeholder', '/component/footer/footer.html');

    loadProductFromUrl();
    loadRelatedProducts();

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

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const qtyInput = document.getElementById('quantity-input');
            const quantity = parseInt(qtyInput?.value) || 1;
            addToCart(addToCartBtn, quantity);
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

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadProductFromUrl() {
    const productId = getProductIdFromUrl();

    if (!productId || typeof window.getProductById === 'undefined') {
        return;
    }

    const product = window.getProductById(productId, '..');
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    document.getElementById('breadcrumb-product-name').textContent = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `VND ${product.price}`;
    document.getElementById('product-description').textContent = product.desc;

    const mainImg = document.getElementById('main-product-img');
    if (mainImg) {
        mainImg.src = product.img;
        mainImg.alt = product.name;
    }

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-product-id', product.id);
    }

    document.title = `Funiro - ${product.name}`;
}

function loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid || typeof window.products === 'undefined') return;

    const currentProductId = parseInt(getProductIdFromUrl()) || 0;
    const relatedProducts = window.products
        .filter(p => p.id !== currentProductId)
        .slice(0, 4);

    relatedGrid.innerHTML = relatedProducts.map(p => {
        let cardClass = 'card';
        if (p.type === 'sale') cardClass = 'card-sale';
        else if (p.type === 'new') cardClass = 'card-new';

        let badgeHtml = '';
        if (p.type === 'sale' && p.discount) {
            badgeHtml = `<div class="circle">-${p.discount}</div>`;
        } else if (p.type === 'new') {
            badgeHtml = `<div class="circle" style="background:#2EC1AC">New</div>`;
        }

        let oldPriceHtml = '';
        if (p.oldPrice) {
            oldPriceHtml = `<p style="text-decoration:line-through; color:#B0B0B0">VND ${p.oldPrice}</p>`;
        }

        return `
            <div class="${cardClass}" data-product-id="${p.id}" onclick="window.location.href='single-product.html?id=${p.id}'">
                <img src="../${p.img}" alt="${p.name}">
                ${badgeHtml}
                <div class="in4">
                    <h5>${p.name}</h5>
                    <p>${p.desc}</p>
                    <div>
                        <h6>VND ${p.price}</h6>
                        ${oldPriceHtml}
                    </div>
                </div>
                <div class="card-hover">
                    <button type="button" data-product-id="${p.id}" onclick="event.stopPropagation(); addToCart(this)">Add to cart</button>
                    <div class="action">
                        <a href="#" onclick="event.stopPropagation()">Share</a>
                        <a href="#" onclick="event.stopPropagation()">Compare</a>
                        <a href="#" onclick="event.stopPropagation()">Like</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}