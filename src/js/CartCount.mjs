import { getLocalStorage } from "./utils.mjs";

function cartCountTemplate() {
    return `<span class="cart-count">0</span>`;
}

export default class CartCount {
    constructor(container) {
        this.container = container;
        this.countElement = null;
    }

    render() {
        if (!this.container) {
            console.warn('No container element provided for cart count');
            return;
        }
        
        // Check if count element already exists to avoid duplicates
        const existingCount = this.container.querySelector('.cart-count');
        if (existingCount) {
            this.countElement = existingCount;
        } else {
            this.container.insertAdjacentHTML('afterbegin', cartCountTemplate());
            this.countElement = this.container.querySelector('.cart-count');
        }
        
        this.updateCount();
    }
    
    updateCount() {
        const cartItems = getLocalStorage('so-cart') || [];
        const count = Array.isArray(cartItems) ? cartItems.length : 0;

        if (!this.countElement) {
            console.warn('Cart count element not found');
            return;
        }
        
        this.countElement.textContent = count;
        
        // Show/hide count based on whether there are items
        if (count > 0) {
            this.countElement.style.display = 'block';
        } else {
            this.countElement.style.display = 'none';
        }
    }

    listenForUpdates(eventName = 'cartUpdated') {
        window.addEventListener(eventName, () => this.updateCount());
    }

    listenForUpdates(eventName = 'cartUpdated') {
        window.addEventListener(eventName, () => this.updateCount());
    }
}