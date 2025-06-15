import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity || 1} <span class="remove-item" data-id="${item.Id}">X</span></p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export default class ShoppingCart {
    constructor() {
        this.cartItems = [];
        this.cartFooter = null;
        this.cartTotalElement = null;
        this.clearCartBtn = null;
    }

    async init() {
        this.cartItems = getLocalStorage("so-cart") || [];
        this.cartFooter = qs(".cart-footer");
        this.cartTotalElement = qs("#cart-total");
        this.clearCartBtn = document.getElementById("clearCartBtn");
        
        if (this.clearCartBtn) {
            this.clearCartBtn.addEventListener("click", () => {
                this.clearCart();
            });
        }
        
        // Render the cart contents
        this.renderCartContents();
    }
    
    renderCartContents() {
        const productList = document.querySelector(".cart-list");
        
        if (!productList) {
            console.error('Product list element not found');
            return;
        }

        if (this.cartItems.length === 0) {
            productList.innerHTML = '<li><p>Your cart is empty</p></li>';
            if (this.cartFooter) {
                this.cartFooter.classList.add("hide");
            }
            if (this.clearCartBtn) {
                this.clearCartBtn.style.display = "none";
            }
            return;
        }

        // Render cart items
        const htmlItems = this.cartItems.map((item) => cartItemTemplate(item));
        productList.innerHTML = htmlItems.join("");
    
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(span => {
            span.addEventListener('click', (e) => {
                e.preventDefault();
                const id = span.dataset.id;
                this.removeProductFromCart(id);
            });
        });
    
        // Handle cart total display
        if (this.cartFooter) {
            this.cartFooter.classList.remove("hide");
        }
        
        if (this.clearCartBtn) {
            this.clearCartBtn.style.display = "block";
        }

        // Calculate and display total
        const total = this.cartItems.reduce((sum, item) => {
            const price = Number(item.FinalPrice) || 0;
            const qty = Number(item.Quantity) || 1;
            return sum + (price * qty);
        }, 0);

        if (this.cartTotalElement) {
            this.cartTotalElement.textContent = total.toFixed(2);
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            localStorage.removeItem("so-cart");
            this.cartItems = [];
            this.renderCartContents();
        }
        // dispatch cart updated
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    removeProductFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.Id !== productId);
        setLocalStorage("so-cart", this.cartItems);
        this.renderCartContents();

        // dispatch cart updated
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Method to update quantity of a specific item
    updateQuantity(productId, newQuantity) {
        const item = this.cartItems.find(item => item.Id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeProductFromCart(productId);
            } else {
                item.Quantity = newQuantity;
                setLocalStorage("so-cart", this.cartItems);
                this.renderCartContents();
            }
        }

        // dispatch cart updated
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Get total number of items in cart
    getItemCount() {
        return this.cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
    }

    // Get total price of all items in cart
    getTotal() {
        return this.cartItems.reduce((sum, item) => {
            const price = Number(item.FinalPrice) || 0;
            const qty = Number(item.Quantity) || 1;
            return sum + (price * qty);
        }, 0);
    }
}