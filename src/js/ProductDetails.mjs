import { getLocalStorage, setLocalStorage } from "./utils.mjs";

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
      const productToAdd = { ...this.product, Quantity: 1 };
      cartItems.push(productToAdd);
    }

    // Save updated cart to localStorage
    setLocalStorage("so-cart", cartItems);
    
    // Show confirmation message
    this.showAddToCartConfirmation();
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