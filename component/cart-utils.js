// Maximum quantity limit for a single product
const MAX_PRODUCT_QUANTITY = 10;

async function addToCart(btn, quantity = 1) {
    const productId = btn.getAttribute('data-product-id');
    
    if (!productId) {
        console.error('No product ID found on button');
        return;
    }

    if (typeof window.CartService !== 'undefined' && !window.CartService.isLoggedIn()) {
        showLoginRequiredNotification();
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
        // Check if product already exists in cart
        const existingItems = window.CartService.getItems();
        const existingItem = existingItems.find(i => i.id === item.id);
        const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

        // Check if adding this would exceed the limit
        if (newQuantity > MAX_PRODUCT_QUANTITY) {
            showLimitNotification(product.name, MAX_PRODUCT_QUANTITY, existingItem ? existingItem.quantity : 0);
            return; // Don't add to cart if it exceeds limit
        }

        await window.CartService.addItem(item);

        btn.textContent = 'Added!';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Add to cart';
            btn.disabled = false;
        }, 1500);

        showAddToCartNotification(product.name);
    } else {
        console.error('CartService not available');
    }
}

function showAddToCartNotification(productName) {
    const existingNotif = document.getElementById('add-to-cart-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'add-to-cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        animation: slideInRight 0.3s ease-in-out;
    `;
    notification.textContent = `✓ ${productName} added to cart`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function showLimitNotification(productName, maxLimit, currentQuantity) {
    const existingNotif = document.getElementById('limit-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'limit-notification';
    notification.className = 'limit-notification';
    
    const remainingSlots = maxLimit - currentQuantity;
    const message = remainingSlots <= 0 
        ? `Maximum limit reached for ${productName}! You can only add up to ${maxLimit} items.`
        : `Limit for ${productName}! Only ${remainingSlots} item${remainingSlots !== 1 ? 's' : ''} remaining.`;

    notification.innerHTML = `
        <div class="limit-notification-content">
            <i class="fa-solid fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('fadeOut');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function showLoginRequiredNotification() {
    const existingNotif = document.getElementById('login-required-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'login-required-notification';
    notification.className = 'login-required-notification';
    
    notification.innerHTML = `
        <div class="login-notification-content">
            <i class="fa-solid fa-lock"></i>
            <div class="login-notification-text">
                <p class="login-message">Please login to add products to your cart</p>
                <div class="login-notification-buttons">
                    <button class="login-btn" onclick="window.location.href='/login/login.html'">
                        <i class="fa-solid fa-sign-in-alt"></i> Login
                    </button>
                    <button class="signup-btn" onclick="window.location.href='/login/login.html'">
                        <i class="fa-solid fa-user-plus"></i> Sign Up
                    </button>
                </div>
            </div>
            <button class="login-notification-close" onclick="this.closest('.login-required-notification').remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fadeOut');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

function getMaxProductQuantity() {
    return MAX_PRODUCT_QUANTITY;
}

function setMaxProductQuantity(newLimit) {
    if (typeof newLimit === 'number' && newLimit > 0) {
        MAX_PRODUCT_QUANTITY = newLimit;
        console.log(`Max product quantity updated to: ${newLimit}`);
    } else {
        console.error('Invalid quantity limit. Must be a positive number.');
    }
}

if (typeof window !== 'undefined') {
    window.addToCart = addToCart;
    window.showLimitNotification = showLimitNotification;
    window.showLoginRequiredNotification = showLoginRequiredNotification;
    window.getMaxProductQuantity = getMaxProductQuantity;
    window.setMaxProductQuantity = setMaxProductQuantity;
}

