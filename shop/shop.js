document.addEventListener("DOMContentLoaded", () => {
    const products = window.getProducts ? window.getProducts('..') : [];

    const productGrid = document.getElementById('product-grid');
    const showInput = document.querySelector('.input-small');
    const searchInput = document.getElementById('product-search');
    const filterBtn = document.getElementById('filter-btn');

    let currentProducts = [...products];
    let isAsc = true;

    const renderProducts = (list) => {
        let showCount = parseInt(showInput.value) || 16;
        if (showCount > 16) showCount = 16;
        if (showCount < 1) showCount = 1;

        const limitedList = list.slice(0, showCount);
        productGrid.innerHTML = limitedList.map(p => {
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
                <div class="${cardClass}" data-product-id="${p.id}" onclick="window.location.href='../single%20product/single-product.html?id=${p.id}'">
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
                            <a href="#" onclick="event.stopPropagation()"><i class="fa-solid fa-share-nodes"></i> Share</a>
                            <a href="#" onclick="event.stopPropagation()"><i class="fa-solid fa-right-left"></i> Compare</a>
                            <a href="#" onclick="event.stopPropagation()"><i class="fa-regular fa-heart"></i> Like</a>
                        </div>
                    </div>
                </div>`;
        }).join('');
    };

    showInput.addEventListener('input', () => {
        if (showInput.value > 12) showInput.value = 12;
        renderProducts(currentProducts);
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        currentProducts = products.filter(p => p.name.toLowerCase().includes(query));
        renderProducts(currentProducts);
    });

    filterBtn.addEventListener('click', () => {
        currentProducts.sort((a, b) =>
            isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        isAsc = !isAsc;
        renderProducts(currentProducts);
    });

    renderProducts(products);
});