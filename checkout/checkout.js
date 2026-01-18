// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutItems();
});

function loadCheckoutItems() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (!orderItemsContainer) return;

    const items = CartService.getItems();
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
                    <span>${CartService.formatPrice(itemSubtotal)}</span>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    if (subtotalEl) subtotalEl.textContent = CartService.formatPrice(total);
    if (totalEl) totalEl.textContent = CartService.formatPrice(total);
}

// Listen for cart updates
window.addEventListener('cartUpdated', function() {
    loadCheckoutItems();
});

// Handle place order button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-place-order')) {
        e.preventDefault();
        handlePlaceOrder();
    }
});

function handlePlaceOrder() {
    // Validate form
    const form = document.querySelector('.billing-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get cart data
    const items = CartService.getItems();
    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Here you would typically send the order to a server
    alert('Order placed successfully! Thank you for your purchase.');

    // Clear cart after successful order
    CartService.clear();

    // Redirect to home or order confirmation page
    window.location.href = '../index.html';
}

