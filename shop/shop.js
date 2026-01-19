document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById('product-grid');

    const productTemplates = [
        {
            type: 'card-sale',
            img: '/img/image 1.png',
            badge: '50%',
            name: 'Syltherine',
            desc: 'Stylish cafe chair',
            price: 'Rp 2.500.000',
            oldPrice: 'Rp 3.500.000'
        },
        {
            type: 'card',
            img: '/img/image 2.png',
            badge: null,
            name: 'Leviosa',
            desc: 'Stylish cafe chair',
            price: 'Rp 2.500.000',
            oldPrice: null
        },
        {
            type: 'card-new',
            img: '/img/image 3.png',
            badge: 'New',
            name: 'Respira',
            desc: 'Outdoor bar table and stool',
            price: 'Rp 500.000',
            oldPrice: null
        }
    ];

    function createProductHTML(product) {
        return `
            <div class="${product.type}">
                <img src="${product.img}" alt="${product.name}">
                ${product.badge ? `<div class="circle">${product.badge}</div>` : ''}
                <div class="in4">
                    <h5>${product.name}</h5>
                    <p>${product.desc}</p>
                    <div>
                        <h6>${product.price}</h6>
                        ${product.oldPrice ? `<p>${product.oldPrice}</p>` : ''}
                    </div>
                </div>
                <div class="card-hover">
                    <button>Add to cart</button>
                    <div class="action">
                        <a href="#"><i class="fa-solid fa-share-nodes"></i> Share</a>
                        <a href="#"><i class="fa-solid fa-right-left"></i> Compare</a>
                        <a href="#"><i class="fa-regular fa-heart"></i> Like</a>
                    </div>
                </div>
            </div>
        `;
    }

    if (productGrid) {
        let allProductsHTML = "";
        for (let i = 0; i < 4; i++) {
            productTemplates.forEach(product => {
                allProductsHTML += createProductHTML(product);
            });
        }
        productGrid.innerHTML = allProductsHTML;
    }
});