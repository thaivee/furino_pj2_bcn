import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsc-64x3eq9bZ-hQAGz7a7INsBDRSqF4w",
    authDomain: "new-project-1d853.firebaseapp.com",
    projectId: "new-project-1d853",
    storageBucket: "new-project-1d853.firebasestorage.app",
    messagingSenderId: "1093376377124",
    appId: "1:1093376377124:web:70ecf5eeba7bfa573473b1",
    measurementId: "G-CZR721JW15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const CartService = {
    STORAGE_KEY: 'furniroCart',
    CURRENT_VERSION: 3,
    _items: [],
    _initialized: false,
    _userId: null,

    init() {
        if (this._initialized) return;

        this.loadFromLocalStorage();
        this._initialized = true;

        window.dispatchEvent(new CustomEvent('cartReady'));
        this.notifyUpdate();

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this._userId = user.uid;
                await this.loadFromFirestore();
            } else {
                if (this._userId !== null) {
                    this._userId = null;
                    this.loadFromLocalStorage();
                    this.notifyUpdate();
                }
            }
        });
    },

    async loadFromFirestore() {
        if (!this._userId) return;

        try {
            const cartRef = doc(db, 'carts', this._userId);
            const cartSnap = await getDoc(cartRef);

            if (cartSnap.exists()) {
                this._items = cartSnap.data().items || [];
            } else {
                this._items = this.getDefaultItems();
                await this.saveToFirestore();
            }
        } catch (error) {
            console.error('Error loading cart from Firestore:', error);
            this.loadFromLocalStorage();
        }
        this.notifyUpdate();
    },

    async saveToFirestore() {
        if (!this._userId) {
            this.saveToLocalStorage();
            return;
        }

        try {
            const cartRef = doc(db, 'carts', this._userId);
            await setDoc(cartRef, {
                items: this._items,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving cart to Firestore:', error);
            this.saveToLocalStorage();
        }
    },

    loadFromLocalStorage() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                this._items = JSON.parse(stored);
            } catch (e) {
                this._items = this.getDefaultItems();
            }
        } else {
            this._items = this.getDefaultItems();
        }
        this.saveToLocalStorage();
    },

    saveToLocalStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items));
    },

    getDefaultItems() {
        return [];
    },

    getItems() {
        return this._items;
    },

    async saveItems(items) {
        this._items = items;
        if (this._userId) {
            await this.saveToFirestore();
        } else {
            this.saveToLocalStorage();
        }
        this.notifyUpdate();
    },

    async addItem(item) {
        const existingIndex = this._items.findIndex(i => i.id === item.id);

        if (existingIndex >= 0) {
            this._items[existingIndex].quantity += item.quantity || 1;
        } else {
            this._items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image
            });
        }

        await this.saveItems(this._items);
        return this._items;
    },

    async removeItem(itemId) {
        this._items = this._items.filter(i => i.id !== itemId);
        await this.saveItems(this._items);
        return this._items;
    },

    async updateQuantity(itemId, quantity) {
        const item = this._items.find(i => i.id === itemId);

        if (item) {
            item.quantity = Math.max(1, quantity);
            await this.saveItems(this._items);
        }
        return this._items;
    },

    getTotal() {
        return this._items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount() {
        return this._items.reduce((count, item) => count + item.quantity, 0);
    },

    async clear() {
        this._items = [];
        if (this._userId) {
            await this.saveToFirestore();
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        this.notifyUpdate();
    },

    formatPrice(price) {
        return price.toLocaleString('vi-VN') + ' ₫';
    },

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this._items,
                total: this.getTotal(),
                count: this.getItemCount()
            }
        }));
    },

    isLoggedIn() {
        return this._userId !== null;
    }
};
window.CartService = CartService;
CartService.init();
