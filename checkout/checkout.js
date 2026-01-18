let checkoutInitialized = false;

function initializeCheckout() {
    if (checkoutInitialized) return;
    if (typeof window.CartService === 'undefined' || !window.CartService._initialized) return;

    checkoutInitialized = true;
    loadCheckoutItems();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

window.addEventListener('cartReady', function() {
    initializeCheckout();
});

window.addEventListener('cartUpdated', function() {
    if (checkoutInitialized) {
        loadCheckoutItems();
    }
});

function loadCheckoutItems() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (!orderItemsContainer) return;

    const items = window.CartService.getItems();
    renderOrderItems(items, orderItemsContainer, subtotalEl, totalEl);
}

function renderOrderItems(items, container, subtotalEl, totalEl) {
    let html = '';
    let total = 0;

    if (items.length === 0) {
        html = '<div class="order-item empty"><span>Your cart is empty</span></div>';
    } else {
        items.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal;

            html += `
                <div class="order-item" data-id="${item.id}">
                    <span>${item.name} <span class="quantity">x ${item.quantity}</span></span>
                    <span>${window.CartService.formatPrice(itemSubtotal)}</span>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    if (subtotalEl) subtotalEl.textContent = window.CartService.formatPrice(total);
    if (totalEl) totalEl.textContent = window.CartService.formatPrice(total);
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-place-order')) {
        e.preventDefault();
        handlePlaceOrder();
    }
});

function handlePlaceOrder() {
    const form = document.querySelector('.billing-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const items = window.CartService.getItems();
    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Order placed successfully! Thank you for your purchase.');

    window.CartService.clear();
    window.location.href = '../index.html';
}
