let sidebarLoaded = false;

function loadCartSidebar(basePath = '') {
    const sidebarPath = basePath ? `${basePath}/component/cart-sidebar/cart-sidebar.html` : './cart-sidebar/cart-sidebar.html';

    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) throw new Error("Error loading cart sidebar");
            return response.text();
        })
        .then(data => {
            const sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'cart-sidebar-container';
            sidebarContainer.innerHTML = data;
            document.body.appendChild(sidebarContainer);
            sidebarLoaded = true;
            initCartSidebar();
            tryRenderSidebar();
        })
        .catch(error => console.error(error));
}

function tryRenderSidebar() {
    if (!sidebarLoaded) return;
    if (typeof window.CartService !== 'undefined' && window.CartService._initialized) {
        renderSidebarCartItems();
    }
}

window.addEventListener('cartReady', function() {
    tryRenderSidebar();
});

window.addEventListener('cartUpdated', function() {
    tryRenderSidebar();
});

function initCartSidebar() {
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-close-btn');
    document.addEventListener('click', function(e) {
        const cartIcon = e.target.closest('.cart-trigger');
        if (cartIcon) {
            e.preventDefault();
            openCartSidebar();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeCartSidebar);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartSidebar();
        }
    });

    document.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.cart-item-remove');
        if (removeBtn) {
            const cartItem = removeBtn.closest('.cart-item');
            if (cartItem) {
                const itemId = parseInt(cartItem.dataset.id);
                if (typeof window.CartService !== 'undefined') {
                    window.CartService.removeItem(itemId);
                }
                cartItem.remove();
                updateSidebarSubtotal();
            }
        }
    });
}

function renderSidebarCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    let items = [];
    if (typeof window.CartService !== 'undefined') {
        items = window.CartService.getItems();
    }

    if (items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        updateSidebarSubtotal();
        return;
    }

    let html = '';
    items.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${item.quantity} x ${formatSidebarPrice(item.price)}</p>
                </div>
                <button class="cart-item-remove" title="Remove item">
                    <i class="fa-solid fa-circle-xmark"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    updateSidebarSubtotal();
}

function formatSidebarPrice(price) {
    if (typeof window.CartService !== 'undefined') {
        return window.CartService.formatPrice(price);
    }
    return price.toLocaleString('vi-VN') + ' ₫';
}

function openCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderSidebarCartItems();
    }
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateSidebarSubtotal() {
    const subtotalEl = document.getElementById('cart-subtotal-price');

    if (typeof window.CartService !== 'undefined') {
        const total = window.CartService.getTotal();
        if (subtotalEl) {
            subtotalEl.textContent = window.CartService.formatPrice(total);
        }
    } else {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0 && subtotalEl) {
            subtotalEl.textContent = '0 ₫';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll('script[data-cart-base]');
    if (scripts.length > 0) {
        const basePath = scripts[scripts.length - 1].getAttribute('data-cart-base');
        loadCartSidebar(basePath);
    }
});
