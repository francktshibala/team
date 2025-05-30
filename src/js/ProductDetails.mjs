import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      // Handle case where product is not found
      document.querySelector('main').innerHTML = '<h2>Product not found</h2>';
      return;
    }
    
    // render the product details
    this.renderProductDetails();
    
    // add event listener to Add to Cart button
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // Get existing cart items or empty array
    const cartItems = getLocalStorage("so-cart") || [];
    
    // Check if product already exists in cart
    const productIndex = cartItems.findIndex(item => item.Id === this.product.Id);

    if (productIndex > -1) {
      // Product already in cart, increment quantity
      cartItems[productIndex].Quantity = (cartItems[productIndex].Quantity || 1) + 1;
    } else {
      // Add new product with quantity 1
        const productToAdd = {
            Id: this.product.Id,
            Name: this.product.Name,
            FinalPrice: this.product.FinalPrice,
            Colors: this.product.Colors,
            Quantity: 1,
            Image: this.product.Images.PrimarySmall || "images/placeholder.jpg", // Fallback image
      };
      cartItems.push(productToAdd);
    }

    // Save updated cart to localStorage
    setLocalStorage("so-cart", cartItems);
    
    // Show success alert message
    const successAlert = document.createElement('div');
    successAlert.className = 'alert-message success';
    successAlert.innerHTML = `
      <div class="alert-content">
        <span class="alert-text">✅ ${this.product.Name} added to cart successfully!</span>
        <span class="alert-close">&times;</span>
      </div>
    `;

    // Style the success alert
    successAlert.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-family: Arial, sans-serif;
      font-size: 16px;
      max-width: 90%;
      word-wrap: break-word;
    `;

    const alertContent = successAlert.querySelector('.alert-content');
    alertContent.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    `;

    const closeButton = successAlert.querySelector('.alert-close');
    closeButton.style.cssText = `
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      border: none;
      background: none;
      color: white;
      padding: 0;
      margin: 0;
    `;

    // Insert the alert
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.insertBefore(successAlert, mainElement.firstChild);
    } else {
      document.body.insertBefore(successAlert, document.body.firstChild);
    }

    // Add close functionality
    closeButton.addEventListener('click', () => {
      successAlert.remove();
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (successAlert.parentNode) {
        successAlert.remove();
      }
    }, 3000);

    // Dispatch cartUpdated event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  showAddToCartConfirmation() {
    const button = document.getElementById('addToCart');
    const originalText = button.textContent;
    button.textContent = 'Added to Cart!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 2000);
  }

  renderProductDetails() {
    // Update page title
    document.title = `Sleep Outside | ${this.product.Name}`;
    
    // Render product details
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Set brand name and product name
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  // Set product image
  const productImage = document.getElementById('productImage');
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  // Set product color
  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  
  // Set product description
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

  // Set product ID on Add to Cart button
  document.getElementById('addToCart').dataset.id = product.Id;

  // Simple price display without discount badges
  document.getElementById('productPrice').textContent = `$${product.FinalPrice}`;
}