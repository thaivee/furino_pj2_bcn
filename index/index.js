document.addEventListener("DOMContentLoaded", () => {

    // Render products dynamically
    const productGrid = document.getElementById('product-grid');
    if (productGrid && typeof window.products !== 'undefined') {
        renderProducts(window.products);
    }

    const buyNowBtn = document.querySelector('.description button');

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            window.location.href = './shop/shop.html'; 
        });
        buyNowBtn.style.cursor = 'pointer';
    }

    const viewMoreBtn = document.querySelector('.button-viewmore');

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            window.location.href = './shop/shop.html'; 
        });
        viewMoreBtn.style.cursor = 'pointer';
    }

    const exploreBtn = document.querySelector('.button-explore');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            window.location.href = './shop/shop.html'; 
        });
        exploreBtn.style.cursor = 'pointer';
    }

    const slider = document.getElementById('slider-view4');
    const nextBtn = document.getElementById('next-btn-view4');
    const dots = document.querySelectorAll('#dots-container-view4 .dot');
    const cards = document.querySelectorAll('.slide-card');

    if (slider && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollAmount = cards[0].offsetWidth + 24;
            slider.scrollLeft += scrollAmount;

            if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
                slider.scrollLeft = 0;
            }
        });

      
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const scrollAmount = cards[0].offsetWidth + 24;
                slider.scrollLeft = index * scrollAmount;
            });
        });

        slider.addEventListener('scroll', () => {
            const scrollAmount = cards[0].offsetWidth + 24;
            const currentIndex = Math.round(slider.scrollLeft / scrollAmount);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        });

        let isDown = false;
        let startX;
        let scrollLeftPos;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeftPos = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeftPos - walk;
        });
    }

    const galleryTrack = document.getElementById('gallery-track-view5');
    if (galleryTrack) {
        galleryTrack.addEventListener('mouseenter', () => {
            galleryTrack.style.animationPlayState = 'paused';
        });
        galleryTrack.addEventListener('mouseleave', () => {
            galleryTrack.style.animationPlayState = 'running';
        });
    }

});

function renderProducts(productList) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = productList.map(p => {
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
            <div class="${cardClass}" data-product-id="${p.id}" onclick="window.location.href='single%20product/single-product.html?id=${p.id}'">
                <img src="${p.img}" alt="${p.name}">
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
                        <a href="#" onclick="event.stopPropagation()">Like</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}