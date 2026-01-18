let cartPageInitialized = false;

function initializeCartPage() {
    if (cartPageInitialized) return;
    if (typeof window.CartService === 'undefined' || !window.CartService._initialized) return;

    cartPageInitialized = true;
    loadCartItems();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

window.addEventListener('cartReady', function() {
    initializeCartPage();
});

window.addEventListener('cartUpdated', function() {
    if (cartPageInitialized) {
       loadCartItems();
    }
});

function loadCartItems() {
    const tableBody = document.getElementById('cart-table-body');
    if (!tableBody) return;
    const items = window.CartService.getItems();

    if (items.length === 0) {
        showEmptyCart();
        return;
    }

    let html = '';
    items.forEach(item => {
        const subtotal = item.price * item.quantity;
        html += `
            <tr class="cart-row" data-id="${item.id}" data-price="${item.price}">
                <td class="cart-product-image">
                    <img src="${item.image}" alt="${item.name}">
                </td>
                <td class="cart-product-name">${item.name}</td>
                <td class="cart-product-price">${window.CartService.formatPrice(item.price)}</td>
                <td class="cart-product-quantity">
                    <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input" title="Quantity" aria-label="Quantity">
                </td>
                <td class="cart-product-subtotal">${window.CartService.formatPrice(subtotal)}</td>
                <td class="cart-product-remove">
                    <button type="button" class="remove-btn" title="Remove item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
    updateCartTotals();
}

function initCartPage() {
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            handleQuantityChange(e);
        }
    });
    document.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.remove-btn');
        if (removeBtn) {
            handleRemoveItem(removeBtn);
        }
    });
}

function handleQuantityChange(e) {
    const input = e.target;
    const row = input.closest('.cart-row');
    const itemId = parseInt(row.dataset.id);
    const quantity = parseInt(input.value);
    if (quantity < 1) {
        input.value = 1;
        return;
    }
    window.CartService.updateQuantity(itemId, quantity);
    const price = parseFloat(row.dataset.price);
    const subtotal = price * quantity;
    const subtotalCell = row.querySelector('.cart-product-subtotal');
    subtotalCell.textContent = window.CartService.formatPrice(subtotal);
    updateCartTotals();
}

function handleRemoveItem(removeBtn) {
    const row = removeBtn.closest('.cart-row');
    if (row) {
        const itemId = parseInt(row.dataset.id);
        window.CartService.removeItem(itemId);
        row.remove();
        updateCartTotals();
        const items = window.CartService.getItems();
        if (items.length === 0) {
            showEmptyCart();
        }
    }
}

function updateCartTotals() {
    const total = window.CartService.getTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = window.CartService.formatPrice(total);
    if (totalEl) totalEl.textContent = window.CartService.formatPrice(total);
}

function showEmptyCart() {
    const tableWrapper = document.querySelector('.cart-table-wrapper');
    if (tableWrapper) {
        tableWrapper.innerHTML = `
            <div class="cart-empty-message">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="../index.html">Continue Shopping</a>
            </div>
        `;
    }
}
