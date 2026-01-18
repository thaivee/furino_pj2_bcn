// Shared Cart Service - used across all pages
const CartService = {
    STORAGE_KEY: 'furniroCart',
    VERSION_KEY: 'furniroCartVersion',
    CURRENT_VERSION: 2,

    getItems: function() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return [];
    },

    saveItems: function(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        this.notifyUpdate();
    },

    addItem: function(item) {
        const items = this.getItems();
        const existingIndex = items.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
            items[existingIndex].quantity += item.quantity || 1;
        } else {
            items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image
            });
        }
        
        this.saveItems(items);
        return items;
    },

    removeItem: function(itemId) {
        let items = this.getItems();
        items = items.filter(i => i.id !== itemId);
        this.saveItems(items);
        return items;
    },

    updateQuantity: function(itemId, quantity) {
        const items = this.getItems();
        const item = items.find(i => i.id === itemId);
        
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveItems(items);
        }
        return items;
    },

    getTotal: function() {
        const items = this.getItems();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount: function() {
        const items = this.getItems();
        return items.reduce((count, item) => count + item.quantity, 0);
    },

    clear: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.notifyUpdate();
    },

    formatPrice: function(price) {
        return price.toLocaleString('vi-VN') + ' ₫';
    },

    notifyUpdate: function() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.getItems(),
                total: this.getTotal(),
                count: this.getItemCount()
            }
        }));
    },

    initWithDefaults: function() {
        const storedVersion = localStorage.getItem(this.VERSION_KEY);

        if (storedVersion !== String(this.CURRENT_VERSION)) {
            this.clear();
            localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
        }

        if (this.getItems().length === 0) {
            const defaultItems = [
                { id: 1, name: 'Asgaard sofa', price: 25000000, quantity: 1, image: '/img/syltherine.png' },
                { id: 2, name: 'Casaliving Wood', price: 27000000, quantity: 1, image: '/img/lolito.png' }
            ];
            this.saveItems(defaultItems);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    CartService.initWithDefaults();
});

