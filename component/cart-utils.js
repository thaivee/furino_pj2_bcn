async function addToCart(btn, quantity = 1) {
    const productId = btn.getAttribute('data-product-id');
    
    if (!productId) {
        console.error('No product ID found on button');
        return;
    }

    if (typeof window.getProductById === 'undefined') {
        console.error('Products not loaded');
        return;
    }

    const product = window.getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const price = parseInt(product.price.replace(/[^\d]/g, ''), 10);

    const item = {
        id: product.id,
        name: product.name,
        price: price,
        quantity: quantity,
        image: product.img.startsWith('/') ? product.img : '/' + product.img
    };

    if (typeof window.CartService !== 'undefined') {
        await window.CartService.addItem(item);

        btn.textContent = 'Added!';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Add to cart';
            btn.disabled = false;
        }, 1500);
    } else {
        console.error('CartService not available');
    }
}

if (typeof window !== 'undefined') {
    window.addToCart = addToCart;
}

