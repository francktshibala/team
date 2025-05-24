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
  <p class="cart-card__quantity">qty: ${item.Quantity} <span class="remove-item" data-id="${item.Id}">X</span></p>
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
        this.cartTotalElement = qs(".cart-total");
        this.clearCartBtn = document.getElementById("clearCartBtn");
        this.clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });
        // Render the cart contents
        this.renderCartContents();
    }
    
    renderCartContents() {
        const htmlItems = this.cartItems.map((item) => cartItemTemplate(item));
        const productList = document.querySelector(".product-list");
        productList.innerHTML = htmlItems.join("");
    
        // Add event listeners to remove cart items
        document.querySelectorAll('.remove-item').forEach(span => {
        span.addEventListener('click', () => {
            const id = span.dataset.id;
            this.removeProductFromCart(id);
        });
        });
    
        // Handle cart total display
        if (this.cartItems.length > 0) {
        this.cartFooter.classList.remove("hide");
    
        const total = this.cartItems.reduce((sum, item) => {
            const price = Number(item.FinalPrice) || 0;
            const qty = Number(item.Quantity) || 0;
            return sum + price * qty;
        }, 0);
    
        this.cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
        } else {
        this.cartFooter.classList.add("hide");
        this.clearCartBtn.style.display = "none";
        }
        
    }

    clearCart() {
        localStorage.removeItem("so-cart");
        this.cartItems = [];
        // Optionally, refresh the UI after clearing
        this.renderCartContents();
    }
    
    // Function to remove a product from the cart
    removeProductFromCart(productId) {
        // const cartItems = getLocalStorage("so-cart") || [];
        const updatedCart = this.cartItems.filter(item => item.Id !== productId);
        setLocalStorage("so-cart", updatedCart);
        this.cartItems = updatedCart;
        // Optionally, refresh the UI after removing the product
        this.renderCartContents();
    }
}