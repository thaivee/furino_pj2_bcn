document.addEventListener("DOMContentLoaded", () => {
    const products = [
        { id: 1, 
            name: "Syltherine", 
            desc: "Stylish cafe chair", 
            price: "2.500.000", 
            oldPrice: "3.500.000", 
            discount: "30%", 
            img: "../img/image 1.png", 
            type: "sale" 
        },
        { id: 2, 
            name: "Leviosa", 
            desc: "Stylish cafe chair", 
            price: "2.500.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 2.png", 
            type: "normal" 
        },
        { id: 3, 
            name: "Lolito", 
            desc: "Luxury big sofa", 
            price: "7.000.000", 
            oldPrice: "14.000.000", 
            discount: "50%", 
            img: "../img/image 3.png", 
            type: "sale" 
        },
        { id: 4, 
            name: "Respira", 
            desc: "Outdoor bar table and stool", 
            price: "500.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 4.png", 
            type: "new" 
        },
        { id: 5, 
            name: "Grifo", 
            desc: "Night lamp", 
            price: "1.500.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 1.png", 
            type: "normal" 
        },
        { id: 6, 
            name: "Muggo", 
            desc: "Small mug", 
            price: "150.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 2.png", 
            type: "new" 
        },
        { id: 7, 
            name: "Pingky", 
            desc: "Cute bed set", 
            price: "7.000.000", 
            oldPrice: "14.000.000", 
            discount: "50%", 
            img: "../img/image 3.png", 
            type: "sale" 
        },
        { id: 8, 
            name: "Potty", 
            desc: "Minimalist flower pot", 
            price: "500.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 4.png", 
            type: "new" 
        },
        { id: 9, 
            name: "Adora", 
            desc: "Luxury sofa set", 
            price: "25.000.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 1.png", 
            type: "normal" 
        
        },
        { id: 10, 
            name: "Bento", 
            desc: "Dining table", 
            price: "3.200.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 2.png", 
            type: "normal" 
        },
        { id: 11, 
            name: "Croma", 
            desc: "Study desk", 
            price: "1.800.000", 
            oldPrice: "", 
            discount: "", 
            img: "../img/image 3.png", 
            type: "new" 
        },
        { id: 12, 
            name: "Dura", 
            desc: "Office chair", 
            price: "1.200.000", 
            oldPrice: "2.000.000", 
            discount: "40%", 
            img: "../img/image 4.png", 
            type: "sale" 
        }
    ];

    const productGrid = document.getElementById('product-grid');
    const showInput = document.querySelector('.input-small');
    const searchInput = document.getElementById('product-search');
    const filterBtn = document.getElementById('filter-btn');

    let currentProducts = [...products]; 
    let isAsc = true;

    const renderProducts = (list) => {
        let showCount = parseInt(showInput.value) || 12;
        if (showCount > 12) showCount = 12;
        if (showCount < 1) showCount = 1;

        const limitedList = list.slice(0, showCount);
        productGrid.innerHTML = limitedList.map(p => `
            <div class="card" onclick="window.location.href='../single%20product/single-product.html'">
                <img src="${p.img}" alt="${p.name}">
                ${p.type === 'sale' ? `<div class="circle">-${p.discount}</div>` : 
                  p.type === 'new' ? `<div class="circle" style="background:#2EC1AC">New</div>` : ''}
                <div class="in4">
                    <h5>${p.name}</h5>
                    <p>${p.desc}</p>
                    <div>
                        <h6>Rp ${p.price}</h6>
                        ${p.oldPrice ? `<p style="text-decoration:line-through; color:#B0B0B0">Rp ${p.oldPrice}</p>` : ''}
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
            </div>`).join('');
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