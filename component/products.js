const products = [
    { 
        id: 1, 
        name: "Syltherine", 
        desc: "Stylish cafe chair", 
        price: "2.500.000", 
        oldPrice: "3.500.000", 
        discount: "30%", 
        img: "img/image 1.png", 
        type: "sale" 
    },
    { 
        id: 2, 
        name: "Leviosa", 
        desc: "Stylish cafe chair", 
        price: "2.500.000", 
        oldPrice: "", 
        discount: "", 
        img: "img/image 2.png", 
        type: "normal" 
    },
    { 
        id: 3, 
        name: "Lolito", 
        desc: "Luxury big sofa", 
        price: "7.000.000", 
        oldPrice: "14.000.000", 
        discount: "50%", 
        img: "img/image 3.png", 
        type: "sale" 
    },
    { 
        id: 4, 
        name: "Respira", 
        desc: "Outdoor bar table and stool", 
        price: "500.000", 
        oldPrice: "", 
        discount: "", 
        img: "img/image 4.png", 
        type: "new" 
    },
    { 
        id: 5, 
        name: "Grifo", 
        desc: "Night lamp", 
        price: "1.500.000", 
        oldPrice: "", 
        discount: "", 
        img: "img/image 6.png", 
        type: "normal" 
    },
    { 
        id: 6, 
        name: "Muggo", 
        desc: "Small mug", 
        price: "150.000", 
        oldPrice: "", 
        discount: "", 
        img: "img/image 7.png", 
        type: "new" 
    },
    { 
        id: 7, 
        name: "Pingky", 
        desc: "Cute bed set", 
        price: "7.000.000", 
        oldPrice: "14.000.000", 
        discount: "50%", 
        img: "img/image 8.png", 
        type: "sale" 
    },
    { 
        id: 8, 
        name: "Potty", 
        desc: "Minimalist flower pot", 
        price: "500.000", 
        oldPrice: "", 
        discount: "", 
        img: "img/image 9.png", 
        type: "new" 
    }
];

function getProducts(basePath = '') {
    return products.map(product => ({
        ...product,
        img: basePath ? `${basePath}/${product.img}` : product.img
    }));
}

function getProductById(id, basePath = '') {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return null;

    return {
        ...product,
        img: basePath ? `${basePath}/${product.img}` : product.img
    };
}

if (typeof window !== 'undefined') {
    window.products = products;
    window.getProducts = getProducts;
    window.getProductById = getProductById;
}

